import React from 'react';
import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container'
import SongItem from './SongItem.js'


class SongList extends React.Component {
    render() {
        return (
            <Container>
                <ul className="list-unstyled">
                    {this.props.songs.map(song => (
                        <SongItem onSelectSong={this.props.onSelectSong.bind(this, song)} song={song}></SongItem>
                    ))}
                </ul>
            </Container>
        );
    }
}

export default SongList;