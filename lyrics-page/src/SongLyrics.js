import React from 'react';
import MDReactComponent from 'markdown-react-js';
import Container from 'react-bootstrap/Container';
import Media from 'react-bootstrap/Media';

class SongLyrics extends React.Component {
    render() {
        return (
            <Container>
                <Media key={this.props.selectedSong.song.id} className="my-4">
                    <img src={process.env.PUBLIC_URL + '/icon64.png'} className="mr-3" alt="..."></img>
                    <Media.Body>
                        <h5 className="mt-0 mb-1">{this.props.selectedSong.song.name}</h5>
                        <p>{this.props.selectedSong.song.artist}</p>
                        <br></br>
                        <MDReactComponent text={this.props.selectedSong.lyrics}/> 
                    </Media.Body>
                </Media>                
            </Container>
        );
    }
}

export default SongLyrics;