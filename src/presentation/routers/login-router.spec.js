class LoginRouter {
  route (httpRequest) {
    return {
      statusCode: 400
    }
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provid', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      password: '12345'
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
