const sequelize = require('../config/connection');
const {User, Blog, Comment} = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });
  
    await User.bulkCreate(userData, {
      individualHooks: true,     
      returning: true,
      
    });

    await Comment.bulkCreate(commentData, {
    
        returning: true,
    });

    await Blog.bulkCreate(blogData, {
    
        returning: true,
    });

    console.log('\n----- DATABASE SYNCED -----\n');
  
    process.exit(0);
  };
  
  seedDatabase();