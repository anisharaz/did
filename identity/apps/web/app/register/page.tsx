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
import { Loader2 } from "lucide-react";
const formSchema = z.object({
  firstName: z.string().min(2, { message: "This field has to be filled." }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "This field has to be filled." }),
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
  photo: z.string().url({ message: "This is not a valid URL" }),
  address_line: z.string().min(5, { message: "This field has to be filled." }),
  city: z.string().min(5, { message: "City is required" }),
  state: z.string().min(5, { message: "State is required" }),
  pin_code: z.number().int({ message: "Valid pincode required" }),
});

type Inputs = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    setValue,
    clearErrors,
    reset,
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: "https://static.aaraz.me/payko/money.png",
    },
  });
  const [file, setFile] = useState<File | null>(null);
  const onSubmit: SubmitHandler<Inputs> = async (InputFormData) => {
    const res = await RegisterAction(InputFormData);
    if (!res.success) {
      alert("Submission failed");
      return;
    }
    alert("Submission successful");
    reset();
  };
  // TODO: add the id in all input for Label
  // TODO: ability to upload image
  return (
    <div className="grid grid-cols-2  h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="">
        <div>
          <div className="text-4xl font-bold p-4">Enter People detail</div>
          <hr />
          <form onSubmit={handleSubmit(onSubmit)} className="p-2">
            <div className="grid grid-cols-3 gap-2 p-2">
              <div>
                <Label htmlFor="firstName" className="text-xl">
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
                <Label className="text-xl" htmlFor="middleName">
                  Middle Name (Optional)
                </Label>
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
                <Label className="text-xl" htmlFor="lastName">
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
            </div>
            <div className="grid grid-cols-2 gap-2 p-2">
              <div>
                <Label className="text-xl" htmlFor="phone">
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
                <Label className="text-xl" htmlFor="email">
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
            </div>
            <div className="p-2">
              <Label className="text-xl" htmlFor="address">
                Address Line<span className="font-light text-red-600">*</span>
              </Label>
              <Input type="text" {...register("address_line")} />
              {errors.address_line && (
                <p className="text-red-500">{errors.address_line.message}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
              <div>
                <Label className="text-xl" htmlFor="address">
                  State<span className="font-light text-red-600">*</span>
                </Label>
                <Input type="text" {...register("state")} />
                {errors.state && (
                  <p className="text-red-500">{errors.state.message}</p>
                )}
              </div>
              <div>
                <Label className="text-xl" htmlFor="address">
                  City<span className="font-light text-red-600">*</span>
                </Label>
                <Input type="text" {...register("city")} />
                {errors.city && (
                  <p className="text-red-500">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label className="text-xl" htmlFor="address">
                  Pin Code<span className="font-light text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  {...register("pin_code", {
                    valueAsNumber: true,
                  })}
                />
                {errors.pin_code && (
                  <p className="text-red-500">{errors.pin_code.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2 p-2">
              <Label className="text-xl" htmlFor="gender">
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
            <div className="grid grid-cols-2 gap-2 p-2">
              <div>
                <Label className="text-xl" htmlFor="photo">
                  Upload a photo
                  <span className="font-light text-red-600">*</span>
                </Label>
                <Input
                  type="file"
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
                <Label className="text-xl" htmlFor="dob">
                  Date Of Birth
                  <span className="font-light text-red-600">*</span>
                </Label>
                <Input
                  type="date"
                  {...register("dob", {
                    valueAsDate: true,
                  })}
                  placeholder="Select your date of birth"
                  className="text-black"
                />
                {errors.dob && (
                  <p className="text-red-500">{errors.dob.message}</p>
                )}
              </div>
            </div>
            <div className="p-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />{" "}
                    <span className="pl-2">Please Wait..</span>
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>
            </div>
          </form>
          {errors.root && <p className="text-red-500">Submission Error</p>}
        </div>
      </div>
      <div className="flex justify-center items-center bg-white">
        <Image
          src={"https://static.aaraz.me/payko/money.png"}
          alt="icon"
          height={300}
          width={300}
          className="border-2 border-gray-300 rounded-full object-fill h-[500px] w-[500px]"
        />
      </div>
    </div>
  );
}
