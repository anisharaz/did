import AppBar from "@/components/ui/AppBar";
import Image from "next/image";

function Home() {
  return (
    <main className="bg-[url('https://static.aaraz.me/did/bg.jpeg')] bg-cover min-h-screen font-mono">
      <AppBar />
      {/* text description */}
      <div className=" pt-64 pl-36">
        <div>
          <h1
            className=" text-9xl font-extrabold"
            style={{
              fontFamily: "Round Digitalio Expanded",
              fontWeight: "100",
              color: "yellow",
              textShadow: "0px 0px 20px rgb(255, 16, 240)",
            }}
          >
            Decentralized Identification(DID)
          </h1>
        </div>
        <p className="text-[#EEEEEE] text-xl mt-4 ml-4">
          This is a decentralised way to store data and prevent unauthorised
          access and hence prevent tampering of dapinkta
        </p>
      </div>
      <footer>
        <section>
          <div></div>
        </section>
      </footer>
    </main>
  );
}

export default Home;
