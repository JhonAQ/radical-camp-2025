"use client";

import { useState, useEffect, useCallback } from "react";
import { account, teams, APPWRITE } from "./appwrite";
import type { Models } from "appwrite";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  isAdmin: boolean;
  loading: boolean;
}

let cachedUser: Models.User<Models.Preferences> | null = null;
let cachedIsAdmin: boolean = false;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: cachedUser,
    isAdmin: cachedIsAdmin,
    loading: !cachedUser && Date.now() - cacheTimestamp > CACHE_TTL,
  });

  const checkSession = useCallback(async () => {
    // Use cache if fresh
    if (cachedUser && Date.now() - cacheTimestamp < CACHE_TTL) {
      setState({ user: cachedUser, isAdmin: cachedIsAdmin, loading: false });
      return;
    }

    try {
      const user = await account.get();
      cachedUser = user;
      cacheTimestamp = Date.now();

      // Check admin membership
      let isAdmin = false;
      try {
        const teamList = await teams.list();
        isAdmin = teamList.teams.some(
          (t) => t.$id === APPWRITE.teams.admin || t.name === "admin"
        );
      } catch {
        isAdmin = false;
      }

      cachedIsAdmin = isAdmin;
      setState({ user, isAdmin, loading: false });
    } catch {
      cachedUser = null;
      cachedIsAdmin = false;
      cacheTimestamp = Date.now();
      setState({ user: null, isAdmin: false, loading: false });
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const refresh = useCallback(() => {
    cacheTimestamp = 0; // invalidate cache
    return checkSession();
  }, [checkSession]);

  const logout = useCallback(async () => {
    try {
      cachedUser = null;
      cachedIsAdmin = false;
      cacheTimestamp = 0;
      await account.deleteSession("current");
      setState({ user: null, isAdmin: false, loading: false });
      window.location.href = "/auth";
    } catch (err) {
      console.error("Logout error", err);
    }
  }, []);

  return { ...state, refresh, logout };
}
