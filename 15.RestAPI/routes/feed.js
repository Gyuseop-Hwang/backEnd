
const { Router } = require('express');

const router = Router();
const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPost);

router.post('/post', feedController.createPost);

module.exports = router;