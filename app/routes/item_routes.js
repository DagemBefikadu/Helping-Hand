// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for items
const Item = require('../models/item')
const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

require('dotenv').config()
//require multer to help with cloudinary upload
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
//require and config cloudinary
const cloudinary = require('cloudinary')
cloudinary.config(process.env.CLOUDINARY_URL)


// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { item: { title: '', text: 'foo' } } -> { item: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available¡
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX for all item
// GET /items
router.get('/items', (req, res, next) => {
	Item.find()
		.then((items) => {
			// `items` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return items.map((item) => item.toObject())
		})
		// respond with status 200 and JSON of the items
		.then((items) => res.status(200).json({ items: items }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW ONE ITEM
// GET /items/5a7db6c74d55bc51bdf39793
router.get('/items/:id',(req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Item.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "item" JSON
		.then((item) => res.status(200).json({ item: item.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /items

router.post('/items', requireToken, upload.single('myFile'),  (req, res, next) => {
	console.log('req.body : ', req.body)
	console.log('req.body.items.image: ', req.body.items.image)

	cloudinary.uploader.upload(req.body.items.image, function(result) {
		console.log(result)
		console.log(result.url)
		
		req.body.items.image = result.url

		Item.create(req.body.items)
			// respond to succesful `create` with status 201 and JSON of new "item"
			.then((item) => {
				res.status(201).json({ item: item.toObject() })
			})
			// if an error occurs, pass it off to our error handler
			// the error handler needs the error message and the `res` object so that it
			// can send an error message back to the client
			.catch(next)
	})
})


// UPDATE
// PATCH /items/5a7db6c74d55bc51bdf39793
router.patch('/items/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	

	Item.findById(req.params.id)
		.then(handle404)
		.then((item) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			

			// pass the result of Mongoose's `.update` to the next `.then`
			return Item.updateOne(req.body.item)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

router.patch('/items/favorites/:itemId', removeBlanks, requireToken, (req,res,next)=>{
<<<<<<< HEAD
    User.findById(req.user.id)
=======
  User.findById(req.user.id)
>>>>>>> 28bb5cb0dc5e2fed86d1f6fd318e4a0ed147ef6f
    .then(handle404)
    .then(foundUser =>{
        foundUser.favorites.push(req.params.itemId)
        return foundUser.save()
    })
    .then(() =>res.sendStatus(204))
    .catch(next)
})

router.delete('/items/favorites/:itemId', removeBlanks, requireToken, (req,res,next) => {
	User.findById(req.user.id)
	.then(handle404)
	.then(foundUser =>{
		foundUser.favorites.pull(req.params.itemId)
		return foundUser.save()
	})
	.then(() =>res.sendStatus(204))
	.catch(next)
})

router.patch('/items/mylistings/:itemId', removeBlanks, requireToken, (req,res,next)=>{
	console.log('req.user.id', req.user.id)
	User.findById(req.user.id)
	  .then(handle404)
	  .then(foundUser =>{
		  console.log('found User:',  foundUser)
		  foundUser.createdItems.push(req.params.itemId)
		  return foundUser.save()
	  })
	  .then(() =>res.sendStatus(204))
	  .catch(next)
  })

// DESTROY
// DELETE /items/5a7db6c74d55bc51bdf39793
router.delete('/items/:id', requireToken,  (req, res, next) => {
	Item.findById(req.params.id)
		.then(handle404)
		.then((item) => {
			// throw an error if current user doesn't own this `item`
			// delete the item ONLY IF the above didn't throw an error
			item.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router