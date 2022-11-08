import React from 'react';
import { connect, ConnectedProps } from "react-redux";

import {logIn } from "../../store/actions";
import LoginForm from "./LoginForm/LoginForm";

interface OwnProps {
}

const mapStateToProps = null;
const mapDispatchToProps = { logIn };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;


interface OwnState {
  errors: string[];
}

class LoginPage extends React.Component<Props, OwnState> {
  constructor(props: Props) {
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
    });
  }

  public render(): React.ReactElement<Props> {
    return (
      <section className="section section--login">
        <LoginForm onSubmit={this._onSubmit} form="login" />
        {
          this.state.errors?.map((error: string) => (
            <div className="error" key={error}>{error}</div>
          ))
        }
      </section>
    );
  }
}

export default connector(LoginPage)
