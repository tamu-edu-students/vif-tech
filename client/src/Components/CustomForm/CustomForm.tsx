import React from 'react';
import { InjectedFormProps } from "redux-form";

interface OwnProps {
}

interface OwnState {
  
}

class CustomForm<T, U> extends React.Component<InjectedFormProps<any, OwnProps & T> & OwnProps & T, OwnState & U> {
  protected _renderInput = ({ input, label, meta, id, type, ...rest }: any) => {
    return (
      <div className={`field ${meta.error && meta.touched ? "error" : ""}`}>
        <label htmlFor={id}>
          <p>{label}</p>
          <input {...input} type={type} id={id} autoComplete="off" {...rest} />
          {this._renderError(meta)}
        </label>
      </div>
    );
  }

  protected _renderSelect = ({ input, label, meta, id, children }: any) => {
    return (
      <div className={`field ${meta.error && meta.touched ? "error" : ""}`}>
        <label htmlFor={id}>
          <p>{label}</p>
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
