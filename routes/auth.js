const exp = require("express").Router();
const bcrypt = require("bcrypt");
const users = require("../db");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
exp.post(
  "/signup",
  [check("email", "Please provide a valid Mail").isEmail()],
  [
    check(
      "password",
      "Please provide a password greater than 5 Characters"
    ).isLength({ min: 6 }),
  ],
  async function(req, res) {
    const { email, password } = req.body;
    const error = validationResult(req);

    //validating the email & password
    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
      });
    }
    //validating if our user is already existing or not
    let user = users.find((user) => {
      return user.email == email;
    });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "This E-mail already exists.",
          },
        ],
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);
    console.log(email, password);
    users.push({
      email,
      password: hashPassword,
    });
    exp.post("/login",function(req, res) {
      const { password, email } = req.body;

      let user = users.find((user) => {
        return user.email === email;
      });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials",
            },
          ],
        });
      }
      let match = bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      const token = jwt.sign(
        {
          email,
        },
        "mynameissahil",
        {
          expiresIn: "36000",
        }
      );
      res.json({
        token,
      });
      res.send("authentication is working");
    });
  }
);

exp.get("/users", function(req, res) {
  res.json(users);
});
module.exports = exp;
