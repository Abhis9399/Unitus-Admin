import Head from "next/head";
import Image from "next/image";
import Header from "@/components/Header";
import TopCards from "@/components/TopCards";
import BarChart from "@/components/BarChart";
import RecentOrders from "@/components/RecentOrders";
import withAuth from "@/hoc/withAuth"; 

const Home=({ logout, user, componentKey })=> {
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 min-h-screen">
      {componentKey && <Header logout={logout} user={user} key={componentKey} />}
        <TopCards />
        <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
          <BarChart />
          <RecentOrders />
        </div>
      </main>
    </>
  );
}

export default withAuth(Home)