import React, { ChangeEvent, KeyboardEvent } from "react";
import SearchResponse from "../model/SearchResponse";
import Album from "../model/Album";

interface SearchProps {
  setQuery: (query: string) => void;
}

interface SearchState {
  query: string;
}

export default class Search extends React.Component<SearchProps, SearchState> {
  state = {
    query: "",
  };

  handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: ev.target.value });
  };

  handleKeyUp = (ev: KeyboardEvent<HTMLInputElement>) => {
    console.log(ev.keyCode);
    if (ev.keyCode === 13) this.props.setQuery(this.state.query);
  };

  render() {
    return (
      <div className="search">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              <i className="fas fa-search"></i>
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon1"
            onKeyUp={this.handleKeyUp}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}
