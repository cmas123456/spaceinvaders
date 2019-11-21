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
let changeDirection = false;
let isGameOver = false;
//create bricks
let invaderArray = [];
let invaderArray2 = [];
let bulletArray = [];
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
        image: alienImage1,
        dimensions: [
          window.innerWidth / 50,
          window.innerHeight / 30,
        ],
        markedForDeletion: false,
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
        Draw() {
          if (invader.counter === 0){
            invader.image = alienImage1;
          } 
          if (invader.counter === 60) {
            invader.image = alienImage2;
            invader.counter = -60;
          }
          context.drawImage(invader.image, invader.origin[0], invader.origin[1], invader.dimensions[0], invader.dimensions[1]); 
          if (invader.isForward){
            invader.origin[0] += 1;
            invader.counter++;
            if (invader.origin[0] > window.innerWidth - 100){
              invader.origin[0] -= 1;
              invaderArray.forEach(row => {
                row.forEach(alien => {
                  alien.isForward = false;
                  alien.origin[1] += 10;
                })
              })
            }
          }
          else if (!invader.isForward){
            invader.origin[0] -= 1;
            invader.counter++;
            if (invader.origin[0] < 10) {
              invaderArray.forEach(row => {
                row.forEach(alien => {
                  alien.isForward = true;
                  alien.origin[1] += 10;
                })
              })
            }    
         }
      },
        isForward: true
      }
      rowArray.push(invader);
    }
    invaderArray.push(rowArray);
  }
})();

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
    // if (bullet.origin[1] <= 50){
    //   bullet.markedForDeletion = true;
    // }
  })
  bulletArray = bulletArray.filter(
    bullet => !bullet.markedForDeletion);
}
function drawObjects() {
  bulletArray.forEach(bullet => {
    bullet.origin[1] += bullet.projectileSpeed;
    bullet.Draw();
    if (bullet.origin[1] <= 50) {
      bullet.markedForDeletion = true;
    }
  let leftX = bullet.origin[0];
  let rightX = bullet.origin[0] + bullet.dimensions[0];
  let topY = bullet.origin[1];
  let bottomY = bullet.origin[1] + bullet.dimensions[1];
  if (
    checkWithinObject(leftX, topY) ||
    checkWithinObject(leftX, bottomY) ||
    checkWithinObject(rightX, topY) ||
    checkWithinObject(rightX, bottomY)
  ) {
     bullet.markedForDeletion = true;
    }
  })
  invaderArray.forEach(row => {
    row.forEach(alien => {
      alien.Draw();
    })
  })
  // invaderArray.forEach(row => {
  //   row.forEach(alien => {
  //     // alien.Draw();
  //     if (willFlip === true && alien.isForward === true){
  //       alien.isForward = false;
  //       alien.origin[1] += 10;
  //     } else if (willFlip === true && alien.isForward === false){
  //       alien.isForward = true;
  //       alien.origin[1] += 10;
  //       }
  //   })
  // })
  // willFlip = false;
  ship.Draw();
};
// function moveInvaders() {
//   invaderArray.forEach(row => {
//     row.forEach(alien => {
//       if (willFlip === true && alien.isForward === true){
//         alien.isForward = false;
//         alien.origin[1] += 10;
//         if (alien.origin[1] > window.innerHeight * .7){
//           context.fillStyle = 'white'
//           context.font = '20px Georgia'
//           context.fillText('New High Score = INSERT SCORE HERE', 10, 30)
//           clearInterval(gameLoop);
//         }
//       }
//       else if (willFlip === true && alien.isForward === false){
//         alien.isForward = true;
//         alien.origin[1] += 10;

//         if (alien.origin[1] > window.innerHeight * .7){
//           context.fillStyle = 'white'
//           context.font = '20px Georgia'
//           context.fillText('New High Score = INSERT SCORE HERE', 10, 30)
//           clearInterval(gameLoop);
//         }
//       }
  
//     })
//   })
//   willFlip = false;
// }
function deleteObjects() {
  bulletArray = bulletArray.filter(
    bullet => !bullet.markedForDeletion);
  invaderArray = invaderArray.filter(row => {
    row = row.filter(alien => !alien.markedForDeletion);
    if (row.length !== 0)
      return row;
  })
}
// function detectCollision() {
//   bulletArray.forEach (bullet => {
//   let leftX = bullet.origin[0];
//   let rightX = bullet.origin[0] + bullet.dimensions[0];
//   let topY = bullet.origin[1];
//   let bottomY = bullet.origin[1] + bullet.dimensions[1];
//   if (
//     checkWithinObject(leftX, topY) ||
//     checkWithinObject(leftX, bottomY) ||
//     checkWithinObject(rightX, topY) ||
//     checkWithinObject(rightX, bottomY)
//    ) {
//      bullet.markedForDeletion = true;
//    }
//   })
// }
function checkWithinObject(pointX, pointY) {
  invaderArray.forEach(row => {
    row.forEach (alien => {
      let topOfObject = alien.origin[1];
      let bottomOfObject = alien.origin[1] + alien.dimensions[1];
      let leftSideOfObject = alien.origin[0];
      let rightSideOfObject = alien.origin[0] + alien.dimensions[0];
      if (
        pointY >= topOfObject &&
        pointY <= bottomOfObject &&
        pointX >= leftSideOfObject &&
        pointX <= rightSideOfObject
      ) {
        alien.markedForDeletion = true;
        console.log(alien);
      }
    })
  }) 
}
function assignAttributes(element, attributes) {
	Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
}

let gameLoop = (() => {
  const gameLoop = setInterval(() => {
    drawBackground();
    ship.Move();  
    if (bulletArray.length === 0){
      ship.canShoot = true;
    }
    if (ship.hasFired && bulletArray.length === 0) {
      ship.bulletCreate();
    }
    drawObjects();
    deleteObjects();
    // moveInvaders();
    // drawBullets();
    // ship.Draw();
    // detectCollision();
    // drawInvaders();
  },1000/60)
})();