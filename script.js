const btnRules = document.getElementById("btn-rules");
const rules = document.getElementById("rules");
const btnClose = document.getElementById("btn-close");
const popupContainer = document.getElementById("popup-container");
const popupScore = document.getElementById("popup-score");

btnRules.addEventListener("click", () => rules.classList.add("show"));
btnClose.addEventListener("click", () => rules.classList.remove("show"));

//basic commands to connect the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
let score1 = 0;

//******************Ball********************** */

//ball initiails
//making the ball requirements and use them later in arc keyword
//x and y dist. from left(x-axis) and top(y-axis)
//r be radius
//speed be the motion of speed of ball
//dx ball movement on x axis
//dy ball movement on y axis

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

//use the initals in function to show in DOM
//Show Ball on canvas
//firstly begin and closed the path
//in b/w add the stuff
//we want an circle use arc
//for color using fillStyle

function showBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.closePath();
}
//showBall(); calling in a seperate function called draw

//*******************Paddle************************* */

//paddle initals
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 30,
  w: 80,
  h: 10,
  speed: 8,
  //we want paddle movt on x -axis only so no dy compaonent
  //also we want our padddle be at static or no movt state initially
  //gonna move on a key event and we update this later
  //checkout ball dx,dy this means that at initial ball is moving i.e not depend on keypress or anything
  dx: 0,
};

//Show In DOM
function showPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.closePath();
}
//showPaddle(); calling in a seperate function called draw

//to show text on canvas we use fillText
function showScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}
//showScore();

//*********************Bricks Section ***************** */

const brickRows = 9;
const brickColumns = 7;

//basic brick info for all the bricks
//offsetX and offsetY for the inital positions(the position of the first brick and has to be changed for the other bricks and we gonna do this by for each loop)of the brick from x and y axis
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,

  //ye offset waali values temperory hai yaa phir kah sakte hai pehle brick ke liye ye value hai and for the next bricks we want to update these
  //apan ko rect banana hai usme x,y,w,h chahiye and w,h are fixed but x,y are diff for every brick so it changed in func
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

//so now our target is to give every brick its x and y
//so loop through a row and its every column and update the x and y values
//and set these values in the bricks aray of objects having x,y and also the whole brickInfo

const bricks = [];
for (let i = 0; i < brickRows; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumns; j++) {
    x = brickInfo.offsetX + i * (brickInfo.w + brickInfo.padding);
    y = brickInfo.offsetY + j * (brickInfo.h + brickInfo.padding);
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//now we have to show it in the DOM
//we have to show every brick i.e forEach is req.
function showBricks() {
  bricks.forEach((column) =>
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "red" : "transparent";
      ctx.fill();
      ctx.closePath();
    })
  );
}
//the main function of showing the sections
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showBall();
  showPaddle();
  showScore();
  showBricks();
}

//****************************************************Animation part******************************************************** */

//*************************Paddle*********************** */

//first of all the movement of the paddle
//inital dx be 0
//and on key press events we want x to be vary accordingly
//we also want to have the wall detection i.e if wall came then no movt further on that direction
function movepaddle() {
  paddle.x = paddle.x + paddle.dx;

  //wall detection for right wall

  //agar paddle ki position mtlb paddle ka starting point + paddle ki width,, whole mtlb pura paddle is greater than canvas.width tho phir apne ko stop hona hai
  //tho paddle ki position is equal to canvas ki w -paddle ki w
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  //wall detection for left wall

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}
//now the functioning of paddle is done now focus on keymovt at the bottom

//*****************************Ball***************************** */

function moveBall() {
  ball.x = ball.x + ball.dx;
  ball.y = ball.y + ball.dy;

  //wall detection (right/left)
  if (ball.x + ball.r > canvas.width || ball.x - ball.r < 0) {
    ball.dx = ball.dx * -1;
  }
  //wall detection (top/bottom)
  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
    ball.dy = ball.dy * -1;
  }
  //paddle collision
  if (
    ball.x - ball.r > paddle.x &&
    ball.x + ball.r < paddle.x + paddle.w &&
    ball.y + ball.r > paddle.y
  ) {
    ball.dy = -ball.speed;
  }
  //bricks collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.r > brick.x && // left brick side check
          ball.x + ball.r < brick.x + brick.w && // right brick side check
          ball.y + ball.r > brick.y && // top brick side check
          ball.y - ball.r < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy = ball.dy * -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  //Lose : Hit bottom wall

  if (ball.y + ball.r > canvas.height) {
    showAllBricks();
    score = 0;
    popup();
    stopExe;
  }
}

function popup() {
  popupScore.innerText = score1;
  popupContainer.classList.add("show");
}

function increaseScore() {
  score++;

  if (score % (brickRows * brickRows === 0)) {
    showAllBricks();
  }
  score1 = score;
}

function showAllBricks() {
  bricks.forEach((column) => column.forEach((brick) => (brick.visible = true)));
}
//this function for showing the drawing and animation of parts
function update() {
  movepaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}
update();

//function of keydown mtlb jab tak key pressed rahegi...
function keyDown(e) {
  //console.log(e.key);
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

//function for keyup mtlb jab apan key ko release karenge tab
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
