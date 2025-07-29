import React, { useState } from 'react';
import Styles from './AdminLogin.module.css'; // Importa los estilos del módulo CSS
import { URL } from '../../types/constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) =>
  {
    e.preventDefault();

    setErrorMessage( '' );

    axios.post(`${URL}admin/login`, { password } )
    .then( ( { data } ) =>
    {
      localStorage.setItem( 'adminToken', data.token );
      navigate('/dashboard');
    })
    .catch( ( error ) =>
    {
      console.log( error.response?.data );
      setErrorMessage( error.response?.data?.error );
    });
  };

  return(
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
          <button type='button' onClick={()=>console.log( localStorage.getItem('adminToken') )}> adminToken </button>
          <button type="submit" className={Styles.submitButton}>
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;