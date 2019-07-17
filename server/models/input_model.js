const mongoose = require('mongoose');

let validInputs = {
    values: ['PRODUCT','SERVICE'],
    message: '{VALUE} no es un tipo de insumo permitido'
};

let Schema = mongoose.Schema;

let inputSchema = new Schema({
    input_name: {
        type: String,
        required: [true, 'El nombre es Obligatorio']
    },
    input_type: {
        type: String,
        required: [true, 'El tipo de insumo es Obligatorio'],
        enum: validInputs
    },
    input_description: {
        type: String,
        required: [true, 'Por favor introduzca una descripción de insumo']
    },
    input_price: {
        type: Number,
        required: [true, 'El precio base es obligatorio']
    },
    input_price_sale: {
        type: Number
    },
    input_unit: {
        type: String
    },
    input_featured_img: {
        type: String
    },
    input_imgs: {
        type: [String]
    },
    input_p_weight: {
        type: Number
    },
    input_p_large: {
        type: Number
    },
    input_p_width: {
        type: Number
    },
    input_p_color: {
        type: String
    },
    input_s_start_date: {
        type: String
    },
    input_s_end_date: {
        type: String
    },
    input_s_start_time: {
        type: String
    },
    input_s_end_time: {
        type: String
    },
    input_category: {
        type: String
    },
    input_tags: {
        type: String
    },
    input_others: {
        type: String
    },
    input_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    input_state: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Input', inputSchema)