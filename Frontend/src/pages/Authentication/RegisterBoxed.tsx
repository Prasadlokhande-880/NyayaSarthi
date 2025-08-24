import { wait } from "@testing-library/user-event/dist/utils";
import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config";

const RegisterBoxed = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    email: "",
    password: "",
    dateOfBirth: "",
    ordinaryPlaceOfWorking: "",
    district: "",
    state: "",
    mobile: "",
    aadhar: "",
    barNumber: "",
    pincode: "",
    gender: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    console.log(formData);
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendDataToBackend = async (data: any) => {
    setLoading(true);
    setError("");
    
    try {
      const response: AxiosResponse<any> = await axiosInstance.post(
        "/signup",
        data
      );
      console.log("Data sent to the backend:", response.data);

      // ✅ show success message
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/auth/boxed-signin";
      }, 2000);

    } catch (error: any) {
      console.error("Error sending data to the backend:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendDataToBackend(formData);
  };

  return (
    <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
        <img
          src="/assets/images/auth/coming-soon-object1.png"
          alt="image"
          className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
        />
        <img
          src="/assets/images/auth/coming-soon-object2.png"
          alt="image"
          className="absolute left-24 top-0 h-40 md:left-[30%]"
        />
        <img
          src="/assets/images/auth/coming-soon-object3.png"
          alt="image"
          className="absolute right-0 top-0 h-[300px]"
        />
        <img
          src="/assets/images/auth/polygon-object.svg"
          alt="image"
          className="absolute bottom-0 end-[28%]"
        />
        <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)25%,rgba(255,255,255,0)_75%,#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                  Sign Up
                </h1>
                <p className="text-base font-bold leading-normal text-white-dark">
                  Enter your email and password to register
                </p>
              </div>
              <form
                className="space-y-5 dark:text-white"
                onSubmit={handleSubmit}
              >
                <div className="space-y-5 dark:text-white">
                  <div>
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter Full Name *"
                      className="form-input"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="type">Type *</label>
                    <select
                      id="type"
                      className="form-input"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--- select ---</option>
                      <option value="Lawyer">Lawyer</option>
                      <option value="Litigant">Litigant</option>
                      <option value="Judge">Judge</option>
                      <option value="Admin">Admin</option>
                      <option value="courtAdmin">Court Admin</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter Email Address *"
                      className="form-input"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password">Password *</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter Password *"
                      className="form-input"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth">Date Of Birth *</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      className="form-input"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="ordinaryPlaceOfWorking">
                      Ordinary Place Of Working *
                    </label>
                    <select
                      id="ordinaryPlaceOfWorking"
                      className="form-input"
                      value={formData.ordinaryPlaceOfWorking}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--- select ---</option>
                      <option value="High Court">High Court</option>
                      <option value="District Court">District Court</option>
                      <option value="Supreme Court">Supreme Court</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="district">District *</label>
                    <input
                      type="text"
                      id="district"
                      placeholder="Enter District *"
                      className="form-input"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      placeholder="Enter State *"
                      className="form-input"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile">Mobile *</label>
                    <input
                      type="text"
                      id="mobile"
                      placeholder="Mobile"
                      className="form-input"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="aadhar">Aadhar *</label>
                    <input
                      type="text"
                      id="aadhar"
                      placeholder="Aadhar *"
                      className="form-input"
                      value={formData.aadhar}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="barNumber">BarNumber</label>
                    <input
                      type="text"
                      id="barNumber"
                      placeholder="Enter BarNumber"
                      className="form-input"
                      value={formData.barNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      placeholder="Enter Pincode *"
                      className="form-input"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="gender">Gender *</label>
                    <select
                      id="gender"
                      className="form-input"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--- select ---</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Not Prefer to answer">Not Prefer to answer</option>
                    </select>
                  </div>
                  <div className="!mt-2">
                    <span className="text-white-dark text-[11px] inline-block">
                      *Required Fields
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                >
                  Sign Up
                </button>
              </form>
              <div className="relative my-7 text-center md:mb-9">
                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">
                  or
                </span>
              </div>
              <div className="text-center dark:text-white">
                Already have an account ?&nbsp;
                <Link
                  to="/auth/boxed-signin"
                  className="uppercase text-primary underline transition hover:text-black dark:hover:text-white"
                >
                  SIGN IN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterBoxed;
