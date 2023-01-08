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
      <div className={`form__field form__field--input ${hasError ? "form__field--error" : ""}`}>
        <label className={"form__field-label"} htmlFor={id}>{label}</label>
        {/* //TODO: handle different scenarios for autocomplete */}
        <input className={`form__element form__input ${hasError ? "form__input--error" : ""}`} {...input} type={type} id={id} autoComplete="off" {...rest} />
        {this._renderError(meta)}
      </div>
    );
  }

  protected _renderSelect = ({ input, label, meta, id, children }: any) => {
    const hasError: boolean = meta.error && meta.touched;
    return (
      <div className={`form__field form__field--select ${hasError ? "form__field--error" : ""}`}>
        <label className="form__field-label" htmlFor={id}>{label}</label>
        <select className={`form__element form__select ${hasError ? "form__select--error" : ""}`} {...input} id={id}>
          {children}
        </select>
        {this._renderError(meta)}
      </div>
    );
  }

  
  protected _renderRadio = ({ input, label, meta, id, type, ...rest }: any) => {
    const hasError: boolean = meta.error && meta.touched;
    return (
      <div className={`form__field form__field--radio ${hasError ? "form__field--error" : ""}`}>
        <input className={`form__element form__radio ${hasError ? "form__radio--error" : ""}`} {...input} type={type} id={id} {...rest} />
        <label htmlFor={id} className='form__field-label form__field-label--radio'>{label}</label>
        {/* {this._renderError(meta)} */}
      </div>
    );
  }

  protected _renderCheckbox = ({ input, label, meta, id, type, ...rest }: any) => {
    const hasError: boolean = meta.error;
    return (
      <div className={`form__field form__field--checkbox ${hasError ? "form__field--error" : ""}`}>
        <input className={`form__element form__checkbox ${hasError ? "form__checkbox--error" : ""}`} {...input} type={type} id={id} {...rest} />
        <label className='form__field-label form__field-label--checkbox' htmlFor={id}>{label}</label>
        {/* {this._renderError(meta)} */}
      </div>
    );
  }

  protected _renderError({ error, touched }: any) {
    if (touched && error) {
      return (
        <p className="form__field-error-text">{error}</p>
      );
    }
  }
}

export default CustomForm;
