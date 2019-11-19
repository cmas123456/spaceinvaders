const source = document.createElement('canvas')
assignAttributes(source, {
	id: 'source',
	height: window.innerHeight,
	width: window.innerWidth
})
document.body.appendChild(source)

const context = source.getContext('2d', {alpha: 'false'})
let isForward = true;

//create bricks
const invaderArray = []

for (let row = 1; row <= 5; row++){
  for (let alien = 1; alien <= 11; alien++){
    let rowArray = [];
    const invader = {
      origin: [
        ((window.innerWidth / 11) * alien ) - ((window.innerWidth / 22) / 2),
        ((window.innerHeight / 20) + (row * 10))
      ],
      health: 2,
      dimensions: [
        window.innerWidth / 10,
        window.innerHeight / 20,
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
      }
    }
    rowArray.push(invader);
  }
  invaderArray.push(rowArray);
}
// for (let index = 1; index <= 5; index++){
//     const invader = {
//         origin: [
//             ((window.innerWidth / 10) * index ) - ((window.innerWidth / 20) / 2),
// 			(window.innerHeight / 20)
//         ],
//         health: 2,
//         dimensions: [
//             window.innerWidth / 20,
//             window.innerHeight / 40
//         ],
//         color: () => {
//           switch(invader.health) {
//           case 2:
//             return 'green'
//           case 1: 
//             return 'red'
//           case 0:
//             return 'black'
//           default:
//           return 'green'

//           }
//         }
//    }
//   invaderArray.push(invader);
// }

setInterval(() => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'black';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'brown';
    context.fillRect(0, window.innerHeight - (window.innerHeight / 10),
    window.innerWidth - 50, window.innerHeight / 10);
    
invaderArray.forEach(ele => {
        context.fillStyle = ele.color();
        context.fillRect(ele.origin[0], ele.origin[1], ele.dimensions[0], ele.dimensions[1])
        if (isForward){
        	ele.origin[0] += 10; 
        }
        else if (!isForward){
        	ele.origin[0] -= 10; 
        }
         
})
invaderArray.forEach(ele => {
  if (ele.origin[0] < 10){
        	isForward = true;
        	invaderArray.forEach(ele => {
        	ele.origin[1] += 10;
        	})
        }
        if (ele.origin[0] > window.innerWidth - 100){
        	isForward = false;
        	invaderArray.forEach(ele => {
        	ele.origin[1] += 10;
        	})
        }
  })
},100)
    

function assignAttributes(element, attributes) {
	Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
}