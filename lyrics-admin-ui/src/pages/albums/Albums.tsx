import { AxiosResponse } from "axios";
import { inject, observer } from "mobx-react";
import React from "react";
import AlbumsService from "../../api/AlbumsService";
import { Actions } from "../../common/Actions";
import Button from "../../common/Button";
import NoData from "../../common/NoData";
import Search from "../../common/Search";
import View, { ViewOption } from "../../common/View";
import AlbumModel from "../../model/Album";
import SearchResponse from "../../model/SearchResponse";
import Places from "../../router/Places";
import { HeaderStore } from "../../store/HeaderStore";
import { Store } from "../../store/Store";
import Album from "./Album";

interface AlbumsProps {
  headerStore?: HeaderStore;
}

interface AlbumsState {
  albums: AlbumModel[];
  busy: boolean;
  query: string;
}

class Albums extends React.Component<AlbumsProps, AlbumsState> {
  state = {
    albums: Array(12).fill({}),
    busy: false,
    query: "",
  };

  service = AlbumsService;

  componentDidMount() {
    this.props.headerStore?.setTitle("Albums");
    this.refresh();
  }

  refresh = () => {
    this.setState({ busy: true, albums: Array(12).fill({}) });
    this.service.getAll(0, 0, this.state.query).then(
      (res: AxiosResponse) => {
        const response: SearchResponse<AlbumModel> = res.data;
        this.setState({
          albums: response.data,
          busy: false,
        });
      },
      (err) => {}
    );
  };

  load = () => {
    this.service.load().then((res) => this.refresh());
  };

  search = (query: string) => {
    this.setState({ query: query }, this.refresh);
  };

  buildAlbums = () => {
    if (this.state.albums.length > 0) {
      return (
        <View option={ViewOption.GRID} itemsPerRow={6}>
          {this.state.albums.map((elem: AlbumModel, i: number) => (
            <Album key={i} show={!this.state.busy} album={elem}></Album>
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
        <Search setQuery={this.search}></Search>
        <div className="albums__section">
          <Actions>
            <Button icon="sync" onClick={this.refresh}>
              Refresh
            </Button>
            <Button icon="plus" onClick={() => Places.goToAlbumsForm()}>
              New Album
            </Button>
            <Button icon="upload" onClick={this.load}>
              Load
            </Button>
          </Actions>
          {this.buildAlbums()}
        </div>
      </div>
    );
  }
}

export default inject(Store.HEADER_STORE)(observer(Albums));
