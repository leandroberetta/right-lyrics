import { inject, observer } from "mobx-react";
import React from "react";
import request from "superagent";
import AlbumsService from "../../api/AlbumsService";
import NoData from "../../common/NoData";
import Search from "../../common/Search";
import View, { ViewOption } from "../../common/View";
import SearchResponse from "../../model/SearchResponse";
import { HeaderStore } from "../../store/HeaderStore";
import Album from "./Album";

interface AlbumsProps {
  headerStore?: HeaderStore;
}

interface AlbumsState {
  albums: Album[];
  busy: boolean;
}

class Albums extends React.Component<AlbumsProps> {
  state = {
    albums: [],
    busy: false,
  };

  service = new AlbumsService();

  componentDidMount() {
    this.props.headerStore?.setTitle("Albums");
    this.refresh();
  }

  refresh = () => {
    this.setState({ busy: true });
    this.service.getAll(0, 0, "").then(
      (res: request.Response) => {
        const response: SearchResponse<Album> = res.body;
        this.setState({ albums: response.data, busy: false });
      },
      (err) => {}
    );
  };

  buildAlbums = () => {
    if (this.state.busy) {
      return <div></div>;
    }
    if (this.state.albums.length > 0) {
      return (
        <View option={ViewOption.GRID} itemsPerRow={6}>
          {this.state.albums.map((elem) => (
            <Album album={elem}></Album>
          ))}
        </View>
      );
    } else {
      return <NoData content="No se encontraron albums"></NoData>;
    }
  };

  render() {
    return (
      <div className="container-fluid albums">
        <Search></Search>
        <div className="albums__section">{this.buildAlbums()}</div>
      </div>
    );
  }
}

export default inject("headerStore")(observer(Albums));
