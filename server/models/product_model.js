const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    prod_name: {
        type: String,
        required: [true, 'El nombre es Obligatorio']
    },
    prod_description: {
        type: String,
        required: [true, 'Por favor introduzca una descripción del producto']
    },
    prod_price: {
        type: Number,
        unique: true,
        required: [true, 'El precio base es obligatorio']
    },
    prod_price_sale: {
        type: Number
    },
    prod_unit: {
        type: String
    },
    prod_featured_img: {
        type: String
    },
    prod_weight: {
        type: Number
    },
    prod_large: {
        type: Number
    },
    prod_width: {
        type: Number
    },
    prod_color: {
        type: String
    },
    prod_category: {
        type: String
    },
    prod_tags: {
        type: String
    },
    prod_others: {
        type: String
    },
    prod_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    prod_state: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Product', productSchema)