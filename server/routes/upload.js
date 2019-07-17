const express = require('express')
const fileUpload = require('express-fileupload');
//var cors = require('cors');
var Usuario = require('../models/user_model');
var Input = require('../models/input_model');

var fs = require('fs');
const app = express()

// default options
//app.use(cors());
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var top = 'top';
    var tipo2 = 'users';

    // Tipos de colecciones
    var coleccionesValidas = ['inputs', 'users', 'top_users'];
    if ( coleccionesValidas.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: "Tipo de coleccion no valida",
            err: "Solo inputs y users"
        });
    }

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            message: "No se han seleccionado imagenes para subir",
            err: "Not Images"
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.img;
    var nombre_cortado = archivo.name.split('.');
    var extension = nombre_cortado[nombre_cortado.length -1];

    // Unicas extensiones válidas
    var extensionesValdas = ['png', 'jpg', 'jpeg', 'JPG', 'PNG', 'JPEG'];

    if (extensionesValdas.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: "Extensión inválida",
            err: "Solo se permiten extenciones PNG, JPG o JPEG"
        });
    }

    
    if ( tipo === 'top_users') {
        // Nombre de img personalido
        var nombre_archivo = `${ top }-${ id }-${ new Date().getMilliseconds() }.${ extension }`;

        // Mover a un path temporal
        var path = `./server/uploads/${ tipo2 }/${ nombre_archivo }`;
    } else {
        // Nombre de img personalido
        var nombre_archivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

        // Mover a un path temporal
        var path = `./server/uploads/${ tipo }/${ nombre_archivo }`;
    }

    archivo.mv( path, err => { 
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: "ERROR AL MOVER EL ARCHIVO",
                errors: err
            });
        }

        uploadByType( tipo, id, nombre_archivo, res );

    });

    function uploadByType( tipo, id, nombreArchivo, res ) {
        if ( tipo === 'users') {
            Usuario.findById(id, (err, user) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR EN EL SERVIDOR "+id,
                        errors: err
                    });
                }

                if (user === null) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO AL USUARIO "+id,
                        errors: "No existe el id "+ id +" o está errado: " + err
                    });
                }

                console.log(user.usr_img);

                var pathViejo = './server/uploads/users/' + user.usr_img;

                // console.log('el path viejo es: ' + pathViejo+'espaciopegado');

                // Si existe una img anterior, la elimina
                if ( user.usr_img ) {
                    if ( fs.existsSync( pathViejo ) ) {
                        fs.unlink( pathViejo, (err, eliminado) => {
                            if ( err ) {
                                return res.status(500).json({
                                    ok: false,
                                    message: "ERROR AL REEMPLAZAR LA IMG YA EXISTENTE DEL USUARIO "+pathViejo,
                                    errors: err
                                });
                            }
                        });
                        // console.log('PASO LA ACTUALIZACION DE LA IMG EXISTENTE DEL USUARIO');
                    } else {
                        return res.status(500).json({
                            ok: false,
                            message: "LA IMG O RUTA A ACTUALIZAR NO EXISTE, POR FAVOR VERIFIQUELA "+pathViejo,
                            errors: err
                        });
                    }

                }

                user.usr_img = nombreArchivo;

                user.save( (err, userUpdated ) => {

                    try {
                        if ( err ) {
                            return res.status(500).json({
                                ok: false,
                                message: "ERROR AL INTENTAR ACTUALIZAR LA IMG DEL USUARIO "+user.usr_name,
                                errors: err
                            });
                        } else {
                            return res.status(200).json({
                                ok: true,
                                mensaje: 'Imagen de usuario actualizada correctamente',
                                userUpdated
                            });
                        }
                    } catch (error) {
                        return res.status(500).json({
                            ok: false,
                            message: "GUARDANDO - ERROR EN EL SERVIDOR "+user.usr_name,
                            errors: error
                        });
                    }

                });

            })
        }

        if ( tipo === 'top_users') {
            Usuario.findById(id, (err, user) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR EN EL SERVIDOR "+id,
                        errors: err
                    });
                }

                if (user === null) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO AL USUARIO "+id,
                        errors: "No existe el id "+ id +" o está errado: " + err
                    });
                }

                console.log(user.usr_img_top);

                var pathViejo = './server/uploads/users/' + user.usr_img_top;

                // console.log('el path viejo es: ' + pathViejo+'espaciopegado');

                // Si existe una img anterior, la elimina
                if ( user.usr_img_top ) {
                    if ( fs.existsSync( pathViejo ) ) {
                        fs.unlink( pathViejo, (err, eliminado) => {
                            if ( err ) {
                                return res.status(500).json({
                                    ok: false,
                                    message: "ERROR AL REEMPLAZAR LA IMG YA EXISTENTE DEL USUARIO "+pathViejo,
                                    errors: err
                                });
                            }
                        });
                        // console.log('PASO LA ACTUALIZACION DE LA IMG EXISTENTE DEL USUARIO');
                    } else {
                        return res.status(500).json({
                            ok: false,
                            message: "LA IMG O RUTA A ACTUALIZAR NO EXISTE, POR FAVOR VERIFIQUELA "+pathViejo,
                            errors: err
                        });
                    }

                }

                user.usr_img_top = nombreArchivo;

                user.save( (err, userUpdated ) => {

                    try {
                        if ( err ) {
                            return res.status(500).json({
                                ok: false,
                                message: "ERROR AL INTENTAR ACTUALIZAR LA IMG DEL USUARIO "+user.usr_name,
                                errors: err
                            });
                        } else {
                            return res.status(200).json({
                                ok: true,
                                mensaje: 'Imagen de usuario actualizada correctamente',
                                userUpdated
                            });
                        }
                    } catch (error) {
                        return res.status(500).json({
                            ok: false,
                            message: "GUARDANDO - ERROR EN EL SERVIDOR "+user.usr_name,
                            errors: error
                        });
                    }

                });

            })
        }

        if ( tipo === 'inputs') {
            Input.findById(id, (err, input) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO LA ENTRADA "+id,
                        errors: err
                    });
                }

                if (input === null) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO LA ENTRADA O INSUMO "+id,
                        errors: "No existe el id "+ id +" o está errado: " + err
                    });
                }

                input.input_imgs.push(nombreArchivo);

                input.save( (err, inputUpdated ) => {

                    if ( err ) {
                        return res.status(500).json({
                            ok: false,
                            message: "ERROR AL INTENTAR ACTUALIZAR LAS IMGS DE LA ENTRADA "+input.input_id,
                            errors: err
                        });
                    }
                    
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagenes de entrada actualizadas correctamente',
                        inputUpdated
                    });
                });

            })
            
        }
    }

})

module.exports = app;
