import React from "react";
import { Form, Button, Card, Container, Navbar, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Register"
import {login} from "../cognito"
import { useAuth } from "./AuthForm";
import {Aws} from "../Aws"
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useState } from "react";

function Login() {
   const { email, setEmail, password, setPassword, error, loading, handleLogin, message, setMessage } = useAuth();
   const [showPassword, setShowPassword] = useState(false);
    
  return (
    <div className="App">
      <Form onSubmit={handleLogin} style={{ width : "100%" }}  > 
          <div
            style={{
              minHeight: "100vh",
              background: "linear-gradient(135deg, #2d3e50cc, #243B55)",
              
              display: "flex",
              flexDirection: "column",
              width : "100%"
            }}
          >
            {/* Navbar */}
            <Navbar
              style={{ backgroundColor: "rgba(45, 62, 80, 0.8)" }}
              variant="dark"
              expand="lg"
            >
              <Container style={{ backgroundColor :"#2d3e50"  }} variant="dark" expand="lg">
                <Link to = "/" style={{ textDecoration: 'none', color: 'white' }} >
                <Navbar.Brand
                  style={{ fontSize: "40px", color: "#ffffffff", fontWeight: 700 }} >
                  🔒 File Secure Vault
                </Navbar.Brand>
                </Link>
                 
              </Container>
            </Navbar>
      
               <Card
                style={{
                  width: "650px",
                  padding: "25px",
                  borderRadius: "20px",           
                  backdropFilter: "blur(10px)", // blur
                  boxShadow: "0 8px 32px 0 #ffffff82",
                  // color: "white",
                   backgroundColor: "#d6d1d1e3",
                  margin: "100px auto",
                  padding : "50px 35px 35px 35px",

                }}
              >
                <h2 className="text-center mb-4 cl-black">Login</h2>
                {/* <Form onSubmit={handleRegister}> */}          
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
                  {error && <p style={{fontSize : "18px", color : "red", textAlign : "center"}}>{error}</p>}     
                   
                  <Button
                    type="submit"
                    className="w-100"
                    style={{
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                      border: "none",
                      fontWeight: "600",
                    }}
                  >
                    Login
                  </Button>
                  <div style={{display : "flex",
                   justifyContent : "center", alignItems : "center",
                     gap : "10px", marginTop : "20px", paddingTop: "10px"}}> 

                  <h3 style = {{fontSize : "20px", marginTop : 10, 
                    fontWeight : 400}}> Don't have an account ? </h3>
                   <Link to = "/register" style = {{fontSize : "20px", 
                    fontWeight : 600, textDecoration : "none"}}> Register  </Link> 
                     <h3 style = {{fontSize : "20px", marginTop : 10, 
                    fontWeight : 400}}> now </h3>
                </div>
            </Card>   
              {/* </Container>           */}
                {/* </Form>         */}     
          </div>
      </Form>
    </div>
  );
}

export default Login;
