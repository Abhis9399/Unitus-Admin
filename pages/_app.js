import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingBar from 'react-top-loading-bar';



export default function App({ Component, pageProps }) {
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  
  useEffect(() => {

    router.events.on('routeChangeStart', () => {
      setProgress(40);
    });
    router.events.on('routeChangeComplete', () => {
      setProgress(100);
    });

    const token = localStorage.getItem('token');
    if (token) {
      setUser({ value: token });
    }
    setKey(Math.random());
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser({ value: null });
    setKey(Math.random());
    router.push('/login');
  };

  const noSidebarRoutes = ['/login', '/signup' ,'/forgot'];

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
