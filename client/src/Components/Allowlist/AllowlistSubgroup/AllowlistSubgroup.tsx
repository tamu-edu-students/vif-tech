import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from 'Store/reducers';
import { showModal, hideModal, createAllowlistEmail, deleteAllowlistEmail, createAllowlistDomain, deleteAllowlistDomain, transferPrimaryContact } from 'Store/actions';

import { Usertype, AllowlistSubgroupType } from 'Shared/enums';
import AllowlistEmail from 'Shared/entityClasses/AllowlistEmail';
import AllowlistDomain from 'Shared/entityClasses/AllowlistDomain';

import AllowlistEntryForm from './AllowlistEntryForm/AllowlistEntryForm';
import AllowlistTransferForm from './AllowlistTransferForm/AllowlistTransferForm';


interface OwnProps {
  subgroupType: AllowlistSubgroupType;
  parentTitle: string;
  entryUsertype: Usertype;
  entryIsPrimaryContact?: boolean;
  entries: AllowlistEmail[] | AllowlistDomain[];
  // onSubmit: any;
  // onDelete: any;
  company_id?: number;
  disabled?: boolean;
}

const mapStateToProps = (state: IRootState, ownProps: OwnProps) => {
  const { entryIsPrimaryContact, disabled, entries } = ownProps;
  const shouldRenderAddButton: boolean = !disabled &&
    ((!entryIsPrimaryContact) || (entryIsPrimaryContact && entries.length === 0));
  const shouldRenderDeleteButton: boolean = !disabled;
  const shouldRenderTransferButton: boolean = !disabled &&
    ((entryIsPrimaryContact === true) && (entries.length > 0));
  return {
    entryType: ownProps.subgroupType === AllowlistSubgroupType.DOMAINS ? 'domain' : 'email',
    usertype: state.auth.user?.usertype,
    shouldRenderAddButton,
    shouldRenderDeleteButton,
    shouldRenderTransferButton,
  };
};
const mapDispatchToProps = { showModal, hideModal, createAllowlistEmail, deleteAllowlistEmail, createAllowlistDomain, deleteAllowlistDomain, transferPrimaryContact };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AllowlistSubgroup extends React.Component<Props, {}> {
  //TODO: Handle '@' sign in domain submissions
  private _onSubmit = (formValues: any): void => {
    const { entryType, entryUsertype, company_id, entryIsPrimaryContact } = this.props;

    const submissionObj: any = {
      [entryType]: formValues[entryType],
      usertype: entryUsertype,
      ...(company_id && {company_id: company_id}),
      ...(entryIsPrimaryContact && {is_primary_contact: entryIsPrimaryContact}),
    }
    
    this.props[entryType === 'email' ? 'createAllowlistEmail' : 'createAllowlistDomain'](submissionObj, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  
  private _onTransfer = (formValues: any): void => {
    this.props.transferPrimaryContact(Number.parseInt(formValues.to), this.props.usertype === Usertype.ADMIN, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  private _onCancel = (): void => {
    this.props.hideModal();
  }

  private _onEntryDeletion = (id: number): void => {
    const { entryType, parentTitle } = this.props;
    this.props[entryType === 'email' ? 'deleteAllowlistEmail' : 'deleteAllowlistDomain'](id, parentTitle)
      .then(() => this.props.hideModal());
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

  private _renderEntry(entryString: string, id: number): JSX.Element {
    return (
      <li className="allowlist__entry" key={id}>
        {entryString}
        {
          this.props.shouldRenderDeleteButton &&
          <button
            className="btn-solid btn-solid--delete"
            onClick={() => this._renderConfirmationDialogue(id, entryString, this.props.parentTitle)}
          >
            x
          </button>
        }
      </li>
    )
  }

  private _renderEntries(allowlist_entries: any[]): JSX.Element[] {
    return allowlist_entries.map(
      this.props.entryType === 'email' ?
        ({email, id}: AllowlistEmail) => (this._renderEntry(email, id)) :
        ({domain, id}: AllowlistDomain) => (this._renderEntry(domain, id))
    );
  }

  private _renderEntryForm = (): void => {
    this.props.showModal(
      <AllowlistEntryForm 
        onSubmit={this._onSubmit}
        onCancel={this._onCancel}
        name={this.props.entryType}
        id={this.props.entryType}
        label={this._generateLabel()}
        form={this.props.subgroupType === AllowlistSubgroupType.DOMAINS ? 'createAllowlistDomain' : 'createAllowlistEmail'}
      />)
    ;
  }
  
  private _renderTransferForm = (): void => {
    this.props.showModal(
      <AllowlistTransferForm
        onSubmit={this._onTransfer}
        onCancel={this._onCancel}
        name="to"
        id="to"
        label="Colleagues"
        form="transferPrimaryContact"
        company_id={this.props.company_id ?? -1}
        currentAllowlistEmail={this.props.entries[0] as AllowlistEmail}
      />
    );
  }

  private _generateLabel(): string {
    switch(this.props.subgroupType) {
      case AllowlistSubgroupType.PRIMARY_CONTACT: return 'Primary Contact Email';
      case AllowlistSubgroupType.PERSONAL_EMAILS: return 'Personal Email';
      case AllowlistSubgroupType.DOMAINS: return 'Domain';
    }
  }

  public render(): React.ReactElement<Props> {
    const {
      entries,
      subgroupType,
      shouldRenderAddButton,
      shouldRenderTransferButton,
    } = this.props;

    return (
      <div className={`allowlist__subgroup`}>
        <h3 className="heading-tertiary">{subgroupType}</h3>
        <ul className="allowlist__subgroup-entries">
          {this._renderEntries(entries)}
        </ul>
        {
          shouldRenderAddButton &&
          <button
            className="btn-solid btn-solid--add"
            onClick={() => this._renderEntryForm()}
          >
            +
          </button>
        }
        {
          shouldRenderTransferButton &&
          <button
            className="btn-solid btn-solid--transfer"
            onClick={() => this._renderTransferForm()}
          >
            &#x21c6;
          </button>
        }
      </div>
    );
  }
}

export default connector(AllowlistSubgroup);
