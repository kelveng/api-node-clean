class LoginRouter {
  route (httpRequest) {
    const { email, password } = httpRequest.body
    if (!password || !email) {
      return {
        statusCode: 400
      }
    }
  }
}

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
  })
})
