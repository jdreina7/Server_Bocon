// ===================
//  ENVIROMENT
// ===================
GLOBAL_ENV = process.env.NODE_ENV || 'dev';


// ===================
//  Obtener el puerto 
// ===================

ENV_PORT = process.env.PORT || 3002;

// ===================
//  Obtener el puerto 
// ===================

let urlDB;

if (GLOBAL_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/bocon_db'
} else {
    urlDB = 'mongodb://super_bocon_db:qazxsw21@2019@ds139576.mlab.com:39576/bocon_db'
}

ENV_DB = urlDB;