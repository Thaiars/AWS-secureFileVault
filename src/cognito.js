import { signIn, signOut, getCurrentUser } from "aws-amplify/auth";

export const login = async (email, password) => {
      try {    
    const currentUser = await getCurrentUser().catch(() => null);
    if (currentUser) {
      console.log("Already signed in as:", currentUser.username);
      return { success: true, user: currentUser };
    } 
    const user = await signIn({ username: email, password });
    console.log("Login success:", user);
    return { success: true, user  };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut();
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

export const isAuthenticated = async () => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch {
    return null;
  }
};
