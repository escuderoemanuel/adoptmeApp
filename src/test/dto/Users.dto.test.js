const chai = require('chai');
const expect = chai.expect;
const UserDTO = require('../../dto/User.dto');

describe('Chai Version: Users DTO Tests', () => {

  before(() => {
    this.mockUser = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@gmail.com',
      password: '1234',
      role: 'user',
    }
  });

  it('1. Chai Version:  Por parte del DTO de usuario: Corroborar que el DTO unifique el nombre y apellido en una única propiedad. (Recuerda que puedes evaluar múltiples expects)', async () => {
    const dtoInstance = UserDTO.getUserTokenFrom(this.mockUser);
    expect(dtoInstance.name).to.includes(this.mockUser.first_name);
    expect(dtoInstance.name).to.includes(this.mockUser.last_name);
  });

  it('2. Chai Version: Por parte del DTO de usuario: El DTO debe eliminar las propiedades innecesarias como password, first_name, last_name', async () => {
    const dtoInstance = UserDTO.getUserTokenFrom(this.mockUser);
    expect(dtoInstance.password).to.be.undefined;
    expect(dtoInstance.first_name).to.be.undefined;
    expect(dtoInstance.last_name).to.be.undefined;

  });

});