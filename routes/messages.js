const Router = require("express").Router;
const router = new Router();

const Message = require("../models/message");
const {ensureLoggedIn} = require("../middleware/auth");
const ExpressError = require("../expressError");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', async function (req, res, next){
    try {
        const id = req.params.id
        const msg = await Message.get(id)

        return res.json({message: msg})
    } catch (err) {
        next (err)
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const {to_username, body} = req.body
        const msg = await Message.create({
            from_username: req.user.username,
            to_username: to_username,
            body: body
        });

        return res.json({message: msg})
    } catch (err) {
        next (err)
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', async function (req, res, next) {
    try {
        const id = req.params.id
        const msg = await Message.markRead(id)

        return ({message: msg})
    } catch (err) {
        next (err)
    }
})

module.exports = router