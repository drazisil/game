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
  spaceLoaded: false,
  keys: [],
}

function isGameLoaded() {
  if (gameObjects === {}) {
    console.error(`Empty gameObject in gameLoop`)
    gameState.frameRequest = window.requestAnimationFrame(run)
    return false
  }
  if (gameState.spaceLoaded && gameState.shipLoaded) {
    document.getElementById('loadingScreen').style.visibility = 'hidden'
    gameState.loaded = true
    return true
  }
  return false
}

function removeMissile(missile) {
  gameState.missiles = gameState.missiles.filter(missile => {
    return missile.x !== gameState.shipLocation.x
  })
}

function moveMissile(missile) {
  if (missile.y <= 0) {
  }
  missile.y = missile.y - 5
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

function keysPressed(e) {
  console.log(e.code)
  switch (e.code) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Space':
      e.preventDefault()
      break
  }
  gameState.keys[e.code] = true
}

function keysReleased(e) {
  gameState.keys[e.code] = false
}

function handleKeys() {
  const { movementUnit } = gameConfig

  if (gameState.keys['ArrowRight']) {
    gameState.shipLocation.x = gameState.shipLocation.x + movementUnit
    gameState.spaceLocation.x = gameState.spaceLocation.x + movementUnit / 2
  }
  if (gameState.keys['ArrowLeft']) {
    gameState.shipLocation.x = gameState.shipLocation.x - movementUnit
    gameState.spaceLocation.x = gameState.spaceLocation.x - movementUnit / 2
  }
  if (gameState.keys['ArrowUp']) {
    gameState.shipLocation.y = gameState.shipLocation.y - movementUnit
    gameState.spaceLocation.y = gameState.spaceLocation.y - movementUnit / 2
  }
  if (gameState.keys['ArrowDown']) {
    gameState.shipLocation.y = gameState.shipLocation.y + movementUnit
    gameState.spaceLocation.y = gameState.spaceLocation.y + movementUnit / 2
  }

  if (gameState.keys['Space']) {
    gameState.missiles.push({
      x: gameState.shipLocation.x,
      y: gameState.shipLocation.y,
    })
  }
}

function drawSpace() {
  const { ctx } = gameState
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.drawImage(
    gameObjects.space,
    gameState.spaceLocation.x,
    gameState.spaceLocation.y,
    gameObjects.space.width / 2,
    gameObjects.space.height / 2
  )
}

function drawShip() {
  const { ctx } = gameState
  ctx.drawImage(
    gameObjects.ship,
    gameState.shipLocation.x,
    gameState.shipLocation.y,
    gameObjects.ship.width / 2,
    gameObjects.ship.height / 2
  )
}

function run() {
  if (!isGameLoaded()) {
    gameState.frameRequest = window.requestAnimationFrame(run)
    return
  }

  handleKeys()
  drawSpace()
  drawShip()

  gameState.missiles.forEach(missile => {
    moveMissile(missile)
  })
  gameState.missiles.forEach(missile => {
    drawMissile(missile)
  })
  gameState.frameRequest = window.requestAnimationFrame(run)
}

function init() {
  window.addEventListener('keydown', keysPressed, false)
  window.addEventListener('keyup', keysReleased, false)

  const ship = document.images[0]
  const space = document.images[2]

  let body = document.getElementById(containerId)
  let canvas = document.createElement('canvas')
  canvas.setAttribute('id', 'gameCanvas')
  canvas.setAttribute('width', 800)
  canvas.setAttribute('height', 600)
  body.appendChild(canvas)

  gameState.ctx = canvas.getContext('2d')

  space.onload = function() {
    gameState.spaceLoaded = true
  }

  ship.onload = function() {
    gameState.shipLoaded = true
  }
  gameObjects.space = space
  gameObjects.ship = ship
  gameState.frameRequest = window.requestAnimationFrame(run)
}

window.onload = init()
