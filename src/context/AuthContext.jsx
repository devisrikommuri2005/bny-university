import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loadUsers, saveUsers } from "../data/mockData";
import { loginUser } from "../services/authService";

const AuthContext = createContext(null);
const SESSION_KEY = "bny_portal_session";
 
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [users, setUsers] = useState(() => loadUsers());
 
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (e) {
      // ignore corrupt session
    }
    setInitializing(false);
  }, []);
 
  useEffect(() => {
    saveUsers(users);
  }, [users]);
 
  const persistSession = (user) => {
    if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(SESSION_KEY);
  };
 
  /**
   * loginTab: "user" | "admin" — which tab the person submitted from.
   * Returns { ok: true } or { ok: false, message } — never throws,
   * so the Login screen can show the error inline without a try/catch.
   */
  const login = useCallback(
    async ({ email, password }) => {
      try {
        const response = await loginUser(email, password);
        const token = response.data.token;
		const user = {
		    email,
		    username: response.data.username,
		    name: response.data.fullName,
		    role: response.data.role,
		};
        sessionStorage.setItem("jwtToken",token);
        setCurrentUser(user);
        persistSession(user);
        return { ok: true };
      } catch (error) {
        return {ok: false,message:error?.response?.data?.message || "Login failed",};
      }
    },
    []
  );
 
  const logout = useCallback(() => {
    setCurrentUser(null);
    persistSession(null);
  }, []);
 
  const addUser = useCallback((user) => {
    setUsers((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        employeeId: user.employeeId || "",
        joinedOn: new Date().toISOString().slice(0, 10),
        ...user,
      },
    ]);
  }, []);
 
  const updateUser = useCallback((userId, fields) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...fields } : u)));
  }, []);
 
  /** Returns { ok, message } — blocks removing yourself or the last admin. */
  const removeUser = useCallback((userId) => {
    let result = { ok: true };
    setUsers((prev) => {
      const target = prev.find((u) => u.id === userId);
      if (!target) return prev;
      if (currentUser && target.id === currentUser.id) {
        result = { ok: false, message: "You can't remove the account you're currently signed in with." };
        return prev;
      }
      const remainingAdmins = prev.filter((u) => u.role === "admin" && u.id !== userId);
      if (target.role === "admin" && remainingAdmins.length === 0) {
        result = { ok: false, message: "At least one Admin account must remain." };
        return prev;
      }
      return prev.filter((u) => u.id !== userId);
    });
    return result;
  }, [currentUser]);
 
  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, initializing, users, addUser, updateUser, removeUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
 