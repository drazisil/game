const { GameObject, Missile, Game } = require("../src/app.js");

describe("GameObject", () => {
  test("Can create a GameObject", () => {
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

describe("Missile", () => {
  test("Can create a Missile", () => {
    const missile = new Missile(14, 24, 16, "dummySource");
    expect(missile.source).toEqual("dummySource");
  });
});

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test("ship can move up", () => {
    game.gameObjects.ship = { y: 700 };
    game.gameObjects.ship.y = game.gameConfig.defaultShipLocation.y;
    game.moveUp();
    expect(game.gameObjects.ship.y).toEqual(
      game.gameConfig.defaultShipLocation.y - game.gameConfig.movementUnit
    );
  });

  test("ship can move down", () => {
    game.gameObjects.ship = { y: 700 };
    game.gameObjects.ship.y = game.gameConfig.defaultShipLocation.y;
    game.moveDown();
    expect(game.gameObjects.ship.y).toEqual(
      game.gameConfig.defaultShipLocation.y + game.gameConfig.movementUnit
    );
  });

  test("ship can move left", () => {
    game.gameObjects.ship = { x: 42 };
    game.gameObjects.ship.x = game.gameConfig.defaultShipLocation.x;
    game.moveLeft();
    expect(game.gameObjects.ship.x).toEqual(
      game.gameConfig.defaultShipLocation.x - game.gameConfig.movementUnit
    );
  });

  test("ship can move right", () => {
    game.gameObjects.ship = { x: 42 };
    game.gameObjects.ship.x = game.gameConfig.defaultShipLocation.x;
    game.moveRight();
    expect(game.gameObjects.ship.x).toEqual(
      game.gameConfig.defaultShipLocation.x + game.gameConfig.movementUnit
    );
  });
});
