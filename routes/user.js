const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

router.put('/update', authenticate, userController.updateUser);
router.delete('/delete', authenticate, userController.deleteUser);

module.exports = router;
