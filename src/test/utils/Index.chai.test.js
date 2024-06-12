const chai = require('chai');
const expect = chai.expect;
const { createHash, passwordValidation } = require('../../utils/index');

describe('Chai Version: Index Utils Tests', () => {

  it('1. Chai Version:  El servicio debe realizar un hasheo efectivo de la contraseña (debe corroborarse que el resultado sea diferente a la contraseña original)', async () => {
    const originalPassword = '123456';
    // console.log('originalPassword', originalPassword)
    const hashedPassword = await createHash(originalPassword);
    // console.log('hashedPassword', hashedPassword)
    expect(hashedPassword).not.to.be.equal(originalPassword);
  });

  it('2. Chai Version: El hasheo realizado debe poder compararse de manera efectiva con la contraseña original (la comparación debe resultar en true)', async () => {
    const originalPassword = '123456';
    const hashedPassword = await createHash(originalPassword);
    const isSamePassword = await passwordValidation({ password: hashedPassword }, originalPassword);
    expect(isSamePassword).to.be.equal(true);
  });

  it('3. Chai Version: Si la contraseña hasheada se altera, debe fallar en la comparación de la contraseña original', async () => {
    const originalPassword = '123456';
    const hashedPassword = await createHash(originalPassword);
    const alteredPassword = hashedPassword + '1';
    const isSamePassword = await passwordValidation({ password: hashedPassword }, alteredPassword);
    expect(isSamePassword).to.be.equal(false);
  });

});