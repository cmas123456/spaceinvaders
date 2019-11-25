const source = document.createElement('canvas')
assignAttributes(source, {
  id: 'source',
	height: window.innerHeight - 20,
	width: window.innerWidth - 50
})
document.body.appendChild(source)

const context = source.getContext('2d', {alpha: 'false'})
const shipImage = document.getElementById('img_ship');
const alienImage1 = document.getElementById('img_redaliendown');
const alienImage2 = document.getElementById('img_redalienup');
const bulletImage = document.getElementById('img_bullet');
const gameover = document.getElementById('img_gameover');
let changeDirection = false;
let isGameOver = false;
let willFlip = false;
//create bricks
let invaderArray = [];
let bulletArray = [];
let invaderBulletArray = [];
let ship = {};
let shipCreate = (() => {
  ship = {
  origin: [window.innerWidth / 2, window.innerHeight * .83],
  dimensions: [40,50],
  health: 3,
  image: shipImage,
  color: () => {
    switch(ship.health){
      case 3: 
        return 'green'
      case 2:
        return 'yellow'
      case 1:
        return 'red'
      default:
        return 'green'
    }
  },
  maxSpeed: 2,
  horizontalSpeed: 0,
  hasFired: false,
  canShoot: true,
  Move() {
    this.origin[0] += this.horizontalSpeed;
  },
  Draw() {
    context.drawImage(this.image,this.origin[0],this.origin[1], this.dimensions[0], this.dimensions[1]);
  },
  bulletCreate() {
    const bullet = {
      origin: [ship.origin[0] + ship.dimensions[0] / 2 - 5, (ship.origin[1] - 5)],
      dimensions: [10,10],
      projectileSpeed: -10,
      markedForDeletion: false,
      image: bulletImage,
      Draw() {
        context.drawImage(bullet.image, bullet.origin[0], bullet.origin[1], bullet.dimensions[0], bullet.dimensions[1]);
      }

    }
    bulletArray.push(bullet);
  },
  Fire() {
    ship.bulletCreate();
  }
}
})();



let InputHandler = (() => {
  document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowLeft":
            ship.horizontalSpeed = -ship.maxSpeed;
            // ship.Draw();
            break;
        case "ArrowRight":
            ship.horizontalSpeed = ship.maxSpeed;
            // ship.Draw();
            break;
        case ' ':
          if (ship.canShoot) {
            ship.hasFired = true;
            ship.canShoot = false;
            break;
          }
        default:
    }
  })
  document.addEventListener("keyup", event => {
    switch (event.key) {
        case "ArrowLeft":
            ship.horizontalSpeed = 0;
        case "ArrowRight":
            ship.horizontalSpeed = 0;
        case ' ':
            ship.hasFired = false;
            break;
        default:       
    }
  })
})();
let invaderCreate = (() => {
  for (let row = 1; row <= 5; row++){
    let rowArray = []
    for (let alien = 1; alien <= 11; alien++){
      const invader = {
        origin: [
          (((window.innerWidth / 20) * alien) - (window.innerWidth / 40) / 2),
          ((window.innerHeight / 20) + (row * 30) + 1)
        ],
        health: 2,
        counter: 0,
        speedModifier: 0,
        image: alienImage1,
        dimensions: [
          window.innerWidth / 50,
          window.innerHeight / 30,
        ],
        markedForDeletion: false,
        canShoot: false,
        color: () => {
          switch(invader.health){
            case 2:
              return 'green'
            case 1:
              return 'yellow'
            case 0: 
              return 'red'
            default:
              return 'green'
          }
        },
        bulletCreate() {
          const bullet = {
            origin: [invader.origin[0] + invader.dimensions[0] / 2, (invader.origin[1]) + 5],
            dimensions: [10,10],
            projectileSpeed: 5,
            markedForDeletion: false,
            image: bulletImage,
            Draw() {
              context.drawImage(bullet.image, bullet.origin[0], bullet.origin[1], bullet.dimensions[0], bullet.dimensions[1]);
            }
      
          }
          if (invaderBulletArray.length < 5)
          invaderBulletArray.push(bullet);
        },
        Draw() {
          if (invader.counter === 0){
            invader.image = alienImage1;
          } 
          if (invader.counter === 60) {
            invader.image = alienImage2;
            invader.counter = -60;
          }
          if (invader.markedForDeletion === false)
            context.drawImage(invader.image, invader.origin[0], invader.origin[1], invader.dimensions[0], invader.dimensions[1]); 
      },
      Move(){
        if (invader.isForward){
          invader.origin[0] += 1 + this.speedModifier;
          invader.counter++;
          if (invader.origin[0] > window.innerWidth - 100){
            willFlip = true;
          }
        }
        else if (!invader.isForward){
          invader.origin[0] -= 1 + this.speedModifier;
          invader.counter++;
          if (invader.origin[0] < 10) {
            willFlip = true;
          }    
       }
      },
      Shift(){
        if (invader.isForward){
          invader.isForward = false;
          invader.origin[1] += 10;
          invader.speedModifier += .2;
        }
        else if (!invader.isForward){
          invader.isForward = true;
          invader.origin[1] += 10;
          invader.speedModifier += .2;
        }
      },
        isForward: true
      }
      if (row === 5) {
        invader.canShoot = true;
      }
      rowArray.push(invader);
    }
    invaderArray.push(rowArray);
  }
})();
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function drawBackground() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.fillStyle = 'black';
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  context.fillStyle = 'brown';
  context.fillRect(0, window.innerHeight - (window.innerHeight / 10),
  window.innerWidth - 50, window.innerHeight / 10);
}
function drawBullets() {
  bulletArray.forEach (bullet => {
    context.drawImage(bullet.image, bullet.origin[0], bullet.origin[1], bullet.dimensions[0], bullet.dimensions[1])
    bullet.origin[1] += bullet.projectileSpeed;
  })
}
function drawObjects() {
  bulletArray.forEach(bullet => {
    bullet.origin[1] += bullet.projectileSpeed;
    bullet.Draw();
  let leftX = bullet.origin[0];
  let rightX = bullet.origin[0] + bullet.dimensions[0];
  let topY = bullet.origin[1];
  let bottomY = bullet.origin[1] + bullet.dimensions[1];
    if ((checkWithinObject(leftX, topY)) 
    || (checkWithinObject(leftX, bottomY)) 
    || (checkWithinObject(rightX, topY)) 
    || (checkWithinObject(rightX, bottomY))) {
      bullet.markedForDeletion = true;
    }
    if (bullet.origin[1] <= 50) {
      bullet.markedForDeletion = true;
    }
  })
  invaderArray.forEach(row => {
    row.forEach(alien => {
      alien.Draw();
    })
  })
  invaderBulletArray.forEach(bullet => {
    bullet.origin[1] += bullet.projectileSpeed;
    bullet.Draw();
    let leftX = bullet.origin[0];
    let rightX = bullet.origin[0] + bullet.dimensions[0];
    let topY = bullet.origin[1];
    let bottomY = bullet.origin[1] + bullet.dimensions[1];
    if ((checkWithinShip(leftX, topY)) 
    || (checkWithinShip(leftX, bottomY)) 
    || (checkWithinShip(rightX, topY)) 
    || (checkWithinShip(rightX, bottomY))) {
      bullet.markedForDeletion = true;
    }
    if (bullet.origin[1] > window.innerHeight - 100){
      bullet.markedForDeletion = true;
    }
  })
  ship.Draw();
};
function deleteObjects() {
  bulletArray = bulletArray.filter(
    bullet => !bullet.markedForDeletion);
  invaderBulletArray = invaderBulletArray.filter(
    bullet => !bullet.markedForDeletion);  
}
function shiftCanShoot() {
  for (let alien = 0; alien < 11; alien++){
    for (let i = 4; i >= 0; i--){
      if (invaderArray[i][alien].markedForDeletion === true){
        if ((i - 1) >= 0){
          invaderArray[i - 1][alien].canShoot = true;
        } else break;
      }
    }
  }
}
function invadersShoot() {
  invaderArray.forEach(row => {
    row.forEach(alien => {
      if (alien.canShoot === true) {
        if (getRandomInt(100) >= 99)
        alien.bulletCreate();
      }
    })
  })
}
function controlShip() {
  ship.Move();  
  if (bulletArray.length === 0){
    ship.canShoot = true;
  }
  if (ship.hasFired && bulletArray.length === 0) {
    ship.bulletCreate();
  }
}
function moveInvaders() {
  invaderArray.forEach(row => {
    row.forEach(alien => {
      alien.Move();
    })
  })
  if (willFlip === true) {
    invaderArray.forEach(row => {
      row.forEach(alien => {
        alien.Shift();     
      })
    })
  }
  willFlip = false;
}
function checkWithinObject(pointX, pointY) {
  let isWithinSomething = false;
  if (pointY < ship.origin[1]){
    invaderArray.forEach(row => {
      row.forEach (alien => {
        let topOfObject = alien.origin[1];
        let bottomOfObject = alien.origin[1] + alien.dimensions[1];
        let leftSideOfObject = alien.origin[0];
        let rightSideOfObject = alien.origin[0] + alien.dimensions[0];
        if ((pointY >= topOfObject) 
         && (pointY <= bottomOfObject) 
         && (pointX >= leftSideOfObject) 
         && (pointX <= rightSideOfObject)) 
         {
           if (alien.markedForDeletion === true){
             return false;
           }
          alien.markedForDeletion = true;
          alien.canShoot = false;
          isWithinSomething = true;
          shiftCanShoot();
         } 
      })
    }) 
  }
  return isWithinSomething;
}
function checkWithinShip(pointX, pointY) {
  let isWithinSomething = false;
  let topOfObject = ship.origin[1];
  let bottomOfObject = ship.origin[1] + ship.dimensions[1];
  let leftSideOfObject = ship.origin[0];
  let rightSideOfObject = ship.origin[0] + ship.dimensions[0];
      if ((pointY >= topOfObject) 
       && (pointY <= bottomOfObject) 
       && (pointX >= leftSideOfObject) 
       && (pointX <= rightSideOfObject)){
        ship.health -= 1;
        if (ship.health <= 0){
          isGameOver = true;
        }
        isWithinSomething = true;
       }
  return isWithinSomething; 
}
function gameOver() {
  if (ship.health <= 0) {
    isGameOver = true;
    // clearInterval(gameLoop);
  }
}
function assignAttributes(element, attributes) {
	Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
}

let gameLoop = (() => {
  const gameLoop = setInterval(() => {
    drawBackground();
    drawObjects();
    controlShip();
    moveInvaders();
    invadersShoot();
    deleteObjects();
    gameOver();
    if (isGameOver){
      context.drawImage(gameover,0,0, window.innerWidth, window.innerHeight);
      clearInterval(gameLoop);
    }
  },1000/60)
})()