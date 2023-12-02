// Server-side code

console.log("We are here");

// Import the necessary modules and models
const express = require('express');
const { Post, Blog } = require('../../models');

// Create a router
const router = express.Router();

// PUT route to update a blog post
router.put('/blogedit/:id', async (req, res) => {
  try {
    // Retrieve the blog post ID from the request parameters
    const postId = req.params.id;

    // Find the blog post in the database
    const post = await Post.findOne({ where: { id: postId } });

    // If the blog post is found, update its content with the edited data
    if (post) {
      await Post.update(req.body);
      res.status(200).json({ message: 'Blog post updated successfully' });
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/new/', async (req, res) => {

  console.log("New Blog *********************************************" + res.body)
  try{
    const dbUserData = await Blog.create({
      title: req.body.postTitle,
      post: req.body.postContent,
      blogDate: req.body.blogpostDate,
      userId: req.body.useridValue,

    });
    
    req.session.save(() => {
      req.session.loggedIn = true;

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



// Export the router
module.exports = router;