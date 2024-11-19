import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice'; // Reducer de autenticación
import ordersReducer from '../features/ordersSlice'; // Reducer de órdenes

const store = configureStore({
  reducer: {
    auth: authReducer, // Manejo de autenticación
    orders: ordersReducer, // Manejo de órdenes
  },
});

export default store;
