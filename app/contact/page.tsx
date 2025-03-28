"use client";
import ClientInput from "@/components/layout/ClientInput";
import { Owner } from "data/ownerData";
import {
  AlertCircle,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  X,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import Balancer from "react-wrap-balancer";
import { submitContact } from "./submit";
// import { useNotify } from "@/components/Notification";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";
import { useNotify } from "@/components/Notification";
import PayLater from "@/components/shared/Paylater";
import { useReCaptcha } from "next-recaptcha-v3";
import React from "react";
//import CalendlyPopup from "@/components/Calendly";
// import CalendlyModal from "@/components/Calendly/CalendlyModal";

function HocWrapper({ searchParams }: { searchParams: { name: string, email: string, message: string } }) {
  return (
    <>
      <GoogleCaptchaWrapper>
        <ContactUs searchParams={searchParams} />
      </GoogleCaptchaWrapper>
    </>
  );
}

function ContactUs({ searchParams }: { searchParams: { name: string, email: string, message: string } }) {
  const [showForm, setShowForm] = useState(true);
  const [showThanks, setShowThanks] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useRef<HTMLFormElement>(null);
  const [movinDate, setMovinDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const today = new Date();

  const notify = useNotify();
  // Subtract one day (24 hours)
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [formData, setFormData] = useState({
    companySize: "",
    companyName: "",
    timeline: "",
    budget: "",
    challenges: "",
    firstName: searchParams.name || '',
    lastName: "",
    email: searchParams.email || '',
    phone: "",
    source: "",
    message: searchParams.message || '',
    reason: "",
    terms: false,
  });

  const [validation, setValidation] = useState(false);
  const [inputValid, setInputValid] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  const [dateInvalid, setDateInvalid] = useState(false);

  const { executeRecaptcha, loaded } = useReCaptcha();

  const handleValueChange = (newValue: DateValueType) => {

    // let date = newValue?.startDate
    //   ? new Date(newValue?.startDate as string).toLocaleDateString()
    //   : "";

      let date = newValue?.startDate
      ? typeof newValue.startDate === "string"
        ? new Date(newValue.startDate).toLocaleDateString()
        : newValue.startDate instanceof Date
        ? newValue.startDate.toLocaleDateString()
        : ""
      : "";
    setMovinDate(newValue);
    setFormData((prev) => ({ ...prev, date }));
  };

  const formatDateString = (dateString: string) => {
    // Remove non-numeric characters from the input
    const numericValue = dateString.replace(/\D/g, "");

    // Format the numeric value as MM/DD/YYYY
    if (numericValue.length >= 4) {
      return `${numericValue.slice(0, 2)}/${numericValue.slice(
        2,
        4,
      )}/${numericValue.slice(4, 8)}`;
    } else if (numericValue.length >= 2) {
      return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}`;
    } else {
      return numericValue;
    }
  };

  function validateDate(dateString: string) {
    // Regular expression to match MM/DD/YYYY format
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

    if (!datePattern.test(dateString)) {
      return false;
    }

    // Additional validation for month and day
    const parts = dateString.split("/");
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);

    if (month < 1 || month > 12) {
      return false;
    }

    if (day < 1 || day > 31) {
      return false;
    }

    return true;
  }

  function handleCalendlyClose() {
    setShowCalendly(false);
  }

  function handleInputChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;
    if (name === "terms") {
      const { checked } = event.target as HTMLInputElement;
      // console.log(name, checked);

      setFormData((prev) => ({ ...prev, terms: checked }));
    } else setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(formData: FormData) {
    // console.log("submitting");
    setLoading(true);
    const token = await executeRecaptcha("Contact_Submit");

    const res = await submitContact(formData, token);

    if (res == 200) {
      notify("message sent successfully", "success");
      setValidation(false);
      setLoading(false);
      setShowCalendly(true);
    } else notify("failed to send", "fail");
    setLoading(false);
  }

  useEffect(() => {
    if (!movinDate?.endDate && !movinDate?.endDate) {
      setDateInvalid(true);
      return;
    } else {
      setDateInvalid(false);
    }
  }, [movinDate]);

  useEffect(() => {
    async function runCaptcha() {
      const token = await executeRecaptcha("Contact_Visit");
      const res = await fetch("/api/captcha", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      if (res.status == 200) setCaptchaPassed(true);
      else setCaptchaPassed(false);
    }

    if (loaded) runCaptcha();
  }, [loaded, executeRecaptcha]);

  function handleSubmitButton(event: MouseEvent) {
    event.preventDefault();
    setValidation(true);
    form.current?.checkValidity();
    // console.log(inputValid);
    if (inputValid) {
      setLoading(true);
      // console.log("valid input");
      form.current?.requestSubmit();
    }
  }

  useEffect(() => {
    // console.log("formsdata", formData.terms);
    if (
      formData.companySize.match(/\d{1,}/) &&
      formData.companyName.match(/^[a-zA-Z\-0-9 ]{1,50}$/) &&
      formData.challenges.match(/^[a-zA-Z\-0-9 ]{1,150}$/) &&
      formData.budget.match(/[0-9,]{1,}/) &&
      formData.firstName.match(/^[a-zA-Z\- ]{1,50}$/) &&
      formData.lastName.match(/^[a-zA-Z\- ]{1,50}$/) &&
      formData.email.match(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      ) &&
      formData.phone.match(
        /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})([\s.\-]?)\d{3}([\s.\-]?)\d{4}$/,
      ) &&
      formData.source.match(/^[a-zA-Z\- ]{1,100}$/) &&
      formData.message &&
      formData.terms
    ) {
      setInputValid(true);
    } else setInputValid(false);
  }, [formData]);

  return (
    <>
      <div className="relative min-h-screen bg-contact-bg bg-contain bg-no-repeat pt-40 text-gray-700 lg:pb-20">
        <div className="container relative mx-auto flex flex-col justify-center gap-5 rounded-lg bg-white px-1 py-10 shadow-top lg:w-5/6 lg:flex-row lg:px-10 dark:bg-zinc-900 ">
          <div className="z-10 min-h-screen rounded-2xl bg-[#ffffff2a] p-3 lg:w-1/2">
            <div>
              <h1 className="sm:text-3l text-5xl text-[#7E86F6]">
                Get in Touch
              </h1>
              <p className="text-xl">We are here for you! How can we help?</p>
            </div>
            {showForm && (
              <form
                ref={form}
                action={(formdata) => handleSubmit(formdata)}
                className="mt-4 px-5 "
              >
                <div className="my-7 flex flex-col ">
                  <input
                    type="text"
                    name="companySize"
                    pattern="\d{1,}"
                    placeholder="Number of Employees"
                    title="only numbers"
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-7 flex flex-col ">
                  <input
                    type="text"
                    name="companyName"
                    pattern="^[a-zA-Z\-0-9 ]{1,50}$"
                    placeholder="Company Name"
                    title="only letters, numbers, spaces, -"
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-7 flex flex-col dark:text-gray-100">
                  <input
                    type="text"
                    name="background"
                    pattern="^.{1,250}$"
                    disabled={true}
                    placeholder="Tell us about your Requirements"
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    required
                  />
                  <div className="flex max-w-full flex-wrap">
                    <div className="m-2 flex items-center gap-3 p-3">
                      <input
                        name="mlModels"
                        value="Cutting-edge Machine Learning Models"
                        type="checkbox"
                      ></input>
                      <label htmlFor="">
                        Cutting-edge Machine Learning Models
                      </label>
                    </div>
                    <div className="m-2 flex items-center gap-3 p-3">
                      <input
                        name="dataAnalysis"
                        value="Innovative Data Analysis"
                        type="checkbox"
                      ></input>
                      <label htmlFor="">Innovative Data Analysis</label>
                    </div>
                    <div className="m-2 flex items-center gap-3 p-3">
                      <input
                        name="relatimeData"
                        value="Real-time Data Processing"
                        type="checkbox"
                      ></input>
                      <label htmlFor="">Real-time Data Processing</label>
                    </div>
                    <div className="m-2 flex items-center gap-3 p-3">
                      <input
                        name="webDev"
                        value="Web development"
                        type="checkbox"
                      ></input>
                      <label htmlFor="">Web development</label>
                    </div>
                    <div className="m-2 flex items-center gap-3 p-3">
                      <input
                        name="appDev"
                        value="App developement"
                        type="checkbox"
                      ></input>
                      <label htmlFor="">App developement</label>
                    </div>
                  </div>
                </div>
                <div className="my-7 flex flex-col ">
                  <select
                    name="timeline"
                    title="Project Time Line"
                    className="bg-contact-input rounded-md border-2 text-gray-700 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    required
                    onChange={handleInputChange}
                    defaultValue={""}
                  >
                    <option value="" className="text-gray-700" disabled={true}>
                      Select Time line
                    </option>
                    <option className="text-gray-700" value="1-month">
                      1 Month
                    </option>

                    <option className="text-gray-700" value="3-months">
                      3 Months
                    </option>
                    <option className="text-gray-700" value="6-months">
                      6 Months
                    </option>
                    <option className="text-gray-700" value="12-months">
                      12 Months
                    </option>
                  </select>
                </div>
                <div className="my-7 flex flex-col ">
                  <input
                    type="text"
                    name="budget"
                    pattern="[0-9,]{1,}"
                    title="only numbers and `,` allowed"
                    placeholder="Your Max budget"
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-7 flex flex-col ">
                  <input
                    type="text"
                    name="challenges"
                    placeholder="Current challenges"
                    pattern="^[a-zA-Z\- ]{1,50}$"
                    title="only alphabets, - and spaces are allowed"
                    required
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-7 flex flex-col ">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    pattern="^[a-zA-Z\- ]{1,50}$"
                    title="only alphabets, - and spaces are allowed"
                    defaultValue={formData.firstName}
                    required
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-7 flex flex-col ">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    pattern="^[a-zA-Z\- ]{1,50}$"
                    title="only alphabets, - and spaces are allowed"
                    required
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-7 flex flex-col ">
                  <ClientInput
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    defaultValue={formData.email}

                    onChange={handleInputChange}
                    required
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                  ></ClientInput>
                </div>
                <div className="my-7 flex flex-col ">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone number"
                    title="enter valid phone number eg: +1 (123) 456-7890 , 1234567890, 123-456-7890"
                    pattern="^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})([\s.\-]?)\d{3}([\s.\-]?)\d{4}$"
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className="my-7 flex flex-col ">
                  <input
                    type="text"
                    name="source"
                    placeholder="How did you hear about us"
                    pattern="^[a-zA-Z\- ]{1,100}$"
                    title="only alphabets, - and spaces are allowed"
                    onChange={handleInputChange}
                    required
                    className="bg-contact-input rounded-md border-2 outline-none ring-0 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                  />
                </div>
                <div className="my-7 flex flex-col items-start gap-4">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-left text-gray-400"
                  >
                    How does it help your business ?
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    className="bg-contact-input w-full rounded-md  border-0 border-b-2 placeholder-gray-500 invalid:border-red-500 invalid:text-rose-600 invalid:outline-red-500"
                    placeholder="Your answer"
                    required
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="my-7 flex flex-col items-start gap-4">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-left text-gray-400"
                  >
                    Special request ?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="bg-contact-input w-full rounded-md  border-2 border-b-2 placeholder-gray-500 invalid:border-transparent invalid:text-rose-600 invalid:outline-red-500"
                    placeholder="Your Message"
                    required
                    onChange={handleInputChange}
                    defaultValue={formData.message}

                  ></textarea>
                </div>

                <div className="my-7 flex items-center gap-4 dark:text-gray-200">
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    className="border-2 bg-gray-300"
                    //checked= {formData.terms}
                    onChange={handleInputChange}
                    defaultValue={formData.message}

                  />
                  <p>
                    By submitting this, I authorize Cyber Tech shop to contact
                    me at my contact number and information provided message and
                    data rates may apply to opt out at any time email :{" "}
                    {Owner.email}
                  </p>
                </div>

                <button
                  className="w-full rounded-md bg-[#6569F6] p-4 text-white disabled:bg-gray-700"
                  type="submit"
                  disabled={!captchaPassed}
                  onClick={handleSubmitButton}
                >
                  Submit
                </button>
              </form>
            )}

            {validation && (
              <>
                <div className=" absolute left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-[#312f3249]">
                  <div className="relative ">
                    <div className="flex h-fit min-h-96 w-96 flex-col items-center justify-center gap-3 rounded-xl bg-gray-50 p-5 text-center">
                      {!formData.companySize.match(/\d{1,}/) ? (
                        <div className="text-red-400">invalid Company Size</div>
                      ) : (
                        <></>
                      )}
                      {!formData.companyName.match(/^[a-zA-Z0-9\- ]{1,50}$/) ? (
                        <div className="text-red-400">
                          invalid Company Name no special characters allowed
                        </div>
                      ) : (
                        <></>
                      )}
                      {!formData.challenges.match(/^[a-zA-Z\- ]{1,150}$/) ? (
                        <div className="text-red-400">
                          invalid Challenges provide NA if none, only alphabets
                          (max 150 characters)
                        </div>
                      ) : (
                        <></>
                      )}
                      {!formData.budget.match(/[0-9,]{1,}/) ? (
                        <div className="text-red-400">invalid Budget</div>
                      ) : (
                        <></>
                      )}
                      {!formData.firstName.match(/^[a-zA-Z\- ]{1,50}$/) ? (
                        <div className="text-red-400">invalid first name</div>
                      ) : (
                        <></>
                      )}
                      {!formData.lastName.match(/^[a-zA-Z\- ]{1,50}$/) ? (
                        <div className="text-red-400">invalid last name</div>
                      ) : (
                        <></>
                      )}
                      {!formData.email.match(
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                      ) ? (
                        <div className="text-red-400">invalid email</div>
                      ) : (
                        <></>
                      )}
                      {!formData.phone.match(
                        /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})([\s.\-]?)\d{3}([\s.\-]?)\d{4}$/,
                      ) ? (
                        <div className="text-red-400">invalid Phone number</div>
                      ) : (
                        <></>
                      )}
                      {!formData.source.match(/^[a-zA-Z\- ]{1,100}$/) ? (
                        <div className="text-red-400">
                          invalid source (let us know how you heard of us)
                        </div>
                      ) : (
                        <></>
                      )}
                      {!formData.message ? (
                        <div className="text-red-400">invalid Message</div>
                      ) : (
                        <></>
                      )}
                      {!formData.terms ? (
                        <div className="text-red-400">
                          Tick Checkbox to continue
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    {loading && (
                      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                        <Loader2 className="animate-spin" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setValidation(false);
                        form.current?.checkValidity();
                      }}
                      className="absolute right-1 top-1 hover:text-red-400"
                    >
                      <X />
                    </button>
                  </div>
                </div>
              </>
            )}

            {showThanks && (
              <>
                <div className="flex min-h-screen w-2/3 flex-col items-center justify-center p-10 text-center">
                  <Mail />
                  <Balancer>Well be in contact Soon!</Balancer>
                </div>
              </>
            )}

            {showError && (
              <>
                <div className="flex min-h-screen w-2/3 flex-col items-center justify-center p-10 text-center">
                  <AlertCircle color="red" />
                  <Balancer>An error occurred</Balancer>
                </div>
              </>
            )}
          </div>
          <div className="absolute top-10 -z-0 h-1/3 w-full translate-y-1/2 blur-sm lg:static lg:z-0  lg:w-1/2 lg:translate-y-16 lg:blur-none">
            <Image
              src={"/images/contact-graphic.svg"}
              alt="contact-graphic"
              width={340}
              height={250}
              className="w-full object-contain"
            />
            <div className="hidden lg:block">
              <PayLater />
            </div>
          </div>
          <div className="block lg:hidden">
            <PayLater />
          </div>

          <div className="absolute -top-0 flex -translate-y-full flex-row gap-5 rounded-t-lg bg-[#6F65FA]  p-5 py-7 drop-shadow-lg lg:-right-0 lg:top-1/2 lg:translate-x-full lg:flex-col  lg:rounded-br-full-tr-lg">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={Owner.socials.instagram}
            >
              <Instagram className="m-2" color="white"></Instagram>
            </a>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href={Owner.socials.facebook}
            >
              <Facebook className="m-2" color="white"></Facebook>
            </a>
          </div>
        </div>
        {/* {<CalendlyModal open={showCalendly} onCloseModal={handleCalendlyClose} />} */}
      </div>
    </>
  );
}

export default HocWrapper;
