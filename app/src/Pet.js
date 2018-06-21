import React, { Component } from 'react';
import SpriteAnimator from 'react-sprite-animator';
import walkingSprite from 'assets/walking.png';
import sleepingSprite from 'assets/sleeping.png';
import sittingSprite from 'assets/sitting.png';
import sadSprite from 'assets/sad.png';
import runningSprite from 'assets/running.png';

// const SPRITE_PROPS
const Sprite = ({ sprite, preventLoop, width, height }) => {
  const props = {
    sprite,
    width: width || 32,
    height: height || 24,
    fps: 2,
    scale: 0.5
  };

  if (preventLoop) {
    props.stopLastFrame = true;
  }

  return <SpriteAnimator {...props} />;
};

export default class Pet extends Component {
  render() {
    const { state } = this.props;

    return (
      <div style={{ position: 'absolute' }}>
        {state === STATE_WALKING && <Sprite sprite={walkingSprite} />}
        {state === STATE_SLEEPING && <Sprite sprite={sleepingSprite} />}

        {state === STATE_SAD && (
          <Sprite sprite={sadSprite} width={24} height={28} />
        )}

        {state === STATE_RUNNING && (
          <Sprite sprite={runningSprite} height={26} />
        )}

        {state === STATE_SITTING && (
          <Sprite sprite={sittingSprite} fps={4} preventLoop />
        )}
      </div>
    );
  }
}

export const STATE_SLEEPING = 'SLEEPING';
export const STATE_WALKING = 'WALKING';
export const STATE_SITTING = 'SITTING';
export const STATE_RUNNING = 'RUNNING';
export const STATE_SAD = 'SAD';
