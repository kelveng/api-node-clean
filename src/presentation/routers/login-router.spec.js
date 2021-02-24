const MissingParamError = require('../helpers/missing-param-error')
const ServerError = require('../helpers/server-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const LoginRouter = require('./login-router')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  authUseCaseSpy.acessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    authUseCaseSpy,
    sut
  }
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.acessToken
    }
  }
  return new AuthUseCaseSpy()
}

const makeAuthUseCaseError = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Should return 400 if no email is provid', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: '12345'
      }

    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provid', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'kelveng@'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provid', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if no httpRequest has no body ', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call  AuthUseCase with correct params', async () => {
    const httpRequest = {
      body: {
        email: 'kelveng.info@gmail.com',
        password: '1q2w3e.,'
      }
    }
    const { sut, authUseCaseSpy } = makeSut()
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
  })

  test('Should return  401 when invalid credencial', async () => {
    const httpRequest = {
      body: {
        email: 'kelveng.info@gmail.com',
        password: '1q2w3e.,'
      }
    }
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.acessToken = null
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return  500 if no AuthUseCase provide', async () => {
    const httpRequest = {
      body: {
        email: 'kelveng.info@gmail.com',
        password: '1q2w3e.,'
      }
    }
    const sut = new LoginRouter({})
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return  500 if  AuthUseCase throw error', async () => {
    const authUseCaseSpyError = makeAuthUseCaseError()
    const httpRequest = {
      body: {
        email: 'kelveng.info@gmail.com',
        password: '1q2w3e.,'
      }
    }
    const sut = new LoginRouter(authUseCaseSpyError)
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return  200 if auth is valid', async () => {
    const httpRequest = {
      body: {
        email: 'kelveng.info@gmail.com',
        password: '1q2w3e.,'
      }
    }
    const { sut, authUseCaseSpy } = makeSut()

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.acessToken).toEqual(authUseCaseSpy.acessToken)
  })
})
