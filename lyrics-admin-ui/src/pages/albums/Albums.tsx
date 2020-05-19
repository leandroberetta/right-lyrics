import { inject, observer } from "mobx-react";
import React from "react";
import request from "superagent";
import AlbumsService from "../../api/AlbumsService";
import NoData from "../../common/NoData";
import Search from "../../common/Search";
import SearchResponse from "../../model/SearchResponse";
import { HeaderStore } from "../../store/HeaderStore";
import Album from "./Album";
import GridView from "../../common/GridView";

interface AlbumsProps {
  headerStore?: HeaderStore;
}

interface AlbumsState {
  albums: Album[];
}

class Albums extends React.Component<AlbumsProps> {
  state = {
    albums: [],
  };

  componentDidMount() {
    this.props.headerStore?.setTitle("Albums");
    const service = new AlbumsService();
    service.getAll(0, 0, "").then(
      (res: request.Response) => {
        const response: SearchResponse<Album> = res.body;
        this.setState({ albums: response.data });
      },
      (err) => {}
    );
  }

  buildAlbums = () => {
    if (this.state.albums.length > 0) {
      return (
        <GridView itemsPerRow={4}>
          {this.state.albums.map((elem) => (
            <Album album={elem}></Album>
          ))}
        </GridView>
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
