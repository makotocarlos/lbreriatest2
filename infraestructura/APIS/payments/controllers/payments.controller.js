const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createPayment = async (req, res) => {
  const { userId, orderId, amount, method } = req.body;

  // Validación inicial
  if (!userId || !orderId || !amount || !method) {
    return res.status(400).json({ message: 'userId, orderId, amount y method son requeridos' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'El monto debe ser un número positivo' });
  }

  try {
    // Validar si el usuario existe a través de la API de usuarios
    const userResponse = await axios.get(`http://login_api:3000/users/${userId}`);
    if (!userResponse.data || !userResponse.data.user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar si la orden existe a través de la API de órdenes
    const orderResponse = await axios.get(`http://orders_api:3002/orders/${orderId}`);
    if (!orderResponse.data || !orderResponse.data.order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Crear el pago
    const payment = await prisma.payments.create({
      data: {
        userId,
        orderId,
        amount,
        status: 'pending',
        method,
      },
    });

    return res.status(201).json({
      message: 'Pago creado con éxito',
      payment,
    });
  } catch (error) {
    console.error('Error al crear el pago:', error);

    if (error.response) {
      // Error de las APIs externas
      return res.status(error.response.status).json({
        message: `Error en la API externa: ${error.response.statusText}`,
      });
    }

    return res.status(500).json({
      message: 'Error interno al crear el pago',
      error: error.message,
    });
  }
};

const getPayments = async (req, res) => {
  const { id: paymentId } = req.params;

  try {
    if (paymentId) {
      // Obtener un pago específico
      const payment = await prisma.payments.findUnique({
        where: { id: parseInt(paymentId, 10) },
      });

      if (!payment) {
        return res.status(404).json({ message: 'Pago no encontrado' });
      }

      // Consultar datos relacionados desde las APIs externas
      const userResponse = await axios.get(`http://login_api:3000/users/${payment.userId}`);
      const orderResponse = await axios.get(`http://orders_api:3002/orders/${payment.orderId}`);

      return res.status(200).json({
        message: 'Pago recuperado con éxito',
        payment: {
          ...payment,
          user: userResponse.data.user || null,
          order: orderResponse.data.order || null,
        },
      });
    }

    // Obtener todos los pagos
    const payments = await prisma.payments.findMany();

    // Obtener detalles adicionales de usuarios y órdenes en paralelo
    const userPromises = payments.map((payment) =>
      axios.get(`http://login_api:3000/users/${payment.userId}`).catch(() => null)
    );
    const orderPromises = payments.map((payment) =>
      axios.get(`http://orders_api:3002/orders/${payment.orderId}`).catch(() => null)
    );

    const users = await Promise.all(userPromises);
    const orders = await Promise.all(orderPromises);

    const paymentsWithDetails = payments.map((payment, index) => ({
      ...payment,
      user: users[index]?.data?.user || null,
      order: orders[index]?.data?.order || null,
    }));

    return res.status(200).json({
      message: 'Pagos recuperados con éxito',
      payments: paymentsWithDetails,
    });
  } catch (error) {
    console.error('Error al obtener los pagos:', error);

    return res.status(500).json({
      message: 'Error interno al obtener los pagos',
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
};
