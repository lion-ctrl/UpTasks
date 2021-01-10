import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");

btnEliminar &&
	btnEliminar.addEventListener("click", (e) => {
		const urlProyecto = e.target.dataset.proyectoUrl;

		Swal.fire({
			title: "¿Deseas eliminar este Proyecto?",
			text: "Esta accion no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Eliminar",
			cancelButtonText: "No, Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				// * peticion a axios para eliminar el proyecto
				const url = `${location.origin}/proyectos/${urlProyecto}`;
				// % se crea la url dinamica ya que a la hora de desplegar el proyecto cambia

				// * enviar los datos
				axios.delete(url, { params: urlProyecto }).then((res) => {
                    Swal.fire(
                        "Proyecto eliminado",
                        res.data,
                        "success"
                    );
                    
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 3000);
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
	});

export default btnEliminar;
