const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route_controllers.js');

router.get('/', routeController.router_index);
router.get('/add', routeController.router_add);
router.post('/', routeController.router_post);
router.get('/:topic', routeController.show_topic_questions);
router.get('/:topic/:id/update', routeController.question_update_page);
router.get('/:topic/:id', routeController.question_details);
router.delete('/:topic/:id', routeController.question_delete);
router.put('/:topic/:id', routeController.question_update);

module.exports = router;