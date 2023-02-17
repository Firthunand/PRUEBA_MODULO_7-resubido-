const { pool } = require("./obtenerPool");
const axios = require("axios");


const insertar = async (datos) => {
    const consulta = {
        text: "insert into usuarios (nombre, balance) values ($1, $2)",
        values: datos
    }
    try {
        const resultado = await pool.query(consulta);
        return resultado;
    } catch (error) {
        console.log(error.code);
        return error
    }
}

const consultar = async () => {
    try {
        const resultado = await pool.query("select * from usuarios;")
        return resultado
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

const editar = async (datos, id) => {
    const consulta = {
        text: `update usuarios set nombre = $1, balance = $2 where id = '${id}' returning *`,
        values: datos,
    }
    try {
        const resultado = await pool.query(consulta)
        return resultado
    } catch (error) {
        console.log(error);
        return error
    }
}

const eliminar = async (id) => {
    try {
        const resultado = await pool.query(
            `delete from transferencias where emisor = ${id} or receptor = ${id};
             delete from usuarios where id = '${id}';
            `);
        return resultado
    } catch (error) {
        console.log(error)
        return error
    }
}

const transferir = async (datos) => {
    try {
        
        const { data } = await axios.get("http://localhost:3000/usuarios");

        
        const emisor = data.rows.filter((e) => {
            return e.nombre == datos[0];
        });
        
        const receptor = data.rows.filter((e) => {
            return e.nombre == datos[1];
        });

        const resultado = await pool.query(
            `
            begin;
            update usuarios set balance = balance - ${datos[2]} where nombre = '${datos[0]}';
            update usuarios set balance = balance + ${datos[2]} where nombre = '${datos[1]}';
            insert into transferencias (emisor, receptor, monto, fecha)
                values (${emisor[0].id}, ${receptor[0].id}, '${datos[2]}', now());
            commit;
            `
        );
        return resultado
    } catch (error) {
        console.log(error);
        return error
    }
}

const consultarTransferencias = async () => {
    try {
        const consulta = {
            text: `select t.fecha, e.nombre as emisor, r.nombre as receptor, t.monto from transferencias as t
                    inner join usuarios as e on t.emisor = e.id
                    inner join usuarios as r on t.receptor = r.id;`,
            rowMode: "array",
        }
        const resultado = await pool.query(consulta)
        return resultado
    } catch (error) {
        console.log(error);
        return error
    }
}


module.exports = { insertar, consultar, editar, eliminar, transferir, consultarTransferencias };
