import { User } from "@/models/user";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

interface UserContextType {
  userDetails: User | null;
  setLoadig: (loading: boolean) => void;
  loading: boolean;
  setUser: (details: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useAuthStore = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userDetails, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateUser = (details: User | null) => {
    setIsLoading(false);
    setUser(details);
  };

  const value: UserContextType = {
    userDetails,
    setLoadig: setIsLoading,
    setUser: updateUser,
    loading: isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
