import React, { Component } from 'react';
import PetView from './PetView';
import InfoBox from './InfoBox';
import MenuBar from './MenuBar';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App" style={{ display: 'in-line' }}>
        <MenuBar/>
        <InfoBox/>
        <PetView/>
        <p style={{ fontSize: '4em' }}>LANCELOT</p>

        <div className='progesss'>
          <div className="progress-bar" style={{ width:'70%' }}></div>
        </div>
      </div>
    );
  }
}

export default App;
