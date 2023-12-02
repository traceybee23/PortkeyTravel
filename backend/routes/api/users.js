const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Username is required'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    // check('password')
    //     .exists({ checkFalsy: true })
    //     .isLength({ min: 6 })
    //     .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Last Name is required'),
    handleValidationErrors
];

router.post('/', validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    try {

        const user = await User.create({ firstName, lastName, email, username, hashedPassword });

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });

    } catch (error) {

        const errors = {};

        errors[error.errors[0].path] = error.errors[0].message

        res.status(500).json({
            message: "User already exists",
            errors
        })
    }
});

module.exports = router;
