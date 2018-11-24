const WORDS = [
  "se02", "house3d", "simple", "game",
  "online", "website", "teamwork", "realtime",
];

var time; // countdown
var playing; // determine state

var focus; // Astroid the player is currently typing out
var field = [];

var score = 0;

var planetCrust; // color of crust
var planetMantle; // color of mantle

var ship; // color of ship

function setup() {
  frameRate(30);
  time = -3; // countdown begins at three
  playing = false; //not playing yet
  var canvas = createCanvas(500, 700);
  canvas.parent('play_ground');
  planetCrust = randomColor();
  planetMantle = randomColor();
  ship = randomColor();
  field.push(new Asteroid(random(width - 150) + 75, 0, random(WORDS), randomColor()));
  focus = null;
}

function draw() {
  background(51);
  drawBase();
  drawLazer();
  drawScore();
  handleField();
}

/**
 * updates & draws Astroids
 * manages field array
 * increments score
 * manages focus
 * creates Asteroids
 */
function handleField() {
    //When the user clicked start
    if (start) {
        //When the user is playing
        if (playing) {
            for (var i = field.length - 1; i >= 0; i--) {
                field[i].update();
                if (field[i].intact) {
                    // Astroid is still on-screen
                    field[i].draw();
                } else {
                    // Astroid has been destroyed
                    score += field[i].text.length;
                    field.splice(i, 1); // delete from array
                    focus = null;
                }
            }
            //If there are no astroid in game add one
            if (field.length == 0) {
                field.push(new Asteroid(random(width - 150) + 75, 0, random(WORDS), randomColor()));
            }
            //Every 1 second run one random value
            if (frameCount % 60 === 0) { 
                //More astroid as game progresses
                if ( random() > map(score, 0, 1000, 0.5, 0.01) ) {
                    field.push(new Asteroid(random(width - 150) + 75, 0, random(WORDS), randomColor()));
                }
            }
        } else {
            text(-time, width / 2, height / 2);
            //Count down countdown
            if (frameCount % 30 === 0) {
                time++;
                if (time === 0) {
                    playing = true;
                }
            }
        }
    }
}

/**
 * handles user input
 */
function keyPressed() {
  if (focus) {
    // if we have honed in on a specific Asteroid
    focus.erode(keyCode);
  } else {
    // find the astroid to target
    focus = findAsteroid(keyCode, field);
    if (focus) {
      focus.erode(keyCode);
    }
  }
}

/**
 * draws planet as a rectangle
 * draws "ground control" as a triangle
 */
function drawBase() {
  /* planet */
  fill(planetMantle);
  stroke(planetCrust);
  strokeWeight(5);
  rect(0, height - 15, width, height);
  /* ground control */
  fill(ship);
  stroke(255);
  beginShape();
  vertex(width / 2 - 20, height);
  vertex(width / 2, height - 50);
  vertex(width / 2 + 20, height);
  endShape(CLOSE);
}

/**
 * draws "lazer" between ground control and Asteroid
 */
function drawLazer() {

  if (!focus) {
    return;
  }
  stroke(randomColor());
  strokeWeight(focus.completedText.length); // width of line depends on progress

  // point of ground control
  line(width / 2, height - 50, focus.position.x, focus.position.y);

  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(30);
  text(focus.completedText, width / 2, height / 2);
}

/**
 * draws the score
 */
function drawScore() {

  textAlign(RIGHT);
  noStroke();
  textSize(30);
  fill(255);
  text(score, 50, height / 2);
}

/**
 * Generates a random color
 */
function randomColor() {

  return color(random(255), random(255), random(255));
}

/**
 * stops loop, draws game over message
 */
function endGame() {
  noLoop();
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(80);
  text("Game over!", width / 2, height / 2);
  $('#name_input').show();
}