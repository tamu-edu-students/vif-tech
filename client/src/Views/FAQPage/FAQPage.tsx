import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { IRootState } from 'Store/reducers';

import EditorConvertToHTML from 'Components/EditorToHTML/EditorToHTML';
import FAQForm from './FAQForm/FAQForm';

import { fetchFAQs, createFAQ, showModal, hideModal } from 'Store/actions';
import FAQ from './FAQ/FAQ';

interface OwnProps {
}

const mapStateToProps = (state: IRootState) => {
  return {
    faqs: state.faqs,
  };
}
const mapDispatchToProps = { fetchFAQs, createFAQ, showModal, hideModal };
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

interface OwnState {
  isLoaded: boolean;
}

class FAQPage extends React.Component<Props, OwnState> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount(): void {
    this.props.fetchFAQs()
    .then(() => this.setState({ isLoaded: true }));
  }

  private _onFAQSubmit = (formValues: any) => {
    console.log(formValues);
    this.props.createFAQ(formValues)
    .then(() => this.props.hideModal())
    .catch((err: any) => {
      console.error('ERROR WHEN SUBMITTING FAQ:', err);
      this.props.hideModal();
    });
  }

  private _renderEditor = (): void => {
    this.props.showModal((
      <FAQForm
        onSubmit={this._onFAQSubmit}
        onCancel={this.props.hideModal}
      />
    ));
  }

  private _renderFAQs = (): JSX.Element[] => {
    return this.props.faqs.map((faq: FAQ) => (
      <FAQ key={faq.id} {...faq} />
    ));
  }

  public render(): React.ReactElement<Props> {
    if (!this.state.isLoaded) {
      return (
        <div>Loading FAQs...</div>
      );
    }

    const {faqs} = this.props;

    return (
      <div>
        <h1 className="heading-primary">FAQ Page</h1>
        <div className="FAQs">
          {
            faqs.length > 0
            ? (<>{ this._renderFAQs() }</>)
            : (<p>No FAQs yet!</p>)
          }
        </div>
        <button onClick={() => this._renderEditor()}>Add FAQ</button>
      </div>
    );
  }
}

export default connector(FAQPage);
