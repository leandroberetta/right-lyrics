import React from "react";
import Button from "./Button";
import { ConfirmationModal } from "./ConfirmationModal";

interface ButtonProps {
  icon: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  show: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default class ConfirmationButton extends React.Component<ButtonProps> {
  state = {
    showModal: false,
  };

  handleClick = () => {
    if (this.props.show) {
      this.setState({ showModal: true });
    } else {
      this.props.onCancel();
    }
  };

  handleCancel = () => {
    console.log("cancel");
    this.setState({ showModal: false });
  };

  render() {
    const { icon, onSubmit, className, type, disabled } = this.props;
    return (
      <div className="confirmation-button">
        <ConfirmationModal
          show={this.state.showModal}
          onCancel={this.handleCancel}
          onSubmit={onSubmit}
        ></ConfirmationModal>
        <Button
          icon={icon}
          type={type}
          className={className}
          disabled={disabled}
          onClick={this.handleClick}
        >
          {this.props.children}
        </Button>
      </div>
    );
  }
}
