## about

# Frikkin ALIENS

## Motivation

I built almost all of this game over a couple of days to practice using object composition (no classes - limited use of this keyword).

## Overview

An arcadey spacey shootery game.

You are in space. Aliens are attacking you. Or are you attacking them? Survive and clear levels to progress.

The game is a proof of concept more that anything else - the level design is far from perfect; aliens, weapons and powerups need to be tweaked for best playability BUT the full underlying structure of the game is in place and fully functional for any future improvements.

## Technologies used

The following technologies were used in this project:

- HTML
- CSS
- Javascript

## Usage guide

Either navigate to the [live demo](https://frickinaliens.netlify.app/) or clone this repo to run the project locally.

Arrows to move, x,c,v to shoot (when you get the right powerups). Space restarts the game at game over.

## Build process

### Build

General overview of the process I devised and followed:

- Create a controller object which holds the state of keys pressed.
- Create behaviours (move, shoot, draw shots etc) and compose them into a player object.
- Create alien with some new attributes such as trajectory and shot timings but reuse some behaviours from player (e.g. draw shots) and use to compose into an alien object.
- Implement collision detection: aliens with player, shots with player, shots with alien, shots with shots 
- Create powerups which modify player object (new/faster weapons, more health etc)
- Create a factory to make all game objects with variables such as trajectory, timings, object type (alien, powerup)
- Create game object and levels which create game objects at given intervals with given attributes.
- Invent cool aliens, weapons, trajectories and powerups.
- Finally add a starfield background - the stars get faster as the game progresses.
- Play!

### Tricky/interesting bits/features

#### Object composition
Game objects are created using factory functions and object composition (Object.assign). The aim of the project was to put into practice these concepts and it was both successful and quite intuitive.

A tricky bug to find during dev was when initialising objects using the same initialistion object - all new objects had a reference to this original initialation object which was not desirable in this case. Solution was to deep clone the object before use.

#### Powerups
I am pleased with the powerups system which allows quite versatile powerups to be created and then later removed at a give time by running an inverting/undo function.

#### Aliens 

The range of aliens that can be created is vast - the weapons they use, their speed and trajectory and various other attributes can be fine tuned for each enemy.

## Future features

- No major features are planned.
- More levels are needed to make game a finished arcade hit! - This process is quite easy and I think the code is quite readable.
- A second player could be added locally (and perhaps remotely using websockets)
