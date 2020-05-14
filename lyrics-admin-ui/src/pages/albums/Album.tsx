import React from "react";
import AlbumModel from "../../model/Album";
import RoundButton from "../../common/RoundButton";

interface AlbumProps {
  album: AlbumModel;
}

export default class Album extends React.Component<AlbumProps> {
  render() {
    const { album } = this.props;
    return (
      <div className="album">
        <div className="album__cover">
          <img src={album.cover} alt="" />
          <div className="album__actions">
            <RoundButton icon="fa-pencil-alt" color="yellow"></RoundButton>
            <RoundButton icon="fa-trash-alt" color="pink"></RoundButton>
          </div>
        </div>
        <div className="album__description">
          <div className="album__title">{album.title}</div>
          <div className="album__artist">{album.artist}</div>
          <div className="album__year">{album.year}</div>
        </div>
      </div>
    );
  }
}
