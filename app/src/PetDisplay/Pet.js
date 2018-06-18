import './PetDisplay.css';

import React, { Component, createRef } from 'react';
import { random } from 'lodash';
import Pet, { STATE_WALKING, STATE_SLEEPING, STATE_SITTING } from 'Pet';
import { delay, animateHop, animateMoveTo, getNextState } from './util';

export default class PetDisplayPet extends Component {
  state = {
    petState: STATE_SITTING
  };

  petRef = createRef();

  constructor() {
    super();

    this.petX = 0;
    this.petY = 0;

    this._isMounted = true;
  }

  componentDidMount() {
    this.raf = requestAnimationFrame(this.nextState);
  }

  componentWillUnmount() {
    this._isMounted = false;

    cancelAnimationFrame(this.raf);
  }

  render() {
    return (
      <div>
        <div
          className="pet-display--pet-container"
          onMouseDown={this.handleMouseDown}
          ref={this.petRef}
        >
          <Pet state={this.state.petState} />
        </div>
      </div>
    );
  }

  handleMouseDown = async () => {
    if (this.moveAnimation) {
      this.moveAnimation.pause();

      await animateHop({ ref: this.petRef.current });

      this.moveAnimation.resume();
    }
  };

  nextStateThink = async () => {
    this.safeSetState({ petState: STATE_SITTING });

    const nextState = getNextState({
      energy: this.props.energy
    });

    await delay(1000);

    this.safeSetState({ petState: nextState });
  };

  nextState = async () => {
    await this.nextStateThink();

    this.moveAnimation = null;

    if (this.state.petState === STATE_WALKING) {
      const nextTargetX = random(0, 95);
      const nextTargetY = random(0, 80);

      this.moveAnimation = animateMoveTo(this.petRef.current, {
        prevX: this.prevX,
        prevY: this.prevY,
        x: nextTargetX,
        y: nextTargetY,
        speed: 5
      });

      if (!this.moveAnimation) {
        return;
      }

      await this.moveAnimation.then();

      this.prevX = nextTargetX;
      this.prevY = nextTargetY;
    }

    if (this.state.petState === STATE_SLEEPING) {
      await delay(10000);
    }

    this.raf = requestAnimationFrame(this.nextState);
  };

  safeSetState = nextState => {
    if (this._isMounted) {
      this.setState(nextState);
    }
  };
}
