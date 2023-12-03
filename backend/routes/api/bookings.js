const express = require('express');
//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation')

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User, Booking } = require('../../db/models');
const review = require('../../db/models/review');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {

    const { user } = req;

    if (user) {
        const bookings = await Booking.findAll({
            where: { userId: user.id },
            attributes: {
                include: ['id'],
                exclude: ['spot'],
            },
            include: [
                {
                    model: Spot,
                    attributes: {
                        exclude: ['description', 'createdAt', 'updatedAt']
                    },
                    include: [
                        {
                            model: Image,
                            attributes: ['url']
                        }
                    ]
                },
            ],
        });
        if (!bookings.length) {
            return res.status(404).json({
                message: "Reviews couldn't be found"
            })
        }
        if (!user) {
            return res.status(401).json({
                "message": "Authentication required"
            })
        }
        let bookingsList = [];

        bookings.forEach(booking => {
            bookingsList.push(booking.toJSON())
        })

        let bookingData = {};

        bookingsList.forEach(booking => {
            if(!booking.Spot.Images) {
                booking.Spot.previewImage = "no image found"
            } else {
                booking.Spot.previewImage = booking.Spot.Images[0].url
            }
           bookingData.id = booking.id
           bookingData.spotId = booking.Spot.id
           bookingData.Spot = booking.Spot
           delete booking.Spot.Images
           bookingData.userId = user.id
           bookingData.startDate = booking.startDate
           bookingData.endDate = booking.endDate
           bookingData.createdAt = booking.createdAt
           bookingData.updatedAt = booking.updatedAt
        })

        res.json({Bookings: [bookingData]})
    }
})


module.exports = router;
