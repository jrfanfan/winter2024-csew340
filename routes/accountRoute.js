// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController") 

// Route to build an account view.
router.get("/account: login", utilities.handleErrors(accountController.buildLogin))

// Deliver a Registration view.
router.get("account: register", utilities.handleErrors(accountController.buildRegister))

// Process Registration
router.post("/register", utilities.handleErrors(accountController.registerAccount))


module.exports = router
