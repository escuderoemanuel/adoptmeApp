const Assert = require('assert');
const pow = require('../utils/pow');

describe('Pow function tests', () => {
  it('Should return 8', () => {
    const result = pow(2, 3);
    Assert.equal(result, 8);
  })

  it('Should return 27', () => {
    const result = pow(3, 3);
    Assert.equal(result, 27);
  })
})
