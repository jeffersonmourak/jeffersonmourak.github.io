import React from 'react';
import classNames from 'classnames';
import {render} from 'react-dom';
import Filter from './components/filter.jsx';
import GooeyBar from './components/gooey.jsx';
import _ from 'lodash';

class Jeffersonmourak extends React.Component {
    constructor(){
        super();
        this.state = {
            appReady: true,
            easterEgg: false
        };

        let keysSequence = [];
        let easterEgg = _.debounce(konamiCode.bind(this), 500);
        document.addEventListener('keydown', (e) => {
          keysSequence.push(e.code);
          easterEgg();
        });

        function konamiCode() {
          let correctSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
          if (_.isEqual(keysSequence, correctSequence)) {
            this.setState({ easterEgg: true });
          } else {
            keysSequence = [];
          }
        }

    }

    render () {
        let commonToggle = { 'exit': this.state.easterEgg };
        return <div>
            <div className={classNames('ab-header', {'ready': this.state.appReady, 'easter-egg': this.state.easterEgg} )} >
                <img className={classNames('animation-at-5', 'userPhoto', commonToggle)} src="https://avatars.githubusercontent.com/u/5585596?v=3"/>
                <span className={classNames('animation-at-4', commonToggle)}>Jefferson Moura</span>
                <div className={classNames('description', commonToggle)}>
                    <a href="https://github.com/jeffersonmourak"><i className="fa fa-github" aria-hidden="true"></i></a>
                    <a href="https://medium.com/@jeffersonmourak"><i className="fa fa-medium" aria-hidden="true"></i></a>
                </div>
                <h1 className={classNames('easter-text', {'easter-egg': this.state.easterEgg})}>EASTER EGG COMING SOON!</h1>
            </div>
            <GooeyBar easterEgg={this.state.easterEgg} ready={this.state.appReady}></GooeyBar>
            <Filter/>
        </div>;
    }
}

render(<Jeffersonmourak/>, document.getElementById('app'));
