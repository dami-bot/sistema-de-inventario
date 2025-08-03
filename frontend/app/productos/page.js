"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [filtro, setFiltro] = useState("");
  const [file, setFile] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editFile, setEditFile] = useState(null);

  // Obtener productos
  const cargarProductos = async () => {
    const res = await fetch("http://localhost:3001/api/productos");
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Filtrar productos
  const productosFiltrados = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(busqueda.toLowerCase()) &&
      p.name.toLowerCase().includes(filtro.toLowerCase()),
  );

  // Agregar producto
  const agregarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("stock", stock);
    formData.append("price", price);
    if (file) formData.append("image", file);
    await fetch("http://localhost:3001/api/productos", {
      method: "POST",
      body: formData,
    });

    setName("");
    setStock("");
    setPrice("");
    setFile(null);
    cargarProductos();
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    await fetch(`http://localhost:3001/api/productos/${id}`, {
      method: "DELETE",
    });
    cargarProductos();
  };
  const abrirEdicion = (producto) => {
    console.log("Abriendo edición para:", producto);

    setProductoEditando(producto);
    setEditName(producto.name);
    setEditStock(producto.stock);
    setEditPrice(producto.price);
    setEditFile(null);
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("stock", editStock);
    formData.append("price", editPrice);
    if (editFile) formData.append("image", editFile);

    await fetch(`http://localhost:3001/api/productos/${productoEditando.id}`, {
      method: "PUT",
      body: formData,
    });

    setProductoEditando(null);
    cargarProductos();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Fondo degradado con SVG */}

      <div className="mb-8 mt-12 w-full max-w-2xl rounded-xl bg-white/60 p-8 shadow-xl backdrop-blur-sm">
        <Link
          href="/"
          className="absolute left-4 top-4 text-blue-600 hover:underline"
        >
          ← Volver al inicio
        </Link>
         <Link
          href="/compras"
          className="absolute right-4 top-4 text-blue-600 hover:underline"
        >
          ir al historial de compras →
        </Link>
        <h1 className="mb-6 text-center text-4xl font-extrabold text-gray-800 drop-shadow-lg">
          Inventario de Productos
        </h1>

        <input
          type="text"
          placeholder="Filtrar por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="mb-8 w-full rounded border p-2"
        />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="mb-6 w-full rounded-lg border border-gray-300 p-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <form
          onSubmit={agregarProducto}
          className="mb-8 flex flex-col items-center justify-center gap-5sm:flex-row"
        >
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-auto"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-auto"
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-auto"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full rounded-lg border border-gray-300 p-2 sm:w-auto"
          />

          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-2 font-bold text-white shadow-lg transition hover:scale-105"
          >
            Agregar
          </button>
        </form>
        {productoEditando && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <form onSubmit={guardarEdicion} className="flex flex-col gap-4">
                <h2 className="mb-2 text-center text-xl font-bold">
                  Editar producto
                </h2>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nombre"
                  className="rounded border p-2"
                />

                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  placeholder="Stock"
                  className="rounded border p-2"
                />

                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Precio"
                  className="rounded border p-2"
                />

                <input
                  type="file"
                  onChange={(e) => setEditFile(e.target.files[0])}
                  className="rounded border p-2"
                />

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setProductoEditando(null)}
                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {productosFiltrados.map((p) => (
            <li
              key={p.id}
              className="group flex flex-col items-start rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl"
            >
              {p.imageUrl && (
                <img
                  src={`http://localhost:3001${p.imageUrl}`}
                  alt={p.name}
                  className="mb-3 h-40 w-full rounded-lg object-cover"
                />
              )}
              <button
                onClick={() => abrirEdicion(p)}
                className="mt-2 text-blue-500 underline hover:text-blue-700"
              >
                Editar
              </button>

              <span className="mb-2 text-lg font-semibold text-gray-700 transition group-hover:text-blue-600">
                {p.name}
              </span>
              <span className="mb-1 text-sm text-gray-500">
                Stock: <span className="font-bold">{p.stock}</span>
              </span>
              <span className="mb-3 text-sm text-gray-500">
                Precio: <span className="font-bold">${p.price}</span>
              </span>
              <button
                onClick={() => eliminarProducto(p.id)}
                className="mt-auto rounded-lg bg-pink-500 px-4 py-1 text-white shadow transition hover:bg-pink-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        {productosFiltrados.length === 0 && (
          <div className="mt-8 animate-pulse text-center text-gray-500">
            No hay productos para mostrar.
          </div>
        )}
      </div>
      {/* Pie de página moderno */}
      <footer className="py-4 text-center text-white opacity-80">
        <span>Inventario Moderno &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
