"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { RegisterAction } from "../actions/database";

const formSchema = z.object({
  firstName: z.string().min(5, { message: "This field has to be filled." }),
  middleName: z.string().optional(),
  lastName: z.string().min(5, { message: "This field has to be filled." }),
  dob: z.date({ message: "Enter your DOB" }),
  gender: z
    .string({ message: "Gender is required" })
    .refine(
      (value) =>
        value.includes("male") ||
        value.includes("female") ||
        value.includes("other"),
      { message: "Please select a gender" }
    ),
  phone: z.string().regex(new RegExp("^\\+[1-9]\\d{1,14}$"), {
    message: "Invalid mobile number",
  }),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email({ message: "This is not a valid email" }),
  photo: z
    .any()
    .refine((file) => file?.size <= 3000000, "Max image size is 3MB."),
  address: z.string().min(5, { message: "This field has to be filled." }),
});

type Inputs = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const {
    register,
    formState: { errors, isSubmitting },
    control,
    setValue,
    clearErrors,
    getValues,
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: "https://static.aaraz.me/payko/money.png",
    },
  });
  const [file, setFile] = useState<File | null>(null);
  const onSubmit: SubmitHandler<Inputs> = async (InputFormData) => {};

  return (
    <div className="grid grid-cols-2 h-screen bg-slate-200">
      <div className="flex justify-center items-center">
        <form
          className=""
          // onSubmit={handleSubmit(onSubmit)}
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await RegisterAction();
            alert(res.msg);
          }}
        >
          <div>
            <Label htmlFor="firstName">
              First Name<span className="font-light text-red-600">*</span>
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="middleName">Middle Name (Optional)</Label>
            <Input
              id="middleName"
              {...register("middleName")}
              placeholder="Enter your middle name"
            />
            {errors.middleName && (
              <p className="text-red-500">{errors.middleName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">
              Last Name<span className="font-light text-red-600">*</span>
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="font-light text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">
              Phone (with country code):
              <span className="font-light text-red-600">*</span>
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Mobile number"
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">
              Email<span className="font-light text-red-600">*</span>
            </Label>
            <Input
              id="email"
              {...register("email")}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address">
              Address<span className="font-light text-red-600">*</span>
            </Label>
            <Input type="text" {...register("address")} />
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">
              Gender<span className="font-light text-red-600">*</span>
            </Label>
            <Controller
              name="gender"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <RadioGroup
                  onValueChange={(e) => {
                    setValue("gender", e);
                    clearErrors("gender");
                  }}
                  value={value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              )}
            ></Controller>
            {errors.gender && (
              <p className="text-red-500">{errors.gender.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="photo">
              Upload a photo<span className="font-light text-red-600">*</span>
            </Label>
            <Input
              type="file"
              {...register("photo")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFile(file);
                  setValue("photo", URL.createObjectURL(file));
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="dob">
              Date Of Birth<span className="font-light text-red-600">*</span>
            </Label>
            <Input
              type="date"
              {...register("dob", {
                valueAsDate: true,
              })}
              placeholder="Select your date of birth"
            />
            {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
          </div>
          <Button type="submit">Submit</Button>
        </form>
        {errors.root && <p className="text-red-500">Submission Error</p>}
      </div>
      <div className="flex justify-center items-center">
        <Image
          src={getValues("photo")}
          alt="icon"
          height={300}
          width={300}
          className="border-2 border-gray-300 rounded-full object-fill h-[500px] w-[500px]"
        />
        <h1 className="font-extrabold text-center text-2xl mt-4"></h1>
      </div>
    </div>
  );
}
