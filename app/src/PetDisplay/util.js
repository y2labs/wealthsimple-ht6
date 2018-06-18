import { sample } from 'lodash';
import { STATE_WALKING, STATE_SLEEPING } from 'Pet';
import { MAX_ATTRIBUTE_VALUE } from '../constants';

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const animateMoveTo = (ref, { x, y, speed, prevX = 0, prevY = 0 }) => {
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

export const animateHop = async ({ ref }) => {
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

  return new Promise(resolve => {
    player.onfinish = () => {
      resolve();
    };
  });
};

export const getNextState = ({ energy = 0 } = {}) => {
  const state = sample([
    ...Array(MAX_ATTRIBUTE_VALUE - energy).fill(STATE_SLEEPING),
    ...Array(MAX_ATTRIBUTE_VALUE).fill(STATE_WALKING)
  ]);

  return state;
};
