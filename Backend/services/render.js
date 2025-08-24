// HomeRoute Call back
exports.homeRoutes = (req, res) => {
    res.send("This is home route ur Welcome!!!");
}

// user login Call back
exports.loginRoute = (req, res) => {
    res.send("user is login in here");
}

// user register Call back
exports.registerRoute = (req, res) => {
    res.send("user is register in here means not logged In");
}