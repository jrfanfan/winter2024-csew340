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
  const head = await utilities.buildMessageHead()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    head,
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
  const head = await utilities.buildMessageHead()
  let nav = await utilities.getNav()
  const className = data[0].inv_make
  res.render("./inventory/classification1", {
    title: className + " vehicles",
    nav,
    grid2,
    head,
    errors: null,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildByManagement = async function (req, res) {
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classificationSelect,
    head,
  })
}

/* ***************************
 *  Build add new classification view
 * ************************** */
invCont.buildByAddNewClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  res.render("./inventory/add-classification", {
    title: "AddNewClassification",
    nav,
    head,
    errors: null,
    
  })

}

/* ****************************************
*  Process Registration new classification
* *************************************** */
invCont.registerNewClassification = async function(req, res) {
  
  const { classification_name} = req.body
  const data = await invModel.getClassifications()
  const regResult = await invModel.registerClassification( classification_name )
  let RegResult 
  data.rows.forEach((row) =>{ 
    if (classification_name == row.classification_name ) {
      
      req.flash(
        "notice",
        ` This name " ${classification_name} " already exists, choose an other please.`
      
      )
      res.redirect("/")
      
    }else{
      RegResult = regResult

    }

  })

  

  if (RegResult) {
    req.flash(
      "notice",
      `Congratulations, you have added a new classification: ${classification_name}`
    )
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const head = await utilities.buildMessageHead()
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      head,
      classificationSelect,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/site-name/inv", {
      title: "AddNewClassification",
      nav,
      head,
      classificationSelect,
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
  const head = await utilities.buildMessageHead()
  res.render("./inventory/add-inventory", {
    title: " addInvetory",
    nav,
    grid4,
    head,
    errors: null,
  })

}

/* ****************************************
*  Process Registration new inventory
* *************************************** */
invCont.registerNewInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
  let data = await invModel.getClassifications()
  let iD;
  data.rows.forEach((row) => {
    if (row.classification_name == classification_id) {
      iD = row.classification_id;
      return parseInt(iD);
    }
  })
  let price = parseInt(inv_price)
  let miles = parseInt(inv_miles)
  const regResult = await invModel.registerInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    price,
    miles,
    inv_color,
    iD
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have added a new make: ${inv_make}`
    )
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("./inventory/management", {
      title: "AddNewInventory",
      nav,
      head,
      classificationSelect,
      errors: null,
    })
  } else {
    const grid4 = await utilities.builAddInvetory()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Management",
      nav,
      grid4,
      head,
      errors: null,
    })
  }

}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  const itemData = await invModel.getInventoryByClassificationDetail(inv_id)
  const classificationSelect = await utilities.getClassificationName(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    itemName,
    head,
    classificationSelect: classificationSelect,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
    errors: null,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    const head = await utilities.buildMessageHead()
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    head,
    itemName,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont