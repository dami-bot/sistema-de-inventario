"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaBoxes, FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function DistribuidoraUI() {
  const { data: session } = useSession();
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
  fetch("http://localhost:3001/api/productos")
    .then((res) => res.json())
    .then((data) => {
      console.log("Respuesta del backend:", data);
      if (Array.isArray(data)) {
        setProductos(data);
      } else {
        console.error("La respuesta no es un array:", data);
        setProductos([]);
      }
    })
    .catch((err) => {
      console.error("Error al obtener productos:", err);
      setProductos([]);
    });
}, []);

  
  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id);
      if (existe) {
        return prev.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Quitar producto del carrito
  const quitarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id));
  };

  // Calcular total del carrito
  const totalCarrito = carrito.reduce((total, item) => total + item.price * item.cantidad, 0);
  const comprar = async () => {
    try {
      // Restar stock en el backend
      for (const item of carrito) {
        const res = await fetch(`http://localhost:3001/api/productos/${item.id}/restar-stock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cantidad: item.cantidad })
        });

        if (!res.ok) {
          const error = await res.json();
          alert(`Error con el producto "${item.name}": ${error.error}`);
          return;
        }
      }

      // Registrar compra en historial (opcional)
      await fetch('http://localhost:3001/api/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito })
      });

      // Limpiar carrito y recargar productos
      setCarrito([]);
      alert('¡Compra realizada con éxito!');
      const productosActualizados = await fetch('http://localhost:3001/api/productos').then(res => res.json());
      setProductos(productosActualizados);
    } catch (err) {
      console.error('Error en la compra:', err);
      alert('Hubo un error al realizar la compra.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-pink-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/logo.jpg" alt="Logo" className="w-32 h-auto object-contain" />
          <h1 className="text-xl font-bold">Distribuidora</h1>
        </div>
        <div className="flex items-center gap-4">
          {session && (
            <>
              <span className="font-bold text-gray-700">Hola, {session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>



      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map(producto => (
            <div
              key={producto.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center gap-3 group"
            >
              <img
                src={producto.imageUrl ? `http://localhost:3001${producto.imageUrl}` : 'https://via.placeholder.com/150'}
                alt={producto.name}
                className="w-full h-48 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-lg font-bold text-gray-700 text-center">{producto.name}</h2>
              <p className="text-gray-500 text-center">
                Stock: <span className="font-semibold">{producto.stock}</span>
              </p>
              <p className="text-gray-500 text-center">
                Precio: <span className="font-semibold">${producto.price}</span>
              </p>
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="w-2/3 hover:scale-105 transition bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={producto.stock === 0}
              >
                {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            </div>
          ))}
        </div>
      </main>




      {/* CARRITO DE COMPRAS */}

      <div className="fixed bottom-8 bg-white rounded-2xl shadow-2xl p-1 w-50 z-30 border border-blue-100 ">

        <h3 className="text-xl font-sans mb-4  text-gray-700 text-center">Carrito de compras</h3>
        {carrito.length === 0 ? (
          <p className="text-gray-500 text-center">El carrito está vacío.</p>
        ) : (
          <>
            <ul>
              {carrito.map(item => (
                <li key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.name} x{item.cantidad}</span>
                  <button
                    onClick={() => quitarDelCarrito(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right font-bold text-lg text-blue-700">
              Total: ${totalCarrito.toFixed(2)}
            </div>
          </>
        )}
        <button
          onClick={comprar}
          className="block w-full rounded-sm bg-yellow-400 p-4 text-sm font-medium transition hover:scale-105"
          disabled={carrito.length === 0}
        >
          Comprar
        </button>
      </div>



      {/* FOOTER */}
      <footer className="text-center text-gray-500 py-6 mt-12 ">
        Distribuidora &copy; {new Date().getFullYear()} | Todos los derechos reservados-DAMI-WEB
         <div className=" justify-center flex gap-4 text-lg">
            <a href="mailto:contacto@distribuidora.com" className="hover:text-blue-600">
              <FaEnvelope />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaInstagram />
            </a>
          </div>
      </footer>
    </div>
  );
}