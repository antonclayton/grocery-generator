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
      // checks if User is authorized or not
      try {
        const res = await fetch("http://localhost:3000/auth/user", {
          credentials: "include",
        });

        if (res.ok) {
          // if successful fetch (200 status code)
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

  if (loading) return null; // ⛔ Prevent rendering while checking auth (to avoid frontend stale content rendering issues)

  // Use the separately defined Provider component
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
