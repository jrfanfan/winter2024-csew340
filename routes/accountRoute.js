// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController") 

// Route to build an account view.
router.get("/account: login", utilities.handleErrors(accountController.buildLogin));

module.exports = router
