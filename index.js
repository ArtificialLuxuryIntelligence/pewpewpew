//to add new weapons - add to weapons, add to player/alien, add-key in controller, add keybiding to playershoot
//to add new trajectory - add new array to trajectories
//to add new alien/object - add new object to switch in objectInitState
//to create/change level - add items in switch in 'newLevel' function with objects and trajectories (see above)

// DOM

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const gameHeight = (canvas.height = 450);
const gameWidth = (canvas.width = 800);

// -------------- canvas
//
function canvasRepaint(player, time) {
  //background
  const fillColour = "rgba(3, 3, 3, 0.9)";
  ctx.fillStyle = fillColour;
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  //weapon cooldown;
  let wKeys = Object.keys(player.weapons);
  for (let i = 0; i < wKeys.length; i++) {
    if (player.weapons[wKeys[i]].owned) {
      let gunPercent =
        1 - player.weapons[wKeys[i]].cooling / player.weapons[wKeys[i]].cooloff;
      ctx.fillStyle = weapons[wKeys[i]].colour;
      ctx.fillRect(gameWidth - 80, 20 + i * 20, gunPercent * 60, 10);
    }
  }

  //healthbar
  healthPercent = player.health / 500;
  // console.log(healthPercent);

  if (healthPercent < 0.3) {
    if ((time % 10 > 0) & (time % 10 < 5)) {
      // console.log("looowww");

      ctx.fillStyle = "red";
      ctx.fillRect(gameWidth - 140, gameHeight - 40, healthPercent * 120, 10);
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(gameWidth - 140, gameHeight - 40, healthPercent * 120, 10);
    }
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(gameWidth - 140, gameHeight - 40, healthPercent * 120, 10);
  }

  //score
  ctx.textAlign = "start";
  ctx.fillStyle = "white";
  ctx.font = "20px Nova Square";
  ctx.fillText(player.score, 20, gameHeight - 20);
}

function canvasMessagePaint(message) {
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "50px Nova Square";
  ctx.fillText(message, gameWidth / 2, gameHeight / 2);
}
//--------------  Controller

const controller = {
  state: {
    up: false,
    down: false,
    left: false,
    right: false,
    x: false,
    c: false,
    v: false,
    space: false,
  },

  keyListener: function (e) {
    e.preventDefault();
    console.log(e.code);

    keyState = e.type == "keydown" ? true : false;
    switch (e.code) {
      case "ArrowUp":
        this.state.up = keyState;
        break;
      case "ArrowDown":
        this.state.down = keyState;
        break;
      case "ArrowLeft":
        this.state.left = keyState;
        break;
      case "ArrowRight":
        this.state.right = keyState;
        break;
      case "KeyX":
        this.state.x = keyState;
        break;
      case "KeyC":
        this.state.c = keyState;
        break;
      case "KeyV":
        this.state.v = keyState;
        break;
      case "Space":
        this.state.space = keyState;
        break;
      default:
        break;
    }
  },
};

// --------------Weapons

const weapons = {
  laser: {
    range: 300,
    v_y: 3, //y v_y
    v_x: 0,
    width: 100,
    height: 3,
    colour: "orange",
    damage: 100,
    cooloff: 85, //time until next use
    health: 3, //how many obstacles it hits before exploding
  },
  biglaser: {
    range: 300,
    v_y: 20, //y v_y
    v_x: 0,
    width: 14,
    height: 80,
    colour: "purple",
    damage: 1000,
    cooloff: 55, //time until next use
    health: 10, //how many obstacles it hits before exploding
  },
  gun: {
    range: 400,
    v_y: 10,
    v_x: 0,
    width: 5,
    height: 5,
    colour: "white",
    damage: 34,
    cooloff: 12,
    health: 1,
  },
  alienlaser: {
    range: 300,
    v_y: 3,
    v_x: 0,
    width: 80,
    height: 3,
    colour: "orange",
    damage: 100,
    health: 1,
  },
  aliengun: {
    range: 400,
    v_y: 5,
    v_x: 0,
    width: 5,
    height: 5,
    colour: "white",
    damage: 34,
    health: 1,
  },
  aliengun_2: {
    range: 400,
    v_y: 5,
    v_x: 2,
    width: 5,
    height: 5,
    colour: "white",
    damage: 34,
    health: 1,
  },
  aliengun_n2: {
    range: 400,
    v_y: 5,
    v_x: -2,
    width: 5,
    height: 5,
    colour: "white",
    damage: 34,
    health: 1,
  },
};

//-------------- Behaviours

// ---------general
const withDraw = (state) => {
  return {
    draw: () => {
      ctx.fillStyle = state.colour;
      ctx.fillRect(
        state.x - state.width / 2,
        state.y - state.height / 2,
        state.width,
        state.height
      );

      //   if (state.type == "player") {
      //     ctx.fillRect(
      //       state.x - state.width / 2 - state.width / 6,
      //       state.y - state.height / 2    ,
      //       state.width / 6,
      //       state.height * 1.5
      //     );
      //     ctx.fillRect(
      //       state.x + state.width / 2,
      //       state.y - state.height / 2    ,
      //       state.width / 6,
      //       state.height * 1.5
      //     );
      //   }
    },
  };
};

const withDamage = (state) => {
  return {
    hit: (damage) => {
      state.health -= damage;
    },
  };
};

const withMove = (state) => {
  return {
    move: () => {
      state.x += state.x_v;
      state.y += state.y_v;
    },
  };
};

const withChangeDirection = (state) => {
  // const { trajectory } = state;

  return {
    changeDirection: (time) => {
      if (state.trajectory.length && state.trajectory[0].time == time) {
        let newTrajectory = state.trajectory.shift();
        if (newTrajectory.x_v) {
          state.x_v = newTrajectory.x_v;
        }
        if (newTrajectory.y_v) {
          state.y_v = newTrajectory.y_v;
        }
      }
    },
  };
};

const withDrawAndMoveShots = (state) => {
  let direction = state.type == "player" ? -1 : 1;
  return {
    drawAndMoveShots: () => {
      let shots = [];
      const weapons = state.weapons;
      let wKeys = Object.keys(weapons);

      //remove shots exceeding range;
      for (let i = 0; i < wKeys.length; i++) {
        let activeShots = weapons[wKeys[i]].shots.filter(
          (s) => Math.abs(s.y_init - s.y) < s.range && s.health > 0
        );
        // console.log("active", activeShots);

        state.weapons[wKeys[i]].shots = activeShots;
        shots.push(...activeShots);
      }

      //draw and update
      shots.forEach((s) => {
        console.log(s);

        //move shots
        s.y = s.y + direction * s.v_y;
        s.x = s.x + direction * s.v_x;

        //draw shots
        ctx.fillStyle = s.colour;
        ctx.fillRect(s.x - s.width / 2, s.y - s.height / 2, s.width, s.height);
      });

      // console.log(state.weapons.gun.shots.length)
      // console.log(state.weapons.laser.shots.length)
    },
  };
};

//helper

const shootWeapon = (weapon, player) => {
  let direction = player.type == "player" ? -1 : 1;

  wStats = player.weapons[weapon];
  wUser = player.weapons[weapon];
  if (wUser.owned) {
    wUser.shots.push({
      x_init: player.x,
      y_init: player.y + (direction * player.height) / 2,
      x: player.x,
      y: player.y + (direction * player.height) / 2,
      active: true,
      health: player.health,
      ...wStats,
    });
  }
};

// --------- player
const playerMove = (state) => {
  return {
    move: () => {
      //update velocity
      const friction = 0.9;
      if (controller.state.up) {
        state.y_v -= 1.1;
      }
      if (controller.state.down) {
        state.y_v += 1.1;
      }
      if (controller.state.left) {
        state.x_v -= 1.1;
      }
      if (controller.state.right) {
        state.x_v += 1.1;
      }
      // friction
      state.x_v *= friction;
      state.y_v *= friction;

      // update position
      state.x += state.x_v;
      state.y += state.y_v;

      // infinite plane
      if (state.x > gameWidth + state.width / 2) {
        state.x = 0 - state.width / 2;
      }
      if (state.x < 0 - state.width / 2) {
        state.x = gameWidth + state.width / 2;
      }
      if (state.y > gameHeight + state.height / 2) {
        state.y = 0 - state.height / 2;
      }
      if (state.y < 0 - state.height / 2) {
        state.y = gameHeight + state.height / 2;
      }
    },
  };
};

const playerShoot = (state) => {
  const cooloffWeapons = () => {
    wKeys = Object.keys(state.weapons);
    wKeys.forEach((w) => {
      state.weapons[w].cooling > 0 ? state.weapons[w].cooling-- : null;
    });
  };

  const heatupWeapon = (weapon) => {
    state.weapons[weapon].cooling = state.weapons[weapon].cooloff;
  };

  return {
    //runs every animation loop
    shoot: () => {
      cooloffWeapons();

      if (controller.state.v) {
        if (state.weapons.laser.cooling == 0 && state.weapons.laser.owned) {
          shootWeapon("laser", state);
          heatupWeapon("laser", state);
        }
      }
      if (controller.state.c) {
        if (state.weapons.gun.cooling == 0 && state.weapons.gun.owned) {
          shootWeapon("gun", state);
          heatupWeapon("gun", state);
        }
      }
      if (controller.state.x) {
        if (
          state.weapons.biglaser.cooling == 0 &&
          state.weapons.biglaser.owned
        ) {
          shootWeapon("biglaser", state);
          heatupWeapon("biglaser", state);
        }
      }
    },
  };
};

// with aliens, bonuses and alien shots
const checkPlayerCollisions = (state) => {
  return {
    checkPlayerCollisions: (gameObjects) => {
      for (let i = 0; i < gameObjects.length; i++) {
        //check for collision with enemy/bonus
        if (
          Math.abs(state.x - gameObjects[i].x) <
            state.width / 2 + gameObjects[i].width / 2 &&
          Math.abs(state.y - gameObjects[i].y) <
            state.height / 2 + gameObjects[i].height / 2
        ) {
          // gameObjects[i].colour = "orange";

          gameObjects[i].health -= 1000; //kills them dead
          if (gameObjects[i].type == "bonus") {
            gameObjects[i].bonus.action(state);
          } else if (gameObjects[i].type == "alien") {
            state.colour = "red";
            setTimeout(() => (state.colour = "blue"), 100);
            state.health -= 50;
          }
        }

        //check for collision with any enemy shots;
        let wKeys = Object.keys(gameObjects[i].weapons);

        for (let k = 0; k < wKeys.length; k++) {
          let shots = gameObjects[i].weapons[wKeys[k]].shots;
          // console.log("shots.....", shots);

          for (let j = 0; j < shots.length; j++) {
            // console.log(shots[j]);

            if (
              Math.abs(shots[j].x - state.x) <
                shots[j].width / 2 + state.width / 2 &&
              Math.abs(shots[j].y - state.y) <
                shots[j].height / 2 + state.height / 2
            ) {
              //changed dynamcally based on health (in draw fn?)

              state.colour = "red";
              setTimeout(() => (state.colour = "blue"), 100);

              state.hit(shots[j].damage);
              console.log(state.health);

              shots[j].health -= 1;
            } else {
              // console.log("ok");
            }
          }
        }
      }
    },
  };
};

// with weapons hitting aliens
const checkWeaponsCollisions = (state) => {
  return {
    checkWeaponsCollisions: (gameObjects) => {
      let wKeys = Object.keys(state.weapons);

      for (let i = 0; i < wKeys.length; i++) {
        let shots = state.weapons[wKeys[i]].shots;

        for (let j = shots.length - 1; j >= 0; j--) {
          for (let k = gameObjects.length - 1; k >= 0; k--) {
            // if (shots.length) {
            if (
              Math.abs(shots[j].x - gameObjects[k].x) <
                shots[j].width / 2 + gameObjects[k].width / 2 &&
              Math.abs(shots[j].y - gameObjects[k].y) <
                shots[j].height / 2 + gameObjects[k].height / 2
            ) {
              //changed dynamcally based on health (in draw fn?)
              gameObjects[k].colour = "white";

              shots[j].health -= 1;
              gameObjects[k].hit(shots[j].damage);
              if (gameObjects[k].health <= 0) {
                state.score += gameObjects[k].score;
              }

              // console.log(shots[j]);
              // console.log(gameObjects[k].health);

              // gameObjects = gameObjects
            }
            // }
          }
        }
      }
    },
  };
};

// ----------Bonuses

// remove old bonuses
const removeBonuses = (state) => {
  return {
    removeBonuses: (time) => {
      state.bonuses.forEach((b) => {
        if (b.t_init + b.duration == time) {
          console.log(time, b);
          b.remove();
        }
      });
      state.bonuses = state.bonuses.filter((b) => b.t_init + b.duration > time);
      // console.log("bonuses", state.bonuses.length);
    },
  };
};

//initial state
const playerInitialState = {
  type: "player",
  health: 500,
  score: 0,
  x: gameWidth / 2,
  y: (8 * gameHeight) / 9,
  x_v: 0,
  y_v: 0,
  width: 45,
  height: 20,
  colour: "blue",
  weapons: {
    gun: {
      owned: true,
      cooling: 0,
      // cooloff: weapons.gun.cooloff,
      shots: [],
      ...weapons["gun"],
    },
    laser: {
      owned: true,
      cooling: 0,
      // cooloff: weapons.laser.cooloff,
      shots: [],
      ...weapons["laser"],
    },
    biglaser: {
      owned: false,
      cooling: 0,
      // cooloff: weapons.biglaser.cooloff,
      shots: [],
      ...weapons["biglaser"],
    },
  },
  bonuses: [],
};

// player factory
const playerMaker = (state) => {
  return Object.assign(
    state,
    playerMove(state),
    withDraw(state),
    playerShoot(state),
    withDrawAndMoveShots(state),
    playerShoot(state),
    checkWeaponsCollisions(state),
    checkPlayerCollisions(state),
    withDamage(state),
    removeBonuses(state)
  );
};

// ----------------------------Aliens
const alienShoot = (state) => {
  return {
    shoot: (time) => {
      state.shotTimings.forEach((t) => {
        if (time > t.first && (time + t.first) % t.delay == 0) {
          shootWeapon(t.weapon, state);
        }
      });
    },
  };
};

// -------------- --------------gameObjects (bonuses and aliens)

// ----

const trajectories = {
  trajBuilder: (t_init, array) => {
    return array.map((e) => {
      return { time: t_init + e[0], x_v: e[1], y_v: e[2] };
    });
  },
  vaders: [
    [
      [5, -0.5, 0.2], // format: [delay, x_v, y_v] // delay: time(tics) to apply after object is created, x_v: new x axis velocity;y_v: new y axis velocity
      [50, 0.4, null],
      [100, 0.4, 2],
      [125, -0.4, null],
    ],
    [
      [5, -0.5, 0.2],
      [50, 1, null],
      [100, 1, 1],
      [150, -0.4, null],
    ],
    [
      [5, -0.5, 0.2],
      [50, 0.1, null],
      [100, 0.7, 2],
      [125, -0.2, 0.4],
    ],
  ],
  bonuses: [
    [
      [5, -0.5, 0.2], // format: [delay, x_v, y_v] // delay: time(tics) after object is created, x_v: new x axis velocity;y_v: new y axis velocity
      [50, 0.4, null],
      [100, 0.4, null],
      [125, -0.4, null],
    ],
  ],
};

const modifyWeapon = ({ state, weapon, property, newvalue }) => {
  console.log("modding");

  if (property == "cooloff") {
    state.weapons[weapon].cooling = 0;
  }
  state.weapons[weapon][property] = newvalue;
  // state.weapons[weapon].cooloff = weapons[weapon][property];
};

// factory for all game objects
const objectInitState = (name, trajectory, t_init) => {
  let type, x, colour, shotTimings, score, health, width, height;
  let y = 0;
  let bonus = null;

  switch (name) {
    case "vader1":
      {
        type = "alien";
        width = 20;
        height = 35;
        shotTimings = [
          { first: t_init, delay: 100, weapon: "aliengun" }, //first: time for first shot, delay: ticks until repeated (can make v large if only want once), weapon, weapon
          { first: t_init, delay: 50, weapon: "aliengun_2" },
          { first: t_init + 25, delay: 50, weapon: "aliengun_n2" },
        ];
        colour = "red";
        score = 100;
        health = 100;
        x = gameWidth / 3;
      }
      break;
    case "vader2":
      {
        type = "alien";
        width = 20;
        height = 35;
        shotTimings = [{ first: t_init + 5, delay: 100, weapon: "alienlaser" }];
        score = 50;
        health = 100;
        colour = "darkred";
        x = (4 * gameWidth) / 5;
      }
      break;
    case "vader3":
      {
        type = "alien";
        width = 20;
        height = 35;
        shotTimings = [{ first: t_init + 5, delay: 400, weapon: "aliengun" }];
        score = 200;
        health = 50;
        colour = "purple";
        x = (2 * gameWidth) / 5;
      }
      break;
    case "healthBonus":
      {
        type = "bonus";
        width = 12;
        height = 12;
        shotTimings = [];
        score = 100;
        health = 1000;
        colour = "green";
        x = gameWidth / 2;
        y = gameHeight / 2;
        bonus = {
          action: (state) => {
            state.health = Math.min(state.health + 200, 500);
            state.bonuses.push({
              remove: () => {},
            });
          },
        };
      }
      break;
    case "cannonSpeedBonus":
      {
        type = "bonus";
        width = 12;
        height = 12;
        shotTimings = [];
        score = 100;
        health = 1000;
        colour = "green";
        x = gameWidth / 2;
        y = gameHeight / 2;

        bonus = {
          action: (state) => {
            modifyWeapon({
              state,
              weapon: "gun",
              property: "cooloff",
              newvalue: 3,
            });
            state.bonuses.push({
              t_init,
              duration: 400,
              remove: () => {
                console.log("Unmodding");
                state.weapons.gun.cooloff = weapons.gun.cooloff;
              },
            });
          },
        };
      }
      break;
    case "unlockBigLaser":
      {
        type = "bonus";
        width = 12;
        height = 12;
        shotTimings = [];
        score = 100;
        health = 1000;
        colour = "darkgreen";
        x = gameWidth / 2;
        y = gameHeight / 2;

        bonus = {
          action: (state) => {
            modifyWeapon({
              state,
              weapon: "biglaser",
              property: "owned",
              newvalue: true,
            });
            state.bonuses.push({
              t_init,
              duration: 4000,
              remove: () => {
                console.log("Unmodding");
                state.weapons.biglaser.owned = false;
              },
            });
          },
        };
      }
      break;
  }

  return {
    type,
    t_init,
    health: 100,
    score,
    health,
    x,
    y,
    x_v: 0,
    y_v: 0,
    width,
    height,
    colour,
    trajectory,
    shotTimings,
    weapons: {
      aliengun: {
        owned: true,
        shots: [],
      },
      aliengun_2: {
        owned: true,
        shots: [],
      },
      aliengun_n2: {
        owned: true,
        shots: [],
      },
      alienlaser: {
        owned: true,
        shots: [],
      },
    },
    bonus,
  };
};

//enemy factory
const objectMaker = (state) => {
  return Object.assign(
    state,
    alienShoot(state),
    withDrawAndMoveShots(state),
    withDraw(state),
    withMove(state),
    withChangeDirection(state),
    withDamage(state)
  );
};

// ---------------------------- game levels

const runLevel = (time, state, level) => {
  switch (level) {
    case 1:
      {
        if (time % 160 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader1",
              trajectories.trajBuilder(time, trajectories.vaders[0]),
              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 200 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader2",
              trajectories.trajBuilder(time, trajectories.vaders[2]),
              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 2000 == 0) {
          let a = objectMaker(
            objectInitState(
              "healthBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 1000 == 0) {
          let a = objectMaker(
            objectInitState(
              "cannonSpeedBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              time
            )
          );
          game.gameObjects.push(a);
        }
      }
      break;
    case 2:
      {
        if (time % 200 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader1",
              trajectories.trajBuilder(time, trajectories.vaders[0]),
              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 250 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader1",
              trajectories.trajBuilder(time, trajectories.vaders[1]),
              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 300 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader1",
              trajectories.trajBuilder(time, trajectories.vaders[2]),
              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time == 300) {
          let a = objectMaker(
            objectInitState(
              "unlockBigLaser",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              time
            )
          );
          game.gameObjects.push(a);
        }
      }
      break;
    case 3:
      {
        if (time == 5) {
          modifyWeapon({
            state,
            weapon: "gun",
            property: "cooloff",
            newvalue: 3,
          });
          modifyWeapon({
            state,
            weapon: "biglaser",
            property: "owned",
            newvalue: true,
          });
          //TO DO! all properties need to be copies from weapons object to playinitialstate object and read from there
          modifyWeapon({
            state,
            weapon: "laser",
            property: "v_y",
            newvalue: 8,
          });
        }
      }
      break;
    default: {
      //   alert("no");
    }
  }
};
//--------------- --------------event listeners
// canvas.addEventListener("keydown", (e) => e.preventDefault());
window.addEventListener("keydown", (e) => controller.keyListener(e));
window.addEventListener("keydown", (e) => {
  if (e.code == "Space" && game.gameOver == true) {
    console.log("starting");

    game.start();
  }
});

window.addEventListener("keyup", (e) => controller.keyListener(e));

//-----------------------------game setup

const game = {
  gameObjects: [],
  level: 1, //actually set in start fn below

  gameOver: true,
  p1: null,
  time: 0,

  start() {
    console.log("game . start");

    //reset
    this.gameOver = false;
    this.gameObjects = [];
    this.level = 3;
    //init player
    this.p1 = null;
    p1InitState = Object.assign({}, playerInitialState);
    this.p1 = playerMaker(p1InitState);
    console.log(this.p1);
    this.time = 0;

    canvasRepaint(this.p1, this.time);
    const anim = () => {
      this.time++;
      canvasRepaint(this.p1, this.time);
      if (this.time < 600) {
        canvasMessagePaint(`LEVEL ${this.level}`);
      }
      if (
        this.p1.score >= this.level * 1500 + this.level * 250 &&
        this.gameObjects.length == 0
      ) {
        this.level++;
        this.time = 0;
        this.gameObjects = [];
        this.p1.bonuses.forEach((b) => b.remove());
        this.p1.bonuses = [];
      }
      runLevel(this.time, this.p1, this.level);
      //remove if off screen or no health
      //MAYBE make enemy invisible until it has no active shots left.. then check for health and delete
      this.gameObjects = this.gameObjects.filter(
        (e) => e.y < gameHeight + e.height && e.health > 0
      );
      //update
      this.gameObjects.forEach((e) => {
        e.shoot(this.time);
        e.move();
        e.changeDirection(this.time);
        e.drawAndMoveShots();
        e.draw();
      });

      // ------------ Player

      //track player

      this.p1.shoot();
      this.p1.move();
      this.p1.checkWeaponsCollisions(this.gameObjects);
      this.p1.drawAndMoveShots();
      this.p1.draw();
      this.p1.removeBonuses(this.time);
      this.p1.checkPlayerCollisions(this.gameObjects);

      if (this.p1.health > 0) {
        window.requestAnimationFrame(anim);
      } else {
        this.p1.health = 0;
        this.gameOver = true;
        canvasRepaint(this.p1, this.time);
        canvasRepaint(this.p1, this.time);
        canvasRepaint(this.p1, this.time);
        canvasRepaint(this.p1, this.time);
        canvasRepaint(this.p1, this.time);
        canvasMessagePaint(`GAME OVER`);
        window.cancelAnimationFrame(anim);
        return;
        // alert("game over");
      }
    };
    anim();
  },
};

game.start();
