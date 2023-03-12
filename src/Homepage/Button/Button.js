import React, { Component } from 'react';
import './Button.css';

class Button_set extends Component {
  render() {
    return (
      <div id="Button-3">
        <div id="buttonset">
          <button type="button" className="btn btn-primary" id="b1">
            SEEd
          </button>
          <button type="button" className="btn btn-primary" id="b2">
            Data
          </button>
          <button type="button" className="btn btn-primary" id="b3">
            E-Class
          </button>
        </div>
      </div>
    );
  }
}

export default Button_set;
