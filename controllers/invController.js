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
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
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
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/site-name/inv", {
      title: "AddNewClassification",
      nav,
      errors: null,



    })
  }

}

/* ***************************
 *  Build add new inventory view
 * ************************** */
invCont.buildByAddInventory = async function(req, res) {
  const grid4 = await utilities.builAddInvetory()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: " addInvetory",
    nav,
    grid4,
  })

}

/* ****************************************
*  Process Registration new inventory
* *************************************** */
invCont.registerNewInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body

  const regResult = await invModel.registerInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    parseInt(inv_price),
    parseInt(inv_miles),
    inv_color,
    classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have added a new make: ${inv_make}`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "AddNewInventory",
      nav,
      errors: null,
    })
  } else {
    const grid4 = await utilities.builAddInvetory()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Management",
      nav,
      grid4,
      errors: null,
    })
  }

}


module.exports = invCont