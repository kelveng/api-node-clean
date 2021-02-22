const MissingParamError = require('../helpers/missing-param-error')
const LoginRouter = require('./login-router')

describe('Login Router', () => {
  test('Should return 400 if no email is provid', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: '12345'
      }

    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provid', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'kelveng@'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provid', () => {
    const sut = new LoginRouter()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no httpRequest has no body ', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
