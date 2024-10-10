import { database } from "./firebase.js";
import { ref, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Referencia a la base de datos para los expEdu
const expEduRef = ref(database, 'expEdu');

// Referencia a la base de datos para horario
const horarioRef = ref(database, 'horario');

//Cambiar el nombre de la tabla 'dataTableA'
if (document.getElementById('dataTableH')) {

    // Función para buscar aulas id
    async function buscarHorario(terminoBusqueda = '') {
        const dbRef = ref(database);
        const resultados = [];

        try {
            //Cambiar el 'aula' por el que hayamos puesto arriba
            const snapshot = await get(child(dbRef, 'horario'));
            if (snapshot.exists()) {
                //cambiar la constante aulas
                const horarios = snapshot.val();

                // Filtramos las aulas por id
                //cambiar las constantes aulas
                for (let key in horarios) {
                    const horario = horarios[key];
                    if (
                        //Cambiar el aula.idAula
                        terminoBusqueda === '' || (terminoBusqueda === horario.idHorario)
                    ) {
                        //Cambiar aula (lo que esta entre parentesis)
                        resultados.push(horario);
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
        const dataTableH = document.getElementById('dataTableH').getElementsByTagName('tbody')[0];
        dataTableH.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos resultados

        if (resultados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3" class="text-center">No se encontraron resultados</td>';
            dataTableH.appendChild(tr);
        } else {
            //Cambiar aula, lo que está entre parentesis
            resultados.forEach((horario) => {
                //Cambiar el nombre de la tabla
                const newRow = dataTableH.insertRow();

                //Cambiar las celdas por el nombre de las columnas de nuestra entrada de datos
                const cellidHorario = newRow.insertCell(0);
                const cellee = newRow.insertCell(1);
                const cellaula = newRow.insertCell(2);
                const cellhoraEE = newRow.insertCell(3);
                //const celldocenteEE = newRow.insertCell(4);

                //Se cambia la parte final
                cellidHorario.innerHTML = horario.idHorario;
                cellee.innerHTML = horario.ExpEduH;
                cellaula.innerHTML = horario.aula;
                cellhoraEE.innerHTML = horario.HoraEE;
                //celldocenteEE.innerHTML = horario.docente;

            });
        }
    }

    // Mostrar todas las aulas al cargar la página
    //Se cambia aulaRef, por lo que se cambió arriba
    onValue(horarioRef, (snapshot) => {
        const data = snapshot.val();
        //Cambiar dataTableA
        const dataTableH = document.getElementById('dataTableH').getElementsByTagName('tbody')[0];

        dataTableH.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        if (data) {
            // Mostrar todas las aulas inicialmente
            Object.keys(data).forEach((key) => {
                //Cambiar la constante de acuerdo al archivo
                const horario = data[key];
                const newRow = dataTableH.insertRow();

                //Cambiar las como en el metodo anterior
                const cellidHorario = newRow.insertCell(0);
                const cellee = newRow.insertCell(1);
                const cellaula = newRow.insertCell(2);
                const cellhoraEE = newRow.insertCell(3);
                //const celldocenteEE = newRow.insertCell(4);

                cellidHorario.innerHTML = horario.idHorario;
                cellee.innerHTML = horario.ExpEduH;
                cellaula.innerHTML = horario.aula;
                cellhoraEE.innerHTML = horario.HoraEE;
                //celldocenteEE.innerHTML = horario.docente;
            });
        } else {
            console.log('No hay datos disponibles');
            alert("No hay datos disponibles");
        }
    });

    // Event listener para la búsqueda
    // Cambiar el nombre 'buscarformA' por el formulario de busqueda del html
    const searchForm = document.getElementById('buscarformH');
    // Cambiar el nombre 'buscarformA' por el input de busqueda del html
    const searchInput = document.getElementById('horarioB');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const terminoBusqueda = searchInput.value.trim();
        //Cambiar por la declaración de la función correcta
        const resultados = await buscarHorario(terminoBusqueda);
        mostrarResultadosEnTabla(resultados);
    });

} else {
    // Guardar datos en Firebase cuando se envía el formulario
    document.getElementById('horarioForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

        console.log('Formulario enviado');

        // Obtiene los datos del formulario
        //Corregir las constantes y lo de comillas por el id de los inputs
        const idHorario = document.getElementById('idHorario').value;
        const ExpEduH = document.getElementById('ee').value;
        const aula = document.getElementById('aula').value;
        const HoraEE = document.getElementById('HoraEE').value;

        //Cambiar lo que está entre llaves por las constantes de las lineas anteriores
        console.log(`Datos capturados: ${idHorario}, ${ExpEduH}, ${aula}, ${HoraEE}`);

        // Inserta un nuevo registro de aula en Firebase
        //Piensenle, o sea, cambienle
        //Cambiar aulaRef por la declaración del inicio
        push(horarioRef, {
            //Cambiar
            //Lado izquierdo columnas
            //Lado derecho constantes
            idHorario: idHorario,
            ExpEduH: ExpEduH,
            aula: aula,
            HoraEE: HoraEE,
        }).then(() => {
            alert("Datos del Aula guardados correctamente");
            // Limpiar el formulario después de guardar
            //Cambiar el nombre del formulario del html
            document.getElementById('horarioForm').reset();
        }).catch((error) => {
            console.log("Error al guardar los datos: " + error);
            alert("Error al guardar los datos: " + error);
        });
    });

    // Función para llenar el select con las experiencias educativa
    function cargareeEnSelect() {
        const selectee = document.querySelector('select.form-select');

        // Limpiar el select antes de agregar nuevos datos
        selectee.innerHTML = '<option selected>Seleccione una Experiencia Educativa</option>';

        // Escuchar los cambios en los datos de docentes en Fireba
        onValue(expEduRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Recorrer cada docente y añadirlo como opción en el select
                Object.keys(data).forEach((key) => {
                    const ee = data[key];
                    const option = document.createElement('option');
                    option.value = ee.nrc;  // Valor que se enviará con el formulario
                    option.textContent = `${ee.nomEE}`;  // Mostrar el nombre y profesión del docente
                    selectee.appendChild(option);
                });
            } else {
                console.log("No hay Experiencia Educativa disponibles en la base de datos");
            }
        });
    }

    // Llamar a la función cuando la página cargue
    document.addEventListener('DOMContentLoaded', cargareeEnSelect);

    // Otras funcionalidades que puedas tener en ExpEdu.js (si aplica)

    // Aquí puedes agregar más código si tienes más funciones para manejar el formulario o la lógica de tu aplicación
    //Hasta aqui
    const aulaRef = ref(database, 'aula');
    // Función para llenar el select con las aulas
    function cargaraulaEnSelect() {
        const selectaula = document.getElementById('aula');

        // Limpiar el select antes de agregar nuevos datos
        selectaula.innerHTML = '<option selected>Seleccione una Aula</option>';

        // Escuchar los cambios en los datos de Aula en Firebase
        onValue(aulaRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Recorrer cada docente y añadirlo como opción en el select
                Object.keys(data).forEach((key) => {
                    const aula = data[key];
                    const option = document.createElement('option');
                    option.value = aula.idAula;  // Valor que se enviará con el formulario
                    option.textContent = `${aula.idAula}`;  // Mostrar el nombre y profesión del docente
                    selectaula.appendChild(option);
                });
            } else {
                console.log("No hay Aula disponibles en la base de datos");
            }
        });
    }

    // Llamar a la función cuando la página cargue
    document.addEventListener('DOMContentLoaded', cargaraulaEnSelect);
}