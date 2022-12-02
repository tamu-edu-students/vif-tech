import React from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

interface Props {
  onChange?: any;
  placeholder?: string;
}

interface OwnState {
  editorState: any;
  editorHTMLContent: string;
}

class EditorConvertToHTML extends React.Component<Props, OwnState> {
  public constructor(props: any) {
    super(props);
    const htmlContent: string = '';
    const contentBlock: any = htmlToDraft(htmlContent);
    const contentState: any = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState: any = EditorState.createWithContent(contentState);
    const editorHTMLContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.state = {
      editorState,
      editorHTMLContent
    };
    // this.state = {
    //   editorState: EditorState.createEmpty(),
    // }
  }

  private _onEditorStateChange = (editorState: any) => {
    this.setState({
      editorState,
      editorHTMLContent: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    });
    this.props.onChange?.(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  render() {
    const { placeholder } = this.props;
    const { editorState } = this.state;

    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="editor-wrapper"
          placeholder={placeholder}
          editorClassName="editor"
          onEditorStateChange={this._onEditorStateChange}
          toolbar={{
            options: ['inline', 'list', 'link', 'history'],
            inline: { options: ['bold', 'italic', 'underline'] },
            list: { inDropdown: true },
            link: { showOpenOptionOnHover: false },
          }}
          toolbarClassName="toolbar"
          // readOnly
          
        />
        <textarea
          disabled
          value={this.state.editorHTMLContent}
        />
      </div>
    );
  }
}

export default EditorConvertToHTML;
