import kaboom from "kaboom";
import "kaboom/global";

// Game scaling
let scaleSet = 1;

if (window.innerWidth <= 500) {
  scaleSet = 0.6;
} else if (window.innerWidth <= 1280) {
  scaleSet = 0.7;
} else if (window.innerWidth > 3000) {
  scaleSet = 2.3;
} else if (window.innerWidth > 2000) {
  scaleSet = 1.5;
}

// Initialize
kaboom({
  scale: scaleSet,
});

// Load assets
loadSprite("bird", "sprites/bird.png");
loadSprite("pipe", "sprites/pipe.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("button", "sprites/button.png");
loadSprite("orangeBox", "sprites/score-bg.png");
loadSprite("logo", "sprites/logo.png");
loadSprite("gameover", "sprites/gameover.png");
loadSprite("page", "sprites/page.png");

// load sounds
loadSound("birdHit", "sounds/bird-hit.mp3");
loadSound("die", "sounds/die.mp3");
loadSound("flap", "sounds/flap.mp3");
loadSound("point", "sounds/point.mp3");
loadSound("click", "sounds/click.wav");
loadSound("music", "sounds/soundtrack.mp3");

// load font
loadFont("flappyFont", "font/flappy-font.ttf");

// background music
play("music", {
  volume: 0.2,
  loop: true,
});

// Global Variables
const CENTER_X = width() / 2;
const CENTER_Y = height() / 2;
const BTN_GAP = 150;
let score = 0;
let pipeGap = 150; // bigger number bigger gap
let pipeSpeed = -160; // bigger number = high speed
let loopInterval = 2.5; // value should be less for hard difficulty
let Difficulty = "Easy";

// -------------------
// Add button function
// -------------------

function addButton(txt, position, onclick) {
  // Variables
  let animationSpeed = 0.3;
  let normalSclae = vec2(1);
  let hoverScale = vec2(1.3);
  // content
  const button = add([
    sprite("button"),
    pos(position),
    area({ cursor: "pointer" }),
    scale(normalSclae),
    anchor("center"),
    "button",
  ]);
  const btnText = add([
    text(txt, { font: "flappyFont", size: 42 }),
    anchor("center"),
    scale(normalSclae),
    color(rgb(2, 74, 16)),
    pos(button.pos.x, button.pos.y),
  ]);
  // Button Animation
  button.onHover(() => {
    button.scale = button.scale.lerp(hoverScale, animationSpeed);
    btnText.scale = btnText.scale.lerp(hoverScale, animationSpeed);
  });
  button.onHoverEnd(() => {
    button.scale = button.scale.lerp(normalSclae, animationSpeed);
    btnText.scale = btnText.scale.lerp(normalSclae, animationSpeed);
  });
  button.onClick(() => {
    button.scale = button.scale.lerp(normalSclae, animationSpeed);
    btnText.scale = btnText.scale.lerp(normalSclae, animationSpeed);
    wait(0.25, () => {
      play("click", {
        volume: 0.3,
      });
      onclick();
    });
  });
}

// =========================
// INTRO SCREEN / WELCOME
// =========================

scene("intro", () => {
  add([sprite("bg", { width: width(), height: height() })]);
  add([
    sprite("logo", { height: 200 }),
    pos(CENTER_X, CENTER_Y - 225),
    anchor("center"),
  ]);

  addButton("Start", vec2(CENTER_X, CENTER_Y), () => go("game"));
  addButton("Difficulty", vec2(CENTER_X, CENTER_Y + BTN_GAP), () =>
    go("level")
  );
  addButton("Credits", vec2(CENTER_X, CENTER_Y + 2 * BTN_GAP), () =>
    go("credits")
  );

  add([
    text("Difficulty : " + Difficulty, { size: 24, font: "flappyFont" }),
    pos(20, height() - 40),
    color(rgb(212, 17, 2)),
  ]);
});

// =========================
// CHOOSE DIFFICULTY SCREEN
// =========================
scene("level", () => {
  add([sprite("bg", { width: width(), height: height() })]);
  add([
    sprite("logo", { height: 200 }),
    pos(CENTER_X, CENTER_Y - 225),
    anchor("center"),
  ]);

  addButton("Easy", vec2(CENTER_X, CENTER_Y), () => {
    pipeGap = 150;
    pipeSpeed = -160;
    loopInterval = 2.5;
    Difficulty = "Easy";
    go("intro");
  });
  addButton("Medium", vec2(CENTER_X, CENTER_Y + BTN_GAP), () => {
    pipeGap = 110;
    pipeSpeed = -220;
    loopInterval = 2;
    Difficulty = "Medium";
    go("intro");
  });
  addButton("Hard", vec2(CENTER_X, CENTER_Y + 2 * BTN_GAP), () => {
    pipeGap = 80;
    pipeSpeed = -260;
    loopInterval = 2;
    Difficulty = "Hard";
    go("intro");
  });
  add([
    text("Difficulty : " + Difficulty, { size: 24, font: "flappyFont" }),
    pos(20, height() - 40),
    color(rgb(212, 17, 2)),
  ]);
});

// ==============
// Credits Screen
// ==============

scene("credits", () => {
  let brown = rgb(116, 73, 23);
  add([sprite("bg", { width: width(), height: height() })]);
  const page = add([
    sprite("page"),
    pos(center()),
    area(),
    scale(0.3),
    anchor("center"),
    "page",
  ]);
  add([
    text("Flappy bird", { font: "flappyFont", size: 40 }),
    anchor("center"),
    scale(),
    color(brown),
    pos(CENTER_X, CENTER_Y - 220),
  ]);
  add([
    text("Controls :\n\nSpace,click or tap to play", {
      font: "flappyFont",
      width: 350,
      size: 26,
    }),
    anchor("center"),
    scale(),
    color(brown),
    pos(CENTER_X, CENTER_Y - 100),
  ]);
  add([
    text("Source Code :\n\ngithub.com/anasattaullah", {
      font: "flappyFont",
      width: 350,
      size: 26,
    }),
    anchor("center"),
    scale(),
    color(brown),
    pos(CENTER_X, CENTER_Y + 20),
  ]);
  add([
    text("Developed by\n\n          Anas Attaullah", {
      font: "flappyFont",
      width: 350,
      size: 28,
    }),
    anchor("center"),
    scale(),
    color(brown),
    pos(CENTER_X, CENTER_Y + 150),
  ]);
  addButton("Back", vec2(CENTER_X, height() - 100), () => go("intro"));
});

// =========================
// GAME SCENE / INGAME LOGIC
// =========================

scene("game", () => {
  // Variables
  setGravity(1600);
  let hitflag = false;

  // Adding sprites
  add([sprite("bg", { width: width(), height: height() })]);

  const bird = add([sprite("bird"), pos(200, 80), area(), scale(0.2), body()]);

  const scoreBg = add([
    sprite("orangeBox"),
    pos(150, 60),
    area(),
    scale(0.8),
    anchor("center"),
    z(1),
  ]);
  ``;
  const SCORE_TEXT = add([
    pos(scoreBg.pos.x, scoreBg.pos.y),
    text("Score : " + score, {
      size: 36,
      font: "flappyFont",
    }),
    anchor("center"),
    z(2),
  ]);

  // Jump function
  onKeyPress("space", () => {
    play("flap", {
      volume: 0.2,
    });
    bird.jump(500);
  });
  onMousePress("left", () => {
    play("flap", {
      volume: 0.2,
    });
    bird.jump(500);
  });
  onTouchStart(() => {
    play("flap", {
      volume: 0.2,
    });
    bird.jump(500);
  });

  // Function to produce pipes
  function producePipes() {
    const offset = rand(-250, 250);

    const pipe = add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + pipeGap),
      area(),
      scale(0.4),
      { passed: false },
      "pipe",
    ]);
    const pipeTop = add([
      sprite("pipe", { flipY: true }),
      pos(width(), height() / 2 + offset - pipeGap),
      anchor("botleft"),
      area(),
      scale(0.4),
      "pipe",
    ]);

    pipe.onUpdate(() => {
      pipe.move(pipeSpeed, 0);
      pipeTop.move(pipeSpeed, 0);
    });
    // Score logic
    bird.onUpdate(() => {
      if (bird.pos.x > pipe.pos.x && pipe.passed === false) {
        play("point");
        pipe.passed = true;
        score++;
        SCORE_TEXT.text = "Score :" + score;
      }
    });
  }
  loop(loopInterval, () => {
    producePipes();
  });

  // Gameover logic
  bird.onCollide("pipe", () => {
    if (!hitflag) {
      play("birdHit", {
        volume: 0.5,
      });
      hitflag = true;
    }
    destroy(bird);
    wait(0.7, () => go("outro"));
  });
  bird.onUpdate(() => {
    if (bird.pos.y > height() + 20 || bird.pos.y < -300) {
      if (!hitflag) {
        play("die");

        hitflag = true;
      }
      wait(0.7, () => go("outro"));
    }
  });
});

// ===============
// Gameover Screen
// ===============

scene("outro", () => {
  // Adding Sprites
  add([sprite("bg", { width: width(), height: height() })]);

  add([
    sprite("gameover", { height: 220 }),
    pos(width() / 2, height() / 2 - 200),
    anchor("center"),
  ]);

  const SCORE_TEXT = add([
    pos(CENTER_X, CENTER_Y - 30),
    text("Score : " + score, {
      size: 36,
      font: "flappyFont",
    }),
    anchor("center"),
  ]);
  addButton("Restart", vec2(CENTER_X, CENTER_Y + 100), () => {
    score = 0;
    go("game");
  });
  addButton("Exit", vec2(CENTER_X, CENTER_Y + BTN_GAP + 100), () => {
    score = 0;
    go("intro");
  });
  add([
    text("Difficulty : " + Difficulty, { size: 24, font: "flappyFont" }),
    pos(20, height() - 40),
    color(rgb(212, 17, 2)),
  ]);
});

go("intro");
