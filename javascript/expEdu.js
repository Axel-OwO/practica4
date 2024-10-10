import { database } from "./firebase.js";
import {
  ref,
  push,
  onValue,
  get,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Referencia a la base de datos para los docentes
const docenteRef = ref(database, "docente");

// Referencia a la base de datos para los usuarios
const expeRef = ref(database, "expEdu");

if (document.getElementById("dataTableE")) {
  // Función para buscar aulas id

  async function buscarExperiencias(terminoBusqueda = "") {
    const dbRef = ref(database);
    const resultados = [];

    try {
      const snapshot = await get(child(dbRef, "expEdu"));
      if (snapshot.exists()) {
        const experiencias = snapshot.val();

        // Filtramos las aulas por id

        for (let key in experiencias) {
          const experiencia = experiencias[key];
          if (terminoBusqueda === "" || terminoBusqueda === experiencia.nrc) {
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
    const dataTableE = document
      .getElementById("dataTableE")
      .getElementsByTagName("tbody")[0];
    dataTableE.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos resultados

    if (resultados.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td colspan="3" class="text-center">No se encontraron resultados</td>';
      dataTableE.appendChild(tr);
    } else {
      resultados.forEach((experiencia) => {
        const newRow = dataTableE.insertRow();

        const cellnrc = newRow.insertCell(0);
        //const cellproEduDoc = newRow.insertCell(1);
        const cellnomEE = newRow.insertCell(1);
        const celldocEE = newRow.insertCell(2);
        const cellhoras = newRow.insertCell(3);
        const cellcreditos = newRow.insertCell(4);

        //Se cambia la parte final
        cellnrc.innerHTML = experiencia.nrc;
        //cellproEduDoc.innerHTML = experiencia.proEduDoc;
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

    const dataTableE = document
      .getElementById("dataTableE")
      .getElementsByTagName("tbody")[0];

    dataTableE.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

    if (data) {
      // Mostrar todas las aulas inicialmente
      Object.keys(data).forEach((key) => {
        const experiencia = data[key];
        const newRow = dataTableE.insertRow();

        const cellnrc = newRow.insertCell(0);
        //const cellproEduDoc = newRow.insertCell(1);
        const cellnomEE = newRow.insertCell(1);
        const celldocEE = newRow.insertCell(2);
        const cellhoras = newRow.insertCell(3);
        const cellcreditos = newRow.insertCell(4);

        cellnrc.innerHTML = experiencia.nrc;
        //cellproEduDoc.innerHTML = experiencia.proEduDoc;
        cellnomEE.innerHTML = experiencia.nomEE;
        celldocEE.innerHTML = experiencia.docEE;
        cellhoras.innerHTML = experiencia.horas;
        cellcreditos.innerHTML = experiencia.creditos;
      });
    } else {
      console.log("No hay datos disponibles");
      alert("No hay datos disponibles");
    }
  });

  // Event listener para la búsqueda

  const searchForm = document.getElementById("buscarformE");
  const searchInput = document.getElementById("experienciaB");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const terminoBusqueda = searchInput.value.trim();
    //Cambiar por la declaración de la función correcta
    const resultados = await buscarExperiencias(terminoBusqueda);
    mostrarResultadosEnTabla(resultados);
  });
} else if (document.getElementById("dataTableEEE")) {
  onValue(expeRef, (snapshot) => {
    const data = snapshot.val();

    const dataTableEEE = document
      .getElementById("dataTableEEE")
      .getElementsByTagName("tbody")[0];

    dataTableEEE.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

    if (data) {
      // Mostrar todas las aulas inicialmente
      Object.keys(data).forEach((key) => {
        const expEdu = data[key];
        const newRow = dataTableEEE.insertRow();

        const cellnrc = newRow.insertCell(0);
        //const cellproEduDoc = newRow.insertCell(1);
        const cellnomEE = newRow.insertCell(1);
        const celldocEE = newRow.insertCell(2);
        const cellhoras = newRow.insertCell(3);
        const cellcreditos = newRow.insertCell(4);

        const cellEdit = newRow.insertCell(5);
        const cellDelete = newRow.insertCell(6);

        cellnrc.innerHTML = expEdu.nrc;
        //cellproEduDoc.innerHTML = expEdu.proEduDoc;
        cellnomEE.innerHTML = expEdu.nomEE;
        celldocEE.innerHTML = expEdu.docEE;
        cellhoras.innerHTML = expEdu.horas;
        cellcreditos.innerHTML = expEdu.creditos;

        const editButton = document.createElement("button");
        editButton.innerText = "Editar";
        editButton.classList.add("btn", "btn-warning", "me-2");
        editButton.onclick = () => editEE(key, expEdu);
        cellEdit.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Eliminar";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.onclick = () => deleteEE(key);
        cellDelete.appendChild(deleteButton);
      });
    } else {
      console.log("No hay datos disponibles");
      alert("No hay datos disponibles");
    }

    function editEE(nrc, expEdu) {
      const newNrc = prompt("Editar NRC:", expEdu.nrc);
      //const newProedu = prompt("Editar programa educativo:", expEdu.proEduDoc);
      const newnomEE = prompt("Editar nombre:", expEdu.nomEE);
      const newdocEE = prompt("Editar docente:", expEdu.docEE);
      const newHoras = prompt("Editar horas:", expEdu.horas);
      const newCreditos = prompt("Editar creditos:", expEdu.creditos);

      if (newNrc && newnomEE && newdocEE && newHoras && newCreditos) {
        update(ref(database, `expEdu/${nrc}`), {
          nrc: newNrc,
          nomEE: newnomEE,
          // proEduDoc: newProedu,
          docEE: newdocEE,
          horas: newHoras,
          creditos: newCreditos,
        })
          .then(() => {
            alert("Datos actualizados con éxito");
          })
          .catch((error) => {
            alert("Error al actualizar los datos: " + error.message);
          });
      } else {
        alert("Todos los campos son obligatorios para la edición.");
      }
    }

    function deleteEE(nrc) {
      if (confirm("¿Estás seguro de que deseas eliminar esta EE?")) {
        remove(ref(database, `expEdu/${nrc}`))
          .then(() => {
            alert("EE eliminada con éxito");
            const refreshButton = document.getElementById("showData");
            if (refreshButton) {
              refreshButton.click(); // Refrescar datos si el botón existe
            }
          })
          .catch((error) => {
            alert("Error al eliminar la EE: " + error.message);
          });
      }
    }
  });
} else {
  // Función para llenar el select con los docentes
  function cargarDocentesEnSelect() {
    const selectDocentes = document.querySelector("select.form-select");

    // Limpiar el select antes de agregar nuevos datos
    selectDocentes.innerHTML =
      "<option selected>Seleccione un Docente</option>";

    // Escuchar los cambios en los datos de docentes en Firebase
    onValue(docenteRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Recorrer cada docente y añadirlo como opción en el select
        Object.keys(data).forEach((key) => {
          const docente = data[key];
          const option = document.createElement("option");
          option.value = docente.idDocente; // Valor que se enviará con el formulario
          option.textContent = `${docente.nomDocente}`; // Mostrar el nombre y profesión del docente
          selectDocentes.appendChild(option);
        });
      } else {
        console.log("No hay docentes disponibles en la base de datos");
      }
    });
  }

  // Llamar a la función cuando la página cargue
  document.addEventListener("DOMContentLoaded", cargarDocentesEnSelect);

  // Guardar datos en Firebase cuando se envía el formulario
  document.getElementById("expForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    console.log("Formulario enviado");

    // Obtiene los datos del formulario
    const nrc = document.getElementById("nrc").value;
    //const proEduDoc = document.getElementById('proEduDoc').value;
    const nomEE = document.getElementById("nomEE").value;
    const docEE = document.getElementById("docEE").value;
    const horas = document.getElementById("horas").value;
    const creditos = document.getElementById("creditos").value;

    console.log(
      `Datos capturados: ${nrc}, ${nomEE}, ${docEE}, ${horas}, ${creditos}`
    );

    // Inserta un nuevo registro de aula en Firebase
    push(expeRef, {
      nrc: nrc,
      nomEE: nomEE,
      docEE: docEE,
      horas: horas,
      creditos: creditos,
    })
      .then(() => {
        alert("Datos del Aula guardados correctamente");
        // Limpiar el formulario después de guardar

        document.getElementById("expForm").reset();
      })
      .catch((error) => {
        console.log("Error al guardar los datos: " + error);
        alert("Error al guardar los datos: " + error);
      });
  });
}
