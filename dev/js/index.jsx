import React from 'react';
import classNames from 'classnames';
import {render} from 'react-dom';
import Filter from './components/filter.jsx';
import GooeyBar from './components/gooey.jsx';

class Jeffersonmourak extends React.Component {
    constructor(){
        super();
        this.state = {
            appReady: true,
        };
    }

    render () {
        return <div>
            <div className={classNames('ab-header', {'ready': this.state.appReady} )} >
                <img className="animation-at-5 userPhoto" src="https://avatars.githubusercontent.com/u/5585596?v=3"/>
                <span className="animation-at-4">Jefferson Moura</span>
                <div className="description">
                    <a href="https://github.com/jeffersonmourak"><i className="fa fa-github" aria-hidden="true"></i></a>
                    <a href="https://medium.com/@jeffersonmourak"><i className="fa fa-medium" aria-hidden="true"></i></a>
                </div>
            </div>
            <GooeyBar ready={this.state.appReady}></GooeyBar>
            <Filter/>
        </div>;
    }
}

render(<Jeffersonmourak/>, document.getElementById('app'));