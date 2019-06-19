let containerId = "game"

let backgroundLoaded = false
let shipLoaded = false
const gameConfig = {
    movementUnit: 5,
    width: 800,
    height: 600
}
const gameState = {
    shipLocation: {x: 100, y: 100},
    spaceLocation: {x : -500, y: -500},
    missiles: []
}

// [{ x: number, y: number }]

function drawMissile(missile) {
    console.log(`Drawing missile`)
    let x = (missile.x  + (gameObjects.ship.width / 4))
    ctx.strokeStyle = "red"
    ctx.beginPath(); 
    ctx.moveTo(x, missile.y);    // Move the pen to (30, 50)
    ctx.lineTo(x, missile.y - 20);  // Draw a line to (150, 100)
    ctx.lineWidth = 2;
    ctx.stroke();
}

function moveLeft(params) {
    
}

function dealWithKeyboard(e) {
    const { type, key, code } = e
    const { movementUnit } = gameConfig


    if(type === 'keydown' && key === 'ArrowRight') {
        gameState.shipLocation.x = gameState.shipLocation.x + movementUnit
        gameState.spaceLocation.x = gameState.spaceLocation.x + (movementUnit / 2)
        // request = window.requestAnimationFrame(run);
        e.preventDefault()
        return
    }
    if(type === 'keydown' && key === 'ArrowLeft') {
        gameState.shipLocation.x = gameState.shipLocation.x - movementUnit
        gameState.spaceLocation.x = gameState.spaceLocation.x - (movementUnit / 2)
        // request = window.requestAnimationFrame(run);
        e.preventDefault()
        return
    }
    if(type === 'keydown' && key === 'ArrowUp') {
        gameState.shipLocation.y = gameState.shipLocation.y - movementUnit
        gameState.spaceLocation.y = gameState.spaceLocation.y - (movementUnit / 2)
        // request = window.requestAnimationFrame(run);
        e.preventDefault()
        return
    }
    if(type === 'keydown' && key === 'ArrowDown') {
        gameState.shipLocation.y = gameState.shipLocation.y + movementUnit
        gameState.spaceLocation.y = gameState.spaceLocation.y + (movementUnit / 2)
        // request = window.requestAnimationFrame(run);
        e.preventDefault()
        return
    }

    if(type === 'keydown' && code === 'Space') {
        gameState.missiles.push({
            x: gameState.shipLocation.x, 
            y: gameState.shipLocation.y
        })
        e.preventDefault()
        return
    }

    if (type === 'keyup' && code === 'Space') {
        gameState.missiles = gameState.missiles.filter((missile) => {
            return missile.x !== gameState.shipLocation.x
        })
        e.preventDefault()
        return
    }

    e.preventDefault()
    console.log(`${type} detected on key (${key}) / (${code})`)
}


    window.addEventListener("keydown", dealWithKeyboard, false);
window.addEventListener("keypress", dealWithKeyboard, false);
window.addEventListener("keyup", dealWithKeyboard, false);



    const ship = document.images[0]
    const space = document.images[2]

    let body = document.getElementById(containerId)
    let canvas = document.createElement("canvas")
    canvas.setAttribute("id", "canvas")
    canvas.setAttribute("width", gameConfig.width)
    canvas.setAttribute("height", gameConfig.height)
    body.appendChild(canvas)
    
    const ctx = canvas.getContext('2d');

    space.onload = function() {

        // At this point, the image is fully loaded
        // So do your thing!
        backgroundLoaded = true
    
    };

    ship.onload = function() {

        // At this point, the image is fully loaded
        // So do your thing!
        shipLoaded = true
    
    };
    let gameObjects = {space, ship}
    let request = window.requestAnimationFrame(run);

function run() {
    if (!backgroundLoaded || !shipLoaded) {
        request = window.requestAnimationFrame(run);
        return
    }
    if (gameObjects === {}) {
        console.error(`Empty gameObject in gameLoop`)
        request = window.requestAnimationFrame(run);
        return

    }
    // console.log('Game tick')
    // console.log(gameState)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(gameObjects.space, gameState.spaceLocation.x, gameState.spaceLocation.y, gameObjects.space.width / 2, gameObjects.space.height / 2)
    ctx.drawImage(gameObjects.ship, gameState.shipLocation.x, gameState.shipLocation.y, gameObjects.ship.width /2, gameObjects.ship.height / 2)
    gameState.missiles.forEach((missile) => {
        drawMissile(missile)
    })
    request = window.requestAnimationFrame(run);

}


