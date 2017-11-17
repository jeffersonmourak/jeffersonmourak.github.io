import React from 'react';
import classNames from 'classnames';

class GooeyBar extends React.Component{
    constructor(){
        super();
        this.defaultColumnWidth = 40;
        this.animate = navigator.userAgent.indexOf("Chrome") > -1;
        this.isSafari = !this.animate && navigator.userAgent.indexOf("Safari") > -1;
    }

    _randomNumber(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }

    _createColumns(){
        /**
         * Get the maximum number of columns for the client's screen
         * @type {number}
         */
        let columnLength = window.screen.width / this.defaultColumnWidth;


        let columns = [];
        for (let i = 0; i < columnLength; i++) {
          let offset = (i % 2) * 0.2;
          let maximumHeight = window.screen.height * (0.35 - offset);
          let current = {
            height: this._randomNumber(this.defaultColumnWidth, maximumHeight),
            round: {
              left: true,
              right: true
            }
          };
          if (columns[i-1] && Math.abs((columns[i-1].height - current.height)) > 5) {
            let previous = columns[i-1];
            if (previous.height > current.height) {
              current.round.left = false;
            } else {
              previous.round.right = false;
            }
          }
          columns.push(current);
        }

        return columns.map( (item, index) => {
          let options = {
            'round-right': item.round.right,
            'round-left': item.round.left,
            'easter-egg': this.props.easterEgg,
            'animate': this.animate,
            'goo-column': !this.isSafari
          };

          return <div key={index}
                    className={classNames(options)}
                    style={ {
                      height: `${item.height}px`,
                       animationDelay: `${this._randomNumber(0, 1000)}ms`
                     } } ></div>
        });

    }

    render(){
        let ready = <div>
            <div className="up-bar"></div>
            {this._createColumns()}
        </div>;
        if(!this.props.ready){
            ready = null;
        }
        return (<div className={classNames('gooey', {'ready': this.props.ready})}>
            {ready}
        </div>);
    }

}

export default GooeyBar;
