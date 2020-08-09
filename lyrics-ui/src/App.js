import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
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
            error: null
        };

        this.songEndpoint = (process.env.REACT_APP_SONGS_SERVICE_URL) ? process.env.REACT_APP_SONGS_SERVICE_URL : "/api/song/";
        this.lyricEndpoint = (process.env.REACT_APP_LYRICS_SERVICE_URL) ? process.env.REACT_APP_LYRICS_SERVICE_URL : "/api/lyric/";
    }

    componentDidMount() {
        this.getSongs();
    }

    onSearch = (event) => {
        this.setState({searchValue: event.target.value});
        this.getSongs(event.target.value);
    }

    onDeselectSong = () => {
        this.getSongs(this.state.searchValue);
    }

    onSelectSong = (songId) => {
        console.log("onSelectSong");
        fetch(this.songEndpoint + songId)
            .then(song => song.json())
            .then(
                (song) => {
                    console.log("lyric")
                    if (song) {
                        fetch(this.lyricEndpoint + song.lyricsId)
                            .then(result => result.json())
                            .then(
                                (result) => {
                                    console.log(result.lyrics);
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
        var errorSection = "";
        var mainSection = "";

        if (this.state.selectedSong) {
            mainSection = (
                <div>
                    <SongItem onDeselectSong={this.onDeselectSong}
                        onSelectSong={this.onSelectSong}
                        key={this.state.selectedSong.id}
                        song={this.state.selectedSong} />
                    <SongLyrics lyrics={this.state.selectedSong.lyrics} />
                </div>
            );
        } else {
            mainSection = (
                <SongList onSelectSong={this.onSelectSong} songs={this.state.songs} />
            );
        }

        if (this.state.error) {
            errorSection = (
                <Alert variant="danger">
                    <Alert.Heading>Error!</Alert.Heading>
                    <p>{this.state.error}</p>
                </Alert>
            );
        }

        return (
            <Container className="padding">
                <NavBar onSearch={this.onSearch} />
                {mainSection}
                {errorSection}
            </Container>
        );
    };

}

export default App;
