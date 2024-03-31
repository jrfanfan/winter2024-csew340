// Needed Resources 

const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController") 
const regValidate = require("../utilities/account-validation")
const invCont = require("../controllers/invController")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Deliver a Registration view.
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process Registration
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post("/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request

router.get("/", utilities.checkLogin, utilities.handleErrors(invCont.buildByManagement))

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router
