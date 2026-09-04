import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { supabase } from "../../lib/supabase";

function AuthGuard() {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        console.error("Unable to restore authentication session:", error);
      }

      setSession(error ? null : data.session);
      setIsCheckingSession(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isCheckingSession) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#0c1016] text-[#d5af42]">
        <p role="status" aria-live="polite" className="text-sm font-medium">
          Checking your session...
        </p>
      </main>
    );
  }

  if (!session) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;

    return <Navigate to="/login" replace state={{ returnTo }} />;
  }

  return <Outlet />;
}

export default AuthGuard;
