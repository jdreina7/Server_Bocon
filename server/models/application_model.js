const mongoose = require('mongoose');

let validAdminProcces = {
    values: ['FOR_APPROVAL','APPROVED_BY_ADMIN', 'REJECTED_BY_ADMIN'],
    message: '{VALUE} no es un estado de administracion permitido'
};

let validClientProcces = {
    values: ['FOR_APPROVAL', 'ACEPTED_BY_CLIENT', 'REJECTED_BY_CLIENT'],
    message: '{VALUE} no es un estado de cliente permitido'
};

let validApplicationTypes = {
    values: ['PRODUCT','SERVICE'],
    message: '{VALUE} no es un tipo de insumo permitido'
};

let Schema = mongoose.Schema;

let applicationSchema = new Schema({
    apply_code: {
        type: String,
        unique: true,
        required: [true, 'Por favor introduzca el código del cupon']
    },
    apply_name: {
        type: String,
        required: [true, 'Por favor introduzca el nombre del cupón']
    },
    apply_amount: {
        type: Number,
        required: [true, 'El precio base es obligatorio']
    },
    apply_fee: {
        type: Number,
    },
    apply_item: { 
        type: Schema.Types.ObjectId,
        ref: 'Input', 
    },
    apply_type: { 
        type: String,
        enum: validApplicationTypes
    },
    apply_date: {
        type: String,
        required: [true, 'La fecha de la aplicacion es obligatoria']
    },
    apply_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'los datos de la persona que esta postulando son obligatorios']
    },
    apply_admin_proccess: {
        type: String,
        default: 'FOR_APPROVAL',
        enum: validAdminProcces
    },
    apply_client_proccess: {
        type: String,
        default: 'FOR_APPROVAL',
        enum: validClientProcces
    },
    apply_total: {
        type: Number
    },
    apply_state: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Apply', applicationSchema)