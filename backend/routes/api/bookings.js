const express = require('express');
//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation')

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User, Booking } = require('../../db/models');
const review = require('../../db/models/review');

const router = express.Router();

router.put('/:bookingId', requireAuth, async (req, res, next) => {

    const { user } = req;

    const bookingId = req.params.bookingId;

    const { startDate, endDate } = req.body;
    let newStartDate = new Date(startDate)
    let newEndDate = new Date(endDate)

    if (!startDate || !endDate || (startDate >= endDate)) {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }

    const existingBooking = await Booking.findByPk(bookingId, {
        include: {
            model: Spot
        },
        where: {
            userId: user.id
        }
    });

    if (!existingBooking) return res.status(404).json({
        message: "Booking couldn't be found"
    })
    console.log(existingBooking)

    if (existingBooking.userId !== user.id) return res.status(403).json({
        "message": "Forbidden"
    })

    let spotId = existingBooking.Spot.id

    const spotBookings = await Booking.findAll({
        where: { spotId: spotId }
    })


    let errors = [];

    spotBookings.forEach(booking => {
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
        existingBooking.set({ startDate, endDate });

        await existingBooking.save();

        let bookingData = {
            id: existingBooking.id,
            spotId: existingBooking.spotId,
            userId: existingBooking.userId,
            startDate: startDate,
            endDate: endDate,
            createdAt: existingBooking.createdAt,
            updatedAt: existingBooking.updatedAt
        }
        res.status(200).json(bookingData);
    }
})

router.get('/current', requireAuth, async (req, res) => {

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

        let bookingData = {};
        let spotImg;
        bookings.forEach(booking => {
            if (booking.Spot.Images.length) {
                spotImg = booking.Spot.Images[0].url
            } else {
                spotImg = "No Preview Image Available"
            }
            bookingData = {
                id: booking.id,
                spotId: booking.Spot.id,
                Spot: {
                    id: booking.Spot.id,
                    ownerId: booking.Spot.ownerId,
                    address: booking.Spot.address,
                    city: booking.Spot.city,
                    state: booking.Spot.state,
                    country: booking.Spot.country,
                    lat: booking.Spot.lat,
                    lng: booking.Spot.lng,
                    name: booking.Spot.name,
                    price: booking.Spot.price,
                    previewImage: spotImg
                },
                userId: user.id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }
            bookingsList.push(bookingData)
        })
        res.json({ Bookings: bookingsList })
    }
})


module.exports = router;
