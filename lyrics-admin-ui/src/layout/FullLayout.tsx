import { inject, observer } from "mobx-react";
import React from "react";
import menu, { MenuItem, MenuLayout, MenuType } from "../Menu";
import Albums from "../pages/albums/Albums";
import { HeaderStore } from "../store/HeaderStore";
import Sidebar from "./Sidebar";

export interface FullLayoutProps {
  headerStore?: HeaderStore;
}

const userMenu: MenuItem[] = [
  {
    nombre: "Settings",
    type: MenuType.MAIN,
    icon: "fas fa-cogs",
    layout: MenuLayout.FULL,
    route: "settings",
    component: <Albums></Albums>,
  },
  {
    nombre: "Account",
    type: MenuType.MAIN,
    icon: "fas fa-user",
    layout: MenuLayout.FULL,
    route: "account",
    component: <Albums></Albums>,
  },
];

class FullLayout extends React.Component<FullLayoutProps> {
  render() {
    return (
      <div className="full">
        <div className="full--left">
          <div className="brand">
            <div className="brand__content">
              <i className="fas fa-play-circle"></i> Right Lyrics
            </div>
          </div>
          <Sidebar prefix="" menu={menu}></Sidebar>
          <div className="user-section">
            <Sidebar prefix="" menu={userMenu}></Sidebar>
          </div>
        </div>
        <div className="full--right">
          <div className="header container-fluid">
            <h1>{this.props.headerStore?.title}</h1>
          </div>
          <div className="main">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default inject("headerStore")(observer(FullLayout));
