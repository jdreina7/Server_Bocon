const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let tagsShema = new Schema({
    tag_name: {
        type: String,
        unique: true,
        // uniqueCaseInsensitive: true,
        required: [true, 'El nombre es Obligatorio']
    }
});

//tagsShema.plugin(uniqueValidator, { message: '{PATH} debe de ser único, ya existe una categoria con nombre {VALUE} en la BD' });
module.exports = mongoose.model('Tag', tagsShema)