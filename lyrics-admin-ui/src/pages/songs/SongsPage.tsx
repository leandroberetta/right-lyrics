import { inject, observer } from "mobx-react";
import React from "react";
import ListView from "../../common/ListView";
import NoData from "../../common/NoData";
import Search from "../../common/Search";
import { HeaderStore } from "../../store/HeaderStore";

interface SongsPageProps {
  headerStore?: HeaderStore;
}

interface SongsPageState {
  busy: boolean;
}

class SongsPage extends React.Component<SongsPageProps> {
  state = {
    SongsPage: [],
    busy: false,
  };

  componentDidMount() {
    this.props.headerStore?.setTitle("SongsPage");
    this.refresh();
  }

  refresh = () => {
    this.setState({ busy: true });
  };

  buildSongsPage = () => {
    if (this.state.busy) {
      return <div></div>;
    }
    if (this.state.SongsPage.length > 0) {
      return <ListView></ListView>;
    } else {
      return <NoData content="No se encontraron SongsPage"></NoData>;
    }
  };

  render() {
    return (
      <div className="container-fluid SongsPage">{/* <Search></Search> */}</div>
    );
  }
}

export default inject("headerStore")(observer(SongsPage));
