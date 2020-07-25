import React from 'react';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
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

    onClose = () => {
        this.setState({lyrics: ""});
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

        var close = "";

        if (lyrics !== "") {
            close = (
                <Row>
                    <Col style={{paddingTop: "10px"}} >
                        <Button onClick={this.onClose} className="float-right"><FontAwesomeIcon icon={faTimesCircle} /></Button>
                    </Col>
                </Row>
            );
        }

        return (
            <div>
                <Media key={this.props.song.id} className="my-4" as="li">
                    <AlbumCover error={error} isLoaded={isLoaded} album={album} />
                    <Media.Body>
                        <Row>
                            <Col className="col-12 col-md-8">
                                <h5 className="mt-0 mb-1"><button type="button" className="link-button" onClick={this.onSelectSong.bind(this, this.props.song)}>{this.props.song.name}</button></h5>
                                <p>{this.props.song.artist}</p>
                            </Col>
                            <Col className="col-12 col-md-4">
                                <SongPopularity popularity={this.props.song.popularity} />
                            </Col>
                        </Row>
                        {close}
                    </Media.Body>
                </Media>
                <SongLyrics lyrics={lyrics} />
            </div>
        );
    }
}

export default SongItem;