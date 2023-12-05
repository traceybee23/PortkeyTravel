const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Image } = require('../../db/models');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter);

router.use('/bookings', bookingsRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.delete('/spot-images/:imageId', (req, res, next) => {

})
router.delete('/review-images/:imageId', (req, res, next) => {

})

module.exports = router;
