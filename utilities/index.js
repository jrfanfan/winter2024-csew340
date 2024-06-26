const { cookie } = require("express-validator")
const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const { clearCache } = require("ejs")
require("dotenv").config()
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid2 = async function(data){
  let grid2
  if(data.length > 0){
    data.forEach(vehicle => {
      grid2 = `<div class="inv_detail">`
      grid2 += `<p>This vehicle has passed inspection <br> by an ASE-cetified technician.</p> `
      grid2 +=`<img src="` + vehicle.inv_image +  `" ` + ` alt="Image of ` + vehicle.inv_make + ` `
      + vehicle.inv_model + ` on CSE Motors"/>`
      grid2 += `<hr style="width:490px; margin-left:0px; height: 25px; margin-top: -4px; background-color:green">`
      grid2 += `</div>`
      grid2 += `<div class="aside">`
      grid2 +=  `<h3>` + vehicle.inv_year + ` ` + vehicle.inv_make + ` ` + vehicle.inv_model
      grid2 += `</h3>` 
      grid2 += `<div id="price-view">`
      grid2 += `<p id="as_p">`+ `No-Haggle Price` +`<sup style="color:blue">1</sup>` +
      ` <====> ` + `$` + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + `</p>`
      grid2 += `<p id="as_p2">` + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
      + ` Miles`+ `</p>`
      grid2 += `</div>`
      grid2 += `</div>`
           
    })
    
  } else { 
    grid2 += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid2
  
}

/* **************************************
* Build partial new vehicle view HTML
* ************************************ */

Util.builAddInvetory =  async function() {
  let data = await invModel.getClassifications()
  let grid4
  grid4 = `<select id="chooseClassification" name="classification_id" required>`
  grid4 +=`<option>--Choose a Classification--</option>`
  grid4 += `<ul>`
  data.rows.forEach((row) => {
    grid4 += `<li>`
    grid4 += `<option>` 
    grid4 += row.classification_name
    grid4 += `</option>`
    grid4 += `</li>`
  })
  grid4 += `</ul>`
  grid4 += `</select> <br>`
  return grid4
}

/* **************************************
* Build management edit or delete list vehicle view HTML
* ************************************ */

Util.buildClassificationList  =  async function() {
  let data = await invModel.getClassifications()
  let grid5
  grid5 = `<select id="chooseClassification" name="classification_id" required>`
  grid5 +=`<option>--Choose a Classification--</option>`
  grid5 += `<ul>`
  data.rows.forEach((row) => {
    grid5 += `<li>`
    grid5 += `<option value="${row.classification_id}">` 
    grid5 += row.classification_name
    grid5 += `</option>`
    grid5 += `</li>`
  })
  grid5 += `</ul>`
  grid5 += `</select> <br>`
  return grid5
}



Util.getClassificationName  =  async function(classification_id) {
  let data = await invModel.getClassifications()
  let grid5
  grid5 = `<select id="chooseClassification" name="classification_id" required>`
  grid5 +=`<option>--Choose a Classification--</option>`
  grid5 += `<ul>`
  data.rows.forEach((row) => {
    if (row.classification_id == classification_id) {
      grid5 += `<li>`
      grid5 += `<option selected>` 
      grid5 += row.classification_name
      grid5 += `</option>`
      grid5 += `</li>`
       console.log()
      }
  })
  grid5 += `</ul>`
  grid5 += `</select> <br>`
  return grid5
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 *  Check Login
 * ************************************ */
let name = ""
let type = ""
let check = ""

let account_id 
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) { 
    check = "yes"
     next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
  
 }


 /* ****************************************
* Middleware to check token validity
**************************************** */

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      if(err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }else {
            name = accountData.account_firstname
            type = accountData.account_type
            account_id =accountData.account_id            
            if (check === "no") {
              res.clearCookie("jwt")
            }
      
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()  
                
    })
  }else {
   next()
  }
 }

Util.buildTypeView = async function (req, res, next) {
  let grid7
  switch(type) {
    case "Client":
      grid7 = `<h2>`
      grid7 += `Welcome  ` + name + `<br>`
      grid7 += `</h2>`
      grid7 += `<h2> You're logged in.</h2>`
      grid7 += `<a href="/account/regEdit/${parseInt(account_id)}" style="font-size: 16px; margin-left: 0px;" >Edit Account Information</a>`
      return grid7
    case "Employee":
      grid7 = `<h2>`
      grid7 += `Welcome  ` + name + `<br>`
      grid7 += `</h2>`
      grid7 += `<h2> You're logged in.</h2>`
      grid7 += `<a href="/account/regEdit/${parseInt(account_id)}" style="font-size: 16px; margin-left: 0px;" >Edit Account Information</a>`
      grid7 += `<h2>Inventory Management</h2>`
      grid7 += `<a href="/../inv/management-2" style="font-size: 16px; margin-left: 0px">Manage Inventory</a>`
      return grid7
    default:
      grid7 = `<h2>`
      grid7 += `Welcome  ` + name + `<br>`
      grid7 += `</h2>`
      grid7 += `<h2> You're logged in.</h2>`
      grid7 += `<a href="/account/regEdit/${parseInt(account_id)}" style="font-size: 16px; margin-left: 0px;" >Edit Account Information</a>`
      grid7 += `<h2>Inventory Management</h2>`
      grid7 += `<a href="/../inv/management-2" style="font-size: 16px; margin-left: 0px">Manage Inventory</a>`
      return grid7
  } 
  
} 


 Util.buildMessageHead = () =>{
  let grid6
  if (check === "yes") {
      grid6 = "Welcome " + name + `<br>`
      grid6 += `<a title="Click to log out"  href="/" onclick="${clearCache()}" > Log Out </a>`
      return grid6
      
    }else if(check === "out"){
      
      grid6 = `<a title="Click to log in" onclick="${check="no"}" href="/account/" > My Account </a>`
      return grid6
    }else {
      grid6 = `<a title="Click to log in"  href="/account/" onclick="${check="out"}"> My Account </a>`
      return grid6

    }
    
 
}

module.exports = Util