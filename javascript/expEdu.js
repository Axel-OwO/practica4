import { database } from "./firebase.js";
import { ref, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Referencia a la base de datos para los usuarios
const expeRef = ref(database, 'expEdu');

//Cambiar el nombre de la tabla 'dataTableA'
if (document.getElementById('dataTableE')) {

    // Función para buscar aulas id
    //Cambiar el titulo de la función buscaAulas
    async function buscarExperiencias(terminoBusqueda = '') {
        const dbRef = ref(database);
        const resultados = [];

        try {
            //Cambiar el 'aula' por el que hayamos puesto arriba
            const snapshot = await get(child(dbRef, 'expEdu'));
            if (snapshot.exists()) {
                //cambiar la constante aulas
                const experiencias = snapshot.val();

                // Filtramos las aulas por id
                //cambiar las constantes aulas
                for (let key in experiencias) {
                    const experiencia = experiencias[key];
                    if (
                        //Cambiar el aula.idAula
                        terminoBusqueda === '' || (terminoBusqueda === experiencia.nrc)
                    ) {
                        //Cambiar aula (lo que esta entre parentesis)
                        resultados.push(experiencia);
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
        const dataTableE = document.getElementById('dataTableE').getElementsByTagName('tbody')[0];
        dataTableE.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos resultados

        if (resultados.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3" class="text-center">No se encontraron resultados</td>';
            dataTableE.appendChild(tr);
        } else {
            //Cambiar aula, lo que está entre parentesis
            resultados.forEach((experiencia) => {
                //Cambiar el nombre de la tabla
                const newRow = dataTableE.insertRow();

                //Cambiar las celdas por el nombre de las columnas de nuestra entrada de datos
                const cellnrc = newRow.insertCell(0);
                const cellproEduDoc = newRow.insertCell(1);
                const cellnomEE = newRow.insertCell(2);
                const celldocEE = newRow.insertCell(3);
                const cellhoras = newRow.insertCell(4);
                const cellcreditos = newRow.insertCell(5);

                //Se cambia la parte final
                cellnrc.innerHTML = experiencia.nrc;
                cellproEduDoc.innerHTML = experiencia.proEduDoc;
                cellnomEE.innerHTML = experiencia.nomEE;
                celldocEE.innerHTML = experiencia.docEE;
                cellhoras.innerHTML = experiencia.horas;
                cellcreditos.innerHTML = experiencia.creditos;
            });
        }
    }

    // Mostrar todas las aulas al cargar la página
    //Se cambia aulaRef, por lo que se cambió arriba
    onValue(expeRef, (snapshot) => {
        const data = snapshot.val();
        //Cambiar dataTableA
        const dataTableE = document.getElementById('dataTableE').getElementsByTagName('tbody')[0];
        
        dataTableE.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        if (data) {
            // Mostrar todas las aulas inicialmente
            Object.keys(data).forEach((key) => {
                //Cambiar la constante de acuerdo al archivo
                const experiencia = data[key];
                const newRow = dataTableE.insertRow();

                //Cambiar las como en el metodo anterior
                const cellnrc = newRow.insertCell(0);
                const cellproEduDoc = newRow.insertCell(1);
                const cellnomEE = newRow.insertCell(2);
                const celldocEE = newRow.insertCell(3);
                const cellhoras = newRow.insertCell(4);
                const cellcreditos = newRow.insertCell(5);

                cellnrc.innerHTML = experiencia.nrc;
                cellproEduDoc.innerHTML = experiencia.proEduDoc;
                cellnomEE.innerHTML = experiencia.nomEE;
                celldocEE.innerHTML = experiencia.docEE;
                cellhoras.innerHTML = experiencia.horas;
                cellcreditos.innerHTML = experiencia.creditos;
            });
        } else {
            console.log('No hay datos disponibles');
            alert("No hay datos disponibles");
        }
    });

    // Event listener para la búsqueda
    // Cambiar el nombre 'buscarformA' por el formulario de busqueda del html
    const searchForm = document.getElementById('buscarformE');
    // Cambiar el nombre 'buscarformA' por el input de busqueda del html
    const searchInput = document.getElementById('experienciaB');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const terminoBusqueda = searchInput.value.trim();
        //Cambiar por la declaración de la función correcta
        const resultados = await buscarExperiencias(terminoBusqueda);
        mostrarResultadosEnTabla(resultados);
    });

} else {
    // Guardar datos en Firebase cuando se envía el formulario
    document.getElementById('expForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

        console.log('Formulario enviado');

        // Obtiene los datos del formulario
        //Corregir las constantes y lo de comillas por el id de los inputs
        const nrc = document.getElementById('nrc').value;
        const proEduDoc = document.getElementById('proEduDoc').value;
        const nomEE = document.getElementById('nomEE').value;
        const docEE = document.getElementById('docEE').value;
        const horas = document.getElementById('horas').value;
        const creditos = document.getElementById('creditos').value;

        //Cambiar lo que está entre llaves por las constantes de las lineas anteriores
        console.log(`Datos capturados: ${nrc}, ${proEduDoc}, ${nomEE}, ${docEE}, ${horas}, ${creditos}`);

        // Inserta un nuevo registro de aula en Firebase
        //Piensenle, o sea, cambienle
        //Cambiar aulaRef por la declaración del inicio
        push(expeRef, {
            //Cambiar
            //Lado izquierdo columnas
            //Lado derecho constantes
            nrc: nrc,
            proEduDoc: proEduDoc,
            nomEE: nomEE,
            docEE: docEE,
            horas: horas,
            creditos: creditos
        }).then(() => {
            alert("Datos del Aula guardados correctamente");
            // Limpiar el formulario después de guardar
            //Cambiar el nombre del formulario del html
            document.getElementById('expForm').reset();
        }).catch((error) => {
            console.log("Error al guardar los datos: " + error);
            alert("Error al guardar los datos: " + error);
        });
    });
}