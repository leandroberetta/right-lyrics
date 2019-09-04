import React from 'react';
import MDReactComponent from 'markdown-react-js';
import Container from 'react-bootstrap/Container'

class SongLyrics extends React.Component {
    render() {
        return (
            <Container className="padding">
                <h3>Lyrics</h3>
                <hr></hr>                
                <h5 className="mt-0 mb-1">{this.props.selectedSong.song.name}</h5>
                <h6>{this.props.selectedSong.song.artist}</h6>
                <MDReactComponent text={this.props.selectedSong.lyrics}/> 
            </Container>
        );
    }
}

export default SongLyrics;