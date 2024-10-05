import { database } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Referencia a la base de datos para los usuarios
const docenteRef = ref(database, 'docente');

// Guardar datos en Firebase cuando se envía el formulario
document.getElementById('docenteForm').addEventListener('submit', (event) => {
    event.preventDefault();  // Evita que el formulario se envíe de manera tradicional

    console.log('Formulario enviado');

    // Obtiene los datos del formulario
    const idDocente = document.getElementById('idDocente').value;
    const nomDocente = document.getElementById('nomDocente').value;
    const proEduDoc = document.getElementById('proEduDoc').value;
    

    console.log(`Datos capturados: ${idDocente}, ${nomDocente}, ${proEduDoc}`);

    // Inserta un nuevo usuario en Firebase
    push(docenteRef, {
        idDocente: idDocente,
        nomDocente: nomDocente,
        proEduDoc: proEduDoc
    }).then(() => {
        alert("Datos del Aula guardados correctamente");
        // Limpiar el formulario después de guardar
        document.getElementById('docenteForm').reset();
    }).catch((error) => {
        console.log("Error al guardar los datos: " + error);
        alert("Error al guardar los datos: " + error);
    });
});