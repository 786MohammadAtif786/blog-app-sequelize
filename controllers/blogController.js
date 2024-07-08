const { Blog, User } = require('../models');
const response = require("../utils/response");

exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.userId;

  try {
    if (!title || !content) {
      return response(res, true, null, "All Fields are required", 400); 
    }
    const blog = await Blog.create({ title, content, userId });
    return response(res, true, blog, "Blog created successfully", 201);
  } catch (error) {
    return response(res, false, null, "Failed to create blog", 500);
  }
};

exports.updateBlog = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const blog = await Blog.findOne({ where: { id, userId } });
    if (!blog) return res.status(404).json({ error: 'Blog not found or not authorized' });

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    await blog.save();
    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const blog = await Blog.findOne({ where: { id, userId } });
    if (!blog) return res.status(404).json({ error: 'Blog not found or not authorized' });

    await blog.destroy();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

exports.publishBlog = async (req, res) => {
  const { id } = req.params;

  if (!req.user.isAdmin) return res.status(403).json({ error: 'Not authorized' });

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    blog.isPublished = true;
    await blog.save();
    res.status(200).json({ message: 'Blog published successfully', blog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish blog' });
  }
};

exports.getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { isPublished: true },
      include: [{ model: User, attributes: ['name'] }]
    });
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blogs' });
  }
};
