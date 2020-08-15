import React from 'react';
import { Alert, Container } from 'react-bootstrap'
import Keycloak from 'keycloak-js';
import SongList from './SongList.js'
import NavBar from './NavBar.js'
import SongItem from './SongItem.js'
import SongLyrics from './SongLyrics.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            selectedSong: null,
            searchValue: null,
            error: null,
            keycloak: null,
            authenticated: false
        };

        this.songEndpoint = (process.env.REACT_APP_SONGS_SERVICE_URL) ? process.env.REACT_APP_SONGS_SERVICE_URL : "/api/songs/";
        this.lyricEndpoint = (process.env.REACT_APP_LYRICS_SERVICE_URL) ? process.env.REACT_APP_LYRICS_SERVICE_URL : "/api/lyrics/";
    }

    componentDidMount() {
        var keycloak = new Keycloak({
            url: (process.env.REACT_APP_KEYCLOAK_URL) ? process.env.REACT_APP_KEYCLOAK_URL : "/auth/",
            realm: 'right-lyrics',
            clientId: 'lyrics-ui'
        });

        keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then(authenticated => {
            console.log(authenticated);
            this.setState({ keycloak: keycloak, authenticated: authenticated })
        }).catch(() => {
            console.log("Error");
        })

        this.getSongs();
    }

    onSearch = (event) => {
        this.setState({ searchValue: event.target.value });
        this.getSongs(event.target.value);
    }

    onDeselectSong = () => {
        this.getSongs(this.state.searchValue);
    }

    onSelectSong = (songId) => {
        fetch(this.songEndpoint + songId)
            .then(song => song.json())
            .then(
                (song) => {
                    if (song) {
                        fetch(this.lyricEndpoint + song.lyricsId, { headers: { "Authorization": "Bearer " + this.state.keycloak.token } })
                            .then(result => result.json())
                            .then(
                                (result) => {
                                    if (result) {
                                        song.lyrics = result.lyrics;
                                        this.setState({
                                            selectedSong: song
                                        })
                                    }
                                },
                                (error) => {
                                    console.log(error);
                                    this.setState({
                                        error: "Lyrics service not available.",
                                    });
                                }
                            )
                    }
                }
            )
    }

    getSongs = (filter) => {
        var query = "";
        if (filter) {
            query = "?filter=" + filter;
        }

        fetch(this.songEndpoint + query)
            .then(songs => songs.json())
            .then(
                (songs) => {
                    this.setState({
                        songs: songs,
                        selectedSong: null,
                        error: null
                    });

                },
                (error) => {
                    console.log(error);
                    this.setState({
                        error: "Songs service not available.",
                    });
                }
            )
    }

    render() {
        var errorSection = null;
        var mainSection = null;

        if (this.state.selectedSong) {
            mainSection = (
                <div>
                    <SongItem onDeselectSong={this.onDeselectSong}
                        onSelectSong={this.onSelectSong}
                        authenticated={this.state.authenticated}
                        key={this.state.selectedSong.id}
                        song={this.state.selectedSong} />
                    <SongLyrics lyrics={this.state.selectedSong.lyrics} />
                </div >
            );
        } else {
            mainSection = (
                <SongList authenticated={this.state.authenticated}
                    onSelectSong={this.onSelectSong}
                    songs={this.state.songs} />
            );
        }

        if (this.state.error) {
            errorSection = (
                <Alert variant="danger" >
                    <Alert.Heading > Error! </Alert.Heading>
                    <p>{this.state.error}</p>
                </Alert >
            );
        }

        return (
            <Container className="padding">
                <NavBar authenticated={this.state.authenticated}
                    keycloak={this.state.keycloak}
                    onSearch={this.onSearch} />
                {mainSection}
                {errorSection}
            </Container >
        );
    };

}

export default App;