"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
// import WalletButton from "@/components/ui/WalletButton";

export default function LandingPage() {
  const { publicKey, connected, signMessage, connect } = useWallet();

  const [isDocumentedAdded, setIsDocumentAdded] = useState(false);
  const [isDocumentViewed, setIsDocumentViewed] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const fetchUserData = async () => {
    if (!connected) {
      await connect();
    }

    if (publicKey && signMessage) {
      try {
        const publicKeyString = publicKey.toString();
        console.log("Public Key:", publicKeyString);

        const userData_At_LocalStorage = localStorage.getItem("user");
        if (userData_At_LocalStorage) {
          console.log(
            "User Data from Local Storage:",
            userData_At_LocalStorage
          );
          return;
        }

        const signedMessage = await signMessage(
          new TextEncoder().encode(publicKeyString)
        );

        const response = await fetch("http://localhost:3000/api/getuser", {
          method: "POST",
          body: JSON.stringify({
            public_key: publicKeyString,
            signature: signedMessage as Uint8Array,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User Data from API:", data);
          setUserDetails(data);

          localStorage.setItem("user", JSON.stringify(data));
        } else {
          console.error("Failed to fetch user data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <main>
      <div className="text-xl flex flex-col gap-3 ml-20 mr-40 mt-16">
        <div className="flex gap-6 place-content-between">
          <h1 className="text-3xl font-bold mb-1">My Profile</h1>
          <div className="flex gap-6">
            <button
              className={
                isDocumentedAdded
                  ? "invisible"
                  : "bg-blue-600 px-2 py-1 text-white rounded-md"
              }
              onClick={(e) => {
                e.preventDefault();
                setIsDocumentAdded(true);
              }}
            >
              {isDocumentedAdded ? "" : " + Add documents"}
            </button>
            <button
              className="flex bg-blue-600 px-3 py-1 text-white rounded-md"
              onClick={(e) => {
                e.preventDefault();
                setIsDocumentViewed(!isDocumentViewed);
              }}
            >
              <span className="mr-2 my-1">{<Eye />}</span>
              {isDocumentViewed ? "Back to profile" : "View Document"}
            </button>
          </div>
        </div>
        <section className="flex gap-10 items-center border border-gray rounded-xl py-4 px-4 mb-4">
          <Image
            src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=pexels-simon-robben-55958-614810.jpg&fm=jpg"
            alt="profile_pic"
            height={150}
            width={150}
            className="rounded-full h-36 border-gray"
          />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p>Male</p>
          </div>
        </section>
        {/* Personal Information */}
        {!isDocumentViewed && !isDocumentedAdded ? (
          <>
            {/* Personal Information */}
            <section className="flex flex-col gap-1 border border-gray rounded-xl py-4 px-4 mb-4">
              <h2 className="text-xl font-bold mt-4 mb-2">
                Personal Information
              </h2>
              <div className="text-gray-600">
                <div className="flex gap-80 ml-1">
                  <div>
                    <p className="mb-2">First Name</p>
                    <span>John</span>
                  </div>
                  <div>
                    <p className="mb-2">Last Name</p>
                    <span>Doe</span>
                  </div>
                </div>
                <div className="flex gap-52 mt-6">
                  <div>
                    <p className="mb-2">Email</p>
                    <span>johndoe12@gmail.com</span>
                  </div>
                  <div>
                    <p className="mb-2">Phone</p>
                    <span>+91-8738236233</span>
                  </div>
                </div>
              </div>
            </section>
            {/* Address Information */}
            <section className="flex flex-col gap-1 border border-gray rounded-xl py-4 px-4 mb-4">
              <h2 className="text-xl font-bold mt-4 mb-2">
                Address Information
              </h2>
              <div className="text-gray-600">
                <div className="flex gap-60">
                  <div className="flex flex-col">
                    <p className="mb-2">Address </p>
                    <span>Jain Global Campus</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="mb-2">City</p>
                    <span>Bengaluru</span>
                  </div>
                </div>
                <div className="flex gap-80 mt-6">
                  <div className="flex flex-col">
                    <p>State</p>
                    <span>Karnataka</span>
                  </div>

                  <div className="flex flex-col ml-1">
                    <p>Pincode</p>
                    <span>562112</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Details */}
            <section className="flex flex-col gap-1 border border-gray rounded-xl py-4 px-4 mb-4">
              <h2 className="text-xl font-bold mb-3">Security Details</h2>
              <div className="text-gray-600">
                <div className="flex gap-52">
                  <div className="flex flex-col gap-2">
                    <p>Public Key</p>
                    <span>basdkbjsdsjdasbdkjad</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>Verification Status</p>
                    <span>verified</span>
                  </div>
                </div>
                <div className="flex gap-52 ml-1 mt-6">
                  <div className="flex flex-col gap-2">
                    <p>Verification Id</p>
                    <span>289378928dbdhbd2o</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>Created At</p>
                    <span>20-10-2024</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="h-[620px] rounded-md border-gray border grid grid-cols-3 gap-2 p-4">
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto max-h-[100px]">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto max-h-[100px]">
              <div>
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-700 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto max-h-[100px]">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
{
  /* Add document form
    {isDocumentedAdded && (
      <form>
        <input type="text" placeholder="Enter document name" />
        <input type="text" placeholder="Enter issue date" />
      </form>
    )}

    {/* View Document form */
}
{
  /* {isDocumentViewed && (
      <div>
        details of document [mapped]
      </div>
    )} */
}
