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
        type: String,
        required: [true, 'Fecha de nacimiento es Obligatorio']
    },
    usr_password: {
        type: String,
        required: [true, 'El password es Obligatorio']
    },
    usr_img: {
        type: String
    },
    usr_role: {
        type: String,
        default: 'ROLE_CUSTOMER',
        enum: validRoles
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
        type: String,
        required: [true, 'El celular es requerido']
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