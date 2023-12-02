const express = require('express');
//const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User } = require('../../db/models');


const router = express.Router();

router.post('/:spotId/images', requireAuth, async (req, res, next) => {

    const { user } = req;

    const { url, preview } = req.body

    const spotId = Number(req.params.spotId)

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })
    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    if (user.id !== spot.ownerId) {
        res.status(403).json({
            "message": "Forbidden"
        })
    }

    let newImage = {
        imageableId: spotId,
        imageableType: "Spot",
        url: url,
        preview: preview
    }
    const spotImage = await Image.create(newImage)

    const imageBody = {};
    imageBody.id = spotImage.id;
    imageBody.url = spotImage.url;
    imageBody.preview = spotImage.preview

    res.json(imageBody)
})


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

router.put('/:spotId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const spot = await Spot.findOne({
            where: {
                id: spotId
            }
        })
        if (!spot) {
            res.status(404).json({
                "message": "Spot couldn't be found"
            })
        }
        if (!user) {
            res.status(401).json({
                "message": "Authentication required"
            })
        }
        if (user.id !== spot.ownerId) {
            res.status(403).json({
                "message": "Forbidden"
            })
        }

        if (user) {

            spot.set({ address, city, state, country, lat, lng, name, description, price })

            await spot.save();

            res.status(200).json(spot)
        }

    } catch (error) {
        error.message = "Bad Request"
        error.status = 400
        next(error)
    }
});

router.delete('/:spotId', async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const spot = await Spot.findOne({
            where: {
                id: spotId
            }
        })
        if (!spot) {
            return res.status(404).json({
                "message": "Spot couldn't be found"
            })
        }
        if (!user) {
            return res.status(401).json({
                "message": "Authentication required"
            })
        }
        if (user.id !== spot.ownerId) {
            return res.status(403).json({
                "message": "Forbidden"
            })
        }

        if (user) {

            await spot.destroy(spot)

            res.status(200).json({
                "message": "Successfully deleted"
            })
        }

    } catch (error) {
        error.message = "Bad Request"
        error.status = 400
        next(error)
    }
});

router.get('/:spotId', async (req, res, next) => {

    const spots = await Spot.findAll({
        where: { id: req.params.spotId },
        include: [
            {
                model: Review,
                attributes: ['stars'],
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

        ///get avgStarRating
        let stars = [];
        spotsList.forEach(spot => {
            spot.Reviews.forEach(review => {
                spot.numReviews = spot.Reviews.length
                if (spot.Reviews.length > 1) {
                    stars.push(review.stars)
                    spot.avgStarRating = (stars.reduce((acc, curr) => acc + curr, 0) / stars.length)
                } else {
                    spot.avgStarRating = review.stars
                }
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
        res.json(...spotsList)
    }
})


router.post('/', requireAuth, async (req, res, next) => {
    const { user } = req;
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body

        if (user) {
            const ownerId = user.id
            console.log(user.id)
            const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

            res.status(201).json(spot)
        }

    } catch (error) {

        error.message = "Bad Request"
        error.status = 400
        next(error)
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
