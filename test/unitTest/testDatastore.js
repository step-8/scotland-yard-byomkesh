const { assert } = require("chai");
const sinon = require('sinon');
const Datastore = require('../../src/models/datastore.js');


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

    ds.get(key)
      .then((val) => {
        assert.strictEqual(val, expected);
        done();
      });
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


});