const { GameObject, Missile, Game } = require("../src/app.js");

describe("with GameObject", () => {
  test("that can create a GameObject", () => {
    const gameObject = new GameObject(
      "dummyObject",
      null,
      42,
      84,
      true,
      16,
      32
    );
    expect(gameObject.name).toEqual("dummyObject");
  });
});

describe("with Missile", () => {
  test("that can create a Missile", () => {
    const missile = new Missile(14, 24, 16, "dummySource");
    expect(missile.source).toEqual("dummySource");
  });
});

describe("with Game", () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test("that areEnemiesLoaded() returns false with enemies not loaded", () => {
    game.gameObjects.enemies[0] = { data: { complete: false } };
    expect(game.areEnemiesLoaded()).toEqual(false);
  });

  test("that areEnemiesLoaded() returns true with enemies loaded", () => {
    game.gameObjects.enemies[0] = { data: { complete: true } };
    expect(game.areEnemiesLoaded()).toEqual(true);
  });

  test("that resetSizes() corrects width and height", () => {
    game.gameObjects.ship = {
      data: { width: 40, height: 80 },
      width: 0,
      height: 0
    };
    game.gameObjects.enemies[0] = { data: { complete: true } };
    game.resetSizes();
    expect(game.gameObjects.ship.width).toEqual(20);
    expect(game.gameObjects.ship.height).toEqual(40);
  });

  test("that ship can move up", () => {
    game.gameObjects.ship = { y: 700 };
    game.gameObjects.ship.y = game.gameConfig.defaultShipLocation.y;
    game.moveUp();
    expect(game.gameObjects.ship.y).toEqual(
      game.gameConfig.defaultShipLocation.y - game.gameConfig.movementUnit
    );
  });

  test("that ship can move down", () => {
    game.gameObjects.ship = { y: 700 };
    game.gameObjects.ship.y = game.gameConfig.defaultShipLocation.y;
    game.moveDown();
    expect(game.gameObjects.ship.y).toEqual(
      game.gameConfig.defaultShipLocation.y + game.gameConfig.movementUnit
    );
  });

  test("that ship can move left", () => {
    game.gameObjects.ship = { x: 42 };
    game.gameObjects.ship.x = game.gameConfig.defaultShipLocation.x;
    game.moveLeft();
    expect(game.gameObjects.ship.x).toEqual(
      game.gameConfig.defaultShipLocation.x - game.gameConfig.movementUnit
    );
  });

  test("that ship can move right", () => {
    game.gameObjects.ship = { x: 42 };
    game.gameObjects.ship.x = game.gameConfig.defaultShipLocation.x;
    game.moveRight();
    expect(game.gameObjects.ship.x).toEqual(
      game.gameConfig.defaultShipLocation.x + game.gameConfig.movementUnit
    );
  });
});
