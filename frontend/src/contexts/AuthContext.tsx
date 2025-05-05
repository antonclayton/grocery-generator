import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

// Define types for user data
interface User {
  _id: string;
  email: string;
  googleId: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/user", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAuthenticated(true);
          sessionStorage.setItem("user", JSON.stringify(data.user));
        } else {
          console.log("User not authenticated");
          setUser(null);
          setIsAuthenticated(false);
          sessionStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // // Check for stored user data on component mount
    // try {
    //   const storedUser = sessionStorage.getItem("user");
    //   if (storedUser) {
    //     setUser(JSON.parse(storedUser));
    //     setIsAuthenticated(true);
    //   }
    // } catch (error) {
    //   console.error("Failed to parse stored user data:", error);
    //   sessionStorage.removeItem("user"); // Clear invalid data
    // }
  }, []);

  const login = (user: User) => {
    setUser(user);
    setIsAuthenticated(true);
    sessionStorage.setItem("user", JSON.stringify(user)); // persist user data
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user"); // clear user data
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  if (loading) return null; // ⛔ Prevent rendering while checking auth

  // Use the separately defined Provider component
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
