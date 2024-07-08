const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticate = require('../middleware/authenticate');

router.post('/create', authenticate, blogController.createBlog);
router.put('/update/:id', authenticate, blogController.updateBlog);
router.delete('/delete/:id', authenticate, blogController.deleteBlog);
router.put('/publish/:id', authenticate, blogController.publishBlog);
router.get('/', blogController.getPublishedBlogs);

module.exports = router;
