const HttpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!password) {
        return HttpResponse.badRequest('password')
      }
      if (!email) {
        return HttpResponse.badRequest('email')
      }

      const acessToken = await this.authUseCase.auth(email, password)
      if (!acessToken) {
        return HttpResponse.anauthorizedError()
      }
      return HttpResponse.ok({ acessToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
