const assertOnSuccess = (promise, assertion, done) => {
  promise
    .then((data) => {
      try {
        assertion(data)
        done();
      } catch (e) {
        done(e)
      }
    })
    .catch((e) => done(e))
};

const assertOnFailure = (promise, assertion, done) => {
  promise
    .then((data) => done('Expected to get error but got data, ' + data))
    .catch((e) => {
      try {
        assertion(e)
        done();
      } catch (assertionError) {
        done(assertionError)
      }
    })
};

module.exports = { assertOnSuccess, assertOnFailure };
