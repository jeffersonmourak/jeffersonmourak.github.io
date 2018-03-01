import React from 'react';
import classNames from 'classnames';
import {render} from 'react-dom';
import Filter from './components/filter.jsx';
import GooeyBar from './components/gooey.jsx';
import Runner from './components/runner.jsx';
import _ from 'lodash';
import { Nicobar } from 'nicobar';

class Jeffersonmourak extends React.Component {
    constructor(){
        super();

        this.colors = ['#03a9f4', '#e91e63', '#607d8b', '#009688'];

        let style = this.colors.reduce( (obj, item, index) => { 
          obj[`colorOption${index}`] =  item;
          return obj
        } , {})

        this.state = {
            appReady: true,
            easterEgg: false,
            style
        };

        let keysSequence = [];
        let easterEgg = _.debounce(konamiCode.bind(this), 500);
        document.addEventListener('keydown', (e) => {
          keysSequence.push(e.code);
          easterEgg();
        });

        this.isSafari = localStorage.getItem('slowPc') || (navigator.userAgent.indexOf("Chrome") === -1 && navigator.userAgent.indexOf("Safari") > -1);

        this.gooey = !this.isSafari ?
        <GooeyBar easterEgg={this.state.easterEgg} ready={this.state.appReady}></GooeyBar> :
        '';

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
      this.isSafari = true;
      this.setState({ easterEgg: true });
    }

    setColor(index) {
      let state = this.state;

      if (state.selectedStyle !== index) {
        state.style.background = this.colors[index];
        state.selectedStyle = index;
      } else {
        delete state.style.background;
        delete state.selectedStyle;
      }

      this.setState(state);

    }

    render () {
        let commonToggle = { 'exit': this.state.easterEgg };
        let options = {
          'ready': this.state.appReady,
          'fullscreen': this.isSafari
        };

        let easterEggPlayer = this.state.easterEgg ?
        <div className={classNames('easter-egg')}>
          <Runner/>
        </div> :
        ''


        return (
          <Nicobar style={this.state.style}>
            <div className={classNames('ab-header',  options)} >
              <img className={classNames('animation-at-5', 'userPhoto', commonToggle)} src="https://avatars.githubusercontent.com/u/5585596?v=3"/>
              <span className={classNames('animation-at-4', commonToggle)}>Jefferson Moura</span>
              <div className={classNames('description', commonToggle)}>
                  <a href="https://github.com/jeffersonmourak"><i className="fa fa-github" aria-hidden="true"></i></a>
                  <a href="https://medium.com/@jeffersonmourak"><i className="fa fa-medium" aria-hidden="true"></i></a>
              </div>
              { easterEggPlayer }
            </div>
            { this.gooey }
            <a href="javascript:void(0)" className="slowPc" onClick={this.setSlowPc.bind(this)}> Is your pc slow? </a>
            <div className={classNames('color-selector')}>
              <p> Pick a color </p>
              { new Array(4).fill('').map( (item, index) => (
                <div 
                  key={index} 
                  onClick={ () => { this.setColor(index) } }
                  className={classNames('option', `opt-${index}`)}>
                </div>
              ) ) }
            </div>
            <Filter/>
          </Nicobar>
        );
    }
}

render(<Jeffersonmourak/>, document.getElementById('app'));
