import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { showModal, hideModal, createAllowlistDomain, deleteAllowlistDomain } from 'Store/actions';

import { Usertype } from 'Shared/enums';
import AllowlistEntryForm from './AllowlistEntryForm/AllowlistEntryForm';

import AllowlistDomain from 'Shared/entityClasses/AllowlistDomain';


interface OwnProps {
  parentTitle: string;
  entryUsertype: Usertype;
  onSubmit: any;
  onDelete: any;
  company_id?: number;
  entries: AllowlistDomain[];
}

const mapStateToProps = null;
const mapDispatchToProps = { showModal, hideModal, createAllowlistDomain, deleteAllowlistDomain };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AllowlistSubgroupDomains extends React.Component<Props, {}> {
  private _onSubmit = (formValues: any): void => {
    this.props.createAllowlistDomain({
      domain: formValues.domain,
      usertype: this.props.entryUsertype,
      ...(this.props.company_id && {company_id: this.props.company_id}),
    }, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  private _onCancel = (): void => {
    this.props.hideModal();
  }

  private _onEntryDeletion = (id: number): void => {
    this.props.deleteAllowlistDomain(id, this.props.parentTitle)
      .then(() => this.props.hideModal());
  }

  private _renderEntry(entryString: string, id: number): JSX.Element {
    return (
      <li className="allowlist__entry" key={id}>
        {`@${entryString}`}
        <button onClick={() => this._renderConfirmationDialogue(id, entryString, this.props.parentTitle)}>
          Delete
        </button>
      </li>
    )
  }

  private _renderEntries(allowlist_entries: any): JSX.Element[] {
    return allowlist_entries.map(({domain, id}: AllowlistDomain) => (this._renderEntry(domain, id)));
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
      entries,
    } = this.props;

    const allowlistEntryFormProps = {
      onSubmit: this._onSubmit,
      onCancel: this._onCancel,
      name: 'domain',
      id: 'domain',
      label: 'Domain',
      form: "createAllowlistDomain"
    };

    return (
      <div className={`allowlist__subgroup allowlist__subgroup--domains`}>
        <h3 className="heading-tertiary">{'Domains'}</h3>
        <ul className="allowlist__subgroup-entries">
          {this._renderEntries(entries)}
        </ul>
        <button onClick={() => this._renderForm(allowlistEntryFormProps)}>
          Add
        </button>
      </div>
    );
  }
}

export default connector(AllowlistSubgroupDomains);
