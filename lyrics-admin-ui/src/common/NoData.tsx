import React from "react";
import noData from "../images/no_data.svg";

interface NoDataProps {
  content?: string;
}

export default class NoData extends React.Component<NoDataProps> {
  render() {
    var content = "No results found";
    if (this.props.content) {
      content = this.props.content;
    }

    return (
      <div className="nodata">
        <img src={noData} alt="" className="nodata__image" />
        <div className="nodata__text">{content}</div>
      </div>
    );
  }
}
