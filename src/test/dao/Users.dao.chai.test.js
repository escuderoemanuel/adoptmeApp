const mongoose = require('mongoose');
const { MONGO_URL } = require('../../config/config');
const Users = require('../../dao/Users.dao');
const chai = require('chai');
const expect = chai.expect;

// Conectar a la base de datos antes de empezar los tests
before(async function () {
  this.timeout(10000); // Aumentar el tiempo de espera a 10 segundos
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
});

// Aquí uso function para poder setear el this.timeout, luego puedo seguir la sintaxis de arrow function
describe('Chai Version: Users Dao Tests', async function () {

  this.timeout(10000); // Aumentar el tiempo de espera a 10 segundos

  //! Crea una instancia de Users(), para utilizarla en todos los test
  before(() => {
    this.usersDao = new Users();
    this.mockUser = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@gmail.com',
      password: '1234',
      role: 'user',
    }
  });

  //! Vacía la base de datos actual antes de cada test
  beforeEach(() => {
    mongoose.connection.collections.users.drop();
  });

  //! Desde aquí van los tests
  it('1. Chai Version: should return an array', async () => {
    const result = await this.usersDao.get();
    expect(result).to.deep.equal([]) // Opción
    expect(Array.isArray(result)).to.equal(true); // Opción
    expect(Array.isArray(result)).to.be.ok; // Opción
  });

  it('2. Chai Version: should return an empty array in the first .get', async () => {
    const result = await this.usersDao.get();
    expect(result).to.be.empty; //Opción
    expect(result.length).to.be.equal(0) //Opción
  });

  it('3. Chai Version: El Dao debe agregar correctamente un elemento a la base de datos', async () => {
    const result = await this.usersDao.save(this.mockUser);
    expect(result).to.have.property('_id')
    // assert.ok(result._id); // Si se crea correctamente el user, se le agrega el _id
  })

  it('4. Chai Version: Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto', async () => {
    const result = await this.usersDao.save(this.mockUser);
    // expect(result).to.have.property('pets');
    // expect(result.pets).to.be.empty;
    expect(result).to.have.property('pets').that.is.empty; // Opción de una línea que hace lo mismo que las dos de arriba
    // assert.equal(Array.isArray(result.pets), true); // Verificar si pets es un array
    // assert.equal(result.pets.length, 0); // Verificar si el array está vacío
  })

  it('5. Chai Version: El Dao puede obtener  a un usuario por email', async () => {
    const user = await this.usersDao.save(this.mockUser);
    // console.log('user', user)
    const result = await this.usersDao.getBy({ email: this.mockUser.email });
    // expect(result).to.be.an('object'); // Opción
    expect(result).to.have.property('email').that.equals(this.mockUser.email);
    // console.log('result', result)
    // assert.ok(!!result); // Verificar si result es truthy
    // assert.equal(result.email, user.email);
  })
});
