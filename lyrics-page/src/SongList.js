import React from 'react';
import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container'

class SongList extends React.Component {
    render() {
        return (
            <Container className="padding">
                <h3>Songs</h3>
                <hr></hr>
                <ul className="list-unstyled">
                    {this.props.songs.map(song => (
                        <Media key={song.id} className="my-4" as="li">
                            <img src={process.env.PUBLIC_URL + '/icon64.png'} className="mr-3" alt="..."></img>
                            <Media.Body>
                                <h5 className="mt-0 mb-1"><a onClick={this.props.onSelectSong.bind(this, song)} className="text-dark" href="#">{song.name}</a></h5>
                                <p>{song.artist}</p>
                            </Media.Body>
                        </Media>
                    ))}
                </ul>
            </Container>
        );
    }
}

export default SongList;