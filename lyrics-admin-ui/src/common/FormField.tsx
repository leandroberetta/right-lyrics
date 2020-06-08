import React from "react";
import { Field } from "formik";

interface FormFieldProps {
  label: string;
  errors: any;
  touched: any;
  name: string;
  type: string;
  disabled?: boolean;
}

export default class FormField extends React.Component<FormFieldProps> {
  buildClassName = (name: string, errors: any, touched: any) => {
    if (errors[name] && touched[name]) {
      return "form-control is-invalid";
    } else if (!errors[name] && touched[name]) {
      return "form-control is-valid";
    } else {
      return "form-control";
    }
  };

  render() {
    const { errors, touched, type, name, label, disabled } = this.props;

    return (
      <div>
        <label>{label}</label>
        <Field
          type={type}
          className={this.buildClassName(name, errors, touched)}
          name={name}
          placeholder={label}
          disabled={disabled}
        />
        {errors[name] && touched[name] ? (
          <div className="invalid-feedback">{errors[name]}</div>
        ) : null}
      </div>
    );
  }
}
