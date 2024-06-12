const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const mongoose = require('mongoose');
const userModel = require('../../dao/models/User');
const { MONGO_URL, TESTING_URL } = require('../../config/config');

const requester = supertest(TESTING_URL)

mongoose.connect(MONGO_URL).then(() => {
  console.log('Connected for testing')
})

describe('/api/sessions tests [AVANZADO]', () => {

  before(async () => {
    this.userMock = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@email.com',
      password: "1234"
    }
    this.cookie;
    this.unprotectedCookie;

    await mongoose.connection.collections.users.drop() // borra la coleccion de usuarios
  })

  it('1. Debe poder registrar correctamente un usuario', async () => {
    const { _body, statusCode } = await requester.post('/api/sessions/register').send(this.userMock);
    // console.log({ '_body': _body, 'statusCode': statusCode })
    expect(_body).to.exist
    expect(statusCode).to.be.equal(200)
  })

  it('2. Debe loguear correctamente al usuario y retornar una cookie', async () => {
    const loginMock = { email: this.userMock.email, password: this.userMock.password }
    const { _body, statusCode, headers } = await requester.post('/api/sessions/login').send(loginMock);

    // console.log('headers', headers)
    const cookieFromHeader = headers['set-cookie'][0]
    const cookieParts = cookieFromHeader.split('=')
    this.cookie = {
      name: cookieParts[0],
      value: cookieParts[1]
    }

    expect(this.cookie.name).to.be.equal('coderCookie')
    expect(this.cookie.value).to.be.ok
  })

  it('3. debe enviar la cookie que contiene los datos del usuario y desestructurar correctamente', async () => {
    const { _body, statusCode } = await requester.get('/api/sessions/current').set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])
    const userFromCookie = _body.payload;
    expect(userFromCookie).to.have.property('email')
    expect(userFromCookie).to.have.property('role')
    expect(userFromCookie.email).to.be.equal(this.userMock.email)
  })
})

describe('/api/sessions tests [RUTAS DESPROTEGIDAS]', () => {
  it('Endpoint unprotedtedLogin debe devolver una cookie de nombre unprotectedCookie', async () => {
    const loginMock = { email: this.userMock.email, password: this.userMock.password }
    const { _body, statusCode, headers } = await requester.post('/api/sessions/unprotectedLogin').send(loginMock)
    // console.log('headers', headers)
    const cookieFromHeader = headers['set-cookie'][0]
    const cookieParts = cookieFromHeader.split('=')
    this.unprotectedCookie = {
      name: cookieParts[0],
      value: cookieParts[1]
    }
    expect(this.unprotectedCookie.name).to.be.ok.and.equal('unprotectedCookie')
    expect(this.unprotectedCookie.value).to.be.ok
  })

  it('Endpoint unprotedtedCurrent debe devolver un usuario completo', async () => {
    const { _body, statusCode } = await requester.get('/api/sessions/unprotectedCurrent').set('Cookie', [`${this.unprotectedCookie.name}=${this.unprotectedCookie.value}`])
    const userFromCookie = _body.payload;

    expect(userFromCookie.email).to.be.equal(this.userMock.email)
    expect(userFromCookie).to.have.property('password')
    expect(userFromCookie).to.have.property('role')
    expect(userFromCookie).to.have.property('first_name')
    expect(statusCode).to.be.equal(200)

  })
})