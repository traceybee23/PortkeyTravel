const express = require('express');
//const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, Image } = require('../../db/models');

const router = express.Router();


router.get('/', async (req, res) => {

const spots = await Spot.findAll({
    include: [{
        model: Review,
        attributes: {
            exclude: ['userId', 'spotId', 'review', 'createdAt', 'updatedAt']
        }
    }],
    // include: [{
    //     model: Image,
    //     attributes: {
    //         exclude: ['id', 'imageableId', 'imageableType', 'createdAt', 'updatedAt']
    //     }
    // }]
})




res.json({ "Spots": spots})

})

module.exports = router;
