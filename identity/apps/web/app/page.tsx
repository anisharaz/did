"use client"

import AppBar from "@/components/ui/AppBar";
import { useEffect, useState } from "react";
// import Image from "next/image";

function Home() {
  const [w, setW] = useState(8);
  const [h, setH] = useState(8);

  useEffect(() => {
    const handleWindowMouseMove = event => {
      setW(event.clientX * 0.02);
      setH(event.clientY * 0.02);
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleWindowMouseMove,
      );
    };
  }, []);

  return (
    <main className="bg-[url('https://static.aaraz.me/did/bg.jpeg')] bg-[length:110%_110%] min-h-screen font-mono" style={{ backgroundPosition: w + "% " + h + "%" }}>
      <div className="z-[20] fixed w-screen">
        <AppBar />
      </div>
      {/* text description */}
      <div className="h-screen w-screen fixed top-0 left-0 flex flex-col items-center justify-center z-[0] ">
        <h1
          className=" text-8xl font-extrabold text-center"
          style={{
            fontFamily: "Round Digitalio Expanded",
            fontWeight: "100",
            color: "yellow",
            textShadow: "0px 0px 20px rgb(255, 16, 240)",
          }}
        >
          Decentralized Identification(DID)
        </h1>
        <p className="text-black text-xl text-center w-2/3 mt-4 font-extrabold">
          <mark className="animate-gradient-x bg-gradient-to-r from-blue-500 via-red-200 to-green-500">
            This is a decentralised way to store data and prevent unauthorised
            access and hence prevent tampering of dapinkta
          </mark>
        </p>
      </div>
    </main>
  );

  //   <footer>
  //   <section>
  //     <div></div>
  //   </section>
  // </footer>
  //
}

export default Home;
