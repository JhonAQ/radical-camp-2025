"use client";

import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";
import { useAuth } from "@/lib/useAuth";

export default function AuthPage() {
  const { refresh, logout: globalLogout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const user = await account.get();
      setLoggedInUser(user);
    } catch (err) {
      setLoggedInUser(null);
    }
  };

  const login = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      await refresh();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const register = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      await account.create(ID.unique(), email, password, name);
      await login();
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await globalLogout();
      setLoggedInUser(null);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      setError(err.message || "Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#12121a] border border-[#2a2a35] rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-[#ff3366] mb-6 font-mono">
          Appwrite Auth
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {loggedInUser ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg">
              Logged in as{" "}
              <span className="font-bold text-[#ff3366]">
                {loggedInUser.name || loggedInUser.email}
              </span>
            </p>
            <button
              onClick={logout}
              className="w-full bg-[#2a2a35] hover:bg-[#3a3a45] text-white font-bold py-3 px-4 rounded-xl transition-all font-mono uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Name (for tracking registration)
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-xl px-4 py-3 focus:outline-none focus:border-[#ff3366] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-xl px-4 py-3 focus:outline-none focus:border-[#ff3366] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-xl px-4 py-3 focus:outline-none focus:border-[#ff3366] transition-colors"
                required
                minLength={8}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={login}
                className="flex-1 bg-[#ff3366] hover:bg-[#e62e5c] text-white font-bold py-3 px-4 rounded-xl transition-all font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(255,51,102,0.3)]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={register}
                className="flex-1 bg-[#2a2a35] hover:bg-[#3a3a45] text-white font-bold py-3 px-4 rounded-xl transition-all font-mono uppercase tracking-wider"
              >
                Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
