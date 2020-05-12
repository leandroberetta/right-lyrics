import { inject, observer } from "mobx-react";
import React from "react";
import menu from "../Menu";
import Sidebar from "./Sidebar";
import { HeaderStore } from "../store/HeaderStore";

export interface FullLayoutProps {
  headerStore?: HeaderStore;
}

class FullLayout extends React.Component<FullLayoutProps> {
  render = () => {
    return (
      <div className="full">
        <div className="full--left">
          <div className="brand">
            <div className="brand__content">
              <i className="fas fa-play-circle"></i> Right Lyrics
            </div>
          </div>
          <Sidebar prefix="" menu={menu}></Sidebar>
          <div className="user-section">User Section</div>
        </div>
        <div className="full--right">
          <div className="header container-fluid">
            <h1>{this.props.headerStore?.title}</h1>
          </div>
          <div className="main">{this.props.children}</div>
        </div>
      </div>
    );
  };
}

export default inject("headerStore")(observer(FullLayout));
