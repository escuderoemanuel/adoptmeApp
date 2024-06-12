const mongoose = require('mongoose');
const { MONGO_URL } = require('../config/config');
const Assert = require('assert');
const Users = require('../dao/Users.dao');

const assert = Assert.strict; // Aquí seteo el assert a strictEqual

// Conectar a la base de datos antes de empezar los tests
before(async function () {
  this.timeout(10000); // Aumentar el tiempo de espera a 10 segundos
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
});

describe('Assert Version: Users Dao Tests', function () {
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
  it('should return an array', async () => {
    const result = await this.usersDao.get();
    assert.equal(Array.isArray(result), true);
  });

  it('should return an empty array in the first .get', async () => {
    const result = await this.usersDao.get();
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 0);
    // Assert.equal(result, []) // Esto da false porque no es el mismo objeto
    // Assert.equal(JSON.stringify(result), JSON.stringify([])) // Esto da true porque compara el contenido
    // Assert.equal('2', 2) // Esto da true porque compara el contenido pero no el tipo de dato
    // Assert.strictEqual('2', 2) // Esto da false porque compara el contenido y el tipo de dato
    //! Para evitar errores, es aconsejable utilizar strictEqual, el cual podemos setear al momento de declarar el assert
  });

  it('El Dao debe agregar correctamente un elemento a la base de datos', async () => {
    const result = await this.usersDao.save(this.mockUser);
    assert.ok(result._id); // Si se crea correctamente el user, se le agrega el _id
  })

  it('Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto', async () => {
    const result = await this.usersDao.save(this.mockUser);
    assert.equal(Array.isArray(result.pets), true); // Verificar si pets es un array
    assert.equal(result.pets.length, 0); // Verificar si el array está vacío
  })

  it('El Dao puede obtener  a un usuario por email', async () => {
    const user = await this.usersDao.save(this.mockUser);
    // console.log('user', user)
    const result = await this.usersDao.getBy({ email: this.mockUser.email });
    // console.log('result', result)
    // assert.ok(!!result); // Verificar si result es truthy
    assert.equal(result.email, user.email);
  })
});
