import React from "react";

interface GridViewProps {
  itemsPerRow: number;
}

interface GridViewState {
  loaded: boolean;
}

export default class GridView extends React.Component<
  GridViewProps,
  GridViewState
> {
  state = { loaded: false };

  buildCss = () => {
    return `grid grid__size--${this.props.itemsPerRow} `;
  };

  render() {
    return <div className={this.buildCss()}>{this.props.children}</div>;
  }
}
