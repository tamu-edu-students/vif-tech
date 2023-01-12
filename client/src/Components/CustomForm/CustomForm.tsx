import CustomCheckbox from 'Components/CustomCheckbox/CustomCheckbox';
import React from 'react';
import { InjectedFormProps, WrappedFieldInputProps, WrappedFieldMetaProps, WrappedFieldProps } from "redux-form";

interface OwnProps {
}

interface OwnState {
  
}

interface CustomFormProps {
  input: WrappedFieldInputProps;
  meta: WrappedFieldMetaProps;
  label: string;
  children: JSX.Element;
  rest: any;
}

type Props = WrappedFieldProps & CustomFormProps;

class CustomForm<T, U> extends React.Component<InjectedFormProps<any, OwnProps & T> & OwnProps & T, OwnState & U> {
  protected _renderInput = ({ input, label, meta, ...rest }: Props) => {
    const hasError: boolean = meta.error && meta.touched;
    return (
      <label className={`form__field form__field--input ${hasError ? "form__field--error" : ""}`}>
        <p className={"form__field-label"}>{label}</p>
        {/* //TODO: handle different scenarios for autocomplete */}
        <input className={`form__element form__input ${hasError ? "form__input--error" : ""}`} {...input} autoComplete="off" {...rest} />
        {this._renderError(meta)}
      </label>
    );
  }

  protected _renderSelect = ({ input, label, meta, children, ...rest }: Props) => {
    const hasError: boolean = meta.error && meta.touched;
    return (
      <label className={`form__field form__field--select ${hasError ? "form__field--error" : ""}`}>
        <p className="form__field-label">{label}</p>
        <select className={`form__element form__select ${hasError ? "form__select--error" : ""}`} {...input} {...rest}>
          {children}
        </select>
        {this._renderError(meta)}
      </label>
    );
  }

  
  protected _renderRadio = ({ input, label, meta, ...rest }: Props) => {
    const hasError: boolean = meta.error && meta.touched;
    return (
      <label className={`form__field form__field--radio ${hasError ? "form__field--error" : ""}`}>
        <input className={`form__element form__radio ${hasError ? "form__radio--error" : ""}`} {...input} {...rest} />
        <p className='form__field-label form__field-label--radio'>{label}</p>
        {/* {this._renderError(meta)} */}
      </label>
    );
  }

  // protected _renderCheckbox = ({ input, label, meta, ...rest }: Props) => {
  //   const hasError: boolean = meta.error;
  //   return (
  //     <label className={`form__field form__field--checkbox ${hasError ? "form__field--error" : ""}`}>
  //       <input className={`form__element form__checkbox ${hasError ? "form__checkbox--error" : ""}`} {...input} {...rest} />
  //       <p className='form__field-label form__field-label--checkbox'>{label}</p>
  //       {/* {this._renderError(meta)} */}
  //     </label>
  //   );
  // }

  protected _renderCustomCheckbox = ({ input, label, meta, ...rest }: Props) => {
    const hasError: boolean = meta.error;
    return (
      <label
        className={`form__field form__field--checkbox ${hasError ? "form__field--error" : ""}`}
        onMouseDown={(e) => e.preventDefault()}
      >
        <CustomCheckbox
          className={`form__element form__checkbox ${hasError ? "form__checkbox--error" : ""}`}
          input={input}
          rest={rest}
        />
        <p className='form__field-label form__field-label--checkbox'>{label}</p>
        {/* {this._renderError(meta)} */}
      </label>
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
