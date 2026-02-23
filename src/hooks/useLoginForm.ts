import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export const useLoginForm = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Authentication Failed",
        "Please enter valid credentials to proceed."
      );
      return;
    }
    await login(email, password);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
  };
};