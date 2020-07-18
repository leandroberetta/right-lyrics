import React from 'react';
import Container from 'react-bootstrap/Container'
import SongItem from './SongItem.js'


class SongList extends React.Component {
    render() {
        return (
            <Container>
                <ul className="list-unstyled">
                    {this.props.songs.map(song => (
                        <SongItem key={song.id} song={song}></SongItem>
                    ))}
                </ul>
            </Container>
        );
    }
}

export default SongList;