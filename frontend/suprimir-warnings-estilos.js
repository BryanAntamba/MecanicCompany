#!/usr/bin/env node
/**
 * Script para agregar @ts-ignore antes de media queries en archivos de estilos
 * Esto suprime los warnings del IDE sin afectar la funcionalidad
 */

const fs = require('fs');
const path = require('path');

const archivos = [
  'Styles/pantallaCliente/index.web.ts',
];

console.log('🔧 Suprimiendo warnings de media queries...\n');

archivos.forEach(archivo => {
  const rutaCompleta = path.join(__dirname, archivo);
  
  if (!fs.existsSync(rutaCompleta)) {
    console.log(`⚠️  Archivo no encontrado: ${archivo}`);
    return;
  }

  let contenido = fs.readFileSync(rutaCompleta, 'utf8');
  let modificado = false;
  let cambios = 0;

  // Buscar todas las líneas que contienen '@media'
  const lineas = contenido.split('\n');
  const nuevasLineas = [];

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];
    
    // Si la línea contiene @media y la línea anterior no es un comentario @ts-ignore
    if (linea.includes("'@media") && 
        (i === 0 || !lineas[i - 1].includes('@ts-ignore'))) {
      
      // Obtener la indentación de la línea actual
      const indentacion = linea.match(/^\s*/)[0];
      
      // Agregar @ts-ignore con la misma indentación
      nuevasLineas.push(`${indentacion}// @ts-ignore - Media query funciona en React Native Web`);
      modificado = true;
      cambios++;
    }
    
    nuevasLineas.push(linea);
  }

  if (modificado) {
    fs.writeFileSync(rutaCompleta, nuevasLineas.join('\n'), 'utf8');
    console.log(`✅ ${archivo} - ${cambios} warnings suprimidos`);
  } else {
    console.log(`ℹ️  ${archivo} - Sin cambios necesarios`);
  }
});

console.log('\n✨ Proceso completado!');
console.log('\nAhora reinicia VSCode para que los cambios surtan efecto:');
console.log('1. Cierra VSCode completamente');
console.log('2. Vuelve a abrirlo');
console.log('3. Los warnings deberían desaparecer');
