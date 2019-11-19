const source = document.createElement('canvas')
assignAttributes(source, {
  id: 'source',
	height: window.innerHeight,
	width: window.innerWidth
})
document.body.appendChild(source)

const context = source.getContext('2d', {alpha: 'false'})
let changeDirection = false;
let willFlip = false;
let isGameOver = false;
//create bricks
const invaderArray = []

for (let row = 1; row <= 5; row++){
  let rowArray = []
  for (let alien = 1; alien <= 11; alien++){
    const invader = {
      origin: [
        (((window.innerWidth / 20) * alien) - (window.innerWidth / 40) / 2),
        ((window.innerHeight / 20) + (row * 30))
      ],
      health: 2,
      dimensions: [
        window.innerWidth / 60,
        window.innerHeight / 99,
      ],
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
      isForward: true
    }
    rowArray.push(invader);
  }
  invaderArray.push(rowArray);
}

const gameLoop = setInterval(() => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'black';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'brown';
    context.fillRect(0, window.innerHeight - (window.innerHeight / 10),
    window.innerWidth - 50, window.innerHeight / 10);
    
invaderArray.forEach(row  => {
  row.forEach(alien => {
    context.fillStyle = alien.color();
    context.fillRect(alien.origin[0], alien.origin[1], alien.dimensions[0], alien.dimensions[1])
    if (alien.isForward){
      alien.origin[0] += 10;
      if (alien.origin[0] > window.innerWidth - 100){
        willFlip = true;
      }
    }
    if (!alien.isForward){
      alien.origin[0] -= 10;
      if (alien.origin[0] < 10) {
        willFlip = true;
      } 
    }
  })
})

invaderArray.forEach(row => {
  row.forEach(alien => {
    if (willFlip === true && alien.isForward === true){
      alien.isForward = false;
      alien.origin[1] += 10;
      if (alien.origin[1] > window.innerHeight * .7){
        context.fillStyle = 'white'
        context.font = '20px Georgia'
        context.fillText('New High Score = INSERT SCORE HERE', 10, 30)
        clearInterval(gameLoop);
      }
    }
    else if (willFlip === true && alien.isForward === false){
      alien.isForward = true;
      alien.origin[1] += 10;
      if (alien.origin[1] > window.innerHeight * .7){
        context.fillStyle = 'white'
        context.font = '20px Georgia'
        context.fillText('New High Score = INSERT SCORE HERE', 10, 30)
        clearInterval(gameLoop);
      }
    }

  })
})
if (isGameOver === true){
  clearInterval(gameLoop);
}
willFlip = false;
},100)

function assignAttributes(element, attributes) {
	Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
}
