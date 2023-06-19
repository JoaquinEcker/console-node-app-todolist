import {
  inquirerMenu,
  leerInput,
  pausa,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist,
} from "./helpers/inquirer.js";
import colors from "colors";
import Tareas from "./models/Tareas.js";
import { guardarDB, leerDB } from "./helpers/interaccionesDB.js";

const main = async () => {
  let opt = "";

  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    //Cargar tareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    //Esta funcion imprime el menu
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        //crear opcion
        const desc = await leerInput("Descripción: ");
        tareas.crearTarea(desc);
        break;
      case "2":
        tareas.listadoCompleto();
        // console.log(tareas.listadoArr);
        break;
      case "3":
        tareas.listarPendientesCompletadas(true);
        break;
      case "4":
        tareas.listarPendientesCompletadas(false);
        break;
      case "5": //completado | pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case "6":
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== "0") {
          // TODO: preguntar si esta seguro!!!
          const ok = await confirmar("Está seguro?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada");
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
  } while (opt !== "0");

  // pausa();
};

main();
