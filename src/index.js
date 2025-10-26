import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter , Router, Routes, Route, Link } from "react-router-dom";
import Login from './register/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./register/AuthContext";
import './register/amplify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     <AuthProvider> 
    <BrowserRouter> 
       <React.StrictMode>
          <App />
      </React.StrictMode>    
  </BrowserRouter>
  </AuthProvider> 
);

reportWebVitals();
