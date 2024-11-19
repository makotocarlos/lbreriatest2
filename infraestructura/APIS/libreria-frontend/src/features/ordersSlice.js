import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// URL base del backend de órdenes
const BASE_URL = 'http://localhost:3002/orders';

// Acción para obtener todas las órdenes
export const fetchOrdersAsync = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get(BASE_URL);
  return response.data.orders;
});

// Acción para crear una nueva orden
export const createOrderAsync = createAsyncThunk('orders/createOrder', async (orderData) => {
  const response = await axios.post(BASE_URL, orderData);
  return response.data.order;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      });
  },
});

export default ordersSlice.reducer;
