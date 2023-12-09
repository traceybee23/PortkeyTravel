const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User } = require('../../db/models');

const router = express.Router();

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {

    const { user } = req;

    const { url } = req.body;

    const reviewId = Number(req.params.reviewId)

    const review = await Review.findOne({
        where: {
            id: reviewId
        },
        include: [
            {
                model: Image
            }
        ]
    });

    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }
    if (!user) {
        return res.status(401).json({
            "message": "Authentication required"
        })
    }
    if (user.id !== review.userId) {
        return res.status(403).json({
            "message": "Forbidden"
        })
    }

    if (review.Images.length >= 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        })
    }

    let newImage = {
        imageableId: reviewId,
        imageableType: "Review",
        url: url,
    }

    const reviewImage = await Image.create(newImage);

    const imageBody = {};
    imageBody.id = reviewImage.id;
    imageBody.url = reviewImage.url;

    res.json(imageBody)
})

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
                            attributes: ["url", 'preview']
                        }
                    ],
                    attributes: { exclude: ['description', 'createdAt', 'updatedAt'] },
                },
                {
                    model: Image,
                    attributes: ['id', 'url']
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
            reviewList.push(review.toJSON())
        })

        //attach preview image to spot info
        reviewList.forEach(review => {
            if (!review.Spot.Images.length) {
                review.Spot.previewImage = "No Preview Image available"
            } else if(review.Spot.Images[0].preview) {
                
                review.Spot.previewImage = review.Spot.Images[0].url
            }
            delete review.Spot.Images
        })

        reviewList.forEach(review => {
            if (!review.Images.length) {
                review.ReviewImages = "No Review Images available"
            } else {
                review.ReviewImages = review.Images;
            }
            delete review.Images
        })
        res.json({ Reviews: reviewList })
    }
});

router.put('/:reviewId', requireAuth, async (req, res, next) => {

    const { user } = req;
    const reviewId = Number(req.params.reviewId);
    try {

        const { review, stars } = req.body;

        const editReview = await Review.findOne({
            where: {
                id: reviewId
            }
        });

        if (!editReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            })
        }

        if (!user) {
            return res.status(401).json({
                "message": "Authentication required"
            })
        }

        if (user.id !== editReview.userId) {
            return res.status(403).json({
                "message": "Forbidden"
            })
        }

        if (user) {
            editReview.set({ review, stars });

            await editReview.save();

            res.status(200).json(editReview);
        }

    } catch (error) {
        error.message = "Bad Request"
        error.status = 400
        next(error)
    }
})

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const reviewId = req.params.reviewId
    try {
        const review = await Review.findOne({
            where: {
                id: reviewId
            }
        })
        if (!review) {
            return res.status(404).json({
                "message": "Review couldn't be found"
            })
        }
        if (!user) {
            return res.status(401).json({
                "message": "Authentication required"
            })
        }
        if (user.id !== review.userId) {
            return res.status(403).json({
                "message": "Forbidden"
            })
        }

        if (user) {

            await review.destroy(review)

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

module.exports = router;
