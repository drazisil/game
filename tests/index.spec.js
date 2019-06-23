const { Game } = require("../src/app.js");

let game;

beforeEach(() => {
  game = new Game();
});

test("ship can move left", () => {
  game.gameObjects.ship = { x: 42 };
  game.gameObjects.ship.x = game.gameConfig.defaultShipLocation.x;
  game.moveLeft();
  expect(game.gameObjects.ship.x).toEqual(
    game.gameConfig.defaultShipLocation.x - game.gameConfig.movementUnit
  );
});
