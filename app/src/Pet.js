import React, { Component } from 'react';
import SpriteAnimator from 'react-sprite-animator';
import walkingSprite from 'assets/walking.png';
import sleepingSprite from 'assets/sleeping.png';

export default class Pet extends Component {
  render() {
    const { state } = this.props;

    return (
      <div style={{ position: 'absolute' }}>
        {state === STATE_WALKING && (
          <SpriteAnimator
            sprite={walkingSprite}
            width={32}
            height={24}
            fps={2}
            scale={0.5}
          />
        )}

        {state === STATE_SLEEPING && (
          <SpriteAnimator
            sprite={sleepingSprite}
            width={32}
            height={24}
            fps={2}
            scale={0.5}
          />
        )}
      </div>
    );
  }
}

export const STATE_SLEEPING = 'SLEEPING';
export const STATE_WALKING = 'WALKING';
