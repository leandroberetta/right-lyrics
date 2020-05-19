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
  render() {
    return (
      <div className={`grid grid__size--${this.props.itemsPerRow}`}>
        {this.props.children}
      </div>
    );
  }
}

class GridItem extends React.Component<GridViewProps, GridViewState> {
  render() {
    return <div className="grid__item"></div>;
  }
}
