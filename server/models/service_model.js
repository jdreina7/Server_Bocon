const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let serviceSchema = new Schema({
    serv_name: {
        type: String,
        required: [true, 'El nombre es Obligatorio']
    },
    serv_description: {
        type: String,
        required: [true, 'Por favor introduzca una descripción del servicio']
    },
    serv_price: {
        type: Number,
        unique: true,
        required: [true, 'El precio base es obligatorio']
    },
    serv_price_sale: {
        type: Number
    },
    serv_unit: {
        type: String
    },
    serv_featured_img: {
        type: String
    },
    serv_start_date: {
        type: String
    },
    serv_end_date: {
        type: String
    },
    serv_start_time: {
        type: String
    },
    serv_end_time: {
        type: String
    },
    serv_category: {
        type: String
    },
    serv_tags: {
        type: String
    },
    serv_others: {
        type: String
    },
    serv_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    serv_state: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Service', serviceSchema)