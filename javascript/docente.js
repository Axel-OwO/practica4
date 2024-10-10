import { database } from "./firebase.js";
import { ref, push, onValue, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Referencia a la base de datos para los docentes
const docenteRef = ref(database, 'docente');

if (document.getElementById('dataTableD')) {

    // Función para buscar docentes nombre
    async function buscarDocente(terminoBusqueda = '') {
        const dbRef = ref(database);
        const resultados = [];

        try {
            const snapshot = await get(child(dbRef, 'docente'));
            if (snapshot.exists()) {
                const docentes = snapshot.val();

                // Filtramos las aulas por id
                for (let key in docentes) {
                    const docente = docentes[key];
                    if (
                        terminoBusqueda === '' || (terminoBusqueda === docente.idDocente)
                    ) {
                        resultados.push(docente);
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
        const dataTableD = document.getElementById('dataTableD').getElementsByTagName('tbody')[0];
        dataTableD.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos resultados

        if (resultados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3" class="text-center">No se encontraron resultados</td>';
            dataTableD.appendChild(tr);
        } else {
            resultados.forEach((docente) => {
                const newRow = dataTableD.insertRow();

                const cellidDocente = newRow.insertCell(0);
                const cellnomDocente = newRow.insertCell(1);
                const cellproEduDoc = newRow.insertCell(2);

                cellidDocente.innerHTML = docente.idDocente;
                cellnomDocente.innerHTML = docente.nomDocente;
                cellproEduDoc.innerHTML = docente.proEduDoc;
            });
        }
    }

    // Mostrar todos los docentes al cargar la página
    onValue(docenteRef, (snapshot) => {
        const data = snapshot.val();
        const dataTableD = document.getElementById('dataTableD').getElementsByTagName('tbody')[0];

        dataTableD.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        if (data) {
            // Mostrar todos los docentes inicialmente
            Object.keys(data).forEach((key) => {
                const docente = data[key];
                const newRow = dataTableD.insertRow();

                const cellidDocente = newRow.insertCell(0);
                const cellnomDocente = newRow.insertCell(1);
                const cellproEduDoc = newRow.insertCell(2);

                cellidDocente.innerHTML = docente.idDocente;
                cellnomDocente.innerHTML = docente.nomDocente;
                cellproEduDoc.innerHTML = docente.proEduDoc;
            });
        } else {
            console.log('No hay datos disponibles');
            alert("No hay datos disponibles");
        }
    });
    const searchForm = document.getElementById('buscarformD');
    const searchInput = document.getElementById('docenteB');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const terminoBusqueda = searchInput.value.trim();
        const resultados = await buscarDocente(terminoBusqueda);
        mostrarResultadosEnTabla(resultados);
    });

} else if (document.getElementById('dataTableDE')) {
    onValue(docenteRef, (snapshot) => {
        const data = snapshot.val();
        const dataTableDE = document.getElementById('dataTableDE').getElementsByTagName('tbody')[0];

        dataTableDE.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        if (data) {
            // Mostrar todos los docentes inicialmente
            Object.keys(data).forEach((key) => {
                const docente = data[key];
                const newRow = dataTableDE.insertRow();

                const cellidDocente = newRow.insertCell(0);
                const cellnomDocente = newRow.insertCell(1);
                const cellproEduDoc = newRow.insertCell(2);
                const cellEdit = newRow.insertCell(3);
                const cellDelete = newRow.insertCell(4);


                cellidDocente.innerHTML = docente.idDocente;
                cellnomDocente.innerHTML = docente.nomDocente;
                cellproEduDoc.innerHTML = docente.proEduDoc;

                const editButton = document.createElement('button');
                editButton.innerText = 'Editar';
                editButton.classList.add('btn', 'btn-warning', 'me-2');
                editButton.onclick = () => editDocente(key, docente);
                cellEdit.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Eliminar';
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.onclick = () => deleteDocente(key);
                cellDelete.appendChild(deleteButton);

            });
        } else {
            console.log('No hay datos disponibles');
            alert("No hay datos disponibles");
        }

        function editDocente(idDocente, docente) {
            const newidDocente = prompt("Editar id de docente:", docente.idDocente);
            const newnomDocente = prompt("Editar nombre:", docente.nomDocente);
            const newProedu = prompt("Editar programa educativo:", docente.proEduDoc);

            if (newidDocente&& newnomDocente && newProedu) {
                update(ref(database, `docente/${idDocente}`), {
                    idAula: newidDocente,
                    nomDocente: newnomDocente,
                    proEduDoc: newProedu
                }).then(() => {
                    alert("Datos actualizados con éxito");
                }).catch((error) => {
                    alert("Error al actualizar los datos: " + error.message);
                });
            } else {
                alert("Todos los campos son obligatorios para la edición.");
            }
        }

        function deleteDocente(idDocente) {
            if (confirm("¿Estás seguro de que deseas eliminar este docente?")) {
                remove(ref(database, `docente/${idDocente}`))
                    .then(() => {
                        alert("Docente eliminado con éxito");
                    })
                    .catch((error) => {
                        alert("Error al eliminar el docente: " + error.message);
                    });
            }
        }
    });

} else {
    // Guardar datos en Firebase cuando se envía el formulario
    document.getElementById('docenteForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

        console.log('Formulario enviado');

        // Obtiene los datos del formulario
        const idDocente = document.getElementById('idDocente').value;
        const nomDocente = document.getElementById('nomDocente').value;
        const proEduDoc = document.getElementById('proEduDoc').value;

        console.log(`Datos capturados: ${idDocente}, ${nomDocente}, ${proEduDoc}`);

        // Inserta un nuevo registro de docente en Firebase
        push(docenteRef, {
            idDocente: idDocente,
            nomDocente: nomDocente,
            proEduDoc: proEduDoc
        }).then(() => {
            alert("Datos del Docente guardados correctamente");
            // Limpiar el formulario después de guardar
            document.getElementById('docenteForm').reset();
        }).catch((error) => {
            console.log("Error al guardar los datos: " + error);
            alert("Error al guardar los datos: " + error);
        });
    });
}

