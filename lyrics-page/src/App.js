import React from 'react';
import './App.css';
import SongList from './SongList.js'
import NavBar from './NavBar.js'
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

        console.log(this.state)
    }

    onSelectSong = (song) => {
        fetch("http://localhost:8080/api/song/" + song.id)
            .then(result => result.json())
            .then(
                (result) => {
                    console.log(result);

                    fetch("http://localhost:8000/api/lyric/" + result.lyricId)
                        .then(result => result.json())
                        .then(
                            (result) => {
                                console.log(result);
                                
                                if (result) {
                                    this.setState({
                                        selectedSong: { song: song, lyrics: result.lyric },
                                        error: null
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
                },
                (error) => {
                    console.log(error);            
                }
            )
    }

    onSearch = (event) => {
        console.log("asd")
        fetch("http://localhost:8080/api/song/search", {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({"text": event.target.value})
            })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)

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
        fetch("http://localhost:8080/api/song")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)

                    this.setState({
                        isLoaded: true,
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

        if (this.state.selectedSong.song) {
            lyricsSection = (
                <SongLyrics selectedSong={this.state.selectedSong}></SongLyrics>                
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
                <NavBar onSearch={this.onSearch}></NavBar>
                <SearchBar onSearch={this.onSearch}></SearchBar>
                <SongList onSelectSong={this.onSelectSong} songs={this.state.songs}></SongList>
                { errorSection }
                { lyricsSection }
            </div>
        );
    };

}

export default App;
