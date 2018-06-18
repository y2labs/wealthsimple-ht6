import React, { Component } from 'react';
import hamburger from './hamburger.svg';

const MenuBar = () => {
  return (
    <div style={{ backgroundColor: 'black', height: '60px', paddingLeft: '2%', paddingRight: '2%', cursor: 'pointer' }}>
      <img src={hamburger} style={{ height: '50px', paddingTop: '5px', float: 'left' }}/>
    </div>
  );
}

export default MenuBar;
