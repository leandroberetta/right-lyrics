import { inject, observer } from "mobx-react";
import React from "react";
import NoData from "../../common/NoData";
import Search from "../../common/Search";
import View, { ViewOption } from "../../common/View";
import { HeaderStore } from "../../store/HeaderStore";

interface LyricsPageProps {
  headerStore?: HeaderStore;
}

interface LyricsPageState {
  busy: boolean;
}

class LyricsPage extends React.Component<LyricsPageProps> {
  state = {
    LyricsPage: [],
    busy: false,
  };

  componentDidMount() {
    
    this.refresh();
  }

  refresh = () => {
    this.setState({ busy: true });
  };

  buildLyricsPage = () => {
    if (this.state.busy) {
      return <div></div>;
    }
    if (this.state.LyricsPage.length > 0) {
      return <View option={ViewOption.GRID} itemsPerRow={6}></View>;
    } else {
      return <NoData content="No se encontraron LyricsPage"></NoData>;
    }
  };

  render() {
    this.props.headerStore?.setTitle("LyricsPage");
    return (
      <div className="container-fluid LyricsPage">
        {/* <Search></Search> */}
        <div className="LyricsPage__section">{this.buildLyricsPage()}</div>
      </div>
    );
  }
}

export default inject("headerStore")(observer(LyricsPage));
