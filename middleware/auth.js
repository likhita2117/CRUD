// middleware/auth.js

console.log("Just entered auth.js file");
function requireLogin(req, res, next) {
    console.log("Just entered auth.js function");
  if (req.session && req.session.loggedIn) {
    console.log("sent to next");
    return next();
  } else {
    console.log("move to login page");
    return res.redirect('/login');
  }
}

module.exports = requireLogin;
