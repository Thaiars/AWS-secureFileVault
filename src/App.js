import { BrowserRouter as Router, Routes, Route, Link,Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Navbar, Nav, Button, Table,Card } from "react-bootstrap";
import Login from "./register/Login";
import Register from "./register/Register";
import FileManager from "./register/FileManager";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from '@emotion/styled';
import { useContext } from "react";
import { AuthContext } from "./register/AuthContext";
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import Verify from "./register/Verify";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser, fetchAuthSession, uploadData, isAuthenticated } from './cognito';
import { Save_metaData, getUserFiles, deleteFileMetadata } from './DB/dynamoDB';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";


const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function Home() {
  const { user, logout ,loading } = useContext(AuthContext);
  const contextValue = useContext(AuthContext); 
  return (   
    <div
    style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2d3e50cc, #243B55)", // dark gradient
        display: "flex",
        flexDirection: "column",
    }}
    >               
      <Navbar 
      style={{backgroundColor :"#2d3e50ff" }}
       variant="dark" expand="lg">        
        <Container style={{ backgroundColor :"#2d3e50"  }} variant="dark" expand="lg" >
          <Link to = "/" style={{ textDecoration: 'none', color: 'white' }} >
          <Navbar.Brand style={{ fontSize: "40px", color :"#ffffffff", fontWeight: 700  }}>🔒 File Secure Vault</Navbar.Brand>
          </Link>
          <Nav className="ms-auto">
            {loading ?  (
               <div className="text-white">
                <span className="spinner-border spinner-border-sm me-2" />
                Loading...
              </div>
            ) : user ? (
          <div className="dropdown">          
              <Dropdown>
                   <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    👤 YOU          
                     </Dropdown.Toggle >
                      <Dropdown.Menu>
                      <Dropdown.Header  style = {{fontSize: 20, fontWeight: "bold", color: "#000000ff" }} >👤 { user.signInDetails?.loginId}</Dropdown.Header>
                      <Dropdown.Item  style = {{fontSize: 20,  color: "#000000ff" }} onClick={logout}>🚪 Logout</Dropdown.Item>

                     </Dropdown.Menu>
              </Dropdown>          
          </div>
        ) : (
            <Link to="/login" className="nav-link"   
            style={{ display: "flex",  alignItems: "center", color :"#ffffffff",
              fontWeight: 700 }}>            
             <p style={{fontSize: "30px"}}>Login  </p> 
            </Link>
            )}
          </Nav>
        </Container>        
      </Navbar>
      <FileManager />           
        
      <div style={{ flex: 1 }}></div>
      <div style={{ textAlign: "center", padding: "20px", color: "white", backgroundColor: "#2d3e50ff" }}>
        &copy; 2025 File Secure Vault. All rights reserved.
      </div>             
    </div>
  );
}
function App() {
  return (
      // <ThemeProvider theme={darkTheme}>
      // <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />

         <Route 
          path="/FileManager" 
          element={
            <PrivateRoute>
              <FileManager />
            </PrivateRoute>
          } 
        />
        {/* <Route path="/" element={<Navigate to="/FileManager" />} /> */}
      </Routes>
       //</ThemeProvider> 
  );
}

export default App;
