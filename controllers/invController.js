const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***********************************************
 *  Build inventory by classification view detail
 * *********************************************** */
invCont.buildByClassificationDetail = async function (req, res) {
  const classification_id = req.params.classificationId2
  const data = await invModel.getInventoryByClassificationDetail(classification_id)
  const grid2 = await utilities.buildClassificationGrid2(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification1", {
    title: className + " vehicles",
    nav,
    grid2,
    errors: null,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildByManagement = async function (req, res) {
  const grid3 = await utilities.buildManagement()
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("./inventory/management", {
    title: "Management",
    nav,
    grid3,
    errors: null,
  })
}

/* ***************************
 *  Build add new classification view
 * ************************** */
invCont.buildByAddNewClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "AddNewClassification",
    nav,
    errors: null,
    
  })

}

/* ****************************************
*  Process Registration new classification
* *************************************** */
invCont.registerNewClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name} = req.body

  const regResult = await invModel.registerClassification( classification_name )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have added a new name: ${classification_name}`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/add-classification", {
      title: "AddNewClassification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    let nav = await utilities.getNav()
    res.status(501).render("./inventory/add-classification", {
      title: "AddNewClassification",
      nav,
      errors: null,



    })
  }

}
module.exports = invCont