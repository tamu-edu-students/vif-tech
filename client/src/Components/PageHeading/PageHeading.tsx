import React from 'react';

interface Props {
  h1Text: string;
  subheading?: string;
}

interface OwnState {

}

class PageHeading extends React.Component<Props, OwnState>{
  public render(): React.ReactElement<Props> {
    return (
      <header className="page-heading">
        <h1 className="page-heading__primary-text heading-primary">{this.props.h1Text}</h1>
        {
          this.props.subheading &&
          <p className="page-heading__subheading">{this.props.subheading}</p>
        }
      </header>
    )
  }
}

export default PageHeading;
