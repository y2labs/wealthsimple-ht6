import React, { Component } from 'react';
import stand from './img/stand.gif';
import happy from './img/happy.png';
import rest from './img/rest.gif';

const STATUS = {
  stand,
  happy,
  rest,
}

class PetView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: STATUS.stand,
    };
  }

  // add function to change state on prop change

  render() {
    return (
      <div>
        <img src={stand}/>
      </div>
    );
  }
}

export default PetView;