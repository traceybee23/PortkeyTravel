const express = require('express');
const { Op } = require('sequelize');
//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation')

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User, Booking } = require('../../db/models');


const router = express.Router();

router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({
            "message": "Authentication required"
        })
    }
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }

    const spotId = Number(req.params.spotId)

    const spot = await Spot.findOne({
        where: { id: spotId },
        include: [
            {
                model: Booking,
                attributes: ['startDate', 'endDate']
            }
        ]
    })

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    if (spot.ownerId === user.id) {
        return res.status(403).json({
            "message": "Forbidden"
        })
    }

    let newStartDate = new Date(startDate)
    let newEndDate = new Date(endDate)

    const existingBooking = await Booking.findAll({
        where: {
            startDate: {
                [Op.between]: [newStartDate, newEndDate]
            }
        }
    })


    if (existingBooking) {
        existingBooking.forEach(booking => {

            if (!booking.startDate || !booking.endDate || newStartDate > newEndDate) {
                return res.status(400).json({
                    "message": "Bad Request",
                    "errors": {
                        "endDate": "endDate cannot be on or before startDate"
                    }
                })
            } else if (booking.startDate <= newStartDate && booking.endDate >= newEndDate ) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                        "startDate": "Start date conflicts with an existing booking",
                        "endDate": "End date conflicts with an existing booking"
                    }
                })
            }
        })
    }
    try {
        let newBooking = {}

        const booking = await Booking.create({ userId: user.id, spotId, startDate, endDate })

        newBooking.id = booking.id
        newBooking.spotId = spotId
        newBooking.userId = user.id
        newBooking.startDate = booking.startDate
        newBooking.endDate = booking.endDate
        newBooking.createdAt = booking.createdAt
        newBooking.updatedAt = booking.updatedAt

        return res.status(201).json(newBooking)

    } catch (error) {
        res.status(400).json({
            "message": "Bad Request",
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }
})

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const { user } = req;

    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    const bookings = await Booking.findAll({
        where: { spotId: req.params.spotId },
        attributes: {
            include: ['id'],
            exclude: ['spot']
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    })

    let bookingsList = [];

    bookings.forEach(booking => {
        bookingsList.push(booking.toJSON())
    })

    let bookingData = {};

    if (user.id !== spot.ownerId) {
        let bookingListNotOwner = [];
        bookingsList.forEach(booking => {
            bookingData.spotId = booking.spotId
            bookingData.startDate = booking.startDate
            bookingData.endDate = booking.endDate
            bookingListNotOwner.push(bookingData)
        })
        res.json({ Bookings: [bookingListNotOwner] })
    } else {
        let bookingListOwner = [];
        bookingsList.forEach(booking => {
            bookingData.User = booking.User
            bookingData.id = booking.id
            bookingData.spotId = booking.spotId
            bookingData.userId = booking.userId
            bookingData.startDate = booking.startDate
            bookingData.endDate = booking.endDate
            bookingData.createdAt = booking.createdAt
            bookingData.updatedAt = booking.updatedAt
            bookingListOwner.push(bookingData)
        })
        res.json({ Bookings: [bookingListOwner] })
    }

})

router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {

    const { user } = req;
    if (!user) {
        return res.status(401).json({
            "message": "Authentication required"
        })
    }

    const { review, stars } = req.body

    const spotId = Number(req.params.spotId)

    const spot = await Spot.findOne({
        where: { id: spotId },
        include: [
            {
                model: Review,
                attributes: ['userId']
            }
        ]
    })

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    spot.Reviews.forEach(review => {
        if (review.userId === user.id) {
            return res.status(500).json({
                "message": "User already has a review for this spot"
            })
        }
    })

    try {
        const newReview = await Review.create({ userId: user.id, spotId, review, stars })
        res.status(201).json(newReview)
    } catch (error) {
        error.message = "Bad Request"
        error.status = 400
        next(error)
    }

})

router.get('/:spotId/reviews', async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

    const reviews = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
            },
            {
                model: Image,
                attributes: ['id', 'url']
            }
        ]
    })

    let reviewList = [];

    reviews.forEach(review => {
        //console.log(spot)
        reviewList.push(review.toJSON())
    })

    reviewList.forEach(review => {
        review.ReviewImages = review.Images;
        delete review.Images
        if (review.ReviewImages.length < 1) {
            review.ReviewImages = "No available review images"
        }
    })

    res.json({ Reviews: reviewList })
})

router.post('/:spotId/images', requireAuth, async (req, res, next) => {

    const { user } = req;

    const { url, preview } = req.body;

    const spotId = Number(req.params.spotId);

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    });

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
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
        //console.log(safeUser)
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
        if (!spots.length) {
            return res.status(404).json({
                message: "Spots couldn't be found"
            })
        }
        if (!user) {
            return res.status(401).json({
                "message": "Authentication required"
            })
        }
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

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId
    try {
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

    const spot = await Spot.findOne({
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

    if (!spot) {
        const err = Error('Spot not found');
        err.message = "Spot couldn't be found";
        err.status = 404;
        return next(err)
    } else {

        const spotData = spot.toJSON()

        ///get avgStarRating
        let stars = 0;

        spotData.Reviews.forEach(review => {
            stars += review.stars
            spotData.numReviews = spotData.Reviews.length
            if (spot.Reviews.length > 1) {
                spotData.avgStarRating = stars / spotData.Reviews.length
            } else {
                spot.avgStarRating = review.stars
            }
        })
        delete spotData.Reviews

        spotData.Images.forEach(image => {
            if (!spot.Images) {
                spotData.SpotImages = "no images"
            } else {
                spotData.SpotImages = spot.Images
            }
        })
        delete spotData.Images


        spotData.Owner = spot.User
        delete spotData.User

        res.json(spotData)
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
