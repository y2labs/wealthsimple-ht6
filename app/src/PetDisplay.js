import './PetDisplay.css';

import React, { Component, createRef } from 'react';
import { random } from 'lodash';
import Pet, { STATE_WALKING, STATE_SLEEPING } from 'Pet';

const moveTo = (ref, { x, y, speed, prevX = 0, prevY = 0 }) => {
  const distance = Math.sqrt(
    Math.abs(prevX - x) ** 2 + Math.abs(prevY - y) ** 2
  );

  // Flip image if needed!
  if (x > prevX) {
    ref.children[0].style.transform = 'scaleX(1)';
  }

  if (x < prevX) {
    ref.children[0].style.transform = 'scaleX(-1)';
  }

  const duration = (distance / speed) * 1000;

  const player = ref.animate(
    [{ top: `${prevY}%`, left: `${prevX}%` }, { top: `${y}%`, left: `${x}%` }],
    {
      duration,
      fill: 'forwards'
    }
  );

  const prom = new Promise(resolve => {
    player.onfinish = e => {
      resolve();
    };
  });

  prom.pause = () => player.pause();
  prom.resume = () => player.play();

  return prom;
};

const animateHop = async ({ ref }) => {
  const player = ref.animate(
    [
      {
        transform: 'translateY(0px)'
      },
      {
        transform: 'translateY(-10px)'
      },
      {
        transform: 'translateY(0px)'
      }
    ],
    {
      duration: 300,
      fill: 'forwards',
      easing: 'ease-in-out'
    }
  );

  // player.o
  return new Promise(resolve => {
    player.onfinish = () => {
      resolve();
    };
  });
};

const getNextState = () => {
  return STATE_WALKING;
};

class PetDisplay extends Component {
  petRef = createRef();

  state = {
    petState: STATE_WALKING
  };

  constructor() {
    super();

    this.petX = 0;
    this.petY = 0;
  }

  componentDidMount() {
    this.loopOnce();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    return (
      <div className="pet-display--container">
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

  loopOnce = async () => {
    const nextState = getNextState();

    const nextTargetX = random(0, 95);
    const nextTargetY = random(0, 80);

    this.moveAnimation = moveTo(this.petRef.current, {
      prevX: this.prevX,
      prevY: this.prevY,
      x: nextTargetX,
      y: nextTargetY,
      speed: 5
    });

    await this.moveAnimation.then();

    this.prevX = nextTargetX;
    this.prevY = nextTargetY;

    requestAnimationFrame(this.loopOnce);
  };
}

export default PetDisplay;
