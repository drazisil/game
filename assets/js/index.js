
class GameObject {
  constructor(name, data, x, y, isHidden, width, height) {
    this.name = name
    this.data = data
    this.x = x
    this.y = y
    this.hidden = isHidden
    this.width = width
    this.height = height
  }
}

class Missile {
  constructor (x, y, height, source) {
    this.x = x
    this.y = y
    this.height = height
    this.source = source
  }
}

class Game {
  constructor() {
    this.containerId = 'game'

    this.gameObjects = {
      enemies: []
    }
    this.gameConfig = {
      movementUnit: 5,
      width: 800,
      height: 600,
      enemyMissileInterval: 60,
      shipMissileInterval: 20,
      missileLength: 20,
      defaultShipLocation: { x: 100, y: 400 },
      defaultSpaceLocation: { x: -1000, y: -1000 },
    }
    this.gameState = {
      loaded: false,
      spaceLocation: { x: -500, y: -500 },
      missiles: [], // All missiles in game
      frameRequest: 0,
      shipLoaded: false,
      spaceLoaded: false,
      enemyMissileTimer: 60,
      shipMissileTimer: 60,
      keys: [], // Keys they are currently pressed
    }
  
  }
  
  areEnimiesLoaded() {
    return this.gameState.enemy1Loaded
  }
  
  resetGame() {
    this.gameObjects.ship.x = this.gameConfig.defaultShipLocation.x
    this.gameObjects.ship.y = this.gameConfig.defaultShipLocation.y
  
    this.gameState.spaceLocation.x = this.gameConfig.defaultSpaceLocation.x
    this.gameState.spaceLocation.y = this.gameConfig.defaultSpaceLocation.y
    this.gameObjects.enemies.map((enemy) => {
          enemy.hidden = false
    })
    document.getElementById('winScreen').style.visibility = 'hidden'
  }
  
  isGameLoaded() {
    if (this.gameObjects === {}) {
      console.error(`Empty gameObject in gameLoop`)
      this.gameState.frameRequest = window.requestAnimationFrame(run)
      return false
    }
    if (this.gameState.spaceLoaded && this.gameState.shipLoaded && this.areEnimiesLoaded() ) {
      document.getElementById('loadingScreen').style.visibility = 'hidden'
      this.gameState.loaded = true
      return true
    }
    return false
  }
  
  addMissile(missileX, missileY, source) {
    if (source === 'ship' && this.gameState.shipMissileTimer >= 0) {
      return
    }
    if (source === 'enemy' && this.gameState.enemyMissileTimer >= 0) {
      return
    }
    this.gameState.missiles.push(new Missile(
      missileX, 
      missileY, 
      this.gameConfig.missileLength, 
      source))
    this.gameState.shipMissileTimer = this.gameConfig.shipMissileInterval
    this.gameState.enemyMissileTimer = this.gameConfig.enemyMissileInterval
  }
  
  removeMissile(missileY) {
    this.gameState.missiles = this.gameState.missiles.filter(missile => {
      return missile.y !== missileY
    })
  }
  
  moveMissileUp(missile) {
    if (missile.y <= 0) {
      this.removeMissile(missile.y)
    }
    missile.y = missile.y - 5
  }

  moveMissileDown(missile) {
    if (missile.y >= this.gameState.ctx.canvas.height) {
      this.removeMissile(missile.y)
    }
    missile.y = missile.y + 5
  }
  
  moveMissile(missile) {
    if (missile.source === 'ship') {
      this.moveMissileUp(missile)
    }
    if (missile.source === 'enemy') {
      this.moveMissileDown(missile)
    }
  }
  
  // [{ x: number, y: number }]
  
  drawMissile(missile) {
    const { ctx } = this.gameState
    if (missile.source === 'ship') {
      ctx.strokeStyle = 'red'
    }
    if (missile.source === 'enemy') {
      ctx.strokeStyle = 'blue'
    }

    ctx.beginPath()
    ctx.moveTo(missile.x, missile.y) // Move the pen to (30, 50)
    ctx.lineTo(missile.x, missile.y - missile.height) // Draw a line to (150, 100)
    ctx.lineWidth = 2
    ctx.stroke()
  }
  
  moveUp() {
    if ((this.gameObjects.ship.y - this.gameConfig.movementUnit) < (this.gameState.ctx.canvas.height - (this.gameState.ctx.canvas.height / 2))) {
      return
    }
    this.gameObjects.ship.y = this.gameObjects.ship.y - this.gameConfig.movementUnit
    this.gameState.spaceLocation.y = this.gameState.spaceLocation.y - this.gameConfig.movementUnit / 2
  }
  
  moveDown() {
    if (((this.gameObjects.ship.y + this.gameObjects.ship.height) + this.gameConfig.movementUnit) > this.gameState.ctx.canvas.height) {
      return
    }
    this.gameObjects.ship.y = this.gameObjects.ship.y + this.gameConfig.movementUnit
    this.gameState.spaceLocation.y = this.gameState.spaceLocation.y + this.gameConfig.movementUnit / 2
  }
  
  
  moveLeft() {
    if ((this.gameObjects.ship.x - this.gameConfig.movementUnit) < 0) {
      return
    }
    this.gameObjects.ship.x = this.gameObjects.ship.x - this.gameConfig.movementUnit
    this.gameState.spaceLocation.x = this.gameState.spaceLocation.x - this.gameConfig.movementUnit / 2
  }
  
  moveRight() {
    if (((this.gameObjects.ship.x + this.gameObjects.ship.width) + this.gameConfig.movementUnit) > this.gameState.ctx.canvas.width) {
      return
    }
    this.gameObjects.ship.x = this.gameObjects.ship.x + this.gameConfig.movementUnit
    this.gameState.spaceLocation.x = this.gameState.spaceLocation.x + this.gameConfig.movementUnit / 2
  }
  
  keysPressed(e) {
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
    this.gameState.keys[e.code] = true
  }
  
  keysReleased(e) {
    this.gameState.keys[e.code] = false
  }
  
  handleKeys() {
    const { movementUnit } = this.gameConfig
  
    if (this.gameState.keys['ArrowRight']) {
      this.moveRight()
    }
    if (this.gameState.keys['ArrowLeft']) {
      this.moveLeft()
    }
    if (this.gameState.keys['ArrowUp']) {
      this.moveUp()
    }
    if (this.gameState.keys['ArrowDown']) {
      this.moveDown()
    }
  
    if (this.gameState.keys['Space']) {
      this.addMissile(this.gameObjects.ship.x + (this.gameObjects.ship.width / 2), this.gameObjects.ship.y, 'ship')
    }
  
    if (this.gameState.keys['Escape']) {
      this.gameState.keys['Escape'] = false
      this.resetGame()
    }
  }
  
  drawSpace() {
    const { ctx } = this.gameState
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(
      this.gameObjects.space,
      this.gameState.spaceLocation.x,
      this.gameState.spaceLocation.y,
      this.gameObjects.space.width / 2,
      this.gameObjects.space.height / 2
    )
  }
  
  drawEnemy(enemy) {
    if (enemy.hidden) {
      return
    }
    const { ctx } = this.gameState
    ctx.drawImage(
      enemy.data,
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    )
  }
  
  drawShip() {
    const { ctx } = this.gameState
    ctx.drawImage(
      this.gameObjects.ship.data,
      this.gameObjects.ship.x,
      this.gameObjects.ship.y,
      this.gameObjects.ship.width,
      this.gameObjects.ship.height
    )
  }
  
  isBetween(number, first, second) {
    return (number >= first) && (number <= second)
  }

  checkHitEnemy(missile) {
    if (((missile.y - missile.height) <= enemy.y) && this.isBetween(missile.x, enemy.x, (enemy.x + enemy.width))) {
      enemy.hidden = true
      return
    }
  }
  
  checkHitShip(missile) {
    const { ship } = this.gameObjects
    if (((missile.y - missile.height) >= ship.y) && this.isBetween(missile.x, ship.x, (ship.x + ship.width))) {
      ship.hidden = true
      return
    }
  }

  checkHit() {
    const { ship, enemies } = this.gameObjects
    enemies.map((enemy) => {
      this.gameState.missiles.map((missile) => {
        if (missile.source === 'ship') {
          this.checkHitEnemy(missile)
        }
        if (missile.source === 'enemy') {
          this.checkHitShip(missile)
        }
      })
    })
  
    const remainingEnemies = enemies.filter((enemy) => {
      return !enemy.hidden
    })
  
    if (remainingEnemies.length === 0) {
      document.getElementById('winScreen').style.visibility = 'visible'
    }

    if (ship.hidden === true) {
      document.getElementById('loseScreen').style.visibility = 'visible'
    }
  }
  
  run() {
    if (!this.isGameLoaded()) {
      this.gameState.frameRequest = window.requestAnimationFrame(this.run.bind(this))
      return
    }
  
    this.handleKeys()
    this.drawSpace()
    this.drawShip()
    this.drawEnemy(this.gameObjects.enemies[0])

    // Add enemy missiles
    this.gameObjects.enemies.forEach((enemy) => {

      this.addMissile(enemy.x + (enemy.width / 2), enemy.y + enemy.height + this.gameConfig.missileLength, 'enemy')
    })
  
    this.gameState.missiles.forEach(missile => {
      this.moveMissile(missile)
    })
  
    this.checkHit()
  
    this.gameState.missiles.forEach(missile => {
      this.drawMissile(missile)
    })
    this.gameState.enemyMissileTimer--
    this.gameState.shipMissileTimer--
    this.gameState.frameRequest = window.requestAnimationFrame(this.run.bind(this))
  }
  
  init() {
    const game = this
    window.addEventListener('keydown', this.keysPressed.bind(this), false)
    window.addEventListener('keyup', this.keysReleased.bind(this), false)
  
    const ship = document.images[0]
    const space = document.images[2]
    const enemy1 = document.images[3]
  
    let body = document.getElementById(this.containerId)
    let canvas = document.createElement('canvas')
    canvas.setAttribute('id', 'gameCanvas')
    canvas.setAttribute('width', 800)
    canvas.setAttribute('height', 600)
    body.appendChild(canvas)
  
    this.gameState.ctx = canvas.getContext('2d')
  
    space.onload = function() {
      game.gameState.spaceLoaded = true
    }
  
    ship.addEventListener('load', function() {
      game.gameObjects.ship = new GameObject(
        'ship', 
        ship, 
        game.gameConfig.defaultShipLocation.x, 
        game.gameConfig.defaultShipLocation.y,
        'false',
        ship.width / 2,
        ship.height / 2
      )
      game.gameState.shipLoaded = true
    })
  
    enemy1.onload = function() {
      game.gameObjects.enemies.push(new GameObject( 
        'enemy1',
        enemy1,
        100,
        50,
        false,
        (enemy1.width / 4),
        (enemy1.height / 4)
      ))
      game.gameState.enemy1Loaded = true
    }
  
  
    this.gameObjects.space = space
    
    
    this.gameState.frameRequest = window.requestAnimationFrame(game.run.bind(this))
  }
}

const game = new Game()

window.onload = game.init()
