import React, { Component } from 'react';
import stand from './stand.gif';
import rest from './rest.gif';
import happy from './happy.png';

const petStyle = {
  width: '10%',
  height: 'auto',
  position: 'absolute',
  top: '30%',
  left: '45%',
}


class PetView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: stand,
    }
  }

  render() {
    return (
      <div className='pet'>
        <img style={petStyle} src={stand}/>
      </div>
    );
  }
}

export default PetView;
