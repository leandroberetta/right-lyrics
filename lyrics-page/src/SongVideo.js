import React from 'react';

class SongVideo extends React.Component {

    render() {
        return (
            <div style={{borderLeft: "5px solid #5E548E", paddingLeft: "10px"}}>
                <iframe width="560" height="315" title={this.props.song.name} src={this.props.song.youtubeLink} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        );
    }
}

export default SongVideo;