// // src/register/Verify.js
// import React, { useState } from "react";
// import { useLocation, useNavigate} from "react-router-dom";
// import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
// import { Form, Button, Card, Container , Navbar } from "react-bootstrap";
// import { Link } from "react-router-dom";

// export default function Verify() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email || ""; // lấy email từ Register.js
//   const [code, setCode] = useState("");
//   const [message, setMessage] = useState("");

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     try {
//       await confirmSignUp({ username: email, confirmationCode: code });
//       setMessage(" Verification successful!");
//       setTimeout(() => navigate("/login"), 1500); // tự chuyển về login
//     } catch (err) {
//       setMessage(` ${err.message}`);
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await resendSignUpCode({ username: email });
//       setMessage("📩 A new code has been sent to your email!");
//     } catch (err) {
//       setMessage(`❌ ${err.message}`);
//     }
//   };

//   return (
//       <div
//           style={{
//             minHeight: "100vh",
//             background: "linear-gradient(135deg, #2d3e50cc, #243B55)", // dark gradient
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <Form  style={{ width : "100%" }}> 
//           {/* Navbar */}
//           {/* <Navbar
//             style={{ backgroundColor: "#2d3e50cc" }}
//             variant="dark"
//             expand="lg"
//           > */}
          
//           <div
//             style={{ minHeight: "100vh",
//               background: "linear-gradient(135deg, #2d3e50cc, #243B55)", // dark gradient
//               display: "flex", 
//               flexDirection: "column",
//               width : "100%" }}
//           >
//             {/* Navbar */}
//             <Navbar
//               style={{ backgroundColor: "rgba(45, 62, 80, 0.8)" }}
//               variant="dark"
//               expand="lg"
//             >

//             <Container style={{ backgroundColor :"#2d3e50"  }} variant="dark" expand="lg" >
//               <Link to = "/" style={{ textDecoration: 'none', color: 'white' }} >
//               <Navbar.Brand style={{ fontSize: "40px", color :"#ffffffff", fontWeight: 700  }}>🔒 File Secure Vault</Navbar.Brand>
//               </Link>        
//             </Container>        
//           </Navbar>

//     <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
//       <Card style={{ width: "400px", padding: "20px" }}>
//         <h2 className="text-center mb-4">Verify Your Email</h2>
//         <p className="text-center">A code has been sent to <b>{email}</b></p>

//         <Form onSubmit={handleVerify}>
//           <Form.Group className="mb-3">
//             <Form.Label>🔢 Confirmation Code</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter 6-digit code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Button type="submit" className="w-100 mb-2">Verify</Button>
//         </Form>

//         <Button variant="link" onClick={handleResend} className="w-100">
//           Resend Code
//         </Button>

//         {message && <p className="text-center mt-3">{message}</p>}
//       </Card>
//     </Container>
//     </div>
//     </Form>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { Form, Button, Card, Container, Navbar, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // nhận email từ Register.js
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      setMessage(" Verification successful!");
      setTimeout(() => navigate("/login"), 1000); // tự động về Login
    } catch (err) {
      setMessage(` ${err.message}`);
    }
  };

  const handleResend = async () => {
    try {
      await resendSignUpCode({ username: email });
      setMessage(" A new code has been sent to your email!");
    } catch (err) {
      setMessage(` ${err.message}`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2d3e50cc, #243B55)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <Navbar style={{ backgroundColor: "#2d3e50cc" }} variant="dark" expand="lg">
        <Container style={{ backgroundColor: "#2d3e50" }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <Navbar.Brand
              style={{
                fontSize: "40px",
                color: "#ffffffff",
                fontWeight: 700,
              }}
            >
              🔒 File Secure Vault
            </Navbar.Brand>
          </Link>
        </Container>
      </Navbar>

      {/* Verify Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >    
        <Card
          style={{
            width: "500px",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px 0 #ffffff82",
            backgroundColor: "#d6d1d1e3",
            borderRadius: "20px",           
            backdropFilter: "blur(10px)",
            padding: "50px 35px 35px 35px",
          }}
        >
          <h2 className="text-center mb-4" style={{ color: "#2d3e50", fontWeight: 700 }}>
            Verify Your Email
          </h2>

          <p className="text-center" style={{ fontSize: "18px" }}>
            A 6-digit code has been sent to <b>{email}</b>
          </p>

          <Form onSubmit={handleVerify}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" style={{ fontSize: "22px" }}>
                🔢 Code
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    background: "rgba(255, 254, 254, 0.2)",
                    color: "black",
                    border: "10px solid transparent",
                    fontSize: "18px",
                  }}
                  required
                />
              </Col>
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                border: "none",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Verify
            </Button>
          </Form>

          <Button
            variant="link"
            onClick={handleResend}
            className="w-100 mt-3"
            style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}
          >
            Resend Code
          </Button>

          {message && (
            <p
              className="text-center mt-3"
              style={{
                fontSize: "18px",
                color: message.startsWith("✅") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
        </Card>
       </div>
    </div>
  );
}
