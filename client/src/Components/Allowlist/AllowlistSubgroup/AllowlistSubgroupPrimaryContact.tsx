import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import AllowlistEntryForm from './AllowlistEntryForm/AllowlistEntryForm';

import { showModal, hideModal, createAllowlistEmail, deleteAllowlistEmail } from 'Store/actions';
import { Usertype } from 'Shared/enums';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';

interface OwnProps {
  parentTitle: string;
  usertype: Usertype;
  onSubmit: any;
  onDelete: any;
  company_id?: number;
  entry: AllowlistEmail | null;
}

const mapStateToProps = null;
const mapDispatchToProps = { showModal, hideModal, createAllowlistEmail, deleteAllowlistEmail };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AllowlistSubgroupPrimaryContacts extends React.Component<Props, {}> {
  private _onSubmit = (formValues: any): void => {
    this.props.createAllowlistEmail({
      email: formValues.email,
      usertype: this.props.usertype,
      isPrimaryContact: true,
      ...(this.props.company_id && {company_id: this.props.company_id})
    })
      .then(() => this.props.hideModal());
  }

  private _onEntryDeletion = (id: number): void => {
    this.props.deleteAllowlistEmail(id)
      .then(() => this.props.hideModal());
  }

  private _onCancel = (): void => {
    this.props.hideModal();
  }

  private _renderEntry({email, id}: AllowlistEmail): JSX.Element {
    return (
      <li className="allowlist__entry" key={id}>
        {email}
        <button onClick={() => this._renderConfirmationDialogue(id, email, this.props.parentTitle)}>
          Delete
        </button>
      </li>
    );
  }

  private _renderConfirmationDialogue = (id: number, entryString: string, parentTitle: string): void => {
    this.props.showModal(
      <div>
        <p>Warning: Users registered under {parentTitle} will be deleted if {entryString} was their only tie to the {parentTitle} allowlist. Delete?</p>
        <button onClick={() => this._onEntryDeletion(id)} type="button">Confirm</button>
        <button onClick={this._onCancel} type="button">Cancel</button>
      </div>
    );
  }

  private _renderForm = (allowlistEntryFormProps: any): void => {
    this.props.showModal(<AllowlistEntryForm {...allowlistEntryFormProps} />);
  }

  public render(): React.ReactElement<Props> {
    const {
      entry,
    } = this.props;

    const allowlistEntryFormProps = {
      onSubmit: this._onSubmit,
      onCancel: this._onCancel,
      name: 'email',
      id: 'email',
      label: 'Primary Contact',
      form: "createAllowlistEmail"
    };

    return (
      <div className={`allowlist__subgroup allowlist__subgroup--primary-contact`}>
        <h3 className="heading-tertiary">{'Primary Contact'}</h3>
        <ul>
          {entry && this._renderEntry(entry)}
        </ul>
        {
          !entry &&
          <button onClick={() => this._renderForm(allowlistEntryFormProps)}>
            Add
          </button>
        }
      </div>
    );
  }
}

export default connector(AllowlistSubgroupPrimaryContacts);
