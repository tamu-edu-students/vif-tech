import React from 'react';
import { InjectedFormProps } from "redux-form";

interface OwnProps {
}

interface OwnState {
  
}

class CustomForm<T, U> extends React.Component<InjectedFormProps<any, OwnProps & T> & OwnProps & T, OwnState & U> {
  protected _renderInput = ({ input, label, meta, id, type, ...rest }: any) => {
    const hasError: boolean = meta.error && meta.touched;
    return (
      <div className={`field field--input ${hasError ? "field--error" : ""}`}>
        <label htmlFor={id}>
          <p className='field__label'>{label}</p>
          <input className={`field__input ${hasError ? "field__input--error" : ""}`} {...input} type={type} id={id} autoComplete="off" {...rest} />
          {this._renderError(meta)}
        </label>
      </div>
    );
  }

  protected _renderSelect = ({ input, label, meta, id, children }: any) => {
    const hasError: boolean = meta.error && meta.touched;
    return (
      <div className={`field field--select ${hasError ? "field--error" : ""}`}>
        <label htmlFor={id}>
          <p className='field__label'>{label}</p>
          <select className={`field__select ${hasError ? "field__select--error" : ""}`} {...input} id={id}>
            {children}
          </select>
          {this._renderError(meta)}
        </label>
      </div>
    );
  }

  
  protected _renderRadio = ({ input, label, meta, id, type, ...rest }: any) => {
    const hasError: boolean = meta.error && meta.touched;
    return (
      <div className={`field field--radio ${hasError ? "field--error" : ""}`}>
        <input className={`field__radio ${hasError ? "field__radio--error" : ""}`} {...input} type={type} id={id} autoComplete="off" {...rest} />
        <label htmlFor={id} className='field__label'>{label}</label>
        {this._renderError(meta)}
      </div>
    );
  }

  protected _renderError({ error, touched }: any) {
    if (touched && error) {
      return (
        <p className="field__error-text">{error}</p>
      );
    }
  }
}

export default CustomForm;
