const mongoose = require('mongoose');
const chai = require('chai');
const supertest = require('supertest');
const path = require('path');
const { TESTING_URL, MONGO_URL } = require('../../config/config');
const Pets = require('../../dao/Pets.dao');

const expect = chai.expect;
const requester = supertest(TESTING_URL);

describe('Testing AdoptmeAPI', function () {
  this.timeout(10000); // Aumentar el tiempo de espera a 10 segundos

  describe('⚠️ Pet Tests', function () {

    before(async () => {
      await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      this.petMock = {
        name: 'Coco',
        specie: 'Dog',
        birthDate: '10-10-2020'
      };
    });

    beforeEach(async () => {
      const collection = mongoose.connection.collections['pets'];
      if (collection) {
        await collection.drop().catch(err => {
          if (err.message !== 'ns not found') {
            throw err;
          }
        });
      }
    });

    it('1. The POST endpoint "/api/pets" should create a pet correctly', async () => {
      const { statusCode, _body } = await requester.post('/api/pets').send(this.petMock);
      expect(_body).to.exist;
      expect(statusCode).to.be.equal(200);
      expect(_body.payload).to.have.property('_id');
    });

    it('2. Al crear una mascota sólo con los datos elementales. Se debe corroborar que la mascota creada cuente con una propiedad adopted : false', async () => {
      const { _body, statusCode } = await requester.post('/api/pets').send(this.petMock);
      const responsePet = _body.payload;
      expect(statusCode).to.be.equal(200);
      expect(responsePet).to.have.property('adopted');
      expect(responsePet.adopted).to.be.equal(false);
    });

    it('3. Si se desea crear una mascota sin el campo nombre, el módulo debe responder con un status 400', async () => {
      const response = await requester.post('/api/pets').send({ specie: 'Dog', birthDate: '10-10-2020' });
      expect(response.statusCode).to.be.equal(400);
    });

    it('4. Al obtener a las mascotas con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo', async () => {
      await requester.post('/api/pets').send(this.petMock);
      const response = await requester.get('/api/pets');
      expect(response._body).to.have.property('status');
      expect(response._body).to.have.property('payload');
      expect(Array.isArray(response._body.payload)).to.be.true;
    });

    it('5. El método PUT debe poder actualizar correctamente a una mascota determinada (esto se puede testear comparando el valor previo con el nuevo valor de la base de datos)', async () => {
      const originalPet = await requester.post('/api/pets').send(this.petMock);
      const pid = originalPet._body.payload._id;
      await requester.put(`/api/pets/${pid}`).send({ name: 'Updated Coco' });
      const updatedPet = await requester.get(`/api/pets/${pid}`);
      expect(updatedPet.statusCode).to.be.equal(200);
      expect(originalPet._body.payload.name).not.to.be.equal(updatedPet._body.payload.name);
    });

    it('6. El método DELETE debe poder borrar la última mascota agregada, ésto se puede alcanzar agregando a la mascota con un POST, tomando el id, borrando la mascota con el DELETE, y luego corroborar si la mascota existe con un GET', async () => {
      const pet = await requester.post('/api/pets').send(this.petMock);
      const pid = pet._body.payload._id;
      await requester.delete(`/api/pets/${pid}`);
      const petDeleted = await requester.get(`/api/pets/${pid}`);
      expect(petDeleted.statusCode).to.be.equal(400);
      expect(petDeleted._body).not.to.have.property('payload');
    });

  });

  describe('⚠️ Pets Tests con [MULTER]', () => {
    this.petMock = {
      name: 'Coco',
      specie: 'Dog',
      birthDate: '10-10-2020'
    };

    beforeEach(async () => {
      const collection = mongoose.connection.collections['pets'];
      if (collection) {
        await collection.drop().catch(err => {
          if (err.message !== 'ns not found') {
            throw err;
          }
        });
      }
    });

    it('7. El endpoint de pets debe poder crear mascotas correctamente subiendo un archivo', async () => {

      const response = await requester.post('/api/pets/withimage')
        .field('name', this.petMock.name)
        .field('specie', this.petMock.specie)
        .field('birthDate', this.petMock.birthDate)
        .attach('image', `${__dirname}/puppy-1903313_640.jpg`);

      expect(response.statusCode).to.be.equal(200);
      expect(response._body).to.exist;
      expect(response._body.payload).to.have.property('_id');
      expect(response._body.payload).to.have.property('image');
    });
  });
});
