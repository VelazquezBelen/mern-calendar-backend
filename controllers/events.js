const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {

    const events = await Event.find().populate('user','name');
                            
    console.log(req.body)
    res.json({
        ok: true,
        events
    });
};

const createEvent = async(req, res = response) => {

    const event = new Event(req.body);
    try {
        event.user = req.uid;
        const saveEvent = await event.save();

        res.json({
            ok: true,
            event: saveEvent
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Bad request'
        })
    }
};

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;
    try {

        const event = await Event.findById(eventId);
        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'There is no event with that id'
            });
        }

        if ( event.user.toString() !== req.uid ) {
            return res.status(401).json({
                ok:false,
                msg: 'You are not authorized to edit the event'
            })
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});

        res.json({
            ok: true,
            event: updatedEvent
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Bad request'
        })
    }
};

const deleteEvent = async (req, res = response) => {
    const eventId = req.params.id;
    try {

        const event = await Event.findById(eventId);
        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'There is no event with that id'
            });
        }

        if ( event.user.toString() !== req.uid ) {
            return res.status(401).json({
                ok:false,
                msg: 'You are not authorized to delete the event'
            })
        }

        await Event.findByIdAndDelete(eventId);

        res.json({ ok: true });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Bad request'
        })
    }
};

module.exports = {
    createEvent,
    deleteEvent,
    getEvents,
    updateEvent,
}