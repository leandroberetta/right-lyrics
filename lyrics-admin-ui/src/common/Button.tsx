import React from "react";

interface ButtonProps {
  icon: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
}

export default class Button extends React.Component<ButtonProps> {
  render() {
    const { icon, onClick, className, type } = this.props;
    return (
      <button
        type={type}
        className={`btn button ${className}`}
        onClick={onClick}
      >
        <i className={`button__icon fas fa-${icon}`}></i>
        <span className="button__content">{this.props.children}</span>
      </button>
    );
  }
}
