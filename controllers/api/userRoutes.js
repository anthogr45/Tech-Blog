const router = require('express').Router();
const session = require('express-session');
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');


router.post('/', async (req, res) => {
  let dbUserData;
  try {
      dbUserData = await User.create({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    var blogData = dbUserData.get({plain: true})
   
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

  req.session.save(() => {
    req.session.loggedIn = true;
    req.session.userid = blogData.id;
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    
    res.status(200).json(dbUserData);
   });
});



router.post('/login', async (req, res) => {

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
      req.session.email = userData.email;
      req.session.loggedIn = true;
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
  });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
