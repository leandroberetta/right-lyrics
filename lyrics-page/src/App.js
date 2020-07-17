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

        this.songEndpoint = (process.env.REACT_APP_SONGS_SERVICE_URL) ? process.env.REACT_APP_SONGS_SERVICE_URL + "/api/song/" : "/api/song/";
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
                    console.log(error);
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
                        songs: result,
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
                <SongList songs={this.state.songs}></SongList>
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
