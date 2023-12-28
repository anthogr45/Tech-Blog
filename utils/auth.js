const express = require('express');
const router = require('express').Router();
const { User, Blog, Comment } = require('../models');



const bloguserAuth = (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
      var dbblogData = Blog.findByPk(req.params.id)
        
      var blogData = dbblogData.get({ plain: true });
      var buID = blogData.user_id;
      var suID = req.session.userid;
  }  

  if (buID === suID) {
    next()
  }else{
    alert("Only the Blog Post AUthor Can Edit or Delete the Post!");

  }
    
};

module.exports = bloguserAuth;
