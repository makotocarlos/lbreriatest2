import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PaymentsPage = () => {
  const [orders, setOrders] = useState([]); 
  const [orderStatus, setOrderStatus] = useState({ success: null, message: '' });
  const [newPayment, setNewPayment] = useState({
    userId: '', 
    orderId: '',
    amount: '',
    method: 'Tarjeta de Crédito', 
  });

  const auth = useSelector((state) => state.auth); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        
        if (auth.isLoggedIn) {
          const response = await axios.get(`http://localhost:3005/orders?userId=${auth.userID}`);
          if (response.data.orders) {
            setOrders(response.data.orders);
          } else {
            setOrderStatus({ success: false, message: 'No tienes órdenes disponibles.' });
          }
        } else {
          setOrderStatus({ success: false, message: 'No estás logueado. Inicia sesión para ver tus órdenes.' });
        }
      } catch (err) {
        console.error('Error al cargar órdenes:', err);
        setOrderStatus({ success: false, message: 'No se pudieron cargar las órdenes. Intenta nuevamente más tarde.' });
      }
    };

    
    if (auth.isLoggedIn) {
      setNewPayment((prev) => ({ ...prev, userId: auth.userID }));
    }

    fetchOrders();
  }, [auth.isLoggedIn, auth.userID]);

  const handleCreatePayment = async () => {
    
    if (!newPayment.orderId) {
      setOrderStatus({ success: false, message: 'Por favor, ingresa el ID de la orden antes de proceder.' });
      return;
    }

    const selectedOrder = orders.find((order) => order.id === newPayment.orderId);

    if (!selectedOrder) {
      setOrderStatus({ success: false, message: 'El ID de la orden no es válido.' });
      return;
    }

   
    setNewPayment((prev) => ({
      ...prev,
      amount: selectedOrder.total,
    }));

    try {
      const response = await axios.post('http://localhost:3005/payments', newPayment);
      setOrderStatus({ success: true, message: 'Pago creado exitosamente' });
    } catch (err) {
      setOrderStatus({ success: false, message: 'Hubo un error al crear el pago. Verifica los detalles e intenta nuevamente.' });
    }
  };

  return (
    <div>
      <h1>Gestión de Pagos</h1>

      {/* Formulario para crear un nuevo pago */}
      <h2>Crear Nuevo Pago</h2>
      <p>
        <strong>Usuario:</strong> {auth.email || 'No logueado'}
      </p>
      <input
        type="text"
        placeholder="ID Orden (Ejemplo: 123)"
        value={newPayment.orderId}
        onChange={(e) => setNewPayment({ ...newPayment, orderId: e.target.value })}
      />
      <p>
        <strong>Monto:</strong> ${newPayment.amount || 'Seleccione una orden'}
      </p>
      <select
        value={newPayment.method}
        onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
      >
        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
        <option value="Tarjeta de Débito">Tarjeta de Débito</option>
        <option value="PayPal">PayPal</option>
        <option value="Transferencia Bancaria">Transferencia Bancaria</option>
      </select>
      <button onClick={handleCreatePayment}>Crear Pago</button>

      {/* Mostrar mensaje de éxito o error */}
      {orderStatus.message && (
        <p style={{ color: orderStatus.success ? 'green' : 'red' }}>
          {orderStatus.message}
        </p>
      )}
    </div>
  );
};

export default PaymentsPage;
