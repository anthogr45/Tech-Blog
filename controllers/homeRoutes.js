const express = require('express');
const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const { Post } = require('../models');
const bloguserAuth = require('../utils/auth');
const { build } = require('../models/User');

//Home page route
router.get('/', async (req, res) => {
  try {
    const dbblogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['id','name','email'],
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
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Dashboard Route - Shows only blog post specific to the user
router.get('/dashboard', async (req, res) => {
  console.log("vqvqvqvqvqvvqvqvqvqvqvqvqvqvvqvqqvqv");
  const userID = req.session.userid
  try {
    const dbblogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['id','name','email'],
          where: { id: userID } 
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
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Blog details - shows comments 
router.get('/blogedetails/:id', async (req, res) => {

  try {
    const dbblogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: Comment,
          attributes: ['comment', 'blog_id'],
          include: [User],
        },
      ],
    });

    const blogsData = dbblogData.get({ plain: true });

    if (blogsData) {
      const blogId = blogsData.id;
      const commentData = await Comment.findAll({
        where: { blog_id: blogId },
        include: [User],
      });

      res.render('blogcomment', {
        blogsData,
        blogComment: commentData, 
        loggedIn: req.session.loggedIn,
      });
    } else {
      console.log("No blog found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//TO Edit an existing blog
router.get('/blogedit/:id', async (req, res) => {
  console.log("I am Here baby xoxoxoxoxoxoxoxooxo");
  
  try {
    const dbblogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id','name'],
        },
       
      ]
    });
      const blogsData = dbblogData.get({ plain: true });
      const userId = blogsData.userId;
      const suserId = req.session.userid;
      console.log("User lllllllll"+ userId);  
      console.log("Session IIIIIIIIID" + req.session.userid);

      if (userId === suserId) {

         res.render('blogedit', {
         blogsData,
         loggedIn: req.session.loggedIn,
        })
      }else {

        res.render('Error',{
          blogsData,
          loggedIn: req.session.loggedIn,
        })
       
      }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login 
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});


router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signin');
});

router.get('/accesscomment/:id', (req, res) => {
  const userID = req.session.userid;
  const blogID = req.params.id;

  res.render('typecomment', {
    userID, blogID,
    loggedIn: req.session.loggedIn,
    
   });
});

//Commentin route
router.post('/addcomment', async (req, res) => {

  try{
    const commentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const dbUserData = await Comment.create({
      comment: req.body.commentDetails,
      blogId: req.body.blogId,
      commentDate: commentDate,
      userId: req.session.userid,

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





// PUT route to update a blog post
router.put('/blogupdate/:id'/*,bloguserAuth*/, async (req, res) => {

      var dbblogData = await Blog.findByPk(req.params.id);
        
      var blogData = dbblogData.get({ plain: true });
      var buID = blogData.userId;
      var suID = req.session.userid;
      console.log("PUT User lllllllll"+ buID);  
      console.log("PUT Session IIIIIIIIID" + suID);
      if (buID === suID) {    
       try {

           console.log('req.params:', req.params)
           // Retrieve the blog post ID from the request parameters
           const postId = parseInt(req.params.id);
           console.log(postId + "***************************ANtho");

  
           const updatedBlog = await Blog.update( 
              {
                title: req.body.postTitle,
                post: req.body.postContent
    
              },
    
              {
                  where: {
                    id: req.params.id
                  }
              },
               res.status(200).json({ message: 'Blog post updated successfully' })
    
            );

            } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Internal server error' });
            }
        }else{
         
          return res.status(403).send({ alertMessage: 'Only the Blog Post Owner Can Edit the Post!' });
                  
        }
});


//Delete blog

router.delete('/blogdelete/:id', bloguserAuth, async (req, res) => {

try {
  const blogPost = await Blog.findByPk(req.params.id);

  if (!blogPost) {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  const blogData = blogPost.get({ plain: true });
  const buID = blogData.userId;
  const suID = req.session.userid;

  console.log("Check Check CHeck1" + buID+suID)

  if (buID === suID) {
    await blogPost.destroy();
    res.status({ message: 'Blog post deleted successfully' });
    res.status(204).end();
  } 
  
  else {
     res.status({ alertMessage: 'Only the Blog Post Owner Can delete the Post!' })


  }

} catch (error) {
  
  console.error(error);
  res.status(500).json({ error: 'Failed to delete blog post' });
}
});


router.get('/newblogpost', async (req, res) => {
 try {
  
  var nEmail = req.session.email;
  
  
    const dbblogData = await User.findOne({ where: { email:nEmail } });
   
    const blogData = dbblogData.get({plain: true})
        
    let authorName = blogData.name;
    let userId = blogData.id;
    res.render('newblog', {
      authorName, userId,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
