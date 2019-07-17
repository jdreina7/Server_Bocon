
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');

const Product = require('../models/product_model')
const app = express()

// ================================
// OBTENER TODOS LOS PRODUCTOS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);
    
    // El finde recibe 2 argumentos, el primero es la condicion de busqueda, y el segundo, es los campos exactos que necesitamos devolver
    // Pero no es obligatorio, si deseamos realizar una busqueda general lo podemos dejar asi .find({})
    Product.find({ prod_state: true })
        .skip(from)
        .limit(to)
        .exec( (err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            Product.countDocuments({ prod_state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    products,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UN PRODUCTO
// ================================
app.post('/product', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myProduct = new Product({
        prod_name: body.name,
        prod_description: body.description,
        prod_price: body.price,
        prod_price_sale: body.price_sale,
        prod_unit: body.unit,
        prod_featured_img: body.featured_img,
        prod_weight: body.weight,
        prod_large: body.large,
        prod_width: body.width,
        prod_color: body.color,
        prod_category: body.category,
        prod_tags: body.tags,
        prod_others: body.others,
        prod_created_by: body.created_by,
        prod_state: body.state,
    });

    myProduct.save( (err, productDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UN PRODUCTO
// ================================
app.put('/product/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['prod_name','prod_description','prod_price','prod_price_sale','prod_unit','prod_featured_img','prod_weight','prod_large','prod_width','prod_color','prod_category','prod_tags','prod_others'] );

	Product.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, productDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UN PRODUCTO
// ================================
app.delete('/product/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    // Product.findByIdAndRemove( id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if(!userDeleted) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no existe en la BD'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         producto: userDeleted
    //     });
    // })


    // Actualizar el estado: BORRADO LOGICO

	Product.findByIdAndUpdate( id, {prod_state: false}, {new: true}, (err, prodDeleted2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!prodDeleted2) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            producto: prodDeleted2,
            usrLogin: req.userLogged
        });
    })

})

module.exports = app;