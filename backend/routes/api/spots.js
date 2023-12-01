const express = require('express');
//const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User, sequelize } = require('../../db/models');
const e = require('express');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req;

    if (user) {
        const safeUser = {
            ownerId: user.id
        }
        const spots = await Spot.findAll({
            where: safeUser,
            include: [
                {
                    model: Review,
                    attributes: [
                        'stars',
                        [sequelize.fn('AVG', sequelize.col('stars')), 'avg_stars']
                    ],
                },
                {
                    model: Image,
                    attributes: ['url'],
                }
            ],
        })
        console.log(spots)
        let spotsList = [];

        spots.forEach(spot => {
            //console.log(spot)
            spotsList.push(spot.toJSON())
        })
        console.log(spotsList)
        ///get avgRating
        spotsList.forEach(spot => {
            spot.Reviews.forEach(review => {
                spot.numReviews = spot.Reviews.length
                spot.avgStarRating = review.avg_stars
            })
            delete spot.Reviews
        })

        //attach images
        spotsList.forEach(spot => {
            spot.Images.forEach(image => {
                //console.log(image.url)
                if (!spot.Images) {
                    spot.previewImage = "image url"
                } else {
                    spot.previewImage = image.url
                }
            })
            delete spot.Images
        })
        res.json({ Spots: spotsList })
    }
})

router.get('/:spotId', async (req, res, next) => {

    const spots = await Spot.findAll({
        where: { id: req.params.spotId },
        include: [
            {
                model: Review,
                attributes: [
                    'stars',
                    [sequelize.fn('AVG', sequelize.col('stars')), 'avg_stars']
                ],
            },
            {
                model: Image,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
            }
        ],
    });

    console.log(spots)

    if (!spots.length) {
        const err = Error('Spot not found');
        err.message = "Spot couldn't be found";
        err.status = 404;
        return next(err)
    } else {
        let spotsList = [];

        spots.forEach(spot => {
            spotsList.push(spot.toJSON())
        })

        ///make avgStarRating
        spotsList.forEach(spot => {
            spot.Reviews.forEach(review => {
                spot.numReviews = spot.Reviews.length
                spot.avgStarRating = review.avg_stars
            })
            delete spot.Reviews
        })

        spotsList.forEach(spot => {
            spot.Images.forEach(image => {
                if (!spot.Images) {
                    spot.SpotImages = "no images"
                } else {
                    spot.SpotImages = spot.Images
                }
            })
            delete spot.Images
        })

        spotsList.forEach(spot => {
            spot.Owner = spot.User
            delete spot.User
        })
        res.json({ Spots: spotsList })
    }
})

router.get('/', async (req, res) => {

    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['stars'],
            },
            {
                model: Image,
                attributes: ['url'],
            }
        ],
    });

    let spotsList = [];

    spots.forEach(spot => {
        //console.log(spot)
        spotsList.push(spot.toJSON())
    })

    ///get avgRating
    let stars = [];
    spotsList.forEach(spot => {
        spot.Reviews.forEach(review => {
            if (spot.Reviews.length > 1) {
                stars.push(review.stars)
                spot.avgRating = (stars.reduce((acc, curr) => acc + curr, 0) / stars.length)
            } else {
                spot.avgRating = review.stars
            }
        })
        delete spot.Reviews
    })

    //attach images
    spotsList.forEach(spot => {
        spot.Images.forEach(image => {
            //console.log(image.url)
            if (!spot.Images) {
                spot.previewImage = "image url"
            } else {
                spot.previewImage = image.url
            }
        })
        delete spot.Images
    })
    res.json({ Spots: spotsList })
})

module.exports = router;
