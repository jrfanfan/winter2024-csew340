// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const invController = require("../controllers/invController")
//const regValidate = require('../utilities/classification-validation')
const regValidate = require('../utilities/vehicle-validation')
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:classificationId2", utilities.handleErrors(invController.buildByClassificationDetail));
router.get("/site-name/inv/", utilities.handleErrors(invController.buildByManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildByAddNewClassification));
// Process Registration new inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildByAddInventory))
// Process Registration new classification
router.post('/add-classification', utilities.handleErrors(invController.registerNewClassification));
router.post(
    "/add-classification",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.registerNewClassification)
  )
// Process Registration new inventory
router.post('/add-inventory', utilities.handleErrors(invController.registerNewInventory));
// Process the registration data
router.post(
  "/add-inventory",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(invController.registerNewInventory)
)

module.exports = router;