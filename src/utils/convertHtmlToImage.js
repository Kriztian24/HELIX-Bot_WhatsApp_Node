const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path')

module.exports = async function convertirTablaAImagen(html) {
    const browser = await puppeteer.launch({
        headless: 'new', // Utilizar el nuevo modo headless
    });
    const page = await browser.newPage();

    // Establecer la visualización de la página en "none" para evitar problemas de diseño
    await page.setViewport({ width: 0, height: 0 });

    // Cargar el HTML en la página
    await page.setContent(html);

    // Obtener el tamaño del contenido HTML utilizando page.evaluate()
    const { width, height } = await page.evaluate(() => {
        const tabla = document.querySelector('html');
        const { width, height } = tabla.getBoundingClientRect();
        return { width, height };
    });

    // Ajustar el tamaño de la página según el tamaño del contenido
    await page.setViewport({ width: 420, height: Math.ceil(height) });
    //await page.setViewport({ width: Math.ceil(width), height: Math.ceil(height) });

    // Capturar una captura de pantalla de la tabla
    const imagenBuffer = await page.screenshot();

    // Cerrar el navegador
    await browser.close();

    // Generar un nombre de archivo único para la imagen
    const nombreArchivo = `tabla_${Date.now()}.png`;

    // Guardar la imagen en la carpeta destino
    const ruta = path.join(__dirname, '\\temp\\')
    const rutaImagen = ruta + nombreArchivo;
    await fs.writeFile(rutaImagen, imagenBuffer);

    // Retornar la ruta completa de la imagen
    return rutaImagen;
}