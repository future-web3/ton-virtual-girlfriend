import { NextPage } from "next";
import Layout from "@/components/Layout/Layout";
import MintSection from "@/components/MintSection/MintSection";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="bg-home bg-cover bg-no-repeat bg-center h-screen p-10 overflow-y-auto">
        <MintSection />
      </div>
    </Layout>
  );
};

export default Home;
