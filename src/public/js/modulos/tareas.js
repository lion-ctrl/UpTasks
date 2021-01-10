import axios from "axios";
import Swal from "sweetalert2";

import {ActualizarAvance} from "./avance";

const tareas = document.querySelector(".listado-pendientes");

tareas &&
	tareas.addEventListener("click", (e) => {
		if (e.target.classList.contains("fa-check-circle")) {
			const idTarea = e.target.parentElement.parentElement.dataset.tarea;

			// * cambiar estado
			const url = `${location.origin}/tareas/${idTarea}`;

			axios.patch(url,{idTarea}).then(function (res) {
				if (res.status === 200) {
                    e.target.classList.toggle("completo");
                    ActualizarAvance();
                }
			});
        }
        
        if (e.target.classList.contains("fa-trash")) {
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: "¿Deseas eliminar esta Tarea?",
                text: "Esta accion no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Eliminar",
                cancelButtonText: "No, Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
    
                    // * enviar los datos
                    axios.delete(url, { params: {idTarea} }).then((res) => {
                        if (res.status == 200) {
                            Swal.fire(
                                "Tarea eliminada",
                                res.data,
                                "success"
                            );
                            
                            tareaHTML.remove();
                            ActualizarAvance();

                        }
                    }).catch(err => {
                        Swal.fire({
                            type:"error",
                            title:"Hubo un error",
                            text:"No se pudo eliminar el proyecto",
                            icon:"error"
                        })
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 3000);
                    })
                }
            });
        }
	});

export default tareas;
