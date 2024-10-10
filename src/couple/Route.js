const express = require('express');
const router = express.Router();
const authMiddleware = require('../user/middlewares/authMiddleware');
const coupleController = require('./Controller');
const { validateCoupleUpdate } = require('./Middlewares/CoupleSchema');

router.get('/', authMiddleware.verifyToken, coupleController.getCoupleInfo);

router.put(
  '/',
  authMiddleware.verifyToken,
  validateCoupleUpdate,
  coupleController.updateCouple,
);

module.exports = router;
