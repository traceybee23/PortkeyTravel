const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')
const { Op } = require('sequelize');


const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User, Booking } = require('../../db/models');

const router = express.Router();

const validateQueries = [
    check('page')
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1')
        .optional(),
    check('size')
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1')
        .optional(),
    check('minLat')
        .isFloat({ min: -90 })
        .withMessage("Minimum latitude is invalid")
        .optional(),
    check('maxLat')
        .isFloat({ max: 90 })
        .withMessage("Maximum latitude is invalid")
        .optional(),
    check('minLng')
        .isFloat({ min: -180 })
        .withMessage("Minimum longitude is invalid")
        .optional(),
    check('maxLng')
        .isFloat({ max: 180 })
        .withMessage("Maximum longitude is invalid")
        .optional(),
    check('minPrice')
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0")
        .optional(),
    check('maxPrice')
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0")
        .optional(),
    handleValidationErrors
];

router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const { user } = req;

    if (!user) {
        return res.status(401).json({
            "message": "Authentication required"
        })
    }

    const { startDate, endDate } = req.body;

    if (!startDate || !endDate || (startDate >= endDate)) {
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

    if (spot.ownerId === user.id) return res.status(403).json({
        "message": "Forbidden"
    })

    let newStartDate = new Date(startDate).getTime()
    let newEndDate = new Date(endDate).getTime()

    const existingBooking = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })

    let errors = [];
    existingBooking.forEach(booking => {

        let currStartDate = booking.startDate.getTime()
        let currEndDate = booking.endDate.getTime()

        if ((newStartDate === currStartDate && newEndDate === currEndDate) ||
            (newStartDate > currStartDate && newEndDate < currEndDate) ||
            (newStartDate < currStartDate && newEndDate > currEndDate)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403
            err.errors = {
                startDate: "startDate conflicts with an existing booking",
                endDate: "endDate conflicts with an existing booking"
            }
            errors.push(err)
            next(err)
        }

        if (newStartDate === currStartDate || newStartDate === currEndDate ||
            (newStartDate >= currStartDate && newStartDate <= currEndDate)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403
            err.errors = {
                startDate: "startDate conflicts with an existing booking"
            }
            errors.push(err)
            next(err)
        }

        if (newEndDate === currStartDate || newEndDate === currEndDate ||
            (newEndDate >= currStartDate && newEndDate <= currEndDate)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403
            err.errors = {
                endDate: "endDate conflicts with an existing booking"
            }
            errors.push(err)
            next(err)
        }
    })

    if (!errors.length) {

        let newBooking = {};

        const booking = await Booking.create({ userId: user.id, spotId, startDate, endDate })

        newBooking.id = booking.id
        newBooking.spotId = spotId
        newBooking.userId = user.id
        newBooking.startDate = booking.startDate
        newBooking.endDate = booking.endDate
        newBooking.createdAt = booking.createdAt
        newBooking.updatedAt = booking.updatedAt

        return res.status(200).json(newBooking)
    }


})

router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const { user } = req;

    const spotId = req.params.spotId

    const existingSpot = await Spot.findByPk(spotId)

    if (!existingSpot) return res.status(404).json({
        message: "Spot couldn't be found"
    })

    if (existingSpot.ownerId !== user.id) {
        const bookings = await Booking.findAll({
            attributes: ['id', 'spotId', 'startDate', 'endDate'],
            where: {
                spotId
            }
        })
        return res.json({ Bookings: bookings })
    }
    if (existingSpot.ownerId === user.id) {
        const bookings = await Booking.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                }
            ],
            where: {
                spotId
            }
        })
        let bookingList = [];
        let empty = {}
        bookings.forEach(booking => {
            empty = {
                User: {
                    id: booking.User.id,
                    firstName: booking.User.firstName,
                    lastName: booking.User.lastName
                },
                id: booking.id,
                spotId: spotId,
                userId: booking.User.id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }

            bookingList.push(empty)

        })
        return res.json({ Bookings: bookingList })
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
    try {
        let errors = [];

        spot.Reviews.forEach(review => {
            if (review.userId === user.id) {
                const err = new Error("User already has a review for this spot")
                errors.push(err)
            }
        })

        if (errors.length) {
            return res.status(500).json({
                "message": "User already has a review for this spot"
            })
        }

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
        reviewList.push(review.toJSON())
    })

    reviewList.forEach(review => {
        review.ReviewImages = review.Images;
        delete review.Images
        if (review.ReviewImages.length < 1) {
            review.ReviewImages = "No available review images"
        }
    })

    if (!reviewList.length) {
        res.json({ Reviews: "No reviews found" })
    }

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
            spotsList.push(spot.toJSON())
        })

        ///get avgRating
        let stars = 0;
        spotsList.forEach(spot => {
            spot.Reviews.forEach(review => {
                stars += review.stars
                if (spot.Reviews.length > 1) {
                    spot.avgRating = stars / spot.Reviews.length
                } else {
                    spot.avgRating = review.stars
                }
            });
            if (!spot.avgRating) {
                spot.avgRating = "No ratings available"
            }
            delete spot.Reviews
        })
        spotsList.forEach(spot => {
            spot.Images.forEach(image => {
                if (!spot.Images) {
                    spot.previewImage = "image url"
                } else {
                    spot.previewImage = image.url
                }
            });
            if (!spot.previewImage) {
                spot.previewImage = "No preview image available"
            }
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

            spot.set({ address, city, state, country, lat, lng, name, description, price })

            await spot.save();

            return res.status(200).json(spot)
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

            return res.status(200).json({
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
                spotData.avgStarRating = review.stars
            }
        })
        if(!spotData.numReviews){
            spotData.numReviews = "No available reviews"
        }
        if(!spotData.avgStarRating) {
            spotData.avgStarRating = "No available ratings"
        }
        delete spotData.Reviews

        spotData.Images.forEach(image => {
            if (!spot.Images) {
                spotData.SpotImages = "no images"
            } else {
                spotData.SpotImages = spot.Images
            }
        })
        if(!spotData.SpotImages) {
            spotData.SpotImages = "No available spot images"
        }
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

            const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

            res.status(201).json(spot)
        }

    } catch (error) {

        error.message = "Bad Request"
        error.status = 400
        next(error)
    }
})


router.get('/', validateQueries, async (req, res, next) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const pagination = {};

    const where = {};

    if (req.query.page || req.query.size) {

        page = !page ? 1 : parseInt(page);
        size = !size ? 20 : parseInt(size);

        if (page >= 1 && size >= 1) {
            pagination.limit = size;
            pagination.offset = size * (page - 1)
        } else if (size > 20) {
            pagination.limit = 20
        } else if (page > 10) {
            pagination.offset = 10
        }

        if(minLat) {
            where.lat = { [Op.gte]: minLat }
        }
        if(maxLat) {
            where.lat = { [Op.lte]: maxLat }
        }
        if(minLat && maxLat) {
            where.lat = { [Op.between]: [minLat, maxLat] }
        }
        if(minLng) {
            where.lng = { [Op.gte]: minLng }
        }
        if(maxLng) {
            where.lng = { [Op.lte]: maxLng }
        }
        if(minLng && maxLng) {
            where.lng = { [Op.between]: [minLng, maxLng] }
        }
        if(minPrice) {
            where.price = { [Op.gte]: minPrice }
        }
        if(maxPrice) {
            where.price = { [Op.lte]: maxPrice }
        }
        if(minPrice && maxPrice) {
            where.price = { [Op.between]: [minPrice, maxPrice]}
        }
    }

    let spots = await Spot.findAll({
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
        where: {...where},
        ...pagination

    });

    let spotsList = [];


    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })

    let stars = 0;
    spotsList.forEach(spot => {
        spot.Reviews.forEach(review => {
            stars += review.stars
            if (spot.Reviews.length > 1) {
                spot.avgRating = stars / spot.Reviews.length
            } else {
                spot.avgRating = review.stars
            }
        });
        if (!spot.avgRating) {
            spot.avgRating = "No ratings available"
        }
        delete spot.Reviews
    })
    spotsList.forEach(spot => {
        spot.Images.forEach(image => {
            if (!spot.Images) {
                spot.previewImage = "image url"
            } else {
                spot.previewImage = image.url
            }
        });
        if (!spot.previewImage) {
            spot.previewImage = "No preview image available"
        }
        delete spot.Images
    })

    if(spotsList.length < size ) {
        size = spotsList.length
    }

    res.json({ Spots: spotsList, page, size })

})

module.exports = router;
