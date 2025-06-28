const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        category: joi.string().valid('Beach', 'Mountain', 'City', 'Forest', 'Desert', 'Lake', 'Island', 'Historic', 'Luxury', 'Budget', 'Family', 'Romantic', 'Adventure', 'Spa', 'Farm').required(),
        maxGuests: joi.number().integer().min(1).max(20),
        bedrooms: joi.number().integer().min(1),
        bathrooms: joi.number().integer().min(1),
        amenities: joi.array().items(joi.string().valid('WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'AC', 'Heating', 'TV', 'Washing Machine', 'Balcony', 'Garden', 'BBQ', 'Fireplace', 'Hot Tub', 'Sauna', 'Spa', 'Restaurant', 'Bar', 'Concierge', 'Room Service')),
        featured: joi.boolean(),
        image: joi.string().allow("", null),
    }).required(),
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
});
