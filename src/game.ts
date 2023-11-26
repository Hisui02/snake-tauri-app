const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

const GAMEVARS = {
  gameTimer: 500,
  step: 25,
  snakeColor: "purple",
  pointColor: "yellow",
};

let gameLost: boolean = false;

let snake: { xPos: number; yPos: number }[] = [
  { xPos: 0, yPos: 25 },
  { xPos: 0, yPos: 0 },
];

let xPos = snake[0].xPos;
let yPos = snake[0].yPos;
let xPosPrev = snake[1].xPos;
let yPosPrev = snake[1].yPos;

let direction: string = "DOWN";
let changedDirection = false;

let points = parseInt(document.getElementById("points")!.textContent as string);
let isPointGenerated: boolean = false;
let xPointPos: number;
let yPointPos: number;

const { step, gameTimer } = GAMEVARS;

function draw() {
  //Clearing rects
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Drawing point
  ctx.fillStyle = GAMEVARS.pointColor;
  ctx.fillRect(xPointPos, yPointPos, step, step);

  //Drawing snake
  ctx.fillStyle = GAMEVARS.snakeColor;
  drawSnake();

  if (!isPointGenerated) generatePoint();

  changedDirection = false;

  setTimeout(() => {
    if (!gameLost) requestAnimationFrame(update);
  }, gameTimer);
}

function update() {
  directionHandler();
  calcNextPosition(direction);
  evaluateNextPosition();
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
  points += 1;
  document.getElementById("points")!.textContent = points.toString();
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
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].xPos, snake[i].yPos, step, step);
  }
  ctx.beginPath();
  ctx.arc(
    snake[0].xPos + step / 2,
    snake[0].yPos + step / 2,
    step / 4,
    0,
    2 * Math.PI
  );
  // ctx.ellipse(
  //   snake[0].xPos + step / 2,
  //   snake[0].yPos + step / 6,
  //   step / 2,
  //   step,
  //   0,
  //   0,
  //   2 * Math.PI
  // );
  ctx.fillStyle = "black";
  ctx.fill();
};

update();
