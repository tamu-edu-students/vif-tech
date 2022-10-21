import React from 'react';
import { connect } from "react-redux";

import {logIn } from "../../store/actions";
import LoginForm from "./LoginForm/LoginForm";

interface ILoginPageProps {
 logIn?: any;
}

interface ILoginPageState {
  errors: string[];
}

class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {
  constructor(props: ILoginPageProps) {
    super(props);
    this.state = {
      errors: []
    }
  }

  private _onSubmit = (formValues: any) => {
    this.setState({
      errors: []
    });
    this.props.logIn(formValues)
    .catch((err: Error) => {
      console.error(err.message);
      this.setState({
        errors: [err.message]
      });
      console.log('sfgbva')
    });
  }

  public render(): React.ReactElement<ILoginPageProps> {
    return (
      <section className="section section--login">
        <LoginForm onSubmit={this._onSubmit} />
        {
          this.state.errors?.map((error: string) => (
            <div className="error">{error}</div>
          ))
        }
      </section>
    );
  }
}

export default connect(null, { logIn })(LoginPage)
