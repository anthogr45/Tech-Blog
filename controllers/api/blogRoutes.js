// Server-side code
console.log("We are here");

// Import the necessary modules and models
const express = require('express');
const { Post } = require('../../models');

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

// Export the router
module.exports = router;