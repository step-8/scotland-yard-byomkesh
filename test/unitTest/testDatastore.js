const { assert } = require('chai');
const sinon = require('sinon');
const Datastore = require('../../src/models/datastore.js');
const assertPromiseLib = require('../util/assertOnPromise.js');
const { assertOnSuccess, assertOnFailure } = assertPromiseLib;

describe('Datastore', () => {
  it('Should return value of given key from store.', (done) => {
    const p = new Promise((res, rej) => res('some value'))
    const mockedGet = sinon.mock('hGet')
      .exactly(1)
      .withArgs('storeName', 'key')
      .returns(p);

    const ds = new Datastore('storeName', { hGet: mockedGet });
    const key = 'key';
    const expected = 'some value';

    assertOnSuccess(
      ds.get(key),
      (val) => assert.strictEqual(val, expected),
      done
    );
  });

  it('Should return rejected promise with error if key is null when tried to access value.', (done) => {
    const p = new Promise((res, rej) => res('some value'))
    const mockedGet = sinon.mock('hGet')
      .exactly(1)
      .withArgs('storeName', 'key')
      .returns(p);

    const ds = new Datastore('storeName', { hGet: mockedGet });
    const expectedError = 'Key can not be null';

    assertOnFailure(
      ds.get(null),
      (failure) => assert.strictEqual(failure.message, expectedError),
      done
    );

  });


  it('Should set value.', () => {
    const p = new Promise((res, rej) => res());
    const mockedSet = sinon.mock('hSet')
      .exactly(1)
      .withArgs('storeName', 'key', 'some value')
      .returns(p);

    const ds = new Datastore('storeName', { hSet: mockedSet });
    const key = 'key';
    const value = 'some value';
    const mockedCallback = sinon.mock('callback').exactly(1);

    ds.set(key, value)
      .then(mockedCallback);
  });

  it('Should delete value.', () => {
    const p = new Promise((res, rej) => res());
    const mockedDelete = sinon.mock('hDel')
      .exactly(1)
      .withArgs('storeName', 'key')
      .returns(p);

    const ds = new Datastore('storeName', { hDel: mockedDelete });
    const key = 'key';
    const mockedCallback = sinon.mock('callback').exactly(1);

    ds.delete(key)
      .then(mockedCallback);
  });

  it('Should return rejected promise if null key is passed to delete.', (done) => {
    const p = new Promise((res, rej) => res());
    const mockedDelete = sinon.mock('hDel')
      .exactly(1)
      .withArgs('storeName', 'key')
      .returns(p);

    const ds = new Datastore('storeName', { hDel: mockedDelete });
    const expectedError = 'Key can not be null';

    assertOnFailure(ds.delete(null), err => assert.strictEqual(err.message, expectedError), done)
  });

  it('Should return all values of store.', (done) => {
    const p = new Promise((res, rej) => res({ key: 'some value' }))
    const mockedGetAll = sinon.mock('hGetAll')
      .exactly(1)
      .withArgs('storeName')
      .returns(p);

    const ds = new Datastore('storeName', { hGetAll: mockedGetAll });
    const expected = { key: 'some value' };

    assertOnSuccess(
      ds.getAll(),
      (val) => assert.deepStrictEqual(val, expected),
      done
    );
  });
});