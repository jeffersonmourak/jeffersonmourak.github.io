import React from 'react';
import classNames from 'classnames';
import {render} from 'react-dom';
import Filter from './components/filter.jsx';
import GooeyBar from './components/gooey.jsx';
import Runner from './components/runner.jsx';
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
            this.activateEasterEgg();
          } else {
            keysSequence = [];
          }
        }

        window.jeffersonmourak = this;
    }

    setSlowPc() {
      localStorage.setItem('slowPc', true);
      this.isSafari = true;
      this.setState({ slowPc: true });
    }

    activateEasterEgg() {
      this.setState({ easterEgg: true });
    }

    render () {
        let commonToggle = { 'exit': this.state.easterEgg };
        let options = {
          'ready': this.state.appReady,
          'fullscreen': this.isSafari
        };

        let gooey = !this.isSafari ?
          <GooeyBar easterEgg={this.state.easterEgg} ready={this.state.appReady}></GooeyBar> :
          '';
        let easterEggPlayer = this.state.easterEgg ?
        <div className={classNames('easter-egg')}>
          <Runner/>
        </div> :
        ''


        return <div>
            <div className={classNames('ab-header',  options)} >
                <img className={classNames('animation-at-5', 'userPhoto', commonToggle)} src="https://avatars.githubusercontent.com/u/5585596?v=3"/>
                <span className={classNames('animation-at-4', commonToggle)}>Jefferson Moura</span>
                <div className={classNames('description', commonToggle)}>
                    <a href="https://github.com/jeffersonmourak"><i className="fa fa-github" aria-hidden="true"></i></a>
                    <a href="https://medium.com/@jeffersonmourak"><i className="fa fa-medium" aria-hidden="true"></i></a>
                </div>
                { easterEggPlayer }
            </div>
            { gooey }
            <a href="javascript:void(0)" className="slowPc" onClick={this.setSlowPc.bind(this)}> Is your pc slow? </a>
            <Filter/>
        </div>;
    }
}

render(<Jeffersonmourak/>, document.getElementById('app'));
