const http = require("http")
const url = require("url")
const fsPromises = require("fs/promises")
const { insertar, consultar, editar, eliminar, transferir, consultarTransferencias } = require("./consultas")


http.createServer(async (req, res) => {

    if (req.url == "/" && req.method == "GET") {
        res.statusCode = 200
        const html = await fsPromises.readFile("./www/index.html", "utf8")
        res.end(html)
    }

    if ((req.url == "/usuario" && req.method == "POST")) {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        })

        req.on("end", async () => {
            try {
                const datos = Object.values(JSON.parse(body))
                const respuesta = await insertar(datos)
                res.end(JSON.stringify(respuesta))
            } catch (error) {
                res.end(JSON.stringify({
                    code: error.code,
                    message: "Error inesperado. Contacte al administrador.",
                }));
            }
        })
    }

    if ((req.url == "/usuarios" && req.method == "GET")) {
        const respuesta = await consultar()
        res.end(JSON.stringify(respuesta))
    }

    if (req.url.startsWith("/usuario?") && req.method == "PUT") {
        const { id } = url.parse(req.url, true).query;
        let body = "";
        req.on("data", (chunk) => {
            body += chunk
        })
        req.on("end", async () => {
            try {
                const datos = Object.values(JSON.parse(body))
                const respuesta = await editar(datos, id)
                res.end(JSON.stringify(respuesta))
            } catch (error) {
                res.end(JSON.stringify({
                    code: error.code,
                    message: "Error inesperado. Contacte al administrador.",
                }));
            }
        })
    }

    if (req.url.startsWith("/usuario?") && req.method == "DELETE") {
        try {
            const { id } = url.parse(req.url, true).query
            const respuesta = await eliminar(id)
            res.end(JSON.stringify(respuesta))
        } catch (error) {
            res.end(JSON.stringify({
                code: error.code,
                message: "Error inesperado. Contacte al administrador.",
            }));
        }
    }

    if ((req.url == "/transferencia" && req.method == "POST")) {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk
        })
        req.on("end", async () => {
            try {
                const datos = Object.values(JSON.parse(body))
                const respuesta = await transferir(datos)
                res.end(JSON.stringify(respuesta))
            } catch (error) {
                res.end(JSON.stringify({
                    code: error.code,
                    message: "Error inesperado. Contacte al administrador.",
                }));
            }
        })
    }

    if ((req.url == "/transferencias" && req.method == "GET")) {
        try {
            const respuesta = await consultarTransferencias()
            res.writeHead(200, { "content-type": "application/json" })
            res.end(JSON.stringify(respuesta))
        } catch (error) {
            res.end(JSON.stringify({
                code: error.code,
                message: "Error inesperado. Contacte al administrador.",
            }));
        }
    }

}).listen(3000, () => console.log("Server ON! http://localhost:3000"))