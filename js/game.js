window.onload = function () {
  // Canvas basic validation.
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    console.error("Error: <canvas id='canvas'> Not found.");
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Error: Browser doesn't support canvas 2D.");
    return;
  }

  // Sizes definition (Screen and canvas).
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  // Defining auxiliar variables.
  let halfW = W / 2;
  let quarterW = halfW / 2;
  let threeQuarterW = halfW + quarterW;

  // ---------- Physics contact/Angle ----------
  const BALL_BASE_SPEED  = 12;                    // Velocity.
  const MAX_BOUNCE_ANGLE = Math.PI * 60 / 180;    // 60° bounce angle.
  const MIN_HORIZ_COS    = 0.4;                   // avoid almost vertical serves (|cos(θ)| very small.
  const SPEED_BOOST      = 1.15;                  // Increases 10% everytime hits the paddle (if you set to 1, it is not to increase the speed).
  const MAX_SPEED        = 18;                    // limit max speed.

  // ---- Auxiliar functions ----
  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
  function randInt(min, max) { return Math.round(Math.random() * (max - min)) + min; }

  // Recalculates resizes if the window changes its dimensions. (improves UX).
  window.addEventListener("resize", () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    halfW = W / 2;
    quarterW = halfW / 2;
    threeQuarterW = halfW + quarterW;
    // Prevents them from going out of range when changing dimensions.
    players.forEach(p => {
      if (p.y + p.padLength > H) p.y = Math.max(0, H - p.padLength);
      if (p.side === "right") p.x = Math.max(0, W - p.width);
    });
  });

  // ---- Game Status. ----
  const players = [ new Player("left"), new Player("right") ];
  const scoreboard = [0, 0];
  const paddleDirection = {
    p1: { up: false, down: false },
    p2: { up: false, down: false }
  };
  const ball = new Ball();
  ball.reset(); // random start.

  // ---- Principal loop. ----
  //let lastTime = 0;
  function loop(ts) {
    /*const dt = ts - lastTime; // In case you want time-dependent physics.
    lastTime = ts;*/

    paintBoard();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // ---- Definitions. ----
  function Player(side) {
    const self = this;
    self.side = side;
    self.width = 60;
    self.padLength = 150;
    self.x = (side === "left") ? 0 : W - self.width;
    self.y = randInt(0, Math.max(0, H - self.padLength));
    self.color = "#FF0000";
    self.velocity = 12;

    self.paint = function () {
      ctx.fillStyle = self.color;
      ctx.fillRect(self.x, self.y, self.width, self.padLength);
    };
    self.move = function () {
      if (self.side === "left") {
        if (paddleDirection.p1.down) self.y = Math.min(self.y + self.velocity, H - self.padLength);
        if (paddleDirection.p1.up)   self.y = Math.max(self.y - self.velocity, 0);
      } else {
        if (paddleDirection.p2.down) self.y = Math.min(self.y + self.velocity, H - self.padLength);
        if (paddleDirection.p2.up)   self.y = Math.max(self.y - self.velocity, 0);
      }
    };
  }

  function Ball() {
    const self = this;
    self.size  = 15; // radio
    self.x     = W / 2;
    self.y     = randInt(self.size, Math.max(self.size, H - self.size));
    self.style = "rgba(255, 255, 255, 0.9)";
    self.speed = BALL_BASE_SPEED;
    self.dir_x = 0;
    self.dir_y = 0;

    // Random direction, avoids the vertical direction.
    self.randomServe = function () {
      const toRight = randInt(0, 1) === 0; // true => right
      let angle;

      // Random angle bewteen -MAX and +MAX, filtering small |cos|.
      do {
        angle = (Math.random() * 2 - 1) * MAX_BOUNCE_ANGLE; // [-MAX, +MAX]
      } while (Math.abs(Math.cos(angle)) < MIN_HORIZ_COS);

      self.dir_x = (toRight ? 1 : -1) * Math.cos(angle) * self.speed;
      self.dir_y = Math.sin(angle) * self.speed;
    };

    self.reset = function () {
      self.x = W / 2;
      self.y = randInt(self.size, Math.max(self.size, H - self.size));
      self.speed = BALL_BASE_SPEED;
      self.randomServe();
    };

    self.paint = function () {
      ctx.beginPath();
      ctx.fillStyle = self.style;
      ctx.arc(self.x, self.y, self.size, 0, Math.PI * 2);
      ctx.fill();
    };

    self.move = function () {
      self.x += self.dir_x;
      self.y += self.dir_y;

      const p1 = players[0];
      const p2 = players[1];

      // Vertical bounce with Radio.
      if (self.y - self.size <= 0 || self.y + self.size >= H) {
        self.dir_y *= -1;
        self.y = clamp(self.y, self.size, H - self.size);
      }

      // Goles (it goes away from the palette limit.)
      if (self.x + self.size < p1.x) { // Player 1 scores.
        scoreboard[1]++;
        self.reset();
      }
      if (self.x - self.size > p2.x + p2.width) { // Player 2 scores.
        scoreboard[0]++;
        self.reset();
      }

      // --- Left pallete collision (p1). ---
      if (
        self.x - self.size <= p1.x + p1.width &&
        self.x > p1.x &&
        self.y + self.size >= p1.y &&
        self.y - self.size <= p1.y + p1.padLength
      ) {
        const pCenter = p1.y + p1.padLength / 2;
        let rel = (self.y - pCenter) / (p1.padLength / 2); // [-1, 1]
        rel = clamp(rel, -1, 1);

        // Bounce angle according to the impact.
        const bounceAngle = rel * MAX_BOUNCE_ANGLE;

        // It increases the velocity and it limits.
        self.speed = Math.min(self.speed * SPEED_BOOST, MAX_SPEED);

        // Recalculates the components with a new angle (to the right).
        self.dir_x = Math.cos(bounceAngle) * self.speed;
        self.dir_y = Math.sin(bounceAngle) * self.speed;

        // Avoid to be inside the pallete area.
        self.x = p1.x + p1.width + self.size;

        makeHitBallSound();
      }

      // --- Right pallete collision (p2). ---
      if (
        self.x + self.size >= p2.x &&
        self.x < p2.x + p2.width &&
        self.y + self.size >= p2.y &&
        self.y - self.size <= p2.y + p2.padLength
      ) {
        const pCenter = p2.y + p2.padLength / 2;
        let rel = (self.y - pCenter) / (p2.padLength / 2); // [-1, 1]
        rel = clamp(rel, -1, 1);

        const bounceAngle = rel * MAX_BOUNCE_ANGLE;

        self.speed = Math.min(self.speed * SPEED_BOOST, MAX_SPEED);

        // Goes to the left: reverts X component.
        self.dir_x = -Math.cos(bounceAngle) * self.speed;
        self.dir_y =  Math.sin(bounceAngle) * self.speed;

        self.x = p2.x - self.size;

        makeHitBallSound();
      }
    };
  }

  // ---- Render principal ----
  function paintBoard() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    // Marcador
    ctx.font = "80px Helvetica";
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "top";
    ctx.fillText(String(scoreboard[0]), quarterW, 20);
    ctx.fillText(String(scoreboard[1]), threeQuarterW, 20);

    // Elementos
    for (let i = 0; i < players.length; i++) {
      players[i].paint();
      players[i].move();
    }
    ball.paint();
    ball.move();
  }

  // ---- Key Control. ----
  function handleKeyDown(e) {
    const code = e.which || e.keyCode;
    switch (code) {
      case 79: // O
        paddleDirection.p2.up = true;
        break;
      case 75: // K
        paddleDirection.p2.down = true;
        break;
      case 87: // W
        paddleDirection.p1.up = true;
        break;
      case 83: // S
        paddleDirection.p1.down = true;
        break;
    }
  }
  function handleKeyUp(e) {
    const code = e.which || e.keyCode;
    switch (code) {
      case 79:
        paddleDirection.p2.up = false;
        break;
      case 75:
        paddleDirection.p2.down = false;
        break;
      case 87:
        paddleDirection.p1.up = false;
        break;
      case 83:
        paddleDirection.p1.down = false;
        break;
    }
  }

  // ---- Sound validation. ----
  function makeHitBallSound() {
    const audio = document.getElementById("hitBall");
    if (!audio) return;
    try {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (_) {
      // Silent if the browser blocks autoplay.
    }
  }

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
};