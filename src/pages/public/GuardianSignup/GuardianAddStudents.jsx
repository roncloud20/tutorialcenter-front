import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TC_logo from "../../../assets/images/tutorial_logo.png";
import ReturnArrow from "../../../assets/svg/return arrow.svg";
import signup_img from "../../../assets/images/student_sign_up.jpg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";

export default function GuardianAddStudents() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Each student has a name, email, and an expanded/collapsed state
  const [students, setStudents] = useState([
    { name: "", email: "", expanded: true },
  ]);

  // Toggle a student section open/closed
  const toggleStudent = (index) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, expanded: !s.expanded } : s))
    );
  };

  // Update a field for a specific student
  const handleStudentChange = (index, field, value) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  // Add another student section
  const addStudent = () => {
    // Collapse all existing, expand the new one
    setStudents((prev) => [
      ...prev.map((s) => ({ ...s, expanded: false })),
      { name: "", email: "", expanded: true },
    ]);
  };

  // Remove a student (only if more than one)
  const removeStudent = (index) => {
    if (students.length <= 1) return;
    setStudents((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    students.forEach((student, i) => {
      if (!student.name.trim()) {
        newErrors[`student_${i}_name`] = "Name is required";
      }
      if (!student.email.trim()) {
        newErrors[`student_${i}_email`] = "Email or phone is required";
      }
    });

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submission — save to localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const guardianTel = localStorage.getItem("guardianTel");

    const payload = {
      guardianTel,
      students: students.map((s) => ({
        name: s.name,
        email: s.email,
      })),
      password,
    };

    // Save to localStorage for the next page
    localStorage.setItem("guardianStudents", JSON.stringify(payload));

    setToast({ type: "success", message: "Students added successfully!" });

    setTimeout(() => {
      setLoading(false);
      navigate("/register/guardian/student/biodata");
    }, 1500);
  };

  return (
    <>
      <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row font-sans overflow-x-hidden">
        {/* LEFT SIDE: Content Area */}
        <div className="w-full md:w-1/2 h-full bg-[#F4F4F4] flex flex-col justify-center relative px-6 py-10 lg:px-[100px] lg:py-[60px] order-2 md:order-1 overflow-y-auto">
          {/* TOP NAV */}
          <div className="relative w-full flex items-center justify-center mb-8 md:mb-10">
            <button
              onClick={() => navigate("/register/guardian/phone/verify")}
              className="absolute left-0 p-2 hover:bg-gray-200 rounded-full transition-all z-10"
            >
              <img
                src={ReturnArrow}
                alt="Back"
                className="h-6 w-6 lg:h-5 lg:w-5"
              />
            </button>
            <img
              src={TC_logo}
              alt="Logo"
              className="h-[60px] md:h-[80px] w-auto object-contain"
            />
          </div>

          {/* CENTER PIECE */}
          <div className="flex flex-col items-center w-full">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-[#09314F]">
                Add Student
              </h1>
              <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                Add your child(ren) through email, they will receive a
                confirmation email to be able to access their information.
              </p>
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6 flex flex-col items-center w-full">
              {/* Toast */}
              {toast && (
                <div
                  className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg text-white transition-all duration-300 ${
                    toast.type === "success" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {toast.message}
                </div>
              )}

              <form
                autoComplete="off"
                className="w-full space-y-4"
                onSubmit={handleSubmit}
              >
                {/* Student Sections */}
                {students.map((student, index) => (
                  <div key={index} className="w-full">
                    {/* Student Header - Collapsible */}
                    <button
                      type="button"
                      onClick={() => toggleStudent(index)}
                      className="w-full flex items-center justify-between py-3 border-b border-gray-200"
                    >
                      <span className="text-sm font-bold text-[#09314F] uppercase tracking-wide">
                        Student {index + 1}
                      </span>
                      <svg
                        className={`w-5 h-5 text-[#09314F] transition-transform duration-200 ${
                          student.expanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Student Fields - Expandable */}
                    {student.expanded && (
                      <div className="pt-4 pb-2 space-y-4">
                        {/* Name Field */}
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            Name
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                              <UserIcon className="h-5 w-5" />
                            </span>
                            <input
                              type="text"
                              value={student.name}
                              onChange={(e) =>
                                handleStudentChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="first and last name"
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-[#F9F0F0] ${
                                errors[`student_${index}_name`]
                                  ? "border-red-500"
                                  : "border-gray-200"
                              } focus:ring-2 focus:ring-blue-900 focus:border-transparent`}
                            />
                          </div>
                          {errors[`student_${index}_name`] && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors[`student_${index}_name`]}
                            </p>
                          )}
                        </div>

                        {/* Email Field */}
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                              <EnvelopeIcon className="h-5 w-5" />
                            </span>
                            <input
                              type="text"
                              value={student.email}
                              onChange={(e) =>
                                handleStudentChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                              placeholder="you@example.com or +234xxxxxxxxxxx"
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-[#F9F0F0] ${
                                errors[`student_${index}_email`]
                                  ? "border-red-500"
                                  : "border-gray-200"
                              } focus:ring-2 focus:ring-blue-900 focus:border-transparent`}
                            />
                          </div>
                          {errors[`student_${index}_email`] && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors[`student_${index}_email`]}
                            </p>
                          )}
                        </div>

                        {/* Remove button (only if more than 1 student) */}
                        {students.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStudent(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            Remove Student
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Add Another Button */}
                <button
                  type="button"
                  onClick={addStudent}
                  className="w-full flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-[#09314F]">
                    Add another
                  </span>
                  <span className="text-[#09314F] text-xl font-bold">+</span>
                </button>

                {/* Password Fields */}
                <div className="flex gap-4">
                  {/* General Password */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      General Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`w-full px-3 py-2 border rounded-lg bg-[#F9F0F0] ${
                          errors.password
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-900 focus:border-transparent`}
                      />
                      <span
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </span>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm"
                        className={`w-full px-3 py-2 border rounded-lg bg-[#F9F0F0] ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-900 focus:border-transparent`}
                      />
                      <span
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </span>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#09314F] to-[#E83831] hover:opacity-90"
                  } text-white transition-colors`}
                >
                  {loading ? "Saving..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Visual Image */}
        <div
          className="w-full h-[192px] md:w-1/2 md:h-full bg-cover bg-center relative bg-gray-300 order-1 md:order-2"
          style={{ backgroundImage: `url(${signup_img})` }}
        >
          {/* Login Button */}
          <div className="hidden md:block absolute bottom-[60px] left-0">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-white text-[#09314F] font-bold hover:bg-gray-100 transition-all shadow-md"
              style={{ borderRadius: "0px 20px 20px 0px" }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
