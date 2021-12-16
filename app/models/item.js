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
        }, owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
        
    },
    
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Item', itemsSchema)