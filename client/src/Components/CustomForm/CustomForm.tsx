import CustomCheckbox from 'Components/CustomCheckbox/CustomCheckbox';
import CustomCheckboxDropdown from 'Components/CustomCheckboxDropdown/CustomCheckboxDropdown';
import React from 'react';
import { InjectedFormProps, WrappedFieldInputProps, WrappedFieldMetaProps, WrappedFieldProps } from "redux-form";

interface OwnProps {
}

interface OwnState {
  
}

interface CustomFormProps {
  children?: JSX.Element;
  [key: string]: any;
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
        {hasError && this._renderError(meta)}
      </label>
    );
  }

  protected _renderSelect = ({ input, label, meta, children, ...rest }: Props) => {
    const hasError: boolean = !rest.disabled && meta.error && meta.touched;
    return (
      <label className={`form__field form__field--select ${hasError ? "form__field--error" : ""}`}>
        <p className="form__field-label">{label}</p>
        <select className={`form__element form__select ${hasError ? "form__select--error" : ""}`} {...input} {...rest}>
          {children}
        </select>
        {hasError && this._renderError(meta)}
      </label>
    );
  }

  
  protected _renderRadio = ({ input, label, meta, ...rest }: Props) => {
    const hasError: boolean = !rest?.disabled && meta.error && meta.touched;
    return (
      <label className={`form__field form__field--radio ${hasError ? "form__field--error" : ""}`}>
        <input className={`form__element form__radio ${hasError ? "form__radio--error" : ""}`} {...input} {...rest} />
        <p className='form__field-label form__field-label--radio'>{label}</p>
        {/* {this._renderError(meta)} */}
      </label>
    );
  }

  protected _renderCustomCheckbox = ({ input, label, meta, ...rest }: Props) => {
    return (
      <label
        className={`form__field form__field--checkbox ${false ? "form__field--error" : ""}`}
        onMouseDown={(e) => e.preventDefault()}
      >
        <CustomCheckbox
          className={`form__element form__checkbox ${false ? "form__checkbox--error" : ""}`}
          input={input}
          rest={rest}
        />
        <p className='form__field-label form__field-label--checkbox'>{label}</p>
      </label>
    );
  }

  protected _renderCustomCheckboxDropdown = ({ input, legend, checkboxOptions, meta, ...rest }: Props) => {
    const hasError: boolean = meta?.error && meta?.touched && !rest.disabled;
    return (
      <fieldset className="form__fieldset">
        <legend
          className="form__legend form__legend--label"
          onClick={(e) => {(e.currentTarget.nextElementSibling?.querySelector('.custom-checkbox-dropdown__controller') as HTMLDivElement)?.focus();}}
        >
          {`Interests`}
        </legend>
        <CustomCheckboxDropdown
          checkboxOptions={checkboxOptions}
          renderCheckbox={this._renderCustomCheckbox}
          onBlur={input.onBlur}
          hasError={hasError}
          {...rest}
        />
        {hasError && this._renderError(meta, 'focuses')}
      </fieldset>
    )
  }


  protected _renderError({ error, touched }: any, errorFieldName?: string) {
    if (error) {
      return (
        <p className="form__field-error-text">
          {
            typeof error === 'string' ? error :
              (errorFieldName ? error[errorFieldName] : '')
          }
        </p>
      );
    }
  }
}

export default CustomForm;
