import React from 'react';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SongPopularity from './SongPopularity.js'
import AlbumCover from './AlbumCover.js'
import SongLyrics from './SongLyrics.js'

class SongItem extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            lyrics: "",
            isLoaded: false,
            album: null,            
            error: null
        };

        this.albumEndpoint = (process.env.REACT_APP_ALBUMS_SERVICE_URL) ? process.env.REACT_APP_ALBUMS_SERVICE_URL + "/albums/" : "/albums/";
        this.lyricEndpoint = (process.env.REACT_APP_LYRICS_SERVICE_URL) ? process.env.REACT_APP_LYRICS_SERVICE_URL + "/api/lyric/" : "/api/lyric/";

    }

    onSelectSong = (song) => {
        fetch(this.lyricEndpoint + song.lyricId)
            .then(result => result.json())
            .then(
                (result) => {
                    if (result) {
                        this.setState({
                            lyrics: result.lyric,
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
    }

    componentDidMount() {
        fetch(this.albumEndpoint + this.props.song.albumId)
            .then(result => result.json())
            .then(
                (result) => {
                    if (result) {
                        console.log(result);
                        this.setState({
                            isLoaded: true,
                            album: result.data,
                            error: null
                        })
                    }
                },
                (error) => {
                    this.setState({
                        error: "Albums service not available.",
                    });
                }
            )
    }

    render() {        
        const { lyrics, error, isLoaded, album } = this.state;

        return (
            <div>
                <Media key={this.props.song.id} className="my-4" as="li">
                    <AlbumCover error={error} isLoaded={isLoaded} album={album}/>
                    <Media.Body>
                        <Row>
                            <Col>
                                <h5 className="mt-0 mb-1"><button type="button" className="link-button" onClick={this.onSelectSong.bind(this, this.props.song)}>{this.props.song.name}</button></h5>
                                <p>{this.props.song.artist}</p>                                
                            </Col>
                            <Col>
                                <SongPopularity popularity={this.props.song.popularity}/>
                            </Col>
                        </Row>
                    </Media.Body>                
                </Media>
                <SongLyrics lyrics={lyrics}/>
            </div>
        );
    }
}

export default SongItem;