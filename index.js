//to add new weapons - add to weapons, add to player/alien initobj (e.g. newPlayerInitialState), add key in controller, add keybiding to playershoot
//to add new trajectory - add new array to trajectories
//to add new alien/bonus/object - add new object to switch in objectInitState
//to create/change level - add items in switch in 'newLevel' function with objects and trajectories (see above)

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const gameHeight = (canvas.height = 450);
const gameWidth = (canvas.width = 850);
const startingLevel = 1; //for testing

// -------------- canvas
//

const starfield = {
  stars: (a = Array(100)
    .fill(null)
    .map((e) => ({
      x: Math.random() * gameWidth,
      y: Math.random() * gameHeight,
      r: Math.random() * 2 + 1,
      a: Math.random() * 0.3,
    }))),
  update(level) {
    this.stars = this.stars.map((s) => ({
      x: s.x,
      y: (s.y + Math.min(level, 9) * s.r * s.a) % gameWidth,
      r: s.r,
      a: s.a,
    }));
  },
  draw() {
    this.stars.forEach((s) => {
      let g = ctx.createRadialGradient(
        s.x,
        s.y,
        0,
        s.x + s.r,
        s.y + s.r,
        s.r * 2
      );
      g.addColorStop(0, "rgba(255, 255, 255, " + s.a + ")");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
      ctx.fillStyle = g;
      ctx.fill();
    });
  },
};
// console.log(starfield.stars);

function canvasRepaint(player, time, level) {
  //background
  const fillColour = "rgba(3, 3, 3, 0.9)";
  ctx.fillStyle = fillColour;
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  //starfield
  starfield.update(level);
  starfield.draw();

  //weapon cooldown;
  let wKeys = Object.keys(player.weapons);
  let n = 0;
  for (let i = 0; i < wKeys.length; i++) {
    if (player.weapons[wKeys[i]].owned && !player.weapons[wKeys[i]].multimod) {
      let gunPercent =
        1 - player.weapons[wKeys[i]].cooling / player.weapons[wKeys[i]].cooloff;
      ctx.fillStyle = weapons[wKeys[i]].colour;
      ctx.fillRect(gameWidth - 80, 20 + n * 20, gunPercent * 60, 10);
      n++;
    }
  }

  //healthbar
  healthPercent = player.health / 500;
  if (healthPercent < 0.3) {
    if ((time % 10 > 0) & (time % 10 < 5)) {
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
  ctx.fillText(message, gameWidth / 2, gameHeight / 2 + 15);
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
    owned: true,
    multi: [],
    multimod: false, // multimods dont show in cooldown display
    range: 120,
    v_y: 2, //y v_y
    v_x: 0,
    width: 100,
    height: 3,
    colour: "orange",
    damage: 100,
    cooloff: 85, //time until next use
    cooling: 0,
    health: 9, //how many obstacles it can hit before disappearing
  },
  biglaser: {
    owned: false,
    multi: [],
    multimod: false,
    range: 300,
    v_y: 20, //y v_y
    v_x: 0,
    width: 14,
    height: 80,
    colour: "purple",
    damage: 1000,
    cooloff: 55,
    cooling: 0,
    health: 10,
  },
  gun: {
    owned: true,
    multi: [],
    multimod: false,
    range: 400,
    v_y: 10,
    v_x: 0,
    width: 5,
    height: 5,
    colour: "white",
    damage: 34,
    cooloff: 12,
    cooling: 0,
    health: 1,
  },
  gun_l: {
    owned: true, // is multimod so not accessible anyway
    multimod: true,
    range: 400,
    v_y: 10,
    v_x: -2,
    width: 5,
    height: 5,
    colour: "white",
    damage: 34,
    cooloff: 12,
    cooling: 0,
    health: 1,
  },
  gun_r: {
    owned: true,
    multimod: true,
    range: 400,
    v_y: 10,
    v_x: 2,
    width: 5,
    height: 5,
    colour: "white",
    damage: 34,
    cooloff: 12,
    cooling: 0,
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
    width: 4,
    height: 4,
    colour: "white",
    damage: 34,
    health: 1,
  },
  aliengun_2: {
    range: 400,
    v_y: 5,
    v_x: 2,
    width: 4,
    height: 4,
    colour: "white",
    damage: 34,
    health: 1,
  },
  aliengun_n2: {
    range: 400,
    v_y: 5,
    v_x: -2,
    width: 4,
    height: 4,
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
      if (state.type == "player" || state.type == "alien") {
        ctx.fillStyle = state.colour;
        ctx.fillRect(
          state.x - state.width / 2,
          state.y - state.height / 2,
          state.width,
          state.height
        );
      }

      if (state.type == "bonus") {
        ctx.fillStyle = state.colour;
        ctx.beginPath();
        let r = state.width / 2;
        ctx.arc(state.x, state.y, r, 0, 2 * Math.PI, false);
        ctx.fill();

        // ctx.beginPath();
        // ctx.arc(state.x, state.y, state.width / 2, 0, 2 * Math.PI, false);
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = "white";
        // ctx.stroke();
        // ctx.fillStyle = state.colour;
        // ctx.fill();
      }
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
      state.x += state.v_x;
      state.y += state.v_y;
    },
  };
};

const withChangeDirection = (state) => {
  // const { trajectory } = state;

  return {
    changeDirection: (time) => {
      if (state.trajectory.length && state.trajectory[0].time == time) {
        let newTrajectory = state.trajectory.shift();
        if (newTrajectory.v_x) {
          state.v_x = newTrajectory.v_x;
        }
        if (newTrajectory.v_y) {
          state.v_y = newTrajectory.v_y;
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
      state.activeShots = 0; //reset counter
      //remove shots exceeding range;
      for (let i = 0; i < wKeys.length; i++) {
        let activeShots = weapons[wKeys[i]].shots.filter(
          (s) => Math.abs(s.y_init - s.y) < s.range && s.health > 0 //range only in y direction (can do quatratic if needed)
        );
        // console.log("active", activeShots);

        state.weapons[wKeys[i]].shots = activeShots;
        shots.push(...activeShots);
        state.activeShots += activeShots.length;
      }

      //draw and update
      shots.forEach((s) => {
        // console.log(s);

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
      weaponType: weapon,
      x_init: player.x,
      y_init: player.y + (direction * player.height) / 2,
      x: player.x,
      y: player.y + (direction * player.height) / 2,
      // active: true,
      // health: weapon.health,
      ...wStats, //this has too much info
    });
  }
  if (wUser.multi && wUser.multi.length) {
    for (w of wUser.multi) {
      wUser.shots.push({
        weaponType: w,
        x_init: player.x,
        y_init: player.y + (direction * player.height) / 2,
        x: player.x,
        y: player.y + (direction * player.height) / 2,
        // active: true,
        // health: weapon.health,
        ...player.weapons[w], //this has too much info
      });
    }
  }
};

// --------- player
const playerMove = (state) => {
  return {
    move: () => {
      //update velocity
      const friction = 0.9;
      if (controller.state.up) {
        state.v_y -= 1.1;
      }
      if (controller.state.down) {
        state.v_y += 1.1;
      }
      if (controller.state.left) {
        state.v_x -= 1.1;
      }
      if (controller.state.right) {
        state.v_x += 1.1;
      }
      // friction
      state.v_x *= friction;
      state.v_y *= friction;

      // update position
      state.x += state.v_x;
      state.y += state.v_y;

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
          console.log("shooting");

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

const restoreDefaults = (state) => {
  return {
    restoreDefaults: () => {
      //remove any bonuses
      console.log("bonuses " + state.bonuses);
      state.bonuses = [];
      console.log("bonuses " + state.bonuses);
      console.log("w", state.weapons);

      state.weapons = newPlayerInitialState().weapons;
      console.log("w", state.weapons);
    },
  };
};

const modifyWeapon = ({ state, weapon, property, newvalue }) => {
  // console.log("modding...");
  // console.log("weapon", state.weapons[weapon]);

  if (property == "cooloff") {
    state.weapons[weapon].cooling = 0;
  }
  state.weapons[weapon][property] = newvalue;
  // console.log("modded");
  // console.log("weapon", state.weapons[weapon]);
};

// with aliens, bonuses and alien shots
const checkPlayerCollisions = (state) => {
  return {
    checkPlayerCollisions: (gameObjects, time) => {
      for (let i = 0; i < gameObjects.length; i++) {
        //check for collision with enemy/bonus
        if (
          gameObjects[i].health > 0 &&
          Math.abs(state.x - gameObjects[i].x) <
            state.width / 2 + gameObjects[i].width / 2 &&
          Math.abs(state.y - gameObjects[i].y) <
            state.height / 2 + gameObjects[i].height / 2
        ) {
          gameObjects[i].health -= 1000; //kills them dead
          if (gameObjects[i].type == "bonus") {
            gameObjects[i].bonus.action(state, time);
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
              //changed dynamcally based on health (in draw fn?) -nah

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
            if (
              gameObjects[k].health > 0 &&
              Math.abs(shots[j].x - gameObjects[k].x) <
                shots[j].width / 2 + gameObjects[k].width / 2 &&
              Math.abs(shots[j].y - gameObjects[k].y) <
                shots[j].height / 2 + gameObjects[k].height / 2
            ) {
              shots[j].health -= 1;
              gameObjects[k].hit(shots[j].damage);

              if (gameObjects[k].health >= shots[j].damage) {
                //enemy flash white when hit
                let c = gameObjects[k].colour;
                gameObjects[k].colour = "white";
                setTimeout(() => (gameObjects[k].colour = c), 50);
              } else {
                state.score += gameObjects[k].score;
              }
            }

            //player laser stops alien gunshots
            let alienGunShots = [
              ...gameObjects[k].weapons.aliengun.shots,
              ...gameObjects[k].weapons.aliengun_2.shots,
              ...gameObjects[k].weapons.aliengun_n2.shots,
            ];
            for (let m = 0; m < alienGunShots.length; m++) {
              if (
                shots[j].weaponType == "laser" &&
                alienGunShots[m].health > 0 &&
                Math.abs(shots[j].x - alienGunShots[m].x) <
                  shots[j].width / 2 + alienGunShots[m].width / 2 &&
                Math.abs(shots[j].y - alienGunShots[m].y) <
                  shots[j].height / 2 + alienGunShots[m].height / 2
              ) {
                alienGunShots[m].health -= 1;
              }
            }
          }
        }
      }
    },
  };
};

// ----------Bonuses

// remove expired bonuses
const removeBonuses = (state) => {
  return {
    removeBonuses: (time) => {
      state.bonuses.forEach((b) => {
        if (b.t_init + b.duration <= time) {
          //not just equal in case it skips a frame? may have happened before
          console.log("removing");
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
const newPlayerInitialState = () => {
  return {
    type: "player",
    health: 500,
    score: 0,
    x: gameWidth / 2,
    y: (8 * gameHeight) / 9,
    v_x: 0,
    v_y: 0,
    width: 45,
    height: 20,
    colour: "blue",
    weapons: {
      gun: {
        shots: [],
        ...JSON.parse(JSON.stringify(weapons["gun"])), //clone in weapon attributes
      },
      gun_l: {
        shots: [],
        ...JSON.parse(JSON.stringify(weapons["gun_l"])), //clone in weapon attributes
      },
      gun_r: {
        shots: [],
        ...JSON.parse(JSON.stringify(weapons["gun_r"])), //clone in weapon attributes
      },
      laser: {
        shots: [],
        ...JSON.parse(JSON.stringify(weapons["laser"])),
      },
      biglaser: {
        shots: [],
        ...JSON.parse(JSON.stringify(weapons["biglaser"])),
      },
    },
    activeShots: 0,
    bonuses: [],
  };
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
    removeBonuses(state),
    restoreDefaults(state)
  );
};

// ----------------------------
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

const trajectories = {
  trajBuilder: (t_init, array) => {
    return array.map((e) => {
      return { time: t_init + e[0], v_x: e[1], v_y: e[2] };
    });
  },
  vaders: [
    [
      [5, -0.5, 0.2], // format: [delay, v_x, v_y] // delay: time(tics) to apply after object is created, v_x: new x axis velocity;v_y: new y axis velocity
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
      [5, -0.5, 0.2], // format: [delay, v_x, v_y] // delay: time(tics) after object is created, v_x: new x axis velocity;v_y: new y axis velocity
      [50, 0.4, null],
      [100, 0.4, null],
      [125, -0.4, null],
    ],
  ],
  pawns: [
    [
      [5, -0.5, 0.2], // format: [delay, v_x, v_y] // delay: time(tics) after object is created, v_x: new x axis velocity;v_y: new y axis velocity
      [50, 0.4, null],
      [100, 0.4, null],
      [125, -0.4, null],
      [800, -0.4, null],
      [1200, 0.4, null],
    ],
    [
      [5, -0.5, 0.2], // format: [delay, v_x, v_y] // delay: time(tics) after object is created, v_x: new x axis velocity;v_y: new y axis velocity
      [100, 0.4, null],
      [400, 0.4, null],
      [800, -0.4, null],
      [1200, 0.4, null],
    ],
    [
      // format: [delay, v_x, v_y] // delay: time(tics) after object is created, v_x: new x axis velocity;v_y: new y axis velocity
      [0, -6, 0.2],
      [50, 0.1, null],
      [200, 12, null],
      [250, -0.4, null],
      [400, -12, null],
      [450, 0.4, null],
      [620, 11, null],
      [660, -0.4, null],

      [1200, 0.4, null],
    ],
  ],
};

const shotTimings = {
  shotBuilder: (t_init, array) => {
    return array.map((e) => {
      return { first: t_init + e[0], delay: e[1], weapon: e[2] };
    });
  },
  gun: [
    [
      [0, 50, "aliengun"], //format: [first,delay,weapon]first: time for first shot, delay: ticks until repeated (can make v large if only want once), weapon, weapon
      [0, 50, "aliengun_2"],
      [25, 50, "aliengun_n2"],
    ],
    [[5, 100, "aliengun"]],
    [
      [0, 100, "aliengun"], //format: [first,delay,weapon]first: time for first shot, delay: ticks until repeated (can make v large if only want once), weapon, weapon
      [4, 100, "aliengun"],
      [8, 100, "aliengun"],
    ],
  ],

  laser: [[5, 400, "alienlaser"]],
};
// factory for all game objects
const objectInitState = (name, trajectory, shotTimings, t_init) => {
  let type, x, colour, score, health, width, height;
  let y = 0;
  let bonus = null;

  switch (name) {
    case "pawn1":
      {
        type = "alien";
        width = 15;
        height = 5;
        colour = "pink";
        score = 20;
        health = 20;
        x = gameWidth / 2;
      }
      break;
    // case "pawn2":
    //   {
    //     type = "alien";
    //     width = 15;
    //     height = 5;
    //     shotTimings = [];
    //     colour = "pink";
    //     score = 20;
    //     health = 20;
    //     x = gameWidth / 3;
    //   }
    //   break;
    case "vader1":
      {
        type = "alien";
        width = 20;
        height = 35;
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
        score = 100;
        health = 1000;
        colour = "red";
        x = gameWidth / 2;
        y = gameHeight / 2;
        bonus = {
          action: (state, time) => {
            state.health = Math.min(state.health + 200, 500);
            state.bonuses.push({
              remove: () => {},
            });
          },
        };
      }
      break;
    case "cannonCooloffBonus":
      {
        type = "bonus";
        width = 12;
        height = 12;
        shotTimings = [];
        score = 100;
        health = 1000;
        colour = weapons.gun.colour;
        x = gameWidth / 2;
        y = gameHeight / 2;

        bonus = {
          action: (state, time) => {
            modifyWeapon({
              state,
              weapon: "gun",
              property: "cooloff",
              newvalue: 3,
            });
            state.bonuses.push({
              t_init: time, //this sets the duration to start from when the bonus is picked up
              duration: 400,
              remove: () => {
                console.log("Unmodding");
                state.weapons.gun.cooloff = weapons.gun.cooloff;
              },
            });
            console.log(time);
            console.log(state.bonuses);
          },
        };
      }
      break;
    case "cannonBackwardsBonus":
      {
        type = "bonus";
        width = 12;
        height = 12;
        shotTimings = [];
        score = 100;
        health = 1000;
        colour = weapons.gun.colour;
        x = gameWidth / 2;
        y = gameHeight / 2;

        bonus = {
          action: (state, time) => {
            modifyWeapon({
              state,
              weapon: "gun",
              property: "v_y",
              newvalue: -10,
            });
            state.bonuses.push({
              t_init: time,
              duration: 400,
              remove: () => {
                console.log("Unmodding");
                state.weapons.gun.v_y = weapons.gun.v_y;
              },
            });
          },
        };
      }
      break;
    case "laserSpeedBonus":
      {
        type = "bonus";
        width = 12;
        height = 12;
        shotTimings = [];
        score = 100;
        health = 1000;
        colour = weapons.laser.colour;
        x = gameWidth / 2;
        y = gameHeight / 2;

        bonus = {
          action: (state, time) => {
            modifyWeapon({
              state,
              weapon: "laser",
              property: "v_y",
              newvalue: 9,
            });
            state.bonuses.push({
              t_init: time,
              duration: 400,
              remove: () => {
                modifyWeapon({
                  state,
                  weapon: "laser",
                  property: "v_y",
                  newvalue: weapons.laser.v_y,
                });
              },
            });
          },
        };
      }
      break;
    case "cannonMultiBonus":
      {
        type = "bonus";
        width = 12;
        height = 12;
        shotTimings = [];
        score = 100;
        health = 1000;
        colour = "pink";
        x = gameWidth / 2;
        y = gameHeight / 2;

        bonus = {
          action: (state, time) => {
            // modifyWeapon({
            //   state,
            //   weapon: "gun_l",
            //   property: "owned",
            //   newvalue: true,
            // });
            // modifyWeapon({
            //   state,
            //   weapon: "gun_r",
            //   property: "owned",
            //   newvalue: true,
            // });
            modifyWeapon({
              state,
              weapon: "gun",
              property: "multi",
              newvalue: ["gun_l", "gun_r"],
            });
            state.bonuses.push({
              t_init: time,
              duration: 600,
              remove: () => {
                // modifyWeapon({
                //   state,
                //   weapon: "gun",
                //   property: "multi",
                //   newvalue: [],
                // });
                // modifyWeapon({
                //   state,
                //   weapon: "gun_l",
                //   property: "owned",
                //   newvalue: false,
                // });
                modifyWeapon({
                  state,
                  weapon: "gun_r",
                  property: "owned",
                  newvalue: false,
                });
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
        colour = weapons.biglaser.colour;
        x = gameWidth / 2;
        y = gameHeight / 2;

        bonus = {
          action: (state, time) => {
            modifyWeapon({
              state,
              weapon: "biglaser",
              property: "owned",
              newvalue: true,
            });
            state.bonuses.push({
              t_init: time,
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
    v_x: 0,
    v_y: 0,
    width,
    height,
    colour,
    trajectory,
    shotTimings,
    weapons: {
      aliengun: {
        owned: true,
        shots: [],
        ...weapons["aliengun"],
      },
      aliengun_2: {
        owned: true,
        shots: [],
        ...weapons["aliengun_2"],
      },
      aliengun_n2: {
        owned: true,
        shots: [],
        ...weapons["aliengun_n2"],
      },
      alienlaser: {
        owned: true,
        shots: [],
        ...weapons["alienlaser"],
      },
    },
    activeShots: 0,
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

//note time is reset at the start of each level so bonuses need to be reset or their remove function will not work as intended
const runLevel = (time, state, level) => {
  //state = player //bad naming?
  switch (level) {
    case 1:
      {
        if (time % 450 == 0 && time < 600) {
          let a = objectMaker(
            objectInitState(
              "pawn1",
              trajectories.trajBuilder(time, trajectories.pawns[0]),
              [],
              time
            )
          );
          game.gameObjects.push(a);
        }
        if ((time + 200) % 150 == 0) {
          let a = objectMaker(
            objectInitState(
              "pawn1",
              trajectories.trajBuilder(time, trajectories.pawns[1]),
              shotTimings.shotBuilder(time, shotTimings.gun[1]),

              time
            )
          );
          game.gameObjects.push(a);
        }
        if ((time + 200) % 150 == 0) {
          let a = objectMaker(
            objectInitState(
              "pawn1",
              trajectories.trajBuilder(time, trajectories.pawns[2]),
              shotTimings.shotBuilder(time, shotTimings.gun[1]),

              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 1500 == 0) {
          let a = objectMaker(
            objectInitState(
              "cannonCooloffBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],

              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 800 == 0) {
          let a = objectMaker(
            objectInitState(
              "cannonMultiBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],
              time
            )
          );
          game.gameObjects.push(a);
        }
      }
      break;
    case 2:
      {
        if (time % 160 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader1",
              trajectories.trajBuilder(time, trajectories.vaders[0]),
              shotTimings.shotBuilder(time, shotTimings.gun[0]),
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
              shotTimings.shotBuilder(time, shotTimings.gun[1]),

              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time == 200) {
          let a = objectMaker(
            objectInitState(
              "healthBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],

              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 1000 == 0) {
          let a = objectMaker(
            objectInitState(
              "cannonCooloffBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],

              time
            )
          );
          game.gameObjects.push(a);
        }
      }
      break;
    case 3:
      {
        if (time % 200 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader1",
              trajectories.trajBuilder(time, trajectories.vaders[0]),
              shotTimings.shotBuilder(time, shotTimings.gun[1]),

              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 280 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader1",
              trajectories.trajBuilder(time, trajectories.vaders[1]),
              shotTimings.shotBuilder(time, shotTimings.gun[0]),

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
              shotTimings.shotBuilder(time, shotTimings.gun[0]),

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
              [],

              time
            )
          );
          game.gameObjects.push(a);
        }
      }
      break;
    case 4:
      {
        if (time % 140 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader3",
              trajectories.trajBuilder(time, trajectories.vaders[0]),
              shotTimings.shotBuilder(time, shotTimings.gun[2]),

              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 140 == 0) {
          let a = objectMaker(
            objectInitState(
              "vader2",
              trajectories.trajBuilder(time, trajectories.vaders[2]),
              shotTimings.shotBuilder(time, shotTimings.gun[2]),

              time
            )
          );
          game.gameObjects.push(a);
        }
        // if (time % 250 == 0) {
        //   let a = objectMaker(
        //     objectInitState(
        //       "vader1",
        //       trajectories.trajBuilder(time, trajectories.vaders[1]),
        //       shotTimings.shotBuilder(time, shotTimings.gun[0]),

        //       time
        //     )
        //   );
        //   game.gameObjects.push(a);
        // }
        // if (time % 300 == 0) {
        //   let a = objectMaker(
        //     objectInitState(
        //       "vader1",
        //       trajectories.trajBuilder(time, trajectories.vaders[2]),
        //       shotTimings.shotBuilder(time, shotTimings.gun[0]),

        //       time
        //     )
        //   );
        //   game.gameObjects.push(a);
        // }
        if (time == 300) {
          let a = objectMaker(
            objectInitState(
              "healthBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],

              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 800 == 0) {
          let a = objectMaker(
            objectInitState(
              "laserSpeedBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],
              time
            )
          );
          game.gameObjects.push(a);
        }
      }
      break;
    case 5:
      {
        //set new initial weapons state for weapons
        // if (time == 50) {
        //   modifyWeapon({
        //     state,
        //     weapon: "gun",
        //     property: "cooloff",
        //     newvalue: 3,
        //   });
        //   modifyWeapon({
        //     state,
        //     weapon: "biglaser",
        //     property: "owned",
        //     newvalue: true,
        //   });
        //   //TO DO! all properties need to be copies from weapons object to playinitialstate object and read from there
        //   // modifyWeapon({
        //   //   state,
        //   //   weapon: "laser",
        //   //   property: "v_y",
        //   //   newvalue: 8,
        //   // });
        // }

        if (time == 300) {
          let a = objectMaker(
            objectInitState(
              "laserSpeedBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],
              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 300 == 0) {
          let a = objectMaker(
            objectInitState(
              "cannonBackwardsBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],
              time
            )
          );
          game.gameObjects.push(a);
        }
        if (time % 800 == 0) {
          let a = objectMaker(
            objectInitState(
              "cannonMultiBonus",
              trajectories.trajBuilder(time, trajectories.bonuses[0]),
              [],
              time
            )
          );
          game.gameObjects.push(a);
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
  level: 1, // set in start fn below

  gameOver: true,
  p1: null,
  time: 0,

  start() {
    //reset
    this.gameOver = false;
    this.gameObjects = [];
    this.level = startingLevel;
    //init player
    this.p1 = null;

    // let p1InitState = Object.assign({}, newPlayerInitialState); //doesnt deepclone
    //could jsut make newPlayerInitialState a factory?
    let state = newPlayerInitialState();
    this.p1 = playerMaker(state); //new player with initial state (don't want to change initstate so clone here)
    console.log(this.p1.weapons);

    this.time = 0;

    canvasRepaint(this.p1, this.time, this.level);

    const anim = () => {
      this.time++;
      // console.log(this.time);

      canvasRepaint(this.p1, this.time, this.level);
      if (this.time < 600) {
        canvasMessagePaint(`LEVEL ${this.level}`);
      }
      let activeObjects = this.gameObjects.filter((o) => o.health > 0);
      if (
        //this allows you to stay on same lvl forever..
        this.time > 1500 &&
        activeObjects.length == 0
      ) {
        this.level++;
        this.p1.restoreDefaults();
        this.time = 0;
        this.gameObjects = [];
      }
      runLevel(this.time, this.p1, this.level);
      //remove if off screen or no health
      this.gameObjects = this.gameObjects.filter(
        (e) =>
          e.y < gameHeight + e.height && (e.health > 0 || e.activeShots > 0) //dont delete if has active shots (otherwise the shots go too)//draw function will not draw the alien tho
      );
      //update
      this.gameObjects.forEach((e) => {
        e.drawAndMoveShots();
        if (e.health > 0) {
          e.shoot(this.time);
          e.move();
          e.changeDirection(this.time);
          e.draw();
        }
      });

      // ------------ Player

      //track player
      this.p1.draw();
      this.p1.move();
      this.p1.checkWeaponsCollisions(this.gameObjects);
      this.p1.shoot();
      this.p1.drawAndMoveShots();
      this.p1.removeBonuses(this.time);
      this.p1.checkPlayerCollisions(this.gameObjects, this.time);

      if (this.p1.health > 0) {
        window.requestAnimationFrame(anim);
      } else {
        this.p1.health = 0;
        this.gameOver = true;
        //paint over non zero opacity:
        canvasRepaint(this.p1, this.time, this.level);
        canvasRepaint(this.p1, this.time, this.level);
        canvasRepaint(this.p1, this.time, this.level);
        canvasRepaint(this.p1, this.time, this.level);
        canvasRepaint(this.p1, this.time, this.level);
        canvasMessagePaint(`ALIENS WIN`);
        window.cancelAnimationFrame(anim);
        return;
      }
    };
    anim();
  },
};

game.start();
