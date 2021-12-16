const mongoose = require('mongoose')

const itemsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true
        },
        zipcode: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
        },
        category: {
            type: String,
            required: true
<<<<<<< HEAD
        }, owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
        
=======
        },
        owner: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}],
>>>>>>> cb97a0934d2aeba672443766e891f21b87c9d81b
    },
    
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Item', itemsSchema)