const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

// check is user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("You must log in!", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("You must log in!", 401));
  }
};

// check is user is Judge
exports.isJudge = (req, res, next) => {
  // Assuming that req.user is set by the isAuthenticated middleware
  const { user } = req;

  if (user && user.type === "Judge") {
    next();
  } else {
    return next(
      new ErrorResponse("Access denied. Only Judges are allowed.", 403)
    );
  }
};
// check if the user is courtAdmin
exports.isCourtAdmin = (req, res, next) => {
  // Assuming that req.user is set by the isAuthenticated middleware
  const { user } = req;

  if (user && user.type === "courtAdmin") {
    next();
  } else {
    return next(
      new ErrorResponse("Access denied. Only Court admins are allowed.", 403)
    );
  }
};


// check is user is Lawyer
exports.isLawyer = (req, res, next) => {
  const { user } = req;

  if (user && user.type === "Lawyer") {
    next();
  } else {
    return next(
      new ErrorResponse("Access denied. Only Lawyers are allowed.", 403)
    );
  }
};

exports.isLitigant = (req, res, next) => {
  const { user } = req;

  if (user && user.type === "Litigant") {
    next();
  } else {
    return next(
      new ErrorResponse("Access denied. Only Litigants are allowed.", 403)
    );
  }
};

// Allow both Lawyers and Litigants to file cases
exports.canFileCase = (req, res, next) => {
  const { user } = req;

  if (user && (user.type === "Lawyer" || user.type === "Litigant")) {
    next();
  } else {
    return next(
      new ErrorResponse("Access denied. Only Lawyers and Litigants can file cases.", 403)
    );
  }
};

// check is user is Admin
exports.isAdmin = (req, res, next) => {
  const { user } = req;

  if (user && user.type === "Admin") {
    next();
  } else {
    return next(
      new ErrorResponse("Access denied. Only Admins are allowed.", 403)
    );
  }
};

//middleware for admin
// exports.isAdmin = (req, res, next) => {
//     if (req.user.role === 0) {
//         return next(new ErrorResponse('Access denied, you must an admin', 401));
//     }
//     next();
// }
