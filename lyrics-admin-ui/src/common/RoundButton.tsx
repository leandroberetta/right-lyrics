import React from "react";

interface RoundButtonProps {
  icon: string;
  color: string;
  onClick?: () => void;
}

export default class RoundButton extends React.Component<RoundButtonProps> {
  render() {
    const color = "round-button--" + this.props.color;

    return (
      <button
        className={`btn btn-outline-light round-button ${color}`}
        onClick={this.props.onClick}
      >
        <i className={`fas ${this.props.icon}`}></i>
      </button>
    );
  }
}
