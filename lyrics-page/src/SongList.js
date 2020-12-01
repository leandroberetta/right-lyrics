import React from 'react';
import SongItem from './SongItem.js'

class SongList extends React.Component {
    
    render() {
        return (
            <ul className="list-unstyled">
                {this.props.songs.map(song => (
                    <SongItem headers={this.props.headers} authenticated={this.props.authenticated} onSelectSong={this.props.onSelectSong} key={song.id} song={song}></SongItem>
                ))}
            </ul>
        );
    }
}

export default SongList;