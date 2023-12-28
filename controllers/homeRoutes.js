const express = require('express');
const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const { Post } = require('../models');
const bloguserAuth = require('../utils/auth');


router.get('/', /*withAuth,*/ async (req, res) => {
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

router.get('/dashboard', /*withAuth,*/ async (req, res) => {
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


router.get('/blogedetails/:id', /* withAuth */ async (req, res) => {
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


router.get('/blogedit/:id',/* withAuth*/ async (req, res) => {
  console.log("I am Here baby xoxoxoxoxoxoxoxooxo");
  
  try {
    const dbblogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id','name'],
        },
        // {
        //   model:Comment,
        //   attributes:['commentId','comment', 'commentDate']
        // }

      ]
    });
      const blogsData = dbblogData.get({ plain: true });
      const userId = blogsData.userId;
      console.log("User lllllllll"+ userId);  
      console.log("Session IIIIIIIIID" + req.session.userid);

    res.render('blogedit', {
      blogsData,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

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
// PUT route to update a blog post
router.put('/blogedit/:id'/*,bloguserAuth*/, async (req, res) => {

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
          // alert("Only the Blog Post AUthor Can Edit or Delete the Post!");
          
          console.log( "***************************I am here buddy");
          // res.send({alertMessage: 'Only the Blog Post AUthor Can Edit or Delete the Post!'})
          // res.render('home', {alertMessage: 'Only the Blog Post AUthor Can Edit or Delete the Post!'})
          return res.status(403).send({ alertMessage: 'Only the Blog Post Owner Can Edit the Post!' });
                  
        }
});


router.delete('/blogedit/:id', bloguserAuth, async (req, res) => {
  console.log("xxxxxxxxxxpppppp" + req.params.id);
  var blogID = req.params.id;
  try {
    const dbblogData = await Blog.findByPk(blogID);
    if (!dbblogData) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    const blogData = dbblogData.get({ plain: true });
    const buID = blogData.userId;
    const suID = req.session.userid;

    console.log("xxxxxxxxxxppppppccsdcscsc" + buID + suID );

    if (buID === suID) {
      const deletedBlog = await Blog.destroy({
        where: {
          id: blogID
        }
      });
      if (deletedBlog) {
        res.status(200).json({ message: 'Blog post deleted successfully' });
      } else {
        res.status(500).json({ message: 'Failed to delete blog post' });
      }
    } else {
      res.status(403).json({ error: 'You are not authorized to delete this blog post' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/newblogpost', /*withAuth,*/ async (req, res) => {
 try {
  console.log(  req.session.email + "*****NEWBOLGPSTY************")
  var nEmail = req.session.email;
  console.log(  nEmail + "*****NEWBOLGPSTY************")
  
    const dbblogData = await User.findOne({ where: { email:nEmail } });
    console.log( dbblogData + "*****NEWBOLGPSTY************")
    const blogData = dbblogData.get({plain: true})
      
    // const blogData = dbblogData.map(blog => blog.get({ plain: true }));
      console.log( blogData.name + "/*/*//*/NEWBOLGPSTY************")
    
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




    


// Export the router
module.exports = router;
