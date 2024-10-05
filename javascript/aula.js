import { database } from "./firebase.js";
import { ref, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Referencia a la base de datos para las aulas
const aulaRef = ref(database, 'aula');

if (document.getElementById('dataTableA')) {

    // Función para buscar aulas id
    async function buscarAulas(terminoBusqueda = '') {
        const dbRef = ref(database);
        const resultados = [];

        try {
            const snapshot = await get(child(dbRef, 'aula'));
            if (snapshot.exists()) {
                const aulas = snapshot.val();

                // Filtramos las aulas por id
                for (let key in aulas) {
                    const aula = aulas[key];
                    if (
                        terminoBusqueda === '' || (terminoBusqueda === aula.idAula)
                    ) {
                        resultados.push(aula);
                    }
                }
            }
        } catch (error) {
            console.error("Error obteniendo datos:", error);
        }

        return resultados;
    }

    // Función para mostrar los resultados en la tabla
    function mostrarResultadosEnTabla(resultados) {
        const dataTableA = document.getElementById('dataTableA').getElementsByTagName('tbody')[0];
        dataTableA.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos resultados

        if (resultados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3" class="text-center">No se encontraron resultados</td>';
            dataTableA.appendChild(tr);
        } else {
            resultados.forEach((aula) => {
                const newRow = dataTableA.insertRow();

                const cellidAula = newRow.insertCell(0);
                const celledificio = newRow.insertCell(1);
                const cellproEdu = newRow.insertCell(2);

                cellidAula.innerHTML = aula.idAula;
                celledificio.innerHTML = aula.edificio;
                cellproEdu.innerHTML = aula.proEdu;
            });
        }
    }

    // Mostrar todas las aulas al cargar la página
    onValue(aulaRef, (snapshot) => {
        const data = snapshot.val();
        const dataTableA = document.getElementById('dataTableA').getElementsByTagName('tbody')[0];
        dataTableA.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        if (data) {
            // Mostrar todas las aulas inicialmente
            Object.keys(data).forEach((key) => {
                const aula = data[key];
                const newRow = dataTableA.insertRow();

                const cellidAula = newRow.insertCell(0);
                const celledificio = newRow.insertCell(1);
                const cellproEdu = newRow.insertCell(2);

                cellidAula.innerHTML = aula.idAula;
                celledificio.innerHTML = aula.edificio;
                cellproEdu.innerHTML = aula.proEdu;
            });
        } else {
            console.log('No hay datos disponibles');
            alert("No hay datos disponibles");
        }
    });

    // Event listener para la búsqueda
    const searchForm = document.getElementById('buscarformA');
    const searchInput = document.getElementById('aulaB');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const terminoBusqueda = searchInput.value.trim();
        const resultados = await buscarAulas(terminoBusqueda);
        mostrarResultadosEnTabla(resultados);
    });

} else {
    // Guardar datos en Firebase cuando se envía el formulario
    document.getElementById('aulaForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

        console.log('Formulario enviado');

        // Obtiene los datos del formulario
        const idAula = document.getElementById('idAula').value;
        const edificio = document.getElementById('edificio').value;
        const proEdu = document.getElementById('proEdu').value;

        console.log(`Datos capturados: ${idAula}, ${edificio}, ${proEdu}`);

        // Inserta un nuevo registro de aula en Firebase
        push(aulaRef, {
            idAula: idAula,
            edificio: edificio,
            proEdu: proEdu
        }).then(() => {
            alert("Datos del Aula guardados correctamente");
            // Limpiar el formulario después de guardar
            document.getElementById('aulaForm').reset();
        }).catch((error) => {
            console.log("Error al guardar los datos: " + error);
            alert("Error al guardar los datos: " + error);
        });
    });
}
