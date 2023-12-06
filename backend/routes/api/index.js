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

router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {

  const { user } = req;

  if (!user) {
    return res.status(401).json({
      "message": "Authentication required"
    })
  }
  const imgId = req.params.imageId

  const image = await Image.findByPk(imgId)

  if (image) {
    const spot = await Spot.findOne({
      where: {
        id: image.imageableId
      }
    })

    if (user.id !== spot.ownerId) {
      return res.status(403).json({
        "message": "Forbidden"
      })
    }

    await image.destroy(image)

    return res.status(200).json({
      "message": "Successfully deleted"
    })
  } else {
    return res.status(404).json({
      "message": "Spot Image couldn't be found"
    })
  }

})
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {

  const { user } = req;

  if (!user) {
    return res.status(401).json({
      "message": "Authentication required"
    })
  }
  const imgId = req.params.imageId

  const image = await Image.findByPk(imgId)

  if (image) {
    const review = await Review.findOne({
      where: {
        id: image.imageableId
      }
    })

    if (user.id !== review.userId) {
      return res.status(403).json({
        "message": "Forbidden"
      })
    }

    await image.destroy(image)

    return res.status(200).json({
      "message": "Successfully deleted"
    })
  } else {
    return res.status(404).json({
      "message": "Review Image couldn't be found"
    })
  }
})

module.exports = router;
