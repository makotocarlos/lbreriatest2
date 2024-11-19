import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción asíncrona para el login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await axios.post('http://localhost:3000/users/Login', {
      email,
      password,
    });
    return response.data; // Asegúrate de que la respuesta incluya user.id y userJWT
  }
);

// Acción asíncrona para el registro
export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({ email, password }) => {
    const response = await axios.post('http://localhost:3000/users', {
      email,
      password,
    });
    return response.data; // Asegúrate de que la respuesta incluya el user.id
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    email: null,
    userID: null, // Añadimos el userID al estado
    token: null,
    status: 'idle', // Puede ser: 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.email = null;
      state.userID = null; // Limpiamos el userID al hacer logout
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoggedIn = true;
        state.email = action.payload.user.email;
        state.userID = action.payload.user.id; // Guardamos el userID
        state.token = action.payload.userJWT;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Registro
      .addCase(registerAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Opcional: Si quieres que el usuario se logue automáticamente después de registrarse
        state.isLoggedIn = true;
        state.email = action.payload.result.email;
        state.userID = action.payload.result.id; // Guardamos el userID del registro
        state.token = null; // No estamos recibiendo un token en el registro
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;