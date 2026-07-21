import readline from "readline";
import "./api/server";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mostrarMenu(): void {

    console.clear();

    console.log("====================================");
    console.log("     SERVIDOR HTTP NATIVO");
    console.log("====================================");
    console.log("El servidor está ejecutándose.");
    console.log("URL: http://localhost:3000");
    console.log("");
    console.log("0. Finalizar servidor");
    console.log("");

    rl.question("Seleccione una opción: ", (opcion) => {

        switch (opcion) {

            case "0":
                console.log("\nFinalizando servidor...");
                rl.close();
                process.exit(0);

            default:
                console.log("\nOpción no válida.");
                setTimeout(mostrarMenu, 1500);

        }

    });

}

mostrarMenu();