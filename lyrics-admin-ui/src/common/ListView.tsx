import React from "react";

interface ListViewProps {}

export default class ListView extends React.Component<ListViewProps> {
  render() {
    return <div className="list">{this.props.children}</div>;
  }
}
