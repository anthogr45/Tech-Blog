const express = require('express');
const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const { Post } = require('../models');
const bloguserAuth = require('../utils/auth');
const { build } = require('../models/User');


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
       
      ]
    });
      const blogsData = dbblogData.get({ plain: true });
      const userId = blogsData.userId;
      const suserId = req.session.userid;
      console.log("User lllllllll"+ userId);  
      console.log("Session IIIIIIIIID" + req.session.userid);

      if (userId === suserId) {

        console.log("check 66666666666666")

        res.render('blogedit', {
         blogsData,
         loggedIn: req.session.loggedIn,
        })
      }else {

        console.log("check 22222222222222222222222222222222222")
        const userID = req.session.userid
        const dbblogData = await Blog.findAll({
          include: [
            {
              model: User,
              attributes: ['id','name','email'],
              where: { id: userID } 
            },
          ]
        });
        const blogData = dbblogData.map((blog) =>
        blog.get({plain: true}),
        );
      console.log("check daaaaaaaaaaaaataaa"+ blogData.post)
        // return res.status(403).send({ alertMessage: 'Only the Blog Post Owner Can Edit the Post!' });
        res.render('Error', {
          blogData,
          loggedIn: req.session.loggedIn,
          //  res.status(403).send({ alertMessage: 'Only the Blog Post Owner Can Edit the Post!' });
         })
       
      }
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

router.get('/accesscomment/:id', (req, res) => {
  const userID = req.session.userid;
  const blogID = req.params.id;
  console.log("ffffffffkkkkkkkkkllllllllllllll"+blogID);
  res.render('typecomment', {
    userID, blogID,
    loggedIn: req.session.loggedIn,
    
   });
});

router.post('/addcomment', async (req, res) => {

  console.log("New coment *********************************************" +req.body.blogid + req.session.userid )
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
          // alert("Only the Blog Post AUthor Can Edit or Delete the Post!");
          
          console.log( "***************************I am here buddy");
          // res.send({alertMessage: 'Only the Blog Post AUthor Can Edit or Delete the Post!'})
          // res.render('home', {alertMessage: 'Only the Blog Post AUthor Can Edit or Delete the Post!'})
          return res.status(403).send({ alertMessage: 'Only the Blog Post Owner Can Edit the Post!' });
                  
        }
});




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
    console.log("Check 111111111111111111111")
    await blogPost.destroy();
    res.status({ message: 'Blog post deleted successfully' });
    res.status(204).end();
  } 
  
  else {
    console.log("Check 22222222222222222")

    res.status({ alertMessage: 'Only the Blog Post Owner Can delete the Post!' })


  }
    // res.status(404).json({ alertMessage: 'Only the Blog Post Owner Can delete the Post!' });
    // res.status({ status: 'error', message: 'Resource not found', alertMessage: 'Only the Blog Post Owner Can delete the Post!' });
    // res.status(403).send(`<script> alert('Only the Blog Post Owner Can delete the Post!');</script>`);
    // return;
} catch (error) {
  console.log("Check 3333333333333333333333333333")
  console.error(error);
  res.status(500).json({ error: 'Failed to delete blog post' });
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
