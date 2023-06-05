const fs = require('fs');

const plantillaFacturas = () => {
    return fs.readFileSync('C:\\Proyectos\\HELIX-Bot_WhatsApp_Node\\src\\plantillasHTML\\mis_facturas.html', 'utf8');
}

module.exports = {
    plantillaFacturas
}