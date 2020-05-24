import { Engine, Render, Runner, World, Bodies } from 'matter-js';
import { useEffect, useRef } from 'react';
import { useChat } from './use-chat';

const engine = Engine.create();
const runner = Runner.create();

function createBoop(url) {
  const boop = Bodies.circle(Math.round(Math.random() * 1280), -30, 20, {
    angle: Math.PI * (Math.random() * 2 - 1),
    friction: 0.001,
    frictionAir: 0.01,
    restitution: 0.8,
    render: {
      sprite: {
        texture: url,
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  });

  setTimeout(() => {
    World.remove(engine.world, boop);
  }, 30000);

  World.add(engine.world, [boop]);
}

export function useBoop() {
  const ref = useRef();
  const message = useChat();

  useEffect(() => {
    const canvas = ref.current;
    const height = ref.current.clientHeight;
    const width = ref.current.clientWidth;

    const render = Render.create({
      element: 'div',
      canvas,
      engine: engine,
      options: {
        height,
        width,
        background: 'transparent',
        wireframes: false,
      },
    });

    const boundaries = {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
      },
    };
    const ground = Bodies.rectangle(
      width / 2,
      height,
      width + 20,
      4,
      boundaries,
    );
    const leftWall = Bodies.rectangle(
      0,
      height / 2,
      4,
      height + 60,
      boundaries,
    );
    const rightWall = Bodies.rectangle(
      width,
      height / 2,
      4,
      height + 60,
      boundaries,
    );

    World.add(engine.world, [ground, leftWall, rightWall]);

    Render.run(render);
    Runner.run(runner, engine);
  }, [ref]);

  useEffect(() => {
    if (!message?.emotes) return;

    message.emotes.forEach((emote) => {
      if (emote.name === 'jlengsBOOP') {
        emote.locations.forEach(() => createBoop(emote.images.large));
      }
    });
  }, [message]);

  return ref;
}
