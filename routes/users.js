const Router = require("express").Router;
const router = new Router();

const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");

const User = require("../models/user");
const ExpressError = require("../expressError");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', ensureLoggedIn, async function(req, res, next) {
    try {
        const users = await User.all()
        return res.json({users})
    } catch (err) {
        next(err)
    }
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async function(req, res, next) {
    try {
        const username = req.params.username
        const user = await User.get(username)
        return res.json({user})
    } catch (err) {
        next(err)
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async function(req, res, next) {
    try {
        const username = req.params.username
        const msgs = await User.messagesTo(username)
        return res.json({messages: msgs})
    } catch (err) {
        next(err)
    }
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async function (req, res, next) {
    try {
        const username = req.params.username
        const msgs = await User.messagesFrom(username)
        return res.json({messages: msgs})
    } catch (err) {
        next(err)
    }
})

 module.exports = router