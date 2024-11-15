"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PersonBasicDetail } from "../actions/lib/common";
import { PhantomWalletName } from "@solana/wallet-adapter-phantom";
import { UserRound } from "lucide-react";

export default function LandingPage() {
  const { publicKey, connected, signMessage, connect } = useWallet();

  const [isDocumentedAdded, setIsDocumentAdded] = useState<boolean>(false);
  const [isDocumentViewed, setIsDocumentViewed] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<PersonBasicDetail | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { select } = useWallet();
  select(PhantomWalletName);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    if (!connected) {
      await connect();
    }

    if (publicKey && signMessage) {
      try {
        const publicKeyString = publicKey.toString();

        const userData_At_LocalStorage = localStorage.getItem("user");
        if (userData_At_LocalStorage) {
          const userData = JSON.parse(userData_At_LocalStorage);
          setUserDetails(userData);
          setLoading(false);
          return;
        }

        const signedMessage = await signMessage(
          new TextEncoder().encode(publicKeyString)
        );

        const response = await fetch(`http://localhost:3000/api/getuser`, {
          method: "POST",
          body: JSON.stringify({
            public_key: publicKeyString,
            signature: signedMessage,
          }),
        });

        if (response.status === 404) {
          setError("User not found.");
          setLoading(false);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          setError("Failed to fetch user details.");
        }
      } catch (err) {
        setError("An error occurred while fetching user details.");
      }
    } else {
      setError("Wallet not connected.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [connected]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">
          No profile data available. Please connect your wallet.
        </p>
      </div>
    );
  }

  return (
    <main>
      <div className="text-xl flex flex-col gap-3 ml-20 mr-40 mt-16">
        <div className="flex gap-6 place-content-between">
          <h1 className="text-3xl font-bold mb-1">
            {/* base url add */}
            <a href="/dashboard">My Profile</a>
          </h1>
          <div className="flex gap-6">
            <a href="http://localhost:3000/dashboard/addDocument">
              <button
                className={
                  isDocumentedAdded
                    ? "invisible"
                    : "bg-blue-600 px-2 py-1 text-white rounded-md"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDocumentAdded(true);
                }}
              >
                {isDocumentedAdded ? "" : " + Add documents"}
              </button>
            </a>

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
          {/* <Image
            src={userDetails.photo || "/default-profile.png"}
            alt="profile_pic"
            height={150}
            width={150}
            className="rounded-full h-36 border-gray"
          /> */}
          <UserRound
            height={100}
            width={100}
            className="border-gray-500 border rounded-full p-4"
          />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
              <span className="mr-2 capitalize">{userDetails.first_name}</span>
              <span className="capitalize">{userDetails.last_name}</span>
            </h2>
            <p className="capitalize">{userDetails.gender || "N/A"}</p>
          </div>
        </section>
        {!isDocumentViewed && !isDocumentedAdded ? (
          <>
            {/* Personal Information Section */}
            <section className="flex flex-col gap-1 border border-gray rounded-xl py-4 px-4 mb-4">
              <h2 className="text-xl font-bold mt-4 mb-2">
                Personal Information
              </h2>
              <div className="text-gray-600 flex gap-40 grid-cols-2">
                <div className="flex flex-col gap-4 ml-1 grid-cols-1">
                  <div>
                    <p className="mb-2">Name</p>
                    <span className="capitalize">
                      {userDetails.first_name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="mb-2">Email</p>
                    <span>{userDetails.email || "N/A"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 grid-cols-1">
                  <div>
                    <p className="mb-2">Last Name</p>
                    <span className="capitalize">
                      {userDetails.last_name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="mb-2">Phone</p>
                    <span>{userDetails.phone || "N/A"}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Address Information Section */}
            <section className="flex flex-col gap-1 border border-gray rounded-xl py-4 px-4 mb-4">
              <h2 className="text-xl font-bold mt-4 mb-2">
                Address Information
              </h2>
              <div className="text-gray-600 flex gap-40 grid-cols-2">
                <div className="flex flex-col gap-4 ml-1 grid-cols-1">
                  <div>
                    <p className="mb-2">Address</p>
                    <span>{userDetails.address_line || "N/A"}</span>
                  </div>
                  <div>
                    <p className="mb-2">State</p>
                    <span>{userDetails.state || "N/A"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 grid-cols-1">
                  <div>
                    <p className="mb-2">City</p>
                    <span>{userDetails.city || "N/A"}</span>
                  </div>
                  <div>
                    <p className="mb-2">Pincode</p>
                    <span>{userDetails.pin_code || "N/A"}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Details Section */}
            <section className="flex flex-col gap-1 border border-gray rounded-xl py-4 px-4 mb-4">
              <h2 className="text-xl font-bold mt-4 mb-2">Security Details</h2>
              <div className="text-gray-600 flex gap-40 grid-cols-2">
                <div className="flex flex-col gap-4 ml-1 grid-cols-1">
                  <div>
                    <p className="mb-2">Public Key</p>
                    <span>{userDetails.pub_key || "N/A"}</span>
                  </div>
                  <div>
                    <p className="mb-2">Verification ID</p>
                    <span>{userDetails.id || "N/A"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 grid-cols-1">
                  <div>
                    <p className="mb-2">Verification Status</p>
                    <span>
                      {userDetails.verification_complete
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </div>
                  <div>
                    <p className="mb-2">Created At</p>
                    <span>
                      {userDetails.created_at.substring(0, 10) || "N/A"}
                    </span>
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
