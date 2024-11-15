"use client";
import WalletButton from "./WalletButton";
import { FaGithub } from "react-icons/fa";
import logo from "../../public/logo.png";
import Image from "next/image";

function AppBar() {
  return (
    <nav className="flex items-center border border-3 border-black py-6 min-w-full place-content-between pt-10 text-white">
      <div className="ml-10">
        <Image
          src={logo}
          alt="logo"
          height={5}
          width={100}
          className="h-[50px] w-[100px] rounded-md"
        />
      </div>
      <div className="flex gap-20">
        <div>
          <a href="/">Home</a>
        </div>
        <div>
          <a href="#how-it-works">How it works?</a>
        </div>
        <div>
          <a href="#footer">Contact Us</a>
        </div>
        <div className="text-2xl">
          {/* github link */}
          <a href="">
            <FaGithub />
          </a>
        </div>
      </div>

      <div className="mr-20 flex gap-16">
        <a href="/dashboard" className="bg-black text-white rounded-md p-3">
          Dashboard
        </a>

        {/* wsllet button link */}
        <a href="">{/* <WalletButton /> */}</a>
      </div>
    </nav>
  );
}

export default AppBar;
