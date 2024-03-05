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
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildByAddNewClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "AddNewClassification",
    nav,
    
  })

}

module.exports = invCont