var balls = [];
var sliderNum;
var sliderRadius;
var preN;
var preR;

function setup() {
  createCanvas(400, 400);
  createSliderNum();
  createSliderRadius();
  preN = sliderNum.value();
  preR = sliderRadius.value();
  createNewBalls(preN, preR);
}

function draw() {

  if (preN !== sliderNum.value()) {
    changeBallCount();
  }

  if (preR !== sliderRadius.value()) {
    changeRadius();
  }

  background(0);

  for (let b of balls) {
    b.update();
    b.show();
    for (let other of balls) {
      if (b !== other && b.hit(other)) {
        b.calcVel(other);
        break;
      }
    }
  }
}

// create slider for number of balls
function createSliderNum() {
  var group = createDiv('');
  group.position(width + 10, height / 2);
  sliderNum = createSlider(2, 100, 8, 1);
  sliderNum.parent(group);
  var label = createSpan('Number of Balls');
  label.parent(group);
}

// create slider for radius of ball
function createSliderRadius() {
  var group = createDiv('');
  group.position(width + 10, height / 2 + 40);
  sliderRadius = createSlider(2, 50, 20, 1);
  sliderRadius.parent(group);
  var label = createSpan('Radius of ball');
  label.parent(group);
}

function changeBallCount() {
  if (preN > sliderNum.value()) {
    while (preN > sliderNum.value()) {
      balls.splice(balls.length - 1, 1);
      preN--;
    }
  } else {
    while (preN < sliderNum.value()) {
      addNewBall(sliderRadius.value());
      preN++;
    }
  }
}

function addNewBall(r) {
  var tryCount = 10;
  while (tryCount > 0) {
    var isNewBall = true;
    var newb = new Ball(random(r, width - r), random(r, height - r), r);
    for (let b of balls) {
      if (newb.hit(b)) {
        isNewBall = false;
      }
    }

    if (isNewBall) {
      balls.push(newb);
      break;
    }

    tryCount--;
  }
}

function changeRadius() {
  preR = sliderRadius.value();
  for (let b of balls) {
    b.r = preR;
  }
}

function createNewBalls(n, r) {
  balls = [];
  while (balls.length < n) {
    let newball = new Ball(random(r, width - r), random(r, height - r), r);

    let isTarget = true;
    for (let b of balls) {
      if (newball.hit(b)) {
        isTarget = false;
        break;
      }
    }

    if (isTarget) {
      balls.push(newball);
    }
  }
}

  function Ball(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.m = 3;
    this.vel = p5.Vector.random2D();
    this.vel.setMag(this.m);
  
    this.update = function() {
      this.vel.setMag(this.m);
      this.pos.add(this.vel);
  
      if (this.isEdgeX()) {
        while (this.pos.x - this.r <= 0) {
          this.pos.x += 0.1;
        }
        while (this.pos.x + this.r >= width) {
          this.pos.x -= 0.1;
        }
        this.vel.x *= -1;
      }
  
      if (this.isEdgeY()) {
        while (this.pos.y - this.r <= 0) {
          this.pos.y += 0.1;
        }
        while (this.pos.y + this.r >= height) {
          this.pos.y -= 0.1;
        }
        this.vel.y *= -1;
      }
    }
  
    this.show = function() {
      stroke(0); // 輪郭表示
      fill(255, 255, 255); //  色の指定
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2); // 円形表示
    }
  
    this.calcVel = function(other) {
      var left_ball;
      var right_ball;
  
      if (this.pos.x <= other.pos.x) { // 他のボールと比べて自分が左右どちらか判定
        left_ball = this;
        right_ball = other;
      } else {
        left_ball = other;
        right_ball = this;
      }
  
      // 2次元座標上の2点間の距離を計算
      var d = dist(left_ball.pos.x, left_ball.pos.y, right_ball.pos.x, right_ball.pos.y);
      // 跳ね返り先の座標を算出？
      var unit_v = p5.Vector.sub(right_ball.pos, left_ball.pos);
      // https://p5js.org/reference/#/p5.Vector/setMag
      unit_v.setMag(left_ball.r + right_ball.r - d + 3);
      right_ball.pos.add(unit_v);
  
      // v is a vector from leftBall to rightBall
      var v = p5.Vector.sub(right_ball.pos, left_ball.pos);
      var k = p5.Vector.dot(left_ball.vel, v) / pow(v.mag(), 2);
      var vn1 = p5.Vector.mult(v, k, undefined);
  
      v.mult(-1);
      k = p5.Vector.dot(right_ball.vel, v) / pow(v.mag(), 2);
      var vn2 = p5.Vector.mult(v, k, undefined);
  
      vn1.setMag(left_ball.m);
      vn2.setMag(right_ball.m);
      left_ball.vel.add(vn2);
      right_ball.vel.add(vn1);
    }
  
    this.hit = function(other) {
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      return d < (this.r + other.r);
    }
  
    this.isEdgeX = function() {
      return this.pos.x - this.r <= 0 || this.pos.x + this.r >= width;
    }
  
    this.isEdgeY = function() {
      return this.pos.y - this.r <= 0 || this.pos.y + this.r >= height;
    }
  
  }