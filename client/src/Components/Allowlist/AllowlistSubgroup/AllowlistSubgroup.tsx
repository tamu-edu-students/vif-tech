import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import AllowlistEntryForm from './AllowlistEntryForm/AllowlistEntryForm';

import { fetchCompanies, showModal, hideModal } from 'Store/actions';
import { Usertype } from 'Shared/enums';

interface BaseProps {
  usertype: Usertype;
  onSubmit: any;
  onDelete: any;
}

type PrimaryContact = {
  heading: 'Primary Contacts';
  entries: AllowlistEmail[];
  name: 'email';
  isPrimaryContact: true;
}

type Email = {
  heading: 'Personal Emails';
  entries: AllowlistEmail[];
  name: 'email';
}

type Domain = {
  heading: 'Domains';
  entries: AllowlistDomain[];
  name: 'email_domain';
}

type Subgroup = PrimaryContact | Email | Domain;

type OwnProps = Subgroup & BaseProps;

const mapStateToProps = null;
const mapDispatchToProps = { fetchCompanies, showModal, hideModal };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class AllowlistSubgroup extends React.Component<Props, {}> {
  private _onEntryDeletion = (id: number): void => {
    this.props.onDelete(id)
    .then(() => {
      if (this.props.usertype === Usertype.REPRESENTATIVE) {
        this.props.fetchCompanies();
      }
    });
  }

  private _renderEntry(entryString: string, id: number): JSX.Element {
    return (
      <li className="allowlist__entry" key={id}>
        {`${this.props.name === 'email_domain' ? '@' : ''}${entryString}`}
        <button onClick={() => this._onEntryDeletion(id)}>
          Delete
        </button>
      </li>
    )
  }

  private _renderEntries(allowlist_entries: any): JSX.Element[] {
    const name = this.props.name;
    if (name === 'email') {
      return allowlist_entries.map(({email, id}: AllowlistEmail) => (this._renderEntry(email, id)));
    }
    if (name === 'email_domain') {
      return allowlist_entries.map(({email_domain, id}: AllowlistDomain) => (this._renderEntry(email_domain, id)));
    }
    else {
      throw new Error(`Invalid Allowlist field name type "${name}"`);
    }
  }

  private _renderForm = (allowlistEntryFormProps: any): void => {
    this.props.showModal(<AllowlistEntryForm {...allowlistEntryFormProps} />);
  }

  private _onSubmit = (formValues: any): void => {
    this.props.onSubmit(formValues)
    .then(() => this.props.hideModal());
  }

  private _onCancel = (): void => {
    this.props.hideModal();
  }

  public render(): React.ReactElement<Props> {
    const {
      entries,
      name,
      heading,
    } = this.props;

    let classModifier;
    if (heading === 'Primary Contacts') { classModifier = 'primary-contacts'; }
    if (heading === 'Personal Emails') { classModifier = 'personal-emails'; }
    if (heading === 'Domains') { classModifier = 'domains'; }

    const allowlistEntryFormProps = {
      onSubmit: this._onSubmit,
      onCancel: this._onCancel,
      name,
      id: name,
      label: heading,
      form: "createAllowlistEntry"
    };

    return (
      <div className={`allowlist__subgroup allowlist__subgroup--${classModifier}`}>
        <h3 className="heading-tertiary">{heading}</h3>
        <ul>
          {this._renderEntries(entries)}
        </ul>
        <button onClick={() => this._renderForm(allowlistEntryFormProps)}>
          Add
        </button>
      </div>
    );
  }
}

export default connector(AllowlistSubgroup);
