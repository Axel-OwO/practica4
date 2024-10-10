import { database } from "./firebase.js";
import { ref, push, onValue, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

/
//NOTA: Cambiar aularef y 'aula' de acuerdo al archivo
const aulaRef = ref(database, 'aula');

//Cambiar el nombre de la tabla 'dataTableA'
if (document.getElementById('dataTableA')) {

    // Función para buscar aulas id
    //Cambiar el titulo de la función buscaAulas
    async function buscarAulas(terminoBusqueda = '') {
        const dbRef = ref(database);
        const resultados = [];

        try {
            //Cambiar el 'aula' por el que hayamos puesto arriba
            const snapshot = await get(child(dbRef, 'aula'));
            if (snapshot.exists()) {
                //cambiar la constante aulas
                const aulas = snapshot.val();

                // Filtramos las aulas por id
                //cambiar las constantes aulas
                for (let key in aulas) {
                    const aula = aulas[key];
                    if (
                        //Cambiar el aula.idAula
                        terminoBusqueda === '' || (terminoBusqueda === aula.idAula)
                    ) {
                        //Cambiar aula (lo que esta entre parentesis)
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
        //cambiar la constante y el 'dataTableA'
        const dataTableA = document.getElementById('dataTableA').getElementsByTagName('tbody')[0];
        dataTableA.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos resultados

        if (resultados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3" class="text-center">No se encontraron resultados</td>';
            dataTableA.appendChild(tr);
        } else {
            //Cambiar aula, lo que está entre parentesis
            resultados.forEach((aula) => {
                //Cambiar el nombre de la tabla
                const newRow = dataTableA.insertRow();

                //Cambiar las celdas por el nombre de las columnas de nuestra entrada de datos
                const cellidAula = newRow.insertCell(0);
                const celledificio = newRow.insertCell(1);
                const cellproEdu = newRow.insertCell(2);

                //Se cambia la parte final
                cellidAula.innerHTML = aula.idAula;
                celledificio.innerHTML = aula.edificio;
                cellproEdu.innerHTML = aula.proEdu;
            });
        }
    }

    // Mostrar todas las aulas al cargar la página
    //Se cambia aulaRef, por lo que se cambió arriba
    onValue(aulaRef, (snapshot) => {
        const data = snapshot.val();
        //Cambiar dataTableA
        const dataTableA = document.getElementById('dataTableA').getElementsByTagName('tbody')[0];

        dataTableA.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        if (data) {
            // Mostrar todas las aulas inicialmente
            Object.keys(data).forEach((key) => {
                //Cambiar la constante de acuerdo al archivo
                const aula = data[key];
                const newRow = dataTableA.insertRow();

                //Cambiar las como en el metodo anterior
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


    // Cambiar el nombre 'buscarformA' por el formulario de busqueda del html
    const searchForm = document.getElementById('buscarformA');
    // Cambiar el nombre 'buscarformA' por el input de busqueda del html
    const searchInput = document.getElementById('aulaB');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const terminoBusqueda = searchInput.value.trim();
        //Cambiar por la declaración de la función correcta
        const resultados = await buscarAulas(terminoBusqueda);
        mostrarResultadosEnTabla(resultados);
    });

} else if (document.getElementById('dataTableAE')) {
    onValue(aulaRef, (snapshot) => {
        const data = snapshot.val();
        //Cambiar dataTableA
        const dataTableA = document.getElementById('dataTableAE').getElementsByTagName('tbody')[0];

        dataTableA.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        if (data) {
            // Mostrar todas las aulas inicialmente
            Object.keys(data).forEach((key) => {
                //Cambiar la constante de acuerdo al archivo
                const aula = data[key];
                const newRow = dataTableA.insertRow();

                //Cambiar las como en el metodo anterior
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
                        const refreshButton = document.getElementById('showData');
                        if (refreshButton) {
                            refreshButton.click(); // Refrescar datos si el botón existe
                        }
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
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

        console.log('Formulario enviado');

        // Obtiene los datos del formulario
        //Corregir las constantes y lo de comillas por el id de los inputs
        const idAula = document.getElementById('idAula').value;
        const edificio = document.getElementById('edificio').value;
        const proEdu = document.getElementById('proEdu').value;

        //Cambiar lo que está entre llaves por las constantes de las lineas anteriores
        console.log(`Datos capturados: ${idAula}, ${edificio}, ${proEdu}`);

        // Inserta un nuevo registro de aula en Firebase
        //Piensenle, o sea, cambienle
        //Cambiar aulaRef por la declaración del inicio
        push(aulaRef, {
            //Cambiar
            //Lado izquierdo columnas
            //Lado derecho constantes
            idAula: idAula,
            edificio: edificio,
            proEdu: proEdu
        }).then(() => {
            alert("Datos del Aula guardados correctamente");
            // Limpiar el formulario después de guardar
            //Cambiar el nombre del formulario del html
            document.getElementById('aulaForm').reset();
        }).catch((error) => {
            console.log("Error al guardar los datos: " + error);
            alert("Error al guardar los datos: " + error);
        });
    });
}
