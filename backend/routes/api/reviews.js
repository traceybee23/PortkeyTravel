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
        const reviews = await Review.findAll({
            where: safeUser,
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: Spot,
                    include: [
                        {
                            model: Image,
                            attributes: [ "url" ]
                        }
                    ],
                    attributes:{ exclude: [ 'description', 'createdAt', 'updatedAt'] },
                },
                {
                    model: Image,
                    attributes: [ 'id', 'url' ]
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

        //attach preview image to spot info
        reviewList.forEach(review => {
                console.log(review.Spot.Images[0].url)
                if (!review.Spot.Images) {
                    review.Spot.previewImage = "image url"
                } else {
                    review.Spot.previewImage = review.Spot.Images[0].url
                }

            delete review.Spot.Images
        })

        reviewList.forEach(review => {
            review.ReviewImages = review.Images;
            delete review.Images
        })
        res.json({ Reviews: reviewList })
    }
})

module.exports = router;
