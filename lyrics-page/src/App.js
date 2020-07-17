import React from 'react';
import './App.css';
import SongList from './SongList.js'
import Brand from './Brand.js'
import SongLyrics from './SongLyrics.js'
import SearchBar from './SearchBar.js'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            selectedSong: { song: null, lyrics: "" },
            error: null
        };

        this.lyricEndpoint = (process.env.REACT_APP_LYRICS_SERVICE_URL) ? process.env.REACT_APP_LYRICS_SERVICE_URL + "/api/lyric/" : "/api/lyric/";
        this.songEndpoint = (process.env.REACT_APP_SONGS_SERVICE_URL) ? process.env.REACT_APP_SONGS_SERVICE_URL + "/api/song/" : "/api/song/";
    }

    onSelectSong = (song) => {
        fetch(this.lyricEndpoint + song.lyricId)
            .then(result => result.json())
            .then(
                (result) => {
                    if (result) {
                        this.setState({
                            selectedSong: { song: song, lyrics: result.lyric },
                            error: null
                        })
                    }
                },
                (error) => {
                    this.setState({
                        error: "Lyrics service not available.",
                    });
                }
            )
    }

    onSearch = (event) => {
        fetch(this.songEndpoint + "?filter=" + event.target.value)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        songs: result,
                        selectedSong: { song: null, lyric: "" },
                        error: null
                    });

                },
                (error) => {
                    this.setState({
                        error: "Songs service not available.",
                    });
                }
            )
    }

    componentDidMount() {
        fetch(this.songEndpoint)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        songs: result,
                        error: null
                    });

                },
                (error) => {
                    this.setState({
                        error: "Songs service not available.",
                    });
                }
            )
    }

    render() {
        var lyricsSection = "";
        var errorSection = "";
        var songList = "";

        if (this.state.selectedSong.song) {
            lyricsSection = (
                <SongLyrics selectedSong={this.state.selectedSong}></SongLyrics>
            );

            songList = "";
        } else {
            songList = (
                <SongList onSelectSong={this.onSelectSong} songs={this.state.songs}></SongList>
            );
        }

        if (this.state.error) {
            errorSection = (
                <Container>
                    <Alert variant="danger">
                        <Alert.Heading>Error!</Alert.Heading>
                        <p>{this.state.error}</p>
                    </Alert>
                </Container>
            );
        }

        return (
            <div>
                <Brand/>                
                <SearchBar onSearch={this.onSearch}></SearchBar>                
                {songList}
                {errorSection}
                {lyricsSection}
            </div>
        );
    };

}

export default App;
