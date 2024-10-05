import { database } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Referencia a la base de datos para los usuarios
const expeRef = ref(database, 'expEdu');

// Guardar datos en Firebase cuando se envía el formulario
document.getElementById('expForm').addEventListener('submit', (event) => {
    event.preventDefault();  // Evita que el formulario se envíe de manera tradicional

    console.log('Formulario enviado');

    // Obtiene los datos del formulario
    const nrc = document.getElementById('nrc').value;
    const proEduDoc = document.getElementById('proEduDoc').value;
    const nomEE = document.getElementById('nomEE').value;
    const docEE = document.getElementById('docEE').value;
    const horas = document.getElementById('horas').value;
    const creditos = document.getElementById('creditos').value;
    

    console.log(`Datos capturados: ${nrc}, ${proEduDoc}, ${nomEE},${docEE}, ${horas}, ${creditos}`);

    // Inserta un nuevo usuario en Firebase
    push(expeRef, {
        nrc: nrc,
        proEduDoc: proEduDoc,
        nomEE: nomEE,
        docEE : docEE,
        horas : horas,
        creditos : creditos
    }).then(() => {
        alert("Datos del la EE guardados correctamente");
        // Limpiar el formulario después de guardar
        document.getElementById('expForm').reset();
    }).catch((error) => {
        console.log("Error al guardar los datos: " + error);
        alert("Error al guardar los datos: " + error);
    });
});