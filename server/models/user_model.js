const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ROLE_CUSTOMER', 'ROLE_SELLER', 'ROLE_SUPER'],
    message: '{VALUE} no es un role permitido'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    usr_name: {
        type: String,
        required: [true, 'El nombre es Obligatorio']
    },
    usr_last_name: {
        type: String,
        required: [true, 'El Apellido es Obligatorio']
    },
    usr_email: {
        type: String,
        unique: true,
        required: [true, 'El correo es Obligatorio']
    },
    usr_birthday: {
        type: Date
    },
    usr_password: {
        type: String,
        required: [true, 'El password es Obligatorio']
    },
    usr_img: {
        type: String
    },
    usr_img_top: {
        type: String
    },
    usr_role: {
        type: String,
        default: 'ROLE_CUSTOMER',
        enum: validRoles
    },
    usr_joined: {
        type: String
    },
    usr_gender: {
        type: String
    },
    usr_ocupation: {
        type: String
    },
    usr_website: {
        type: String
    },
    usr_country: {
        type: String
    },
    usr_city: {
        type: String
    },
    usr_address: {
        type: String
    },
    usr_phone: {
        type: String
    },
    usr_celphone: {
        type: String
    },
    usr_last_activity: {
        type: String
    },
    usr_state: {
        type: Boolean,
        default: true
    },
    usr_google: {
        type: Boolean,
        default: false
    },
    usr_about: {
        type: String
    }
});

userSchema.methods.toJSON = function() {
    let usr = this;
    let usrObject = usr.toObject();
    delete usrObject.usr_password;

    return usrObject;
}
userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único, ya existe un email {VALUE} en la BD' });
module.exports = mongoose.model('User', userSchema)