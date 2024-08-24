const d = document;
let nombreInput = d.querySelector('.nombre');
let profesionInput = d.querySelector('.profesion');
let salarioInput = d.querySelector('.salario');
let btnGuardar = d.querySelector('.btn-guardar');
let btnActualizar = d.querySelector('.btn-actualizar');
let tabla = d.querySelector('.table > tbody');
let buscarInput = d.querySelector('#buscar');
let btnBuscar = d.querySelector('#btn-buscar');

// Agregar evento al botón del formulario
btnGuardar.addEventListener('click', () => {
    let datos = validarFormulario();
    if (datos != null) {
        guardarDatosLocalStorage(datos);
        quitarDatosTabla();
        obtenerDatosLocalStorage();
    }
});

// Función para validar los campos del formulario
function validarFormulario() {
    if (nombreInput.value === "" || profesionInput.value === "" || salarioInput.value === "") {
        alert("Todos los campos son obligatorios");
        return;
    } else {
        let datosFormulario = {
            nombre: nombreInput.value,
            profesion: profesionInput.value,
            salario: salarioInput.value
        };

        // Limpiar el campo después de hacer un ingreso.
        nombreInput.value = ""; 
        profesionInput.value = "";
        salarioInput.value = "";

        return datosFormulario;
    }
}

const listadoEmpleados = 'empleados'; // Aquí se guardarán todos los empleados.

function guardarDatosLocalStorage(datos) {
    let empleados = JSON.parse(localStorage.getItem(listadoEmpleados)) || [];
    empleados.push(datos);
    localStorage.setItem(listadoEmpleados, JSON.stringify(empleados));
    alert('Empleado agregado con éxito');
}

function obtenerDatosLocalStorage() {
    let empleados = JSON.parse(localStorage.getItem(listadoEmpleados)) || [];
    empleados.forEach((empleado, indice) => {
        let fila = d.createElement('tr');
        fila.innerHTML = `
            <td>${indice + 1}</td>
            <td>${empleado.nombre}</td>
            <td>${empleado.profesion}</td>
            <td>${empleado.salario}</td>
            <td>
                <span onclick="actualizarRegistroTabla(${indice})" class="btn-editar btn"> 📑 </span>
                <span onclick="eliminarRegistroTabla(${indice})" class="btn-eliminar btn mt-1"> ❌ </span>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function quitarDatosTabla() {
    let filas = d.querySelectorAll('.table tbody tr');
    filas.forEach(fila => fila.remove());
}

function eliminarRegistroTabla(indiceTabla) {
    let empleados = JSON.parse(localStorage.getItem(listadoEmpleados)) || [];
    if (confirm(`¿Estás seguro que deseas eliminar el empleado: ${empleados[indiceTabla].nombre}?`)) {
        empleados.splice(indiceTabla, 1);
        localStorage.setItem(listadoEmpleados, JSON.stringify(empleados));
        alert('Empleado eliminado');
        quitarDatosTabla();
        obtenerDatosLocalStorage();
    } else {
        alert('Operación cancelada');
    }
}

function actualizarRegistroTabla(indiceTabla) {
    let empleados = JSON.parse(localStorage.getItem(listadoEmpleados)) || [];
    nombreInput.value = empleados[indiceTabla].nombre;
    profesionInput.value = empleados[indiceTabla].profesion;
    salarioInput.value = empleados[indiceTabla].salario;

    btnActualizar.classList.remove('d-none');
    btnGuardar.classList.add('d-none');

    btnActualizar.addEventListener('click', function () {
        empleados[indiceTabla].nombre = nombreInput.value;
        empleados[indiceTabla].profesion = profesionInput.value;
        empleados[indiceTabla].salario = salarioInput.value;

        localStorage.setItem(listadoEmpleados, JSON.stringify(empleados));
        alert('Empleado actualizado con éxito');

        nombreInput.value = ""; 
        profesionInput.value = "";
        salarioInput.value = "";

        btnActualizar.classList.add('d-none');
        btnGuardar.classList.remove('d-none');

        quitarDatosTabla();
        obtenerDatosLocalStorage();
    }, { once: true });
}

// Función para filtrar empleados por nombre
function buscarEmpleados() {
    let filtro = buscarInput.value.toLowerCase();
    let empleados = JSON.parse(localStorage.getItem(listadoEmpleados)) || [];
    quitarDatosTabla();
    empleados
        .filter(empleado => empleado.nombre.toLowerCase().startsWith(filtro))
        .forEach((empleado, indice) => {
            let fila = d.createElement('tr');
            fila.innerHTML = `
                <td>${indice + 1}</td>
                <td>${empleado.nombre}</td>
                <td>${empleado.profesion}</td>
                <td>${empleado.salario}</td>
                <td>
                    <span onclick="actualizarRegistroTabla(${indice})" class="btn-editar btn"> 📑 </span>
                    <span onclick="eliminarRegistroTabla(${indice})" class="btn-eliminar btn mt-1"> ❌ </span>
                </td>
            `;
            tabla.appendChild(fila);
        });
}

// Agregar evento al campo de búsqueda para búsqueda dinámica
buscarInput.addEventListener('input', buscarEmpleados);

// Agregar evento al botón de búsqueda
btnBuscar.addEventListener('click', buscarEmpleados);

// Mostrar los datos de localStorage al recargar la página
d.addEventListener('DOMContentLoaded', () => {
    quitarDatosTabla();
    obtenerDatosLocalStorage();
});
