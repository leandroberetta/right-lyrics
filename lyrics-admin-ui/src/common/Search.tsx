import React from "react";

interface SaerchProps {}

export default class Search extends React.Component<SaerchProps> {
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
          />
        </div>
      </div>
    );
  }
}
