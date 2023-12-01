const express = require('express');
//const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Image } = require('../../db/models');
const e = require('express');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req;

    if (user) {
        const safeUser = {
            ownerId: user.id
        }
        console.log(safeUser)
        const spots = await Spot.findAll({
            where: safeUser,
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
        })
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
    }
})

router.get('/:spotId', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['stars'],
            },
            {
                model: Image,
                attributes: ['id', 'url', ],
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
    res.json({ Spots: spotsList })
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
