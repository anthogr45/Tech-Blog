const express = require('express');
const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const { Post } = require('../models');


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
        

    res.render('blogedit', {
      blogData,
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
router.put('/blogedit/:id', async (req, res) => {
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
});


router.delete('/blogedit/:id', async (req, res) => {
try {
  const deletedBlog = await Blog.destroy( {
        where: {
            id: req.params.id
        },
  });

  if (deletedBlog) {
    
  // .then((deletedBlog) => {
    res.render('homepage', {
      blogData,
      loggedIn: req.session.loggedIn,
      
    });
  }else {
    res.status(404).send('Blog not found');
  } 

} catch (error) {
  // Handle errors here, e.g., log the error and send an appropriate response
  console.error(error);
  res.status(500).send('Internal Server Error');
}
  // })
 
  // .catch((err) => res.json(err));
});


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


router.get('/newblogpost', /*withAuth,*/ async (req, res) => {
 try {
  console.log(  req.session.email + "*****NEWBOLGPSTY************")
  var nEmail = req.session.email;
  console.log(  nEmail + "*****NEWBOLGPSTY************")
  
    const dbblogData = await User.findOne({ where: { email:nEmail } });
    console.log( dbblogData + "*****NEWBOLGPSTY************")
    // const blogData = dbblogData.map((blog) => 
    //     blog.get({plain: true})
    //   );
    const blogData = dbblogData.map(blog => blog.get({ plain: true }));
      console.log( blogData + "*****NEWBOLGPSTY************")
    
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



 
  
  // try {
  //   const userId = req.session.user_id
  //   console.log(userId);
  //   // const dbblogData = await Blog.findByPk(req.params.id, {
  //   //   include: [
  //   //     {
  //   //       model: User,
  //   //       attributes: ['id','name'],
  //   //     },
  //   //     {
  //   //       model:Comment,
  //   //       attributes:['commentId','comment', 'commentDate']
  //   //     }

  //   //   ]
  //   // });
  //   //   const blogData = dbblogData.get({ plain: true });
        

  //   // res.render('blogedit', {
  //   //   blogData,
  //   // //   loggedIn: req.session.loggedIn,
  //   // });
  // } catch (err) {
  //   res.status(500).json(err);
  // }


    


// Export the router
module.exports = router;
