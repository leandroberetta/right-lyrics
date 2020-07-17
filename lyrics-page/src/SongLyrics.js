import React from 'react';
import MDReactComponent from 'markdown-react-js';
import Container from 'react-bootstrap/Container';
import Media from 'react-bootstrap/Media';

class SongLyrics extends React.Component {
    render() {
        return (
            <Container>
                <MDReactComponent text={this.props.lyrics}/> 
            </Container>
        );
    }
}

export default SongLyrics;