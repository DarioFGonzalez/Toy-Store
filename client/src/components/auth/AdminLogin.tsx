import React, { useState } from 'react';
import Styles from './AdminLogin.module.css';
import { URL } from '../../types/constants';
import axios from 'axios';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    axios.post(`${URL}admin/login`, { password })
      .then(({ data }) => {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/dashboard';
      })
      .catch((error) => {
        console.log(error.response?.data);
        setErrorMessage(error.response?.data?.error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  return (
    <div className={Styles.loginContainer}>
      <div className={Styles.loginCard}>
        <h2 className={Styles.title}>Acceso de Administrador</h2>
        <form onSubmit={handleSubmit} className={Styles.loginForm}>
          <div className={Styles.inputGroup}>
            <label htmlFor="adminPassword" className={Styles.label}>
              Palabra Clave Secreta:
            </label>
            <input
              type="password"
              id="adminPassword"
              className={Styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className={Styles.errorMessage}>{errorMessage}</p>}
          <button type='button' onClick={handleLogout}> Log OUT </button>
          <button type="submit" className={Styles.submitButton}>
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;