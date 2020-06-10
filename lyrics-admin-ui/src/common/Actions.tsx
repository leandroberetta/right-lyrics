import React from "react";

interface ActionsProps {}

export class Actions extends React.Component<ActionsProps> {
  render() {
    return <div className="actions">{this.props.children}</div>;
  }
}
