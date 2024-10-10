import { database } from "./firebase.js";
import { ref, push, onValue, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";


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

    const searchForm = document.getElementById('buscarformA');
    const searchInput = document.getElementById('aulaB');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const terminoBusqueda = searchInput.value.trim();
        const resultados = await buscarAulas(terminoBusqueda);
        mostrarResultadosEnTabla(resultados);
    });

} else if (document.getElementById('dataTableAE')) {
    onValue(aulaRef, (snapshot) => {
        const data = snapshot.val();
        const dataTableA = document.getElementById('dataTableAE').getElementsByTagName('tbody')[0];

        dataTableA.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        if (data) {
            // Mostrar todas las aulas inicialmente
            Object.keys(data).forEach((key) => {
                const aula = data[key];
                const newRow = dataTableA.insertRow();

                const cellidAula = newRow.insertCell(0);
                const celledificio = newRow.insertCell(1);
                const cellproEdu = newRow.insertCell(2);
                const cellEdit = newRow.insertCell(3);
                const cellDelete = newRow.insertCell(4);


                cellidAula.innerHTML = aula.idAula;
                celledificio.innerHTML = aula.edificio;
                cellproEdu.innerHTML = aula.proEdu;

                const editButton = document.createElement('button');
                editButton.innerText = 'Editar';
                editButton.classList.add('btn', 'btn-warning', 'me-2');
                editButton.onclick = () => editAula(key, aula);
                cellEdit.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Eliminar';
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.onclick = () => deleteAula(key);
                cellDelete.appendChild(deleteButton);

            });
        } else {
            console.log('No hay datos disponibles');
            alert("No hay datos disponibles");
        }

        function editAula(aulaId, aula) {
            const newIdAula = prompt("Editar id de aula:", aula.idAula);
            const newEdificio = prompt("Editar edificio:", aula.edificio);
            const newProedu = prompt("Editar programa educativo:", aula.proEdu);

            if (newIdAula && newEdificio && newProedu) {
                update(ref(database, `aula/${aulaId}`), {
                    idAula: newIdAula,
                    edificio: newEdificio,
                    proEdu: newProedu
                }).then(() => {
                    alert("Datos actualizados con éxito");
                }).catch((error) => {
                    alert("Error al actualizar los datos: " + error.message);
                });
            } else {
                alert("Todos los campos son obligatorios para la edición.");
            }
        }

        function deleteAula(aulaId) {
            if (confirm("¿Estás seguro de que deseas eliminar este aula?")) {
                remove(ref(database, `aula/${aulaId}`))
                    .then(() => {
                        alert("Aula eliminada con éxito");
                    })
                    .catch((error) => {
                        alert("Error al eliminar el aula: " + error.message);
                    });
            }
        }
    });

} else {
    // Guardar datos en Firebase cuando se envía el formulario
    document.getElementById('aulaForm').addEventListener('submit', (event) => {
        event.preventDefault();

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
