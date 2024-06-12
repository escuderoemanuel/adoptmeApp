const { Router } = require('express');
const { showHome, showUsersList, showPetsList } = require('../controllers/views.controller');
const router = Router()


router.get('/', showHome);
router.get('/users', showUsersList);
router.get('/pets', showPetsList);

module.exports = {
  viewsRouter: router
};