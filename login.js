const express = require('express')
const router = express.Router()

module.exports = () => {
  router.post('/signup', SignUpRouter.route)
}

class ExpressRouterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = req.body
      const httpResponse = router.route(httpRequest)
      res.statusCode(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
class SignUpRouter {
  async route (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body
    const user = new SignUpUseCase().signup(email, password, repeatPassword)
    return {
      statusCode: 200,
      body: user
    }
  }
}

class SignUpUseCase {
  async signup (email, password, repeatPassword) {
    if (password === repeatPassword) {
      const user = new AddAccountRepository().add(email, password)
      return user
    }
  }
}

const mongoose = require('mongoose')
const AccoutModel = mongoose.model('Account')

class AddAccountRepository {
  async add (email, password) {
    const user = AccoutModel.create({ email, password })
    return user
  }
}
