const MissingParamError = require('../helpers/missing-param-error')
const LoginRouter = require('./login-router')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    authUseCaseSpy,
    sut
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provid', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no httpRequest has no body ', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should call  AuthUseCase with correct params', () => {
    const httpRequest = {
      body: {
        email: 'kelveng.info@gmail.com',
        password: '1q2w3e.,'
      }
    }
    const { sut, authUseCaseSpy } = makeSut()
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
  })
})
