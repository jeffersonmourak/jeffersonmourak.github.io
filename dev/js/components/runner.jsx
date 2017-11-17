import React from 'react';
import classNames from 'classnames';

class Runner extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/IwzUs1IMdyQ?autoplay=true&start=45&controls=0" frameBorder="0" allowFullScreen></iframe>
      </div>
    )
  }
}

export default Runner;