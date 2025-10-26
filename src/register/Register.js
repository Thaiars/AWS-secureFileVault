import React from 'react'
import { Form, Button, Card, Container, Navbar, Row, Col} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import UserPool from "../cognito";
import { useState } from "react";
import {login} from "../cognito"
// import {Aws} from "../Aws"
import { signUp } from 'aws-amplify/auth';
import { useAuth } from "./AuthForm";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useEffect } from 'react';
import { isAuthenticated } from '../cognito';

function Register() {
  const { email, setEmail, password, setPassword, error, loading, handleLogin } = useAuth();
   const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState("");
 const navigate = useNavigate();

const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {     
     setMessage("Passwords do not match!");    
      return;
    }
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password : password,  
        options: {
            userAttributes: {
              email : email,   
               name:  name, 
            },           
        },        
      });
    //   console.log("Sign-up successful:", { isSignUpComplete, userId, nextStep });
    //   setMessage("Registration successful! Please check your email to confirm your account.");
    // } catch (error) {
    //   console.error("Error during sign-up:", error);
    //   setMessage(error.message || "An error occurred during registration.");
    // }
    console.log("Next step:", nextStep);

      if (nextStep?.codeDeliveryDetails) {
        setMessage("✅ Registration successful! Please check your email for the verification code.");
        setTimeout(() => navigate("/verify", { state: { email } }), 2000); // navigate to Verify.js after 3s
      }
    }
        catch (error) {
      console.error("Error during sign-up:", error);
      setMessage(error.message || "An error occurred during registration.");
    }
  };

  return (    
     <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2d3e50cc, #243B55)", // dark gradient
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Form onSubmit={handleRegister} style={{ width : "100%" }}> 
      {/* Navbar */}
      <Navbar
        style={{ backgroundColor: "#2d3e50cc" }}
        variant="dark"
        expand="lg"
      >
        <Container style={{ backgroundColor :"#2d3e50"  }} variant="dark" expand="lg" >
          <Link to = "/" style={{ textDecoration: 'none', color: 'white' }} >
          <Navbar.Brand style={{ fontSize: "40px", color :"#ffffffff", fontWeight: 700  }}>🔒 File Secure Vault</Navbar.Brand>
          </Link>        
        </Container>        
      </Navbar>

      {/* Register Form */}
      {/* <Container
        className="d-flex justify-content-center align-items-center bg-blue"
        style={{ flex: 1 }}
      > */}
        <Card
          style={{
            width: "600px",           
            borderRadius: "20px",           
            backdropFilter: "blur(10px)", // blur
            boxShadow: "0 8px 32px 0 #ffffff82",
            // color: "white",
            borderRadius: "20px",           
             backgroundColor: "#d6d1d1e3",
            margin: "100px auto",
             padding : "50px 35px 35px 35px",
          }}
        >
          <h2 className="text-center mb-4 cl-black">Register</h2>
          {/* <Form onSubmit={handleRegister}> */}
            <Form.Group className="mb-3" as={Row}>
              <Form.Label column sm ="4" style = {{justifyContent: 'left', fontSize : "22px"}}>🅰️ Name</Form.Label>
              <Col sm="8"> 
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  background: "rgba(255, 254, 254, 0.2)",
                  color: "black",
                  border: "10px solid transparent",
                  fontSize : "18px",
                }}
              />
              </Col>
            </Form.Group>

        
            <Form.Group className="mb-3" as={Row}>
              <Form.Label column sm ="4" style = {{justifyContent: 'left', fontSize : "22px"}}>
                📨 Email</Form.Label>
              <Col sm="8"> 
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: "rgba(255, 254, 254, 0.2)",
                  color: "black", 
                  border: "10px solid transparent",
                  fontSize : "18px",
                }}
              />
              </Col>
            </Form.Group>
           <Form.Group className="mb-3" as={Row}>
              <Form.Label column sm ="4" style = {{justifyContent: 'left', fontSize : "22px"}}>
                🔒 Password </Form.Label>
              <Col sm="7"> 
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: "rgba(255, 254, 254, 0.2)",
                  color: "black", 
                  border: "10px solid transparent",
                  fontSize : "18px",
                }}
              />
              </Col>
               <Col sm="1" style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
                          <Button
                              variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ border: 'none', background: 'none', padding: 0 }}
                          >
                            {showPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                </Col>                   
            </Form.Group>


          <Form.Group className="mb-3" as={Row}>
              <Form.Label column sm ="4" style = {{justifyContent: 'left', fontSize : "22px"}}>
                🔒 Confirm </Form.Label>
              <Col sm="7"> 
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)} 
                style={{
                  background: "#fffefe33",
                  color: "black",
                  border: "10px solid transparent",
                  fontSize : "18px",
                }}
              />
              </Col>
               <Col sm="1" style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
                          <Button
                              variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ border: 'none', background: 'none', padding: 0 }}
                          >
                            {showPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                </Col>       
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                border: "none",
                fontWeight: "600",
              }}
            >
              Register
            </Button>
            
        {message && <p style={{fontSize : "18px", color : "red", textAlign : "center", marginTop: "10px"}}>{message}</p>}
      </Card>   
        {/* </Container>           */}
          </Form>   
           <div style={{ flex: 1 }}></div>
       <div style={{ textAlign: "center", padding: "20px", color: "white", backgroundColor: "#2d3e50ff" }}>
        &copy; 2025 File Secure Vault. All rights reserved.
                  
    </div>          
    </div>
  )
}

export default Register;
