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

        this.isSafari = localStorage.getItem('slowPc') || (navigator.userAgent.indexOf("Chrome") === -1 && navigator.userAgent.indexOf("Safari") > -1);

        function konamiCode() {
          let correctSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
          if (_.isEqual(keysSequence, correctSequence)) {
            this.setState({ easterEgg: true });
          } else {
            keysSequence = [];
          }
        }

    }

    setSlowPc() {
      localStorage.setItem('slowPc', true);
      this.isSafari = true;
      this.setState({ slowPc: true });
    }

    render () {
        let commonToggle = { 'exit': this.state.easterEgg };
        let options = {
          'ready': this.state.appReady,
          'easter-egg': this.state.easterEgg,
          'fullscreen': this.isSafari
        };

        let gooey = !this.isSafari ?
          <GooeyBar easterEgg={this.state.easterEgg} ready={this.state.appReady}></GooeyBar> :
          '';

        return <div>
            <div className={classNames('ab-header',  options)} >
                <img className={classNames('animation-at-5', 'userPhoto', commonToggle)} src="https://avatars.githubusercontent.com/u/5585596?v=3"/>
                <span className={classNames('animation-at-4', commonToggle)}>Jefferson Moura</span>
                <div className={classNames('description', commonToggle)}>
                    <a href="https://github.com/jeffersonmourak"><i className="fa fa-github" aria-hidden="true"></i></a>
                    <a href="https://medium.com/@jeffersonmourak"><i className="fa fa-medium" aria-hidden="true"></i></a>
                </div>
                <h1 className={classNames('easter-text', {'easter-egg': this.state.easterEgg})}>EASTER EGG COMING SOON!</h1>
            </div>
            { gooey }
            <a href="javascript:void(0)" className="slowPc" onClick={this.setSlowPc.bind(this)}> Is your pc slow? </a>
            <Filter/>
        </div>;
    }
}

render(<Jeffersonmourak/>, document.getElementById('app'));
