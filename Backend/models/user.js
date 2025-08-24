const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Case = require("../models/caseModel.js");

const MasterCase = mongoose.model("MasterCase", Case.schema);



const userSchema = new mongoose.Schema(
  {
    cases: [{ type: Object, ref: "MasterCase" }],
    type: {
      type: String,
      enum: ["Lawyer", "Litigant", "Judge", "Admin", "courtAdmin"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "e-mail is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password is required"],
      minlength: [6, "password must have at least (6) characters"],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    ordinaryPlaceOfWorking: {
      type: String,
      required: true,
      enum: ["High Court", "District Court", "Supreme Court"],
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    aadhar: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid Aadhar number!`,
      },
    },
    barNumber: {
      type: String,
    },
    pincode: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

// encrypting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// return a JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
};

module.exports = mongoose.model("User", userSchema);

// Schema Which I've followed :
// Type {Lawyer, Litigant, Judge, Admin }

// Name { type: String, required: true }
// Email { type: String }
// Password { at least (6) caracters }
// Date Of Birth { type: Integer, required: true }
// Ordinary Place of working :- (High Court or District Court or supreme court )
// District
// State
// Mobile { mobile number format }
// Adhar { max- 8 digits }
// District
// Pincode
// Gender { three types - male, female, Not Prefer to answer }
