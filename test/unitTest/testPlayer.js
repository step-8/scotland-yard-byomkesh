const { Player } = require('../../src/models/player.js');
const assert = require('assert');
const { mrX } = require('../../src/utils/roles.js');

const DETECTIVE_TICKETS = { taxi: 10, bus: 8, subway: 4, black: 0, twoX: 0 };
const MR_X_TICKETS = { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 };

describe('Player entity', () => {
  let player;
  beforeEach(() => {
    player = new Player('raju');
  });

  it('Should provide player info', () => {
    const username = 'raju';
    let role, currentPosition, color, tickets;

    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets };
    assert.deepStrictEqual(actual, expected);
  });

  it('Should assign role to player', () => {
    const username = 'raju';
    let role = mrX, currentPosition, color = 'black';

    player.assignRole(role);
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets: { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 } };
    assert.deepStrictEqual(actual, expected);
  });

  it('Shouldn\'t assign role if player already have a role', () => {
    const username = 'raju';
    let role = mrX, currentPosition, color = 'black';

    player.assignRole(role);
    player.assignRole('xyz');
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets: { taxi: 24, bus: 24, subway: 24, black: 5, twoX: 2 } };
    assert.deepStrictEqual(actual, expected);
  });

  it('Should update player position', () => {
    const username = 'raju';
    let role, color, currentPosition = 20, tickets;

    player.updatePosition(20);
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false, color, tickets };
    assert.deepStrictEqual(actual, expected);
  });

});