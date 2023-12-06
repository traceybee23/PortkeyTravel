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

    let newStartDate = new Date(startDate)
    let newEndDate = new Date(endDate)

    const existingBooking = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })

    let errors = [];

    existingBooking.forEach(booking => {
        if ((newStartDate >= booking.startDate && newStartDate <= booking.endDate) ||
            (newEndDate >= booking.startDate && newEndDate <= booking.endDate)) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            errors.push(err)
        }
    })
    if (errors.length) {
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
        })
    } else {
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

    let errors = [];

    spot.Reviews.forEach(review => {
        if (review.userId === user.id) {
            const err = new Error("User already has a review for this spot")
            errors.push(err)
        }
    })

    if (errors) {
        return res.status(500).json({
            "message": "User already has a review for this spot"
        })
    }

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


router.get('/', async (req, res, next) => {

    let errorResult = { message: "Bad Request", errors: {} };

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
try {

    if(!page) {
        errorResult.errors.page = "Page must be greater than or equal to 1"
        next(errorResult)
    }
     if (!size) {
        errorResult.errors.size = "Size must be greater than or equal to 1"
        next(errorResult)
    }


    const pagination = {};

    page = parseInt(page);
    size = parseInt(size);


    if (size > 20) {
        pagination.limit = 20
    } else if (page > 10) {
        pagination.offset = 10
    } else if (page >= 1 && size >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1)
    }

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
        ...pagination
    });

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
            //console.log(image.url)
            if (!spot.Images) {
                spot.previewImage = "image url"
            } else {
                spot.previewImage = image.url
            }
        })
        delete spot.Images
    })

    const filteredResults = [];

    if(minLat) {
        spotsList.forEach(spot => {
            if(spot.lat > minLat) {
                filteredResults.push(spot)
            }
        })
        res.json({ Spots: filteredResults, page, size })
    }
    if(maxLat) {
        spotsList.forEach(spot => {
            if(spot.lat < maxLat) {
                filteredResults.push(spot)
            }
        })
        res.json({ Spots: filteredResults, page, size })
    }
    if(minLng) {
        spotsList.forEach(spot => {
            if(spot.lng > minLng) {
                filteredResults.push(spot)
            }
        })
        res.json({ Spots: filteredResults, page, size })
    }
    if(maxLng) {
        spotsList.forEach(spot => {
            if(spot.lng < maxLng) {
                filteredResults.push(spot)
            }
        })
        res.json({ Spots: filteredResults, page, size })
    }

    if(minPrice > 0) {
        spotsList.forEach(spot => {
            if(spot.price > minPrice) {
                filteredResults.push(spot)
            }
        })
        res.json({ Spots: filteredResults, page, size })
    } else {
        errorResult.errors.minPrice = "Minimum price must be greater than or equal to 0"
        next(errorResult)
    }
    if(maxPrice > 0) {
        spotsList.forEach(spot => {
            if(spot.price < maxPrice) {
                filteredResults.push(spot)
            }
        })
        res.json({ Spots: filteredResults, page, size })
    }else {
        errorResult.errors.maxPrice = "Maximum price must be greater than or equal to 0"
        next(errorResult)
    }

  /// res.json({ Spots: spotsList, page, size })
} catch (error) {
    res.json(errorResult)
}
})

module.exports = router;
