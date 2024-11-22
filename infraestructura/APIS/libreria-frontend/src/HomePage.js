import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orderStatus, setOrderStatus] = useState({ success: null, message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]); 
  const [showOrders, setShowOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const auth = useSelector((state) => state.auth);
  const navigate  = useNavigate();  

  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/books');
        if (response.data && Array.isArray(response.data.books)) {
          setBooks(response.data.books);
        } else {
          throw new Error('Datos inesperados de la API');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setBooks([]); 
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  
  useEffect(() => {
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
        setOrders(response.data.orders || []); // Asegúrate de que orders siempre sea un array
      } catch (err) {
        console.error('Error al obtener las órdenes:', err);
        setOrderStatus({
          success: false,
          message: err.response?.data?.message || 'Error al obtener las órdenes.',
        });
      }
    };

    if (showOrders) {
      fetchOrders();
    }
  }, [showOrders, auth.isLoggedIn, auth.userID, auth.token]);

  
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

  
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const goToPayments = () => {
    navigate('/payments');  // Navega a la ruta de pagos
  };

  if (loading) return <p>Cargando libros...</p>;
  if (error) return <p>Error al cargar libros: {error}</p>;

  return (
    <div>
      <h1>Libros disponibles</h1>

      {/* Barra de búsqueda */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por título"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Mostrar los libros filtrados */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
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
          ))
        ) : (
          <p>No hay libros que coincidan con tu búsqueda.</p>
        )}
      </div>

      {/* Sección de órdenes */}
      {auth.isLoggedIn && (
        <div style={{ marginTop: '20px' }}>
          <h2>Mis órdenes</h2>
          <button
            onClick={() => setShowOrders(!showOrders)}
            style={{
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

          {/* Mostrar las órdenes si showOrders es true */}
          {showOrders && (
            <div style={{ marginTop: '20px' }}>
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
        </div>
      )}

      {orderStatus.message && (
        <p style={{ color: orderStatus.success ? 'green' : 'red', marginTop: '20px' }}>
          {orderStatus.message}
        </p>
      )}

      {/* Botón para ir a la página de pagos */}
      <button
        onClick={goToPayments}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Ir a Gestión de Pagos
      </button>
    </div>
  );
};

export default HomePage;
