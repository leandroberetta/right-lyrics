import React from "react";
import Skeleton from "react-loading-skeleton";

interface ImageProps {
  src: string;
}

interface ImageState {
  loaded: boolean;
}

export default class Image extends React.Component<ImageProps, ImageState> {
  state = {
    loaded: false,
  };

  handleImageLoaded = () => {
    this.setState({ loaded: true });
  };

  render() {
    return (
      <div>
        <img
          src={this.props.src}
          onLoad={this.handleImageLoaded.bind(this)}
          alt=""
          hidden={!this.state.loaded}
        ></img>
        <div hidden={this.state.loaded}>
          <Skeleton height={200}></Skeleton>
        </div>
      </div>
    );
  }
}
