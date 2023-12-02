const express = require('express');
//const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User } = require('../../db/models');


const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req;

    if (user) {
        const safeUser = {
            userId: user.id
        }
        //console.log(safeUser)
        const reviews = await Review.findAll({
            where: safeUser,
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: Spot,
                },
                {
                    model: Image,
                    attributes: [ "id", "url" ]
                }
            ],
        })
        if (!reviews.length) {
            return res.status(404).json({
                message: "Reviews couldn't be found"
            })
        }
        if (!user) {
            return res.status(401).json({
                "message": "Authentication required"
            })
        }
        let reviewList = [];

        reviews.forEach(review => {
            //console.log(spot)
            reviewList.push(review.toJSON())
        })

        //attach images
        reviewList.forEach(review => {
            review.Images.forEach(image => {
                //console.log(image.url)
                if (!review.Images) {
                    review.previewImage = "image url"
                } else {
                    review.previewImage = image.url
                }
            })
            delete review.Images
        })
        res.json({ reviews: reviewList })
    }
})

module.exports = router;
