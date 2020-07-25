import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import SongList from './SongList.js'
import NavBar from './NavBar.js'

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
        var errorSection = "";

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
                <NavBar onSearch={this.onSearch}/>
                <SongList songs={this.state.songs}></SongList>
                {errorSection}                
            </Container>
        );
    };

}

export default App;
