import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TC_logo from "../../../assets/images/tutorial_logo.png";
import ReturnArrow from "../../../assets/svg/return arrow.svg";
import signup_img from "../../../assets/images/student_sign_up.jpg";

export const StudentSubjectSelection = () => {
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://tutorialcenter-back.test";

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [subjectsByCourse, setSubjectsByCourse] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /* ================= HELPERS ================= */
  const getSubjectLimit = (courseTitle) =>
    courseTitle.toLowerCase().includes("jamb") ? 4 : 9;

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const storedTraining = JSON.parse(
          localStorage.getItem("selectedTraining")
        );
        const studentData = JSON.parse(localStorage.getItem("studentdata"));

        if (!storedTraining?.length || !studentData?.department) {
          navigate("/register/student/training/selection");
          return;
        }

        const department = studentData.department;

        const courseRes = await axios.get(`${API_BASE_URL}/api/courses`);
        const allCourses = courseRes.data.courses || [];

        const activeCourses = allCourses.filter((c) =>
          storedTraining.includes(c.id)
        );

        setSelectedCourses(activeCourses);

        const subjectMap = {};
        const selectionMap = {};

        for (const course of activeCourses) {
          const res = await axios.get(
            `${API_BASE_URL}/api/courses/${course.id}/subjects/${department}`
          );

          subjectMap[course.id] = res.data.subjects || [];
          selectionMap[course.id] = [];
        }

        setSubjectsByCourse(subjectMap);
        setSelectedSubjects(selectionMap);
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };

    init();
  }, [navigate, API_BASE_URL]);

  /* ================= SUBJECT TOGGLE ================= */
  const toggleSubject = (courseId, subjectId) => {
    setSelectedSubjects((prev) => {
      const current = prev[courseId] || [];
      const course = selectedCourses.find((c) => c.id === courseId);
      const limit = getSubjectLimit(course.title);

      if (current.includes(subjectId)) {
        return {
          ...prev,
          [courseId]: current.filter((id) => id !== subjectId),
        };
      }

      if (current.length >= limit) return prev;

      return {
        ...prev,
        [courseId]: [...current, subjectId],
      };
    });
  };

  /* ================= CONTINUE ================= */
  const handleContinue = () => {
    const valid = selectedCourses.every(
      (course) => selectedSubjects[course.id]?.length > 0
    );

    if (!valid) {
      setError(true);
      return;
    }

    setError(false);
    setShowConfirmModal(true);
  };

  /* ================= FINAL CONFIRM ================= */
  const handleProceed = () => {
    setLoading(true);
    localStorage.setItem(
      "trainingSubjects",
      JSON.stringify(selectedSubjects)
    );
    navigate("/register/student/training/duration");
  };

  return (
    <>
      <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row font-sans overflow-x-hidden">
        {/* LEFT */}
        <div className="w-full md:w-1/2 bg-[#F4F4F4] px-6 py-10 lg:px-[100px]">
          <div className="relative flex justify-center mb-6">
            <button
              onClick={() => navigate("/register/student/training/selection")}
              className="absolute left-0 p-2"
            >
              <img src={ReturnArrow} alt="Back" className="h-6 w-6" />
            </button>
            <img src={TC_logo} alt="Logo" className="h-[70px]" />
          </div>

          <h1 className="text-center text-2xl font-bold text-[#09314F] mb-6">
            Subject Selection
          </h1>

          <div className="grid grid-cols-3 bg-[#09314F] text-white text-sm font-bold rounded-t-lg">
            <div className="p-2">Courses</div>
            <div className="p-2">Subjects</div>
            <div className="p-2 text-right">Number</div>
          </div>

          {selectedCourses.map((course) => {
            const selectedIds = selectedSubjects[course.id] || [];
            const subjects = subjectsByCourse[course.id] || [];
            const limit = getSubjectLimit(course.title);
            const isOpen = openDropdown === course.id;

            return (
              <div key={course.id} className="border-b py-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-semibold">{course.title}</div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : course.id)
                      }
                      className="w-full bg-gray-300 px-3 py-2 rounded text-xs flex justify-between"
                    >
                      {selectedIds.length
                        ? subjects
                            .filter((s) => selectedIds.includes(s.id))
                            .map((s) => s.name)
                            .slice(0, 2)
                            .join(", ") +
                          (selectedIds.length > 2 ? "..." : "")
                        : "Select subjects"}
                      <span>{isOpen ? "▲" : "▼"}</span>
                    </button>

                    {isOpen && (
                      <div className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                        {subjects.map((subject) => {
                          const isSelected = selectedIds.includes(subject.id);
                          const disabled =
                            !isSelected && selectedIds.length >= limit;

                          return (
                            <button
                              key={subject.id}
                              disabled={disabled}
                              onClick={() =>
                                toggleSubject(course.id, subject.id)
                              }
                              className={`w-full px-4 py-2 text-left text-sm
                                ${
                                  isSelected
                                    ? "bg-green-500 text-white"
                                    : disabled
                                    ? "bg-gray-200 text-gray-400"
                                    : "hover:bg-gray-100"
                                }`}
                            >
                              {subject.name} {isSelected && "✓"}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="text-right font-semibold">
                    {selectedIds.length} / {limit}
                  </div>
                </div>
              </div>
            );
          })}

          {error && (
            <p className="text-red-500 text-xs text-center mt-4">
              Please select at least one subject for each course
            </p>
          )}

          <button
            onClick={handleContinue}
            className="mt-6 w-full py-3 rounded bg-gradient-to-r from-[#09314F] to-[#E83831] text-white"
          >
            Continue
          </button>
        </div>

        {/* RIGHT */}
        <div
          className="w-full md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${signup_img})` }}
        />
      </div>

      {/* ================= CONFIRMATION MODAL ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#09314F] mb-4">
              Confirm Your Subject Selection
            </h2>

            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border text-left">Course</th>
                  <th className="p-2 border text-left">Subjects</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourses.map((course) => {
                  const subjects =
                    subjectsByCourse[course.id]?.filter((s) =>
                      selectedSubjects[course.id]?.includes(s.id)
                    ) || [];

                  return (
                    <tr key={course.id}>
                      <td className="p-2 border font-semibold">
                        {course.title}
                      </td>
                      <td className="p-2 border">
                        {subjects.map((s) => s.name).join(", ")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded"
              >
                Make Changes
              </button>
              <button
                onClick={handleProceed}
                disabled={loading}
                className="px-6 py-2 bg-[#09314F] text-white rounded"
              >
                {loading ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};