const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

let xPos = 0;
let yPos = 0;
// let xSpeed = 2;
// let ySpeed = 2;

const step = 25;
const gameTimer = 1000;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "purple";
  ctx.fillRect(xPos, yPos, 25, 25);

  requestAnimationFrame(update);
}

function update() {
  // xPos += xSpeed;
  // yPos += ySpeed;

  // if (xPos + step < canvas.width && xPos > 0) {
  //   xPos += step;
  //   // xSpeed = -xSpeed;
  // }
  // if (yPos + step < canvas.height && yPos > 0) {
  //   yPos += step;
  // ySpeed = -ySpeed;
  // }
  moveHandler();
  // setInterval(() => {
  draw();
  // }, gameTimer);
}

const moveHandler = () => {
  window.addEventListener(
    "keydown",
    function (event) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      switch (event.key) {
        case "ArrowUp":
        case "w":
          if (yPos != 0) yPos -= step;
          break;
        case "ArrowDown":
        case "s":
          if (yPos != canvas.height - step) yPos += step;
          break;
        case "ArrowLeft":
        case "a":
          if (xPos != 0) xPos -= step;
          break;
        case "ArrowRight":
        case "d":
          if (xPos != canvas.width - step) xPos += step;
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
      console.log("X: " + xPos + " Y: " + yPos);
    },
    true
  );
};

// draw();
// debugger;
update();
