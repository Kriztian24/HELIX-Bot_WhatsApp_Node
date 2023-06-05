const fs = require('fs');
const path = require('path')

const plantillaFacturas = () => {
    const ruta = path.join(__dirname, '\\plantillasHTML\\mis_facturas.html')
    return fs.readFileSync(ruta, 'utf8');
}

module.exports = {
    plantillaFacturas
}