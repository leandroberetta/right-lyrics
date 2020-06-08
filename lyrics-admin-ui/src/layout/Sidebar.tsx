import React from "react";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";
import { MenuItem } from "../Menu";
interface SidebarProps {
  prefix: string;
  menu: MenuItem[] | undefined;
}

class Sidebar extends React.Component<SidebarProps & RouteComponentProps> {
  render() {
    let items: MenuItem[] = [];
    if (this.props.menu) {
      items = this.props.menu;
    }

    return (
      <div className="sidebar list-group ">
        {items
          .filter((item) => item.visible !== false)
          .map((item, i) => (
            <div className="sidebar__item" key={i}>
              <NavLink
                className="list-group-item list-group-item-action"
                isActive={(match, location): boolean =>
                  location.pathname.includes(item.route)
                }
                to={this.props.prefix + "/" + item.route}
              >
                <span>
                  <i className={item.icon}></i>
                  <span className="sidebar__text">{item.nombre}</span>
                </span>
              </NavLink>
            </div>
          ))}
      </div>
    );
  }
}

export default withRouter(Sidebar);
