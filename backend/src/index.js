/* const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Asegurar que 'uploads/' exista
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Configuración de multer para manejar la subida de imágenes
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'));
    }
  }
});

app.use('/uploads', express.static('uploads'));

// Endpoint para subir una imagen y crear un producto
app.post('/api/productos', (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Imagen muy grande (máximo 2MB).' });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { name, stock, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    prisma.product.create({
      data: { name, stock: Number(stock), price: Number(price), imageUrl }
    }).then(producto => res.json(producto));
  });
});
//editar productos
app.put('/api/productos/:id', (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Imagen muy grande (máximo 2MB).' });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { name, stock, price } = req.body;
    const updateData = {
      name,
      stock: Number(stock),
      price: Number(price),
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    prisma.product.update({
      where: { id: Number(req.params.id) },
      data: updateData
    }).then(producto => res.json(producto));
  });
});


// Consultar todos los productos
app.get('/api/productos', async (req, res) => {
  const productos = await prisma.product.findMany();
  res.json(productos);
});
// historial de compras
app.post('/api/compras', async (req, res) => {
  const { items } = req.body; // items es un array de productos comprados
  const compra = await prisma.purchase.create({
    data: { items }
  });
  res.json(compra);
});

// Obtener historial de compras
app.get('/api/compras', async (req, res) => {
  const compras = await prisma.purchase.findMany({ orderBy: { date: 'desc' } });
  res.json(compras);
});


app.post('/api/productos/:id/restar-stock', async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  const producto = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!producto || producto.stock < cantidad) {
    return res.status(400).json({ error: 'Stock insuficiente' });
  }
  await prisma.product.update({
    where: { id: Number(id) },
    data: { stock: producto.stock - cantidad }
  });
  res.json({ ok: true });
});


/* // Eliminar producto por id
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: Number(id) } });
  res.json({ ok: true });
}); 
// Eliminar todas las compras (limpiar historial)
app.delete('/api/compras', async (req, res) => {
  try {
    await prisma.purchase.deleteMany();
    res.json({ ok: true, message: 'Historial de compras eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al limpiar el historial' });
  }
});



app.listen(3001, () => console.log('API corriendo en puerto 3001')); */