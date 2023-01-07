import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { showModal, hideModal, createAllowlistEmail, deleteAllowlistEmail } from 'Store/actions';

import { Usertype } from 'Shared/enums';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';

import AllowlistEntryForm from './AllowlistEntryForm/AllowlistEntryForm';


interface OwnProps {
  parentTitle: string;
  entryUsertype: Usertype;
  onSubmit: any;
  onDelete: any;
  company_id?: number;
  entries: AllowlistEmail[];
  disabled?: boolean;
}

const mapStateToProps = null;
const mapDispatchToProps = { showModal, hideModal, createAllowlistEmail, deleteAllowlistEmail };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AllowlistSubgroupEmails extends React.Component<Props, {}> {
  private _onSubmit = (formValues: any): void => {
    this.props.createAllowlistEmail({
      email: formValues.email,
      usertype: this.props.entryUsertype,
      ...(this.props.company_id && {company_id: this.props.company_id}),
    }, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  private _onCancel = (): void => {
    this.props.hideModal();
  }

  private _onEntryDeletion = (id: number): void => {
    this.props.deleteAllowlistEmail(id, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  private _renderEntry(entryString: string, id: number): JSX.Element {
    return (
      <li className="allowlist__entry" key={id}>
        {entryString}
        {
          !this.props.disabled &&
          <button className="btn-solid btn-solid--delete" onClick={() => this._renderConfirmationDialogue(id, entryString, this.props.parentTitle)}>
            x
          </button>
        }
      </li>
    )
  }

  private _renderEntries(allowlist_entries: any): JSX.Element[] {
    return allowlist_entries.map(({email, id}: AllowlistEmail) => (this._renderEntry(email, id)));
  }

  private _renderConfirmationDialogue = (id: number, entryString: string, parentTitle: string): void => {
    this.props.showModal(
      <form
        className="allowlist-form form form--modal form--allowlist">
        <p className="form__note form__note--warning">
          Warning: Users registered under <em>{parentTitle}</em> will be deleted if <em>{entryString}</em> was
          their only tie to the <em>{parentTitle}</em> allowlist.
        </p>
        <div className="form__button-group">
          <button className="btn-wire" onClick={() => this._onEntryDeletion(id)} type="button">Confirm</button>
          <button className="btn-wire" onClick={this._onCancel} type="button">Cancel</button>
        </div>
      </form>
    );
  }

  private _renderForm = (allowlistEntryFormProps: any): void => {
    this.props.showModal(<AllowlistEntryForm {...allowlistEntryFormProps} />);
  }

  public render(): React.ReactElement<Props> {
    const {
      entries,
      disabled = false
    } = this.props;

    const allowlistEntryFormProps = {
      onSubmit: this._onSubmit,
      onCancel: this._onCancel,
      name: 'email',
      id: 'email',
      label: 'Personal Email',
      form: "createAllowlistEmail"
    };

    return (
      <div className={`allowlist__subgroup allowlist__subgroup--perosnal-emails`}>
        <h3 className="heading-tertiary">{'Personal Emails'}</h3>
        <ul className="allowlist__subgroup-entries">
          {this._renderEntries(entries)}
        </ul>
        {
          !disabled &&
          <button className="btn-solid btn-solid--add" onClick={() => this._renderForm(allowlistEntryFormProps)}>
            +
          </button>
        }
      </div>
    );
  }
}

export default connector(AllowlistSubgroupEmails);
