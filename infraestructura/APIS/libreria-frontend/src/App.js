import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginAsync, logout, registerAsync } from './features/authSlice';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './HomePage'; // Asegúrate de que este componente esté en la ubicación correcta
import PaymentsPage from './pages/PaymentsPage'; // Asegúrate de que PaymentsPage esté en la carpeta pages

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginAsync({ email, password }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerAsync({ email, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Ucc {auth.isLoggedIn ? auth.email : 'Librería distribuida'}</h1>

        <Routes>
          {/* Ruta raíz que muestra el formulario de login/registro o un botón de logout si está autenticado */}
          <Route
            path="/"
            element={
              auth.isLoggedIn ? (
                <div>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                  <Navigate to="/home" />
                </div>
              ) : (
                <div>
                  <button onClick={() => setIsRegistering(false)} disabled={!isRegistering}>
                    Iniciar sesión
                  </button>
                  <button onClick={() => setIsRegistering(true)} disabled={isRegistering}>
                    Registrarse
                  </button>

                  {isRegistering ? (
                    <form onSubmit={handleRegister}>
                      <h2>Registro</h2>
                      <div>
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit">Registrarse</button>
                    </form>
                  ) : (
                    <form onSubmit={handleLogin}>
                      <h2>Inicio de sesión</h2>
                      <div>
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit">Iniciar sesión</button>
                    </form>
                  )}
                </div>
              )
            }
          />

          {/* Ruta de HomePage protegida, solo accesible si está autenticado */}
          <Route
            path="/home"
            element={
              auth.isLoggedIn ? (
                <div>
                  <h2>Bienvenido, {auth.email}</h2>
                  <p>ID de usuario: {auth.userID}</p>
                  <HomePage />
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Ruta para la página de pagos */}
          <Route
            path="/payments"
            element={
              auth.isLoggedIn ? (
                <PaymentsPage />  // Aquí se muestra la página de pagos si el usuario está autenticado
              ) : (
                <Navigate to="/" />  // Si no está autenticado, se redirige al login
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
