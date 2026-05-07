const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true,
        validate: {
            validator: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Please provide a valid email'
        }
    },
    company: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    service: {
        type: String,
        enum: ['network', 'cloud', 'endpoint', 'data', 'monitoring', 'incident', 'consulting', 'other'],
        default: 'other'
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        trim: true,
        maxlength: [2000, 'Message cannot be more than 2000 characters']
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'resolved'],
        default: 'new'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);