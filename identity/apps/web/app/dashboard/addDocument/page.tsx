"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import * as z from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  documentType: z.string({ message: "This field has to be filled" }),
  documentID: z.string({ message: "This field has to be filled" }),
  documentIssuedAt: z.date({ message: "Enter issue date" }),
});

type Inputs = z.infer<typeof formSchema>;

// docID, docCreationDate, docExpiry, docType
export default function Modal() {
  const {
    handleSubmit,
    register,
    clearErrors,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
  } = useForm<Inputs>({ mode: "onChange", resolver: zodResolver(formSchema) });
  const [documentDetails, setDocumentDetails] = useState<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (InputFormData) => {
    try {
      setDocumentDetails(InputFormData);
      console.log(InputFormData);
    } catch (error) {
      console.log(error);
    }
    // action to be implemented
  };

  return (
    <div className="justify-center">
      <h1 className="text-5xl mt-12 ml-6 font-bold">Add Documents</h1>
      <form className="justify-center ml-40 mt-28 flex flex-col gap-6 w-[400px]">
        <div>
          <label htmlFor="documentID" className="ml-1 my-2">
            Enter document ID
          </label>
          <Input
            placeholder="Enter document ID"
            id="documentID"
            {...register("documentID")}
          />
          {errors.documentID && (
            <p className="text-red-500">{errors.documentID?.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="document_IssuedDate" className="ml-1 my-2">
            Enter document issue date
          </label>
          <Input
            type="date"
            placeholder="Enter your date"
            {...register("documentIssuedAt")}
          />
          {errors.documentIssuedAt && (
            <p className="text-red-500">
              {errors.documentIssuedAt?.root?.types?.value?.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="documentType" className="ml-1 my-2">
            Choose a document type
          </label>
          <select {...register("documentType")} className="h-10 w-92 px-3">
            <option value="">Select...</option>
            <option value="Aadhaar Card">Aadhaar Card</option>
            <option value="PAN Card">PAN Card</option>
            <option value="Voter ID card">Voter ID Card</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-black w-36 px-6 py-2 text-white rounded-md ml-28"
          onSubmit={handleSubmit(onSubmit)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
