const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')

app.get('/:tipo/:imgs', (req, res) => {

    var tipo = req.params.tipo;
    var imgs = req.params.imgs;

    var tipo2 = 'users';

    if ( tipo === 'top_users') {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img2.png');
        var pathImage = path.resolve(__dirname, `../uploads/${tipo2}/${imgs}`);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${imgs}`);
    }


    if ( fs.existsSync( pathImage ) ) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(pathNoImage);
    }
})

module.exports = app;
