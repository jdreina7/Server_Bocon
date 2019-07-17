
const express = require('express')

const User = require('../models/user_model')
const Input = require('../models/input_model')
const Apply = require('../models/application_model')

const app = express()

// ================================
// BUSQUEDA GENERAL
// ================================
app.get('/all/:search', (req, res) => {

    let busqueda = req.params.search;
    var regex = new RegExp(busqueda, 'i');

    Promise.all(
        [
            searchUsers( busqueda, regex ),
            searchInput( busqueda, regex ),
            searchApply( busqueda, regex )
        ])
        .then( respuestas => {
            // console.log(respuestas);
            res.json({
                ok: true,
                users: respuestas[0],
                inputs: respuestas[1],
                applys: respuestas[2]
            });
        });

    

    function searchUsers(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            User.find()
            .or( [{ usr_name: regex }, { usr_email: regex } ])
            .exec( (err, users) => {
                if ( err ) {
                    reject('Error al ejecutar la búsqueda de usuarios', err);
                } else {
                    resolve( users );
                }
            })
        })
    }

    function searchInput(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            Input.find({ input_name: regex }, (err, input) => {
                if ( err ) {
                    reject('Error al ejecutar la búsqueda de los inputs', err);
                } else {
                    resolve( input );
                }
            })
        })
    }

    function searchApply(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            Apply.find({ apply_name: regex })
            .populate('apply_item')
            .populate('apply_created_by')
            .exec((err, apply) => {
                if ( err ) {
                    reject('Error al ejecutar la búsqueda de las aplicaciones', err);
                } else {
                    resolve( apply );
                    // console.log('entro al apply y devolvio: ' + apply );
                }
            })
            
        })
    }


})

module.exports = app;