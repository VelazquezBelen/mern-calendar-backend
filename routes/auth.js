/*
    Auth Routes
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');


router.post(
    '/new', 
    [ // middlewares
        check('name', 'name is required').not().isEmpty(),
        check('email', 'email is required').isEmail(),
        check('password', 'password must be 6 characters long').isLength({min: 6}),
        fieldValidator
    ], 
    createUser
);

router.post(
    '/', 
    [ // middlewares
        check('email', 'email is required').isEmail(),
        check('password', 'password must be 6 characters long').isLength({min: 6}),
        fieldValidator
    ], 
    loginUser
);

router.get('/renew', jwtValidator, revalidateToken);

module.exports = router;