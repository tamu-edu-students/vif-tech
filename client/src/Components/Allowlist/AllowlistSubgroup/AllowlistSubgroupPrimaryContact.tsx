import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import AllowlistEntryForm from './AllowlistEntryForm/AllowlistEntryForm';
import AllowlistTransferForm from './AllowlistTransferForm/AllowlistTransferForm';

import { showModal, hideModal, createAllowlistEmail, deleteAllowlistEmail, transferPrimaryContact } from 'Store/actions';
import { Usertype } from 'Shared/enums';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';
import { IRootState } from 'Store/reducers';
import User from 'Shared/entityClasses/User';
import Company from 'Shared/entityClasses/Company';

interface OwnProps {
  parentTitle: string;
  entryUsertype: Usertype;
  onSubmit: any;
  onDelete: any;
  company_id?: number;
  entry: AllowlistEmail | null;
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
  const transferFromId: number | undefined = ownProps.entry?.findUser(state.userData.users)?.id ?? undefined;
  const colleagues: User[] = Company.findById(ownProps.company_id, state.companyData.companies)?.findRepresentatives(state.userData.users).filter((rep: User) => rep.id !== transferFromId) ?? [];
  return {
    colleagues,
    usertype: state.auth.user?.usertype,
  };
};
const mapDispatchToProps = { showModal, hideModal, createAllowlistEmail, deleteAllowlistEmail, transferPrimaryContact };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AllowlistSubgroupPrimaryContacts extends React.Component<Props, {}> {
  private _onSubmit = (formValues: any): void => {
    this.props.createAllowlistEmail({
      email: formValues.email,
      usertype: this.props.entryUsertype,
      is_primary_contact: true,
      ...(this.props.company_id && {company_id: this.props.company_id})
    }, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  private _onTransfer = (formValues: any): void => {
    this.props.transferPrimaryContact(Number.parseInt(formValues.to), this.props.usertype === Usertype.ADMIN, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  private _onEntryDeletion = (id: number): void => {
    this.props.deleteAllowlistEmail(id, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  private _onCancel = (): void => {
    this.props.hideModal();
  }

  private _renderEntry({email, id}: AllowlistEmail): JSX.Element {
    return (
      <li className="allowlist__entry" key={id}>
        {email}
        {
          this.props.usertype === Usertype.ADMIN &&
          <button onClick={() => this._renderConfirmationDialogue(id, email, this.props.parentTitle)}>
            Delete
          </button>
        }
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

  private _renderEntryForm = (): void => {
    this.props.showModal(
      <AllowlistEntryForm
        onSubmit={this._onSubmit}
        onCancel={this._onCancel}
        name="email"
        id="email"
        label="Primary Contact"
        form="createAllowlistEmail"
      />
    );
  }

  private _renderTransferForm = (): void => {
    this.props.showModal(
      <AllowlistTransferForm
        colleagues={this.props.colleagues}
        onSubmit={this._onTransfer}
        onCancel={this._onCancel}
        name="to"
        id="to"
        label="Colleagues"
        form="transferPrimaryContact"
      />
    );
  }

  public render(): React.ReactElement<Props> {
    const {
      entry,
      usertype,
    } = this.props;

    return (
      <div className={`allowlist__subgroup allowlist__subgroup--primary-contact`}>
        <h3 className="heading-tertiary">{'Primary Contact'}</h3>
        <ul>
          {
          entry &&
          <>
            {this._renderEntry(entry)}
            <button onClick={() => this._renderTransferForm()}>
              Transfer
            </button>
          </>
          }
        </ul>
        {
          (!entry && usertype === Usertype.ADMIN) &&
          <button onClick={() => this._renderEntryForm()}>
            Add
          </button>
        }
      </div>
    );
  }
}

export default connector(AllowlistSubgroupPrimaryContacts);
