import React from 'react';
import { InjectedFormProps } from "redux-form";

export interface ICustomFormProps {
}

class CustomForm<T> extends React.Component<InjectedFormProps<any, ICustomFormProps & T> & ICustomFormProps & T, {}> {
  protected _renderInput = ({ input, label, meta, id, type }: any) => {
    return (
      <div className={`field ${meta.error && meta.touched ? "error" : ""}`}>
        <label htmlFor={id}>
          {label}
          <input {...input} type={type} id={id} autoComplete="off" />
          {this._renderError(meta)}
        </label>
      </div>
    );
  }

  protected _renderSelect = ({ input, label, meta, id, type, children }: any) => {
    return (
      <div className={`field ${meta.error && meta.touched ? "error" : ""}`}>
        <label htmlFor={id}>
          {label}
          <select {...input} id={id}>
            {children}
          </select>
          {this._renderError(meta)}
        </label>
      </div>
    );
  }

  protected _renderError({ error, touched }: any) {
    if (touched && error) {
      return (
        <div className="error-text">
          <div>{error}</div>
        </div>
      );
    }
  }
}

export default CustomForm;
