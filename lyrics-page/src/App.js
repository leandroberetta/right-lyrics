import React from 'react';
import { Alert, Container } from 'react-bootstrap'
import Keycloak from 'keycloak-js';
import SongList from './SongList.js'
import NavBar from './NavBar.js'
import SongItem from './SongItem.js'
import SongLyrics from './SongLyrics.js'
import SongVideo from './SongVideo.js'

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

        this.songsEndpoint = ((process.env.REACT_APP_SONGS_SERVICE_URL) ? process.env.REACT_APP_SONGS_SERVICE_URL : window.SONGS_SERVICE);
        this.lyricsEndpoint = ((process.env.REACT_APP_LYRICS_SERVICE_URL) ? process.env.REACT_APP_LYRICS_SERVICE_URL : window.LYRICS_SERVICE);
        this.keycloakEnabled = true;

        if (!process.env.REACT_APP_KEYCLOAK_URL && !window.KEYCLOAK_SERVICE) {
            this.keycloakEnabled = false;
        }
    }

    componentDidMount() {
        if (this.keycloakEnabled === "true") {
            var keycloak = new Keycloak({
                url: ((process.env.REACT_APP_KEYCLOAK_URL) ? process.env.REACT_APP_KEYCLOAK_URL : window.KEYCLOAK_SERVICE),
                realm: ((process.env.KEYCLOAK_REALM) ? process.env.KEYCLOAK_REALM : window.KEYCLOAK_REALM),
                clientId: ((process.env.KEYCLOAK_CLIENT_ID) ? process.env.KEYCLOAK_CLIENT_ID : window.KEYCLOAK_CLIENT_ID)
            });
    
            keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then(authenticated => {
                this.setState({ keycloak: keycloak, authenticated: authenticated });
            }).catch(() => {
                console.log("Error");
            });
        } else {
            this.setState({ authenticated: true });
        }

        this.getSongs();
    }

    onSearch = (event) => {
        this.setState({ searchValue: event.target.value });
        this.getSongs(event.target.value);
    }

    onDeselectSong = () => {
        this.getSongs(this.state.searchValue);
    }

    getHeaders = () => {
        if (this.state.keycloak) {
            return {
                "Authorization": "Bearer " + this.state.keycloak.token,
                "Username": this.state.keycloak.subject
            };
        } else {
            return {};
        }
    }

    onSelectSong = (songId) => {
        fetch(this.songsEndpoint + songId, { headers: this.getHeaders() })
            .then(song => song.json())
            .then(
                (song) => {
                    if (song) {                        
                        if (this.lyricsEndpoint) {                            
                            fetch(this.lyricsEndpoint + song.lyricsId, { headers: this.getHeaders() })
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
                                        song.lyrics = "Lyrics not available.";
                                        this.setState({
                                            selectedSong: song
                                        });
                                    }
                                )
                        } else {
                            song.lyrics = "Lyrics not available.";
                            this.setState({
                                selectedSong: song
                            });
                        }
                    }
                }
            )
    }

    getSongs = (filter) => {
        var query = "";
        if (filter) {
            query = "?filter=" + filter;
        }

        fetch(this.songsEndpoint + query)
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
                    {this.state.selectedSong.youtubeLink && <SongVideo song={this.state.selectedSong} />}
                    <SongLyrics lyrics={this.state.selectedSong.lyrics} />
                </div>
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
                <Alert variant="danger">
                    <Alert.Heading > Error! </Alert.Heading>
                    <p>{this.state.error}</p>
                </Alert>
            );
        }

        return (
            <Container className="padding">
                <NavBar authenticated={this.state.authenticated}
                    keycloak={this.state.keycloak}
                    onSearch={this.onSearch} />
                {mainSection}
                {errorSection}
            </Container>
        );
    };
}

export default App;