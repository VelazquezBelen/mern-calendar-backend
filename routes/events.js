/*
    Events Routes
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use(jwtValidator);

router.get('/', getEvents);

router.post(
    '/', 
    [
        check('title', 'title is required').not().isEmpty(),
        check('start', 'Start date is required').custom(isDate),
        check('end', 'End date is required').custom(isDate),
        fieldValidator
    ],
    createEvent
);

router.put('/:id', updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;