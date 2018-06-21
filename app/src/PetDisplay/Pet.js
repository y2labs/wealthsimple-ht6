import './PetDisplay.css';

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { random } from 'lodash';
import { delay, animateHop, animateMoveTo, getNextState } from './util';
import Pet, {
  STATE_WALKING,
  STATE_SLEEPING,
  STATE_SITTING,
  STATE_RUNNING,
  STATE_SAD
} from 'Pet';

export default class PetDisplayPet extends Component {
  static defaultProps = {
    onInteraction() {}
  };

  static propTypes = {
    onInteraction: PropTypes.func
  };

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
      <div
        className="pet-display--pet-container"
        onMouseDown={this.handleMouseDown}
        ref={this.petRef}
      >
        <Pet state={this.state.petState} />
      </div>
    );
  }

  handleMouseDown = async () => {
    if (this.moveAnimation) {
      this.moveAnimation.pause();

      await animateHop({ ref: this.petRef.current });

      this.moveAnimation.resume();

      this.props.onInteraction('PET');
    }
  };

  nextStateThink = async () => {
    this.safeSetState({ petState: STATE_SITTING });

    const nextState = getNextState({
      content: this.props.content,
      energy: this.props.energy,
      hunger: this.props.hunger
    });

    await delay(1000);

    this.safeSetState({ petState: nextState });
  };

  nextState = async () => {
    this.moveAnimation = null;

    await this.nextStateThink();

    if (
      this.state.petState === STATE_WALKING ||
      this.state.petState === STATE_RUNNING
    ) {
      const nextTargetX = random(0, 95);
      const nextTargetY = random(0, 80);

      this.moveAnimation = animateMoveTo(this.petRef.current, {
        prevX: this.prevX,
        prevY: this.prevY,
        x: nextTargetX,
        y: nextTargetY,
        speed: this.state.petState === STATE_RUNNING ? 10 : 5
      });

      if (!this.moveAnimation) {
        return;
      }

      await this.moveAnimation.then();

      this.prevX = nextTargetX;
      this.prevY = nextTargetY;
    }

    if (
      this.state.petState === STATE_SLEEPING ||
      this.state.petState === STATE_SAD
    ) {
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
