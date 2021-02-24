const HttpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body
    if (!password) {
      return HttpResponse.badRequest('password')
    }
    if (!email) {
      return HttpResponse.badRequest('email')
    }

    const acessToken = this.authUseCase.auth(email, password)
    if (!acessToken) {
      return HttpResponse.anauthorizedError()
    }
    return HttpResponse.ok({ acessToken })
  }
}
