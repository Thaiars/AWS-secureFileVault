import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {login} from "../cognito"
import FileManager from "./FileManager";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getCurrentUser } from 'aws-amplify/auth';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { checkUser } = useContext(AuthContext);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
     const result = await login(email, password);  

     if (password === "" || email === "") {     
     setMessage("Fill all the fields!"); 
     setLoading(false);   
      return;
    }
    try {
         
      if (result.success) {
        console.log('✅ Login successful');
       navigate('/');
      //  await checkUser();
      setTimeout(() => {
        window.location.href = '/';  
      }, 300);

      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
   
};
 

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
    message,
    setMessage
  };
};