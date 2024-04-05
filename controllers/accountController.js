utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  res.render("account/login", {
    title: "Login",
    nav,
    head,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  res.render("account/register", {
    title: "Register",
    nav,
    head,
    errors: null,
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      head,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      head,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      head,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    head,
    account_email,
    account_password,
    errors: null,
    
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildNewView(req, res, next) {
  const head = await utilities.buildMessageHead()
  let nav = await utilities.getNav()
  res.render("account/newView", {
    title: "NewView",
    nav,
    head,
    errors: null,
  })
}

async function buildEditAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  const itemData = await accountModel.getAccountById(account_id)
  res.render("./account/register-edit", {
      title: "Edit Registration",
      nav,
      head,
      errors: null,
      account_firstname: itemData[0].account_firstname,
      account_lastname: itemData[0].account_lastname,
      account_email: itemData[0].account_email,
      account_password: itemData[0].account_password,
      account_id: itemData[0].account_id,
    
    })
  }

  /* ***************************
 *  Update register Data
 * ************************** */
async function updateRegister (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body
  const updateResult = await accountModel.updateRegister(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
  if (updateResult) {
    const itemName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The account of ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  }else {
    req.flash("notice", "Sorry, the update failed, start over please") 
    } 
  
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildNewView, buildEditAccountView, updateRegister}