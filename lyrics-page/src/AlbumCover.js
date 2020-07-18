import React from 'react';
import Image from 'react-bootstrap/Image'

class AlbumCover extends React.Component {
    render() {        
        if (this.props.error || !this.props.isLoaded)
            return "";
        else
            return (<Image src={this.props.album.coverUrl} width={128} height={128} className="mr-3" alt="..." rounded/>);
    }
}

export default AlbumCover;