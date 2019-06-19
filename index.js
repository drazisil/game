let containerId = "game"

let backgroundLoaded = false
let shipLoaded = false
const gameConfig = {
    movementUnit: 10
}
const gameState = {
    shipLocation: {x: 100, y: 100}
}

function dealWithKeyboard(e) {
    const { type, key } = e
    const { movementUnit } = gameConfig


    if(type === 'keyup' && key === 'ArrowRight') {
        gameState.shipLocation.x = gameState.shipLocation.x + movementUnit
        return
    }
    if(type === 'keyup' && key === 'ArrowLeft') {
        gameState.shipLocation.x = gameState.shipLocation.x - movementUnit
        return
    }
    if(type === 'keyup' && key === 'ArrowUp') {
        gameState.shipLocation.y = gameState.shipLocation.y - movementUnit
        return
    }
    if(type === 'keyup' && key === 'ArrowDown') {
        gameState.shipLocation.y = gameState.shipLocation.y + movementUnit
        return
    }

    e.preventDefault()
    console.log(`${type} detected on key ${key}`)
}


    window.addEventListener("keydown", dealWithKeyboard, false);
window.addEventListener("keypress", dealWithKeyboard, false);
window.addEventListener("keyup", dealWithKeyboard, false);

    const width = 600
    const height = 600

    const ship = document.images[0]
    const space = document.images[1]

    let body = document.getElementById(containerId)
    let canvas = document.createElement("canvas")
    canvas.setAttribute("id", "canvas")
    canvas.setAttribute("width", width)
    canvas.setAttribute("height", height)
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
    console.log('Game tick')
    console.log(gameState)
    ctx.drawImage(gameObjects.space, 0, 0)
    ctx.drawImage(gameObjects.ship, gameState.shipLocation.x, gameState.shipLocation.y)
    request = window.requestAnimationFrame(run);

}


