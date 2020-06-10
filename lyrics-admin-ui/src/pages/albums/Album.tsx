import React from "react";
import Skeleton from "react-loading-skeleton";
import Image from "../../common/Image";
import RoundButton from "../../common/RoundButton";
import AlbumModel from "../../model/Album";
import Places from "../../router/Places";

interface AlbumProps {
  album: AlbumModel;
  show: boolean;
  preview?: boolean;
}

export default class Album extends React.Component<AlbumProps> {
  render() {
    const { album, show } = this.props;
    if (!show) {
      return <AlbumSkeleton></AlbumSkeleton>;
    } else {
      return (
        <div className="album">
          <div className="album__cover">
            <Image src={album.coverUrl}></Image>
            <div className="album__actions">
              <RoundButton
                icon="fa-pencil-alt"
                color="yellow"
                onClick={() => Places.goToAlbumsForm(album.id)}
              ></RoundButton>
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
}

export class AlbumSkeleton extends React.Component {
  render() {
    return (
      <div className="album">
        <div className="album__cover">
          <Skeleton height={200}></Skeleton>
        </div>
        <div className="album__description">
          <div className="album__title">
            <Skeleton></Skeleton>
          </div>
          <div className="album__artist">
            <Skeleton></Skeleton>
          </div>
          <div className="album__year">
            <Skeleton></Skeleton>
          </div>
        </div>
      </div>
    );
  }
}
