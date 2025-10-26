import { createContext, useState, useEffect } from "react";
import { fetchAuthSession, signIn, signOut ,getCurrentUser } from 'aws-amplify/auth';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true); 

  useEffect(() => {
    checkUser();
  }, []);

    const checkUser = async () => {
      try {
        const cur_user = await getCurrentUser();
        setUser(cur_user);
      } catch (error) {
        setUser(null);
      }
      finally {
      setLoading(false);  
    }
    };
    

const login = async (username, password) => {
    try {
      const logged = await signIn(username, password);
      setUser(logged);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();

      localStorage.clear();
    sessionStorage.clear();
    
      localStorage.removeItem("idToken");
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
