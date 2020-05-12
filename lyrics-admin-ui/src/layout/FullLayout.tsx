import React from "react";

export default class FullLayout extends React.Component {
  render() {
    return (
      <div className="full">
        <div className="full--left">
          <div className="brand">Brand</div>
          <div className="sidebar">Sidebar</div>
          <div className="user-section">User Section</div>
        </div>
        <div className="full--right">
          <div className="header">Header</div>
          <div className="main">Main</div>
        </div>
      </div>
    );
  }
}
