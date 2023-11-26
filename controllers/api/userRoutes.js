const router = require('express').Router();
const session = require('express-session');
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');





router.post('/login', async (req, res) => {
  console.log ("XnxnxnxnxnnxnxnnxnxnxnxnxnxnxnxnxnxnxnxnxnxnxnxxXXXXXX")
  const { email, password } = req.body;
  console.log(email, password)
  try {
   
    const userData = await User.findOne({ where: { email:email } });
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect  password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.userid = userData.id;
      req.session.username = userData.name;
      req.session.loggedIin = true;
      console.log(  req.session.user_id + "Xoxoxoxoxoxoxoxoxoxoxoxoxoxoo")
      console.log( req.session.username + "***********************////////");
      res.json({ user: userData, message: 'You are now logged in!' });
    });

     console.log( req.session.username + "***********************////////");

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
      // res.redirect('/login');
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
