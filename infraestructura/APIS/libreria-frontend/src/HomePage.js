import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orderStatus, setOrderStatus] = useState({ success: null, message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]); // Estado para las órdenes
  const [showOrders, setShowOrders] = useState(false); // Controlar si mostrar órdenes
  const auth = useSelector((state) => state.auth);

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/books');
        setBooks(response.data.books);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle quantity input change
  const handleQuantityChange = (bookId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [bookId]: value,
    }));
  };

  // Handle order submission
  const handleOrder = async (bookId) => {
    if (!auth.isLoggedIn || !auth.userID) {
      setOrderStatus({ success: false, message: 'Error: Usuario no autenticado.' });
      return;
    }

    const quantity = quantities[bookId];
    if (!quantity || quantity <= 0) {
      setOrderStatus({ success: false, message: 'Por favor, ingrese una cantidad válida.' });
      return;
    }

    const orderData = {
      userId: auth.userID,
      bookId,
      quantity: parseInt(quantity, 10),
    };

    try {
      const response = await axios.post('http://localhost:3002/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      setOrderStatus({ success: true, message: 'Orden realizada exitosamente.' });
    } catch (err) {
      console.error('Error al realizar la orden:', err);
      setOrderStatus({
        success: false,
        message: err.response?.data?.message || 'Error al realizar la orden.',
      });
    }
  };

  // Función para obtener las órdenes del usuario
  const fetchOrders = async () => {
    if (!auth.isLoggedIn || !auth.userID) {
      setOrderStatus({ success: false, message: 'Usuario no autenticado.' });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/orders/${auth.userID}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Error al obtener las órdenes:', err);
      setOrderStatus({
        success: false,
        message: err.response?.data?.message || 'Error al obtener las órdenes.',
      });
    }
  };

  // Toggle para mostrar u ocultar las órdenes
  const handleShowOrders = () => {
    setShowOrders(!showOrders);
    if (!showOrders) {
      fetchOrders();
    }
  };

  if (loading) return <p>Cargando libros...</p>;
  if (error) return <p>Error al cargar libros: {error}</p>;

  return (
    <div>
      <h1>Libros disponibles</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              width: '200px',
            }}
          >
            <h3>{book.title}</h3>
            <p>Autor: {book.author}</p>
            <p>Precio: ${book.price}</p>
            <img
              src={book.imageUrl}
              alt={book.title}
              style={{ width: '100%', borderRadius: '5px' }}
            />
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
              <input
                type="number"
                min="1"
                placeholder="Cantidad"
                value={quantities[book.id] || ''}
                onChange={(e) => handleQuantityChange(book.id, e.target.value)}
                style={{
                  width: '60px',
                  marginRight: '10px',
                  padding: '5px',
                  borderRadius: '3px',
                }}
              />
              <button
                onClick={() => handleOrder(book.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para ver las órdenes */}
      {auth.isLoggedIn && (
        <button
          onClick={handleShowOrders}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {showOrders ? 'Ocultar órdenes' : 'Ver órdenes'}
        </button>
      )}

      {/* Mostrar las órdenes si showOrders es true */}
      {showOrders && (
        <div style={{ marginTop: '20px' }}>
          <h2>Mis órdenes</h2>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <li key={order.id}>
                  Libro ID: {order.bookId}, Cantidad: {order.quantity}, Fecha: {order.date}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes órdenes realizadas aún.</p>
          )}
        </div>
      )}

      {orderStatus.message && (
        <p style={{ color: orderStatus.success ? 'green' : 'red', marginTop: '20px' }}>
          {orderStatus.message}
        </p>
      )}
    </div>
  );
};

export default HomePage;


