const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const head = await utilities.buildMessageHead()
  //req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav, head})
}

module.exports = baseController