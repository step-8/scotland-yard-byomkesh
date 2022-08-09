const { Player } = require('../../src/models/player.js');
const assert = require('assert');

describe('Player entity', () => {
  let player;
  beforeEach(() => {
    player = new Player('raju');
  });

  it('Should provide player info', () => {
    const username = 'raju';
    let role, currentPosition;

    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false };
    assert.deepStrictEqual(actual, expected);
  });

  it('Should assign role to player', () => {
    const username = 'raju';
    let role = 'abcd', currentPosition;

    player.assignRole(role);
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false };
    assert.deepStrictEqual(actual, expected);
  });

  it('Shouldn\'t assign role if player already have a role', () => {
    const username = 'raju';
    let role = 'abcd', currentPosition;

    player.assignRole(role);
    player.assignRole('xyz');
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false };
    assert.deepStrictEqual(actual, expected);
  });

  it('Should update player position', () => {
    const username = 'raju';
    let role, currentPosition = 20;

    player.updatePosition(20);
    const actual = player.info;
    const expected = { username, role, currentPosition, isHost: false };
    assert.deepStrictEqual(actual, expected);
  });

});