const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  if (!userId || !bookId || !quantity) {
    return res.status(400).json({ message: 'userId, bookId y quantity son requeridos' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'La cantidad debe ser un número positivo' });
  }

  try {
    const userResponse = await axios.get(`http://login_api:3000/users/${userId}`);
    if (!userResponse.data) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const bookResponse = await axios.get(`http://books_api:3001/books/${bookId}`);
    if (!bookResponse.data || !bookResponse.data.book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    const book = bookResponse.data.book;
    const bookPrice = parseFloat(book.price);

    if (isNaN(bookPrice)) {
      return res.status(400).json({ message: 'El precio del libro no es válido' });
    }

    const totalAmount = bookPrice * quantity;

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

    return res.status(201).json({
      message: 'Orden creada con éxito',
      order,
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);

    if (error.response) {
      return res.status(error.response.status).json({
        message: `Error en la API externa: ${error.response.statusText}`,
      });
    }

    return res.status(500).json({
      message: 'Error interno al crear la orden',
      error: error.message,
    });
  }
};

const getOrder = async (req, res) => {
  const { id: orderId } = req.params;

  try {
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(orderId, 10) },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    return res.status(200).json({ message: 'Orden recuperada con éxito', order });
  } catch (error) {
    console.error('Error al obtener la orden:', error);

    return res.status(500).json({
      message: 'Error interno al obtener la orden',
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: { items: true },
    });

    return res.status(200).json({
      message: 'Órdenes recuperadas con éxito',
      orders,
    });
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);

    return res.status(500).json({
      message: 'Error interno al obtener las órdenes',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
};
