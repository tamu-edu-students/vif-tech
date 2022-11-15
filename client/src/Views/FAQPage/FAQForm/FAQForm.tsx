import React from 'react';
// import { IRootState } from 'Store/reducers';
import EditorConvertToHTML from 'Components/EditorToHTML/EditorToHTML';

interface Props {
  onSubmit: any;
  onCancel: any;
}

interface OwnState {
  question: string;
  answer: string;
}

class FAQForm extends React.Component<Props, OwnState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      question: '',
      answer: '',
    }
  }

  private _setQuestion = (question: string) => this.setState({question});
  private _setAnswer = (answer: string) => this.setState({answer});
  

  render() {
    return (
      <div className="FAQ-Form">
        <h2 className="heading-secondary">Question</h2>
        <EditorConvertToHTML placeholder="Question" onChange={this._setQuestion} />
        <br />

        <h2 className="heading-secondary">Answer</h2>
        <EditorConvertToHTML placeholder="Answer" onChange={this._setAnswer} />

        
        <button onClick={() => this.props.onSubmit(this.state)}>Confirm</button>
        <button onClick={this.props.onCancel}>Cancel</button>
      </div>
    );
  }
}

export default FAQForm;
