let containerId = 'game'

const gameObjects = {}
const gameConfig = {
  movementUnit: 5,
  width: 800,
  height: 600,
}
const gameState = {
  loaded: false,
  shipLocation: { x: 100, y: 100 },
  spaceLocation: { x: -500, y: -500 },
  missiles: [],
  frameRequest: 0,
  shipLoaded: false,
  backgroundLoaded: false
}

function isGameLoaded() {
    if (gameObjects === {}) {
        console.error(`Empty gameObject in gameLoop`)
        gameState.frameRequest = window.requestAnimationFrame(run)
        return false
      }
    if (gameState.backgroundLoaded && gameState.shipLoaded) {
        document.getElementById("loadingScreen").style.visibility = 'hidden'
        gameState.loaded = true
        return true
    }
    return false
}

// [{ x: number, y: number }]

function drawMissile(missile) {
  let x = missile.x + gameObjects.ship.width / 4
  const { ctx } = gameState
  ctx.strokeStyle = 'red'
  ctx.beginPath()
  ctx.moveTo(x, missile.y) // Move the pen to (30, 50)
  ctx.lineTo(x, missile.y - 20) // Draw a line to (150, 100)
  ctx.lineWidth = 2
  ctx.stroke()
}

function moveLeft(params) {}

function dealWithKeyboard(e) {
  const { type, key, code } = e
  const { movementUnit } = gameConfig

  if (type === 'keydown' && key === 'ArrowRight') {
    gameState.shipLocation.x = gameState.shipLocation.x + movementUnit
    gameState.spaceLocation.x = gameState.spaceLocation.x + movementUnit / 2
    e.preventDefault()
    return
  }
  if (type === 'keydown' && key === 'ArrowLeft') {
    gameState.shipLocation.x = gameState.shipLocation.x - movementUnit
    gameState.spaceLocation.x = gameState.spaceLocation.x - movementUnit / 2
    e.preventDefault()
    return
  }
  if (type === 'keydown' && key === 'ArrowUp') {
    gameState.shipLocation.y = gameState.shipLocation.y - movementUnit
    gameState.spaceLocation.y = gameState.spaceLocation.y - movementUnit / 2
    e.preventDefault()
    return
  }
  if (type === 'keydown' && key === 'ArrowDown') {
    gameState.shipLocation.y = gameState.shipLocation.y + movementUnit
    gameState.spaceLocation.y = gameState.spaceLocation.y + movementUnit / 2
    e.preventDefault()
    return
  }

  if (type === 'keydown' && code === 'Space') {
    gameState.missiles.push({
      x: gameState.shipLocation.x,
      y: gameState.shipLocation.y,
    })
    e.preventDefault()
    return
  }

  if (type === 'keyup' && code === 'Space') {
    gameState.missiles = gameState.missiles.filter(missile => {
      return missile.x !== gameState.shipLocation.x
    })
    e.preventDefault()
    return
  }

  e.preventDefault()
  // console.log(`${type} detected on key (${key}) / (${code})`)
}

function run() {
  if (!isGameLoaded()) {
    gameState.frameRequest = window.requestAnimationFrame(run)
    return
  }

  const { ctx } = gameState
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.drawImage(
    gameObjects.space,
    gameState.spaceLocation.x,
    gameState.spaceLocation.y,
    gameObjects.space.width / 2,
    gameObjects.space.height / 2
  )
  ctx.drawImage(
    gameObjects.ship,
    gameState.shipLocation.x,
    gameState.shipLocation.y,
    gameObjects.ship.width / 2,
    gameObjects.ship.height / 2
  )
  gameState.missiles.forEach(missile => {
    drawMissile(missile)
  })
  gameState.frameRequest = window.requestAnimationFrame(run)
}

function init() {
  window.addEventListener('keydown', dealWithKeyboard, false)
  window.addEventListener('keypress', dealWithKeyboard, false)
  window.addEventListener('keyup', dealWithKeyboard, false)

  const ship = document.images[0]
  const space = document.images[2]

  let body = document.getElementById(containerId)
  let canvas = document.createElement("canvas")
  canvas.setAttribute("id", "gameCanvas")
  canvas.setAttribute("width", 800)
  canvas.setAttribute("height", 600)
  body.appendChild(canvas)
  
  gameState.ctx = canvas.getContext('2d')

  space.onload = function() {
    // At this point, the image is fully loaded
    // So do your thing!
    gameState.backgroundLoaded = true
  }

  ship.onload = function() {
    // At this point, the image is fully loaded
    // So do your thing!
    gameState.shipLoaded = true
  }
  gameObjects.space = space
  gameObjects.ship = ship
  gameState.frameRequest = window.requestAnimationFrame(run)
}

window.onload = init()
