import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {AuthProvider} from "./auth/AuthProvider";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";

import './styles/global.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
          </AuthProvider>
  </React.StrictMode>
);
