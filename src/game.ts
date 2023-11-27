const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

let pointImg = new Image();
pointImg.src = "/src/assets/apple-svg.svg";

const GAMEVARS = {
  gameTimer: 250,
  step: 25,
  snakeColor1: "#ED6464",
  snakeColor2: "#CC3E36",
  pointColor: "yellow",
};

let gamePaused: boolean = true;
let gameLost: boolean = false;

const text = document.getElementById("text");

let snake: { xPos: number; yPos: number }[] = [
  { xPos: 0, yPos: 25 },
  { xPos: 0, yPos: 0 },
];

let { xPos, yPos } = snake[0];
let { xPos: xPosPrev, yPos: yPosPrev } = snake[1];

let direction: string = "DOWN";
let changedDirection = false;

let points = parseInt(document.getElementById("points")!.textContent as string);
let isPointGenerated: boolean = false;
let xPointPos: number;
let yPointPos: number;

const { step } = GAMEVARS;
let { gameTimer } = GAMEVARS;

function draw() {
  //Clearing rects
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Drawing point
  drawPoint();

  //Drawing snake
  drawSnake();

  if (!isPointGenerated) generatePoint();

  changedDirection = false;

  if (gameLost) loosingHandler();

  setTimeout(() => {
    if (!gameLost) requestAnimationFrame(update);
  }, gameTimer);
}

function update() {
  directionHandler();
  if (!gamePaused) {
    calcNextPosition(direction);
    evaluateNextPosition();
  }
  draw();
}

const directionHandler = () => {
  window.addEventListener(
    "keydown",
    function (event) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }
      if (!changedDirection) {
        switch (event.key) {
          case "ArrowUp":
          case "w":
            if (direction != "DOWN") {
              direction = "UP";
              changedDirection = true;
            }
            break;
          case "ArrowDown":
          case "s":
            if (direction != "UP") {
              direction = "DOWN";
              changedDirection = true;
            }
            break;
          case "ArrowLeft":
          case "a":
            if (direction != "RIGHT") {
              direction = "LEFT";
              changedDirection = true;
            }
            break;
          case "ArrowRight":
          case "d":
            if (direction != "LEFT") {
              direction = "RIGHT";
              changedDirection = true;
            }
            break;
          case " ":
            gamePaused = !gamePaused;
            if (!gamePaused) {
              text!.style.display = "none";
            } else {
              text!.style.display = "inline";
            }
            if (gameLost) {
              window.location.reload();
            }
            break;
          default:
            return; // Quit when this doesn't handle the key event.
        }
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    },
    true
  );
};

const calcNextPosition = (direction: string) => {
  xPosPrev = xPos;
  yPosPrev = yPos;
  switch (direction) {
    case "UP":
      if (yPos - step >= 0) {
        yPos -= step;
        snake.unshift({ xPos, yPos });
        snake.pop();
      }
      break;
    case "DOWN":
      if (yPos + step < canvas.height) {
        yPos += step;
        snake.unshift({ xPos, yPos });
        snake.pop();
      }
      break;
    case "RIGHT":
      if (xPos + step < canvas.width) {
        xPos += step;
        snake.unshift({ xPos, yPos });
        snake.pop();
      }
      break;
    case "LEFT":
      if (xPos - step >= 0) {
        xPos -= step;
        snake.unshift({ xPos, yPos });
        snake.pop();
      }
      break;
  }
};

const addPoint = () => {
  //Adding the point
  points += 1;
  document.getElementById("points")!.textContent = points.toString();

  //Speeding up the game
  gameTimer *= 0.95;

  //Adding 1 to snake length
  snake.push({
    xPos: snake[snake.length - 1].xPos,
    yPos: snake[snake.length - 1].yPos,
  });
};

const generatePoint = () => {
  xPointPos = generateRandomCoord();
  yPointPos = generateRandomCoord();
  isPointGenerated = true;
};

const generateRandomCoord = () => {
  return Math.floor(Math.random() * 20) * 25;
};

const evaluateNextPosition = () => {
  //Manage game loosing
  if (
    (xPos == xPosPrev && yPos == yPosPrev) ||
    snake.slice(1).some((s) => s.xPos === xPos && s.yPos === yPos)
  ) {
    gameLost = true;
    console.log("LOST");
  }

  //Manage point earning
  if (xPos == xPointPos && yPos == yPointPos) {
    isPointGenerated = false;
    addPoint();
  }
};

const drawSnake = () => {
  //Snake body
  for (let i = 1; i < snake.length; i++) {
    if (i % 2 == 0) {
      ctx.fillStyle = GAMEVARS.snakeColor1;
    } else {
      ctx.fillStyle = GAMEVARS.snakeColor2;
    }
    ctx.fillRect(snake[i].xPos, snake[i].yPos, step, step);
  }

  //Snake head

  ctx.beginPath();
  ctx.arc(
    snake[0].xPos + step / 2,
    snake[0].yPos + step / 2,
    step / 2,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = GAMEVARS.snakeColor1;
  ctx.fill();

  let xOri = step; //Initialize
  let yOri = step; //Initialize

  switch (direction) {
    case "UP":
      xOri = step;
      yOri = step / 2;
      ctx.fillRect(snake[0].xPos, snake[0].yPos + step / 2, xOri, yOri);
      break;
    case "DOWN":
      xOri = step;
      yOri = step / 2;
      ctx.fillRect(snake[0].xPos, snake[0].yPos, xOri, yOri);
      break;
    case "RIGHT":
      xOri = step / 2;
      yOri = step;
      ctx.fillRect(snake[0].xPos, snake[0].yPos, xOri, yOri);
      break;
    case "LEFT":
      xOri = step / 2;
      yOri = step;
      ctx.fillRect(snake[0].xPos + step / 2, snake[0].yPos, xOri, yOri);
      break;
  }
};

const loosingHandler = () => {
  text!.textContent = "YOU LOST!";
  text!.style.animation = "none";
  text!.style.display = "inline";
};

const drawPoint = () => {
  ctx.drawImage(pointImg, xPointPos, yPointPos);
};

update();
