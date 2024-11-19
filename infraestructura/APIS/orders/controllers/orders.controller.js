const axios = require('axios');  // Importar axios
const { PrismaClient } = require('@prisma/client');  // Importar Prisma Client

const prisma = new PrismaClient();  // Inicializar Prisma Client

// Función para crear una orden
const createOrder = async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    const userResponse = await axios.get(`http://login_api:3000/users/${userId}`);
    const bookResponse = await axios.get(`http://books_api:3001/books/${bookId}`);

    if (!userResponse.data) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if (!bookResponse.data) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    const book = bookResponse.data.book; // Accede a la propiedad `book` correctamente
    const bookPrice = parseFloat(book.price);

    // Verificar si el precio del libro es un número válido
    if (isNaN(bookPrice)) {
      return res.status(400).json({ message: 'El precio del libro no es válido' });
    }

    const totalAmount = bookPrice * quantity;

    if (isNaN(totalAmount)) {
      return res.status(400).json({ message: 'El cálculo del total no es válido' });
    }

    // Crear la orden en la base de datos usando Prisma
    const order = await prisma.orders.create({
      data: {
        userId,
        totalAmount,
        status: 'pendiente',
        items: {
          create: [
            {
              bookId,
              quantity,
              price: bookPrice,
            },
          ],
        },
      },
    });

    return res.status(201).json({ message: 'Orden creada con éxito', order });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    return res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
};

// Función para obtener las órdenes (todas o una específica)
const getOrders = async (req, res) => {
  const { orderId } = req.params;  // Obtener el `orderId` si se pasa en la URL

  try {
    let orders;

    if (orderId) {
      // Si se pasa un `orderId`, buscamos esa orden específica
      orders = await prisma.orders.findUnique({
        where: { id: parseInt(orderId) }, // Buscar por `orderId`
        include: {
          items: true,  // Incluir los ítems de la orden
        },
      });

      if (!orders) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
    } else {
      // Si no se pasa un `orderId`, obtenemos todas las órdenes
      orders = await prisma.orders.findMany({
        include: {
          items: true,  // Incluir los ítems de todas las órdenes
        },
      });
    }

    return res.status(200).json({ message: 'Órdenes recuperadas con éxito', orders });
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    return res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
  }
};

// Exportar las funciones para usarlas en las rutas
module.exports = {
  createOrder,
  getOrders,
};
