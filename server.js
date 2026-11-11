import express from "express";
const app = express();

app.use(express.json());


let productos = [];

let siguienteId = 1;

productos.push(
    {
        id: siguienteId++,
        nombre: "Laptop",
        precio: 2500000,
        stock: 10
    },
    {
        id: siguienteId++,
        nombre: "Mouse",
        precio: 45000,
        stock: 20
    },
    {
        id: siguienteId++,
        nombre: "Teclado",
        precio: 85000,
        stock: 15
    },
    {
        id: siguienteId++,
        nombre: "Monitor",
        precio: 750000,
        stock: 8
    }
);


app.get("/productos", (req, res) => {

    let resultado = productos;

    if (req.query.max !== undefined) {
        const max = Number(req.query.max);

        if (!Number.isFinite(max) || max < 0) {
            return res.status(400).json({
                error: "El máximo debe ser un número positivo"
            });
        }

        resultado = productos.filter(
            p => p.precio <= max
        );
    }

    res.status(200).json(resultado);
});


app.get("/productos/:id", (req, res) => {

    const id = Number(req.params.id);

    const producto = productos.find(
        p => p.id === id
    );

    if (!producto) {
        return res.status(404).json({
            error: "Producto no existe"
        });
    }

    res.status(200).json(producto);
});


app.post("/productos", (req, res) => {

    const { nombre, precio, stock = 0 } = req.body;

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        precio === undefined ||
        typeof precio !== "number" ||
        !Number.isFinite(precio) ||
        stock === null ||
        typeof stock !== "number" ||
        !Number.isFinite(stock) ||
        precio < 0 ||
        stock < 0
    ) {
        return res.status(400).json({
            error: "Datos incorrectos o faltantes"
        });
    }

    const nuevo = {
        id: siguienteId++,
        nombre: nombre.trim(),
        precio,
        stock
    };

    productos.push(nuevo);

    res.status(201).json(nuevo);
});


app.put("/productos/:id", (req, res) => {

    const id = Number(req.params.id);

    const i = productos.findIndex(
        p => p.id === id
    );

    if (i === -1) {
        return res.status(404).json({
            error: "Producto no existe"
        });
    }

    const { nombre, precio, stock } = req.body;

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        typeof precio !== "number" ||
        !Number.isFinite(precio) ||
        typeof stock !== "number" ||
        !Number.isFinite(stock) ||
        precio < 0 ||
        stock < 0
    ) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios y deben ser válidos"
        });
    }

    productos[i] = {
        id,
        nombre: nombre.trim(),
        precio,
        stock
    };

    res.status(200).json(productos[i]);
});


app.patch("/productos/:id", (req, res) => {

    const id = Number(req.params.id);

    const i = productos.findIndex(
        p => p.id === id
    );

    if (i === -1) {
        return res.status(404).json({
            error: "Producto no existe"
        });
    }

    const datos = req.body;

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({
            error: "Debe enviar al menos un campo"
        });
    }

    if (
        "nombre" in datos &&
        (typeof datos.nombre !== "string" ||
        !datos.nombre.trim())
    ) {
        return res.status(400).json({
            error: "Nombre incorrecto"
        });
    }

    if (
        "precio" in datos &&
        (typeof datos.precio !== "number" ||
        !Number.isFinite(datos.precio) ||
        datos.precio < 0)
    ) {
        return res.status(400).json({
            error: "Precio incorrecto"
        });
    }

    if (
        "stock" in datos &&
        (typeof datos.stock !== "number" ||
        !Number.isFinite(datos.stock) ||
        datos.stock < 0)
    ) {
        return res.status(400).json({
            error: "Stock incorrecto"
        });
    }

    productos[i] = {
        ...productos[i],
        ...datos
    };

    res.status(200).json(productos[i]);
});



app.delete("/productos/:id", (req, res) => {

    const id = Number(req.params.id);

    const i = productos.findIndex(
        p => p.id === id
    );

    if (i === -1) {
        return res.status(404).json({
            error: "Producto no existe"
        });
    }

    productos.splice(i, 1);

    res.status(204).end();
});


app.listen(3000, () => {
    console.log("Servidor funcionando en http://localhost:3000");
});