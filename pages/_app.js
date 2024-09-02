import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingBar from 'react-top-loading-bar';
import jwtDecode from "jwt-decode";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState({ value: null, role: null });
  const [key, setKey] = useState(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => setProgress(40);
    const handleRouteChangeComplete = () => setProgress(100);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);


    router.events.on('routeChangeStart', () => {
      setProgress(40);
    });
    router.events.on('routeChangeComplete', () => {
      setProgress(100);
    });

 // Initialize user state from localStorage
 const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
 const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
 if (token && role) {
  setUser({ value: token, role });
}
    setKey(Math.random());
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser({ value: null, role: null });
    setKey(Math.random());
    router.push('/login');
  };

  const noSidebarRoutes = ['/login', '/signup', '/forgot'];

  return (
    <>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {noSidebarRoutes.includes(router.pathname) ? (
        <Component {...pageProps} logout={logout} user={user} componentKey={key} />
      ) : (
        key !== null && (
          <Sidebar logout={logout} user={user}>
            <Component {...pageProps} logout={logout} user={user} componentKey={key} />
          </Sidebar>
        )
      )}
    </>
  );
}
