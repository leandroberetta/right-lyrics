import { inject, observer } from "mobx-react";
import React from "react";
import { HeaderStore } from "../../store/HeaderStore";

interface AlbumsProps {
  headerStore?: HeaderStore;
}

class Albums extends React.Component<AlbumsProps> {
  componentDidMount() {
    this.props.headerStore?.setTitle("Albums");
  }

  render() {
    return <div className="container-fluid"></div>;
  }
}

export default inject("headerStore")(observer(Albums));
