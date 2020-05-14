import { inject, observer } from "mobx-react";
import React from "react";
import { HeaderStore } from "../../store/HeaderStore";
import Album from "./Album";
import Search from "../../common/Search";

const albums = [
  {
    title: "Congrete and Gold",
    artist: "Foo Fighters",
    cover:
      "https://www.elquintobeatle.com/wp-content/uploads/2017/09/foo-fighters-concrete-and-gold-1.jpg",
    year: "2018",
  },
  {
    title: "Californication",
    artist: "RHCP",
    cover:
      "https://http2.mlstatic.com/red-hot-chili-peppers-californication-vinilo-nuevo-obivinilo-D_NQ_NP_150511-MLC20572622222_022016-F.jpg",
    year: "1999",
  },
  {
    title: "Are You Experienced?",
    artist: "Jimmy Hendrix Experience",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Are_You_Experienced_-_US_cover-edit.jpg/800px-Are_You_Experienced_-_US_cover-edit.jpg",
    year: "1967",
  },
  {
    title: "1 (Remastered)",
    artist: "The Beatles",
    cover:
      "https://images-na.ssl-images-amazon.com/images/I/91-Uov6izOL._SL1500_.jpg",
    year: "2000",
  },
];

interface AlbumsProps {
  headerStore?: HeaderStore;
}

class Albums extends React.Component<AlbumsProps> {
  componentDidMount() {
    this.props.headerStore?.setTitle("Albums");
  }

  render() {
    return (
      <div className="container-fluid albums">
        <Search></Search>
        <div className="albums__section">
          {albums.map((elem) => (
            <Album album={elem}></Album>
          ))}
        </div>
      </div>
    );
  }
}

export default inject("headerStore")(observer(Albums));
