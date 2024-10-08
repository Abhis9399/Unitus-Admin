import Head from "next/head";
import Image from "next/image";
import Header from "@/components/Header";
import TopCards from "@/components/TopCards";
import BarChart from "@/components/BarChart";
import RecentOrders from "@/components/RecentOrders";
import withAuth from "@/hoc/withAuth";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { useEffect } from "react";
import supplierPage from '@/pages/mySuppliers'
import User from '@/model/Member'
import jwt from 'jsonwebtoken';
import { connectToDatabase } from "@/mongoose/mongodbUser";

const Home=({ logout, user, componentKey })=> {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null; // Avoid rendering anything if user is not loaded
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 min-h-screen">
      {user && <Header logout={logout} user={user} key={componentKey} />}
      {user.role==='admin' ? (
        <>
        <TopCards />
        <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
          <BarChart />
          <RecentOrders />
        </div>
        <Footer />
        </>
      ) : user.role==='supplierExecutive'?(
        <>
        <supplierPage />
        </>
      ) : null}
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.token || '';

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDatabase();

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return { redirect: { destination: '/login', permanent: false } };
    }

    return {
      props: {
        user: {
          id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { redirect: { destination: '/login', permanent: false } };
  }
}


export default Home