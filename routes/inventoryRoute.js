// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:classificationId2", utilities.handleErrors(invController.buildByClassificationDetail));
router.get("/site-name/inv/", utilities.handleErrors(invController.buildByManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildByAddNewClassification));
// Process Registration new classification
router.post('/add-classification', utilities.handleErrors(invController.registerNewClassification));


module.exports = router;