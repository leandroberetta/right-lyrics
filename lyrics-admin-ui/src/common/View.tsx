import React, { ChangeEvent } from "react";
import GridView from "./GridView";
import ListView from "./ListView";

export enum ViewOption {
  LIST,
  GRID,
}

interface ViewProps {
  option: ViewOption;
  itemsPerRow?: number;
}

interface ViewState {
  option: ViewOption;
  itemsPerRow?: number;
}

export default class View extends React.Component<ViewProps, ViewState> {
  state = {
    option: this.props.option,
    itemsPerRow: this.props.itemsPerRow || 8,
  };

  buildView = () => {
    if (this.state.option === ViewOption.GRID) {
      return (
        <GridView itemsPerRow={this.state.itemsPerRow}>
          {this.props.children}
        </GridView>
      );
    } else {
      return <ListView>{this.props.children}</ListView>;
    }
  };

  selectGrid = () => {
    this.setState({ option: ViewOption.GRID });
  };

  selectList = () => {
    this.setState({ option: ViewOption.LIST });
  };

  handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault();
    this.setState({ itemsPerRow: Number.parseInt(ev.target.value) || 8 });
  };

  render() {
    return (
      <div>
        <div className="view__actions">
          <button onClick={this.selectGrid} className="btn view__action">
            <i className="fas fa-th-large"></i>
          </button>
          <button onClick={this.selectList} className="btn view__action">
            <i className="fas fa-bars"></i>
          </button>
          <input
            onChange={this.handleChange}
            type="number"
            className="view__input"
            value={this.state.itemsPerRow}
          ></input>
        </div>
        <div className="view__content">{this.buildView()}</div>
      </div>
    );
  }
}
