let containerId = "game"

let backgroundLoaded = false
let shipLoaded = false
const gameConfig = {
    movementUnit: 5
}
const gameState = {
    shipLocation: {x: 100, y: 100},
    spaceLocation: {x : -500, y: -500}
}

function dealWithKeyboard(e) {
    const { type, key } = e
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

    e.preventDefault()
    // console.log(`${type} detected on key ${key}`)
}


    window.addEventListener("keydown", dealWithKeyboard, false);
window.addEventListener("keypress", dealWithKeyboard, false);
window.addEventListener("keyup", dealWithKeyboard, false);

    const width = 600
    const height = 600

    const ship = document.images[0]
    const space = document.images[2]

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
    // console.log('Game tick')
    // console.log(gameState)
    ctx.drawImage(gameObjects.space, gameState.spaceLocation.x, gameState.spaceLocation.y, gameObjects.space.width / 2, gameObjects.space.height / 2)
    ctx.drawImage(gameObjects.ship, gameState.shipLocation.x, gameState.shipLocation.y, gameObjects.ship.width /2, gameObjects.ship.height / 2)
    request = window.requestAnimationFrame(run);

}


