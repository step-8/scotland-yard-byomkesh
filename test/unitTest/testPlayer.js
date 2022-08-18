const { Player } = require('../../src/models/player.js');
const assert = require('assert');
const { mrX } = require('../../src/utils/roles.js');

describe('Player entity', () => {
  let player;
  beforeEach(() => {
    player = new Player('raju');
  });

  it('Should provide player info', () => {
    const username = 'raju';
    let role, currentPosition, color, tickets, log = [];

    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets, log };
    assert.deepStrictEqual(actual, expected);
  });

  it('Should assign role to player', () => {
    const username = 'raju';
    let role = mrX, currentPosition, color = 'black', log = [];

    player.assignRole(role);
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets: { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 }, log };
    assert.deepStrictEqual(actual, expected);
  });

  it('Shouldn\'t assign role if player already have a role', () => {
    const username = 'raju';
    let role = mrX, currentPosition, color = 'black', log = [];

    player.assignRole(role);
    player.assignRole('xyz');
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets: { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 }, log };
    assert.deepStrictEqual(actual, expected);
  });

  it('Should update player position', () => {
    const username = 'raju';
    let role, color, currentPosition = 20, tickets, log = [];

    player.updatePosition(20);
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets, log };
    assert.deepStrictEqual(actual, expected);
  });

  it('Should add taxi to the player\'s log', () => {
    const username = 'raju';
    let role, color, currentPosition, tickets, log = ['taxi'];

    player.updateLog('taxi');
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets, log };
    assert.deepStrictEqual(actual, expected);
  });

  it('Should initialize player.', () => {
    const playerData = {
      role: 'Mr. X',
      color: 'black',
      currentPosition: 1,
      tickets: {},
      log: []
    };

    const player = new Player('user');
    player.init(playerData);

    const expected = {
      role: 'Mr. X',
      color: 'black',
      currentPosition: 1,
      tickets: {},
      isHost: false,
      username: 'user',
      log: []
    };

    assert.deepStrictEqual(player.info, expected);
  });
});
