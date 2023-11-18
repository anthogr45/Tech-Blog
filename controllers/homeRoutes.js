const express = require('express');
const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const { Post } = require('../models');
// const { BlogPost } = require('../models');
// const withAuth = require('../utils/auth');



router.get('/', /*withAuth,*/ async (req, res) => {
  try {
    const dbblogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['id','name'],
        },
        {
          model:Comment,
          attributes:['commentId','comment', 'commentDate']
        }

      ]
    });
      const blogData = dbblogData.map((blog) =>
        blog.get({plain: true})
      );
    

    res.render('homepage', {
      blogData,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/blogedit/:id', /*withAuth,*/ async (req, res) => {
  try {
    const dbblogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id','name'],
        },
        {
          model:Comment,
          attributes:['commentId','comment', 'commentDate']
        }

      ]
    });
      const blogData = dbblogData.get({ plain: true });
      //   blog.get({plain: true})
      // );
    

    res.render('blogedit', {
      blogData,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// router.put('/blogedit/:id', async (req, res) => {
//   try {
//     // Retrieve the blog post ID from the request parameters
//     const postId = req.params.id;

//     console.log(req.params.id + "ANil")

//     // Find the blog post in the database
//     // const post = await Blog.findAll({ where: { id: req.params.id } });
//     const post = await BlogPost.find({ where: { id: req.params.id } });;

//     // If the blog post is found, update its content with the edited data
//     if (!post) {
//       res.status(404).json({ message: 'Blog post not found' });
//       return;
//     }
//     post.title = req.body.Title;
//     post.post = req.body.post;

//     await post.save();
    
//     res.status(200).json({ message: 'Blog post updated successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;

// PUT route to update a blog post
router.put('/blogedit/:id', async (req, res) => {
  try {

    console.log('req.params:', req.params)
    // Retrieve the blog post ID from the request parameters
    const postId = parseInt(req.params.id);
    console.log(postId + "***************************ANtho");

    // Find the blog post in the database
    const post = await Post.findAll({ where: { id: postId} });

    // If the blog post is found, update its content with the edited data
    if (post) {
      await post.update(req.body);
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
