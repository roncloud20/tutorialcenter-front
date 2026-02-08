import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TC_logo from "../../../assets/images/tutorial_logo.png";
import ReturnArrow from "../../../assets/svg/return arrow.svg";
import signup_img from "../../../assets/images/student_sign_up.jpg";
import Paystack from "../../../components/Paystack";

export const StudentTrainingPayment = () => {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);
  const [selectedDurations, setSelectedDurations] = useState({});
  const [gateway, setGateway] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("studentdata"));

    if (!stored?.data || !stored?.selectedDurations) {
      navigate("/register/student");
      return;
    }

    setStudentData(stored);
    setSelectedDurations(stored.selectedDurations);
  }, [navigate]);

  /* ================= TOTAL ================= */
  const totalAmount = useMemo(() => {
    return Object.values(selectedDurations)
      .filter(Boolean)
      .reduce((sum, item) => sum + Number(item.price || 0), 0);
  }, [selectedDurations]);

  /* ================= EMAIL ================= */
  const payerEmail = useMemo(() => {
    return studentData?.data?.email || "codewithpidgin@gmail.com";
  }, [studentData]);

  /* ================= MODAL ================= */
  const openGateway = (selected) => {
    setGateway(selected);
    setShowModal(true);
  };

  const closeModal = () => {
    if (!processing) {
      setShowModal(false);
      setGateway(null);
    }
  };

  /* ================= PAYSTACK SUCCESS ================= */
  const handlePaystackSuccess = async (response) => {
    try {
      setProcessing(true);

      const studentId = studentData.data.id;
      const selectedSubjects = studentData.selectedSubjects;

      for (const [courseId, duration] of Object.entries(selectedDurations)) {
        /* ===== COURSE ENROLLMENT ===== */
        const courseEnrollRes = await axios.post("/course/enrollment", {
          student_id: studentId,
          course_id: Number(courseId),
          billing_cycle: duration.duration,
        });

        const courseEnrollmentId = courseEnrollRes.data.id;

        /* ===== SUBJECT ENROLLMENT ===== */
        const subjects = selectedSubjects?.[courseId] || [];

        for (const subjectId of subjects) {
          await axios.post("/subject/enrollment", {
            student_id: studentId,
            course_enrollment_id: courseEnrollmentId,
            subject_id: subjectId,
          });
        }

        /* ===== PAYMENT RECORD ===== */
        await axios.post("/payments", {
          student_id: studentId,
          course_enrollment_id: courseEnrollmentId,
          amount: duration.price,
          billing_cycle: duration.duration,
          payment_method: "card",
          gateway: "paystack",
          status: "successful",
          gateway_reference: response.reference,
          meta: {
            channel: response.channel,
            paid_at: response.paid_at,
          },
        });
      }

      /* ===== CLEANUP ===== */
      localStorage.removeItem("studentdata");

      navigate("/student/dashboard");
    } catch (err) {
      console.error("Payment/Enrollment failed:", err);
      alert("Payment was successful, but enrollment failed. Please contact support.");
    } finally {
      setProcessing(false);
      closeModal();
    }
  };

  return (
    <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full md:w-1/2 bg-[#F4F4F4] px-6 py-10 lg:px-[100px]">
        <div className="relative flex justify-center mb-6">
          <button
            onClick={() => navigate("/register/student/training/duration")}
            className="absolute left-0 p-2"
          >
            <img src={ReturnArrow} alt="Back" className="h-6 w-6" />
          </button>
          <img src={TC_logo} alt="Logo" className="h-[70px]" />
        </div>

        <h1 className="text-center text-2xl font-bold text-[#09314F] mb-6">
          Select Payment Method
        </h1>

        <div className="bg-white rounded-lg p-4 mb-6 border">
          <div className="flex justify-between font-bold">
            <span>Total Payable</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {["Paystack", "Flutterwave", "PayPal", "Interswitch"].map((item) => (
          <button
            key={item}
            onClick={() => openGateway(item)}
            className="w-full mb-4 bg-white border rounded-lg px-4 py-4 font-semibold flex justify-between"
          >
            <span>{item}</span>
            <span>→</span>
          </button>
        ))}
      </div>

      {/* RIGHT */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${signup_img})` }}
      />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">{gateway} Payment</h2>

            <div className="text-2xl font-bold text-center mb-6">
              ₦{totalAmount.toLocaleString()}
            </div>

            {gateway === "Paystack" && (
              <Paystack
                amount={totalAmount}
                email={payerEmail}
                reference={`TC-${Date.now()}`}
                onSuccess={handlePaystackSuccess}
                onClose={closeModal}
              />
            )}

            <button
              onClick={closeModal}
              disabled={processing}
              className="mt-4 w-full text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
