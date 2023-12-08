const express = require('express');

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

    existingBooking.forEach(booking => {

        let currStartDate = booking.startDate.getTime()
        let currEndDate = booking.endDate.getTime()

        if ((newStartDate === currStartDate && newEndDate === currEndDate) ||
            (newStartDate >= currStartDate && newEndDate <= currEndDate) ||
            (newStartDate <= currStartDate && newEndDate >= currEndDate)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403
            err.errors = {
                startDate: "startDate conflicts with an existing booking",
                endDate: "endDate conflicts with an existing booking"
            }
            next(err)
        }

        if (newStartDate === currStartDate || newStartDate === currEndDate ||
            (newStartDate >= currStartDate && newStartDate <= currEndDate)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403
            err.errors = {
                startDate: "startDate conflicts with an existing booking"
            }
            next(err)
        }

        if (newEndDate === currStartDate || newEndDate === currEndDate ||
            (newEndDate >= currStartDate && newEndDate <= currEndDate)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403
            err.errors = {
                endDate: "endDate conflicts with an existing booking"
            }
            next(err)
        }
    })

    let newBooking = {}

    const booking = await Booking.create({ userId: user.id, spotId, startDate, endDate })

    newBooking.id = booking.id
    newBooking.spotId = spotId
    newBooking.userId = user.id
    newBooking.startDate = booking.startDate
    newBooking.endDate = booking.endDate
    newBooking.createdAt = booking.createdAt
    newBooking.updatedAt = booking.updatedAt

    return res.status(200).json(newBooking)

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
            })
            delete spot.Reviews
        })

        //attach images
        spotsList.forEach(spot => {
            spot.Images.forEach(image => {
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

            const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price })

            res.status(201).json(spot)
        }

    } catch (error) {

        error.message = "Bad Request"
        error.status = 400
        next(error)
    }
})


router.get('/', async (req, res, next) => {

    let errorResult = { status: 400, message: "Bad Request", errors: {} };

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const pagination = {};

    page = !page ? 1 : parseInt(page);
    size = !size ? 20 : parseInt(size);

    if (size > 20) {
        pagination.limit = 20
    } else if (page > 10) {
        pagination.offset = 10
    } else if (page >= 1 && size >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1)
    }

    if (!page || page <= 0) {
        errorResult.errors.page = "Page must be greater than or equal to 1"
        next(errorResult)
    }
    if (!size || size <= 0) {
        errorResult.errors.size = "Size must be greater than or equal to 1"
        next(errorResult)
    }
    if (maxLat < -90 || maxLat > 90) {
        errorResult.errors.maxLat = "Maximum latitude is invalid"
        next(errorResult)
    }
    if (minLat < -90 || minLat > 90) {
        errorResult.errors.minLat = "Minimum latitude is invalid"
        next(errorResult)
    }
    if (maxLng < -180 || maxLng > 180) {
        errorResult.errors.maxLng = "Maximum longitude is invalid"
        next(errorResult)
    }
    if (minLng < -180 || minLng > 180) {
        errorResult.errors.minLng = "Minimum longitude is invalid"
        next(errorResult)
    }
    if (parseInt(minPrice) < 0) {
        errorResult.errors.minPrice = "Minimum price must be greater than or equal to 0"
        next(errorResult)
    }
    if (parseInt(maxPrice) < 0) {
        errorResult.errors.maxPrice = "Maximum price must be greater than or equal to 0"
        next(errorResult)
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
        })
        delete spot.Reviews
    })

    //attach images
    spotsList.forEach(spot => {
        spot.Images.forEach(image => {
            if (!spot.Images) {
                spot.previewImage = "image url"
            } else {
                spot.previewImage = image.url
            }
        })
        delete spot.Images
    })

    if (!req.query.page || !req.query.size) {
        res.json({ Spots: spotsList })
    } else {
        const filteredResults = [];

        if (minLat || maxLat || minLng || maxLng || minPrice || maxPrice) {
            spotsList.forEach(spot => {
                if (minLat && maxLat && minLng && maxLng && minPrice && maxPrice) {
                    if ((spot.lat > minLat) && (spot.lat < maxLat) && (spot.lng > minLng) && (spot.lng < maxLng) &&
                        (spot.price > minPrice) && (spot.price < maxPrice)) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                } else if (!minLat) {
                    if (spot.lat < maxLat) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                } else if (!maxLat) {
                    if (spot.lat > minLat) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                } else if (minLat && maxLat) {
                    if ((spot.lat > minLat) && (spot.lat < maxLat)) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                } else if (!minLng) {
                    if (spot.lng < maxLng) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                } else if (!maxLng) {
                    if (spot.lng > minLng) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                } else if (minLng && maxLng) {
                    if ((spot.lng > minLng) && (spot.lng < maxLng)) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                } else if (minPrice && maxPrice) {
                    if ((spot.price > minPrice) && (spot.price < maxPrice)) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }

                } else if (!minPrice) {
                    if (spot.price < maxPrice) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                } else if (!maxPrice) {
                    if (spot.price > minPrice) {
                        if (!filteredResults.includes(spot)) {
                            filteredResults.push(spot)
                        }
                    }
                }
            })
            if (!filteredResults.length) {
                res.status(404).json({
                    message:
                        "Spot not found"
                })
            }
        }
        res.json({ Spots: filteredResults, page, size })
    }
})

module.exports = router;
