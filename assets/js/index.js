let containerId = 'game'

const gameObjects = {
  enemies: []
}
const gameConfig = {
  movementUnit: 5,
  width: 800,
  height: 600,
  missileInterval: 20,
  missileLength: 20,
  defaultShipLocation: { x: 100, y: 400 },
  defaultSpaceLocation: { x: -1000, y: -1000 },
}
const gameState = {
  loaded: false,
  spaceLocation: { x: -500, y: -500 },
  missiles: [], // All missiles in game
  frameRequest: 0,
  shipLoaded: false,
  spaceLoaded: false,
  missileTimer: 60,
  keys: [], // Keys they are currently pressed
}

function areEnimiesLoaded() {
  return gameState.enemy1Loaded
}

function resetGame() {
  gameObjects.ship.x = gameConfig.defaultShipLocation.x
  gameObjects.ship.y = gameConfig.defaultShipLocation.y

  gameState.spaceLocation.x = gameConfig.defaultSpaceLocation.x
  gameState.spaceLocation.y = gameConfig.defaultSpaceLocation.y
}

function isGameLoaded() {
  if (gameObjects === {}) {
    console.error(`Empty gameObject in gameLoop`)
    gameState.frameRequest = window.requestAnimationFrame(run)
    return false
  }
  if (gameState.spaceLoaded && gameState.shipLoaded && areEnimiesLoaded() ) {
    document.getElementById('loadingScreen').style.visibility = 'hidden'
    gameState.loaded = true
    return true
  }
  return false
}

function addMissile(missileX, missileY) {
  if (gameState.missileTimer >= 0) {
    return
  }
  gameState.missiles.push({
    x: missileX,
    y: missileY,
    height: gameConfig.missileLength
  })
  gameState.missileTimer = gameConfig.missileInterval
}

function removeMissile(missileY) {
  gameState.missiles = gameState.missiles.filter(missile => {
    return missile.y !== missileY
  })
}

function moveMissile(missile) {
  if (missile.y <= 0) {
    removeMissile(missile.y)
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
  ctx.lineTo(x, missile.y - missile.height) // Draw a line to (150, 100)
  ctx.lineWidth = 2
  ctx.stroke()
}

function moveUp() {
  if ((gameObjects.ship.y - gameConfig.movementUnit) < 0) {
    return
  }
  gameObjects.ship.y = gameObjects.ship.y - gameConfig.movementUnit
  gameState.spaceLocation.y = gameState.spaceLocation.y - gameConfig.movementUnit / 2
}

function moveDown() {
  if (((gameObjects.ship.y + gameObjects.ship.height) + gameConfig.movementUnit) > gameState.ctx.canvas.height) {
    return
  }
  gameObjects.ship.y = gameObjects.ship.y + gameConfig.movementUnit
  gameState.spaceLocation.y = gameState.spaceLocation.y + gameConfig.movementUnit / 2
}


function moveLeft() {
  if ((gameObjects.ship.x - gameConfig.movementUnit) < 0) {
    return
  }
  gameObjects.ship.x = gameObjects.ship.x - gameConfig.movementUnit
  gameState.spaceLocation.x = gameState.spaceLocation.x - gameConfig.movementUnit / 2
}

function moveRight() {
  if (((gameObjects.ship.x + gameObjects.ship.width) + gameConfig.movementUnit) > gameState.ctx.canvas.width) {
    return
  }
  gameObjects.ship.x = gameObjects.ship.x + gameConfig.movementUnit
  gameState.spaceLocation.x = gameState.spaceLocation.x + gameConfig.movementUnit / 2
}

function keysPressed(e) {
  switch (e.code) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Space':
    case 'Escape':
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
    moveRight()
  }
  if (gameState.keys['ArrowLeft']) {
    moveLeft()
  }
  if (gameState.keys['ArrowUp']) {
    moveUp()
  }
  if (gameState.keys['ArrowDown']) {
    moveDown()
  }

  if (gameState.keys['Space']) {
    addMissile(gameObjects.ship.x, gameObjects.ship.y)
  }

  if (gameState.keys['Escape']) {
    console.log(`Resetting`)
    gameState.keys['Escape'] = false
    resetGame()
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

function drawEnemy(enemy) {
  if (enemy.hidden) {
    return
  }
  const { ctx } = gameState
  ctx.drawImage(
    enemy.data,
    enemy.x,
    enemy.y,
    enemy.width,
    enemy.height
  )
}

function drawShip() {
  const { ctx } = gameState
  ctx.drawImage(
    gameObjects.ship.data,
    gameObjects.ship.x,
    gameObjects.ship.y,
    gameObjects.ship.width,
    gameObjects.ship.height
  )
}

function checkHit() {
  gameObjects.enemies.map((enemy) => {
    gameState.missiles.map((missile) => {
      if ((missile.y - missile.height) <= enemy.y) {
        enemy.hidden = true
      }
    })
  })
}

function run() {
  if (!isGameLoaded()) {
    gameState.frameRequest = window.requestAnimationFrame(run)
    return
  }

  handleKeys()
  drawSpace()
  drawShip()
  drawEnemy(gameObjects.enemies[0])

  gameState.missiles.forEach(missile => {
    moveMissile(missile)
  })

  checkHit()

  gameState.missiles.forEach(missile => {
    drawMissile(missile)
  })
  gameState.missileTimer--
  gameState.frameRequest = window.requestAnimationFrame(run)
}

function init() {
  window.addEventListener('keydown', keysPressed, false)
  window.addEventListener('keyup', keysReleased, false)

  const ship = document.images[0]
  const space = document.images[2]
  const enemy1 = document.images[3]

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
    gameObjects.ship = { 
      data: ship, 
      x: gameConfig.defaultShipLocation.x, 
      y: gameConfig.defaultShipLocation.y,
      width: ship.width / 2,
      height: ship.height / 2
    }
    gameState.shipLoaded = true
  }

  enemy1.onload = function() {
    gameObjects.enemies.push( { 
      id: 1,
      data: enemy1,
      x: 100,
      y: 50,
      hidden: false,
      width: (enemy1.width / 4),
      height: (enemy1.height / 4)
    } )
    gameState.enemy1Loaded = true
  }


  gameObjects.space = space
  
  
  gameState.frameRequest = window.requestAnimationFrame(run)
}

window.onload = init()
