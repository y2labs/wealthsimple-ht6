import React, { Component } from 'react';
import stand from './stand.gif';
import rest from './rest.gif';
import happy from './happy.png';

const stylesheet = {
  paddingLeft: '2%',
  paddingRight: '2%',
  margin: '5%',
  backgroundColor: '#DA9C13',
  color: 'white',
  width: '20%',
  height: '10%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  fontSize: '1.4em',
  borderRadius: '25px',
}


const InfoBox = () => {
  return (
    <div style={ stylesheet }>
      <div style={{ marginLeft: '30%', marginRight: '30%' }}>
        <p style={{ float: 'left' }}>LVL</p>
        <p style={{ float: 'right' }}>2</p>
      </div>
      <div>
        <p style={{ float: 'left' }}>PROFIT</p>
        <p style={{ float: 'right' }}>200</p>
      </div>
      <div>
        <p style={{ float: 'left' }}>RETURN</p>
        <p style={{ float: 'right' }}>124</p>
      </div>
    </div>
  );
}

export default InfoBox;
