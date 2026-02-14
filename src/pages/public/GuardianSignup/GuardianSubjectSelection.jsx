import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TC_logo from "../../../assets/images/tutorial_logo.png";
import ReturnArrow from "../../../assets/svg/return arrow.svg";
import signup_img from "../../../assets/images/student_sign_up.jpg";

export default function GuardianSubjectSelection() {
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://tutorialcenter-back.test";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState(null);

  /* ================= HELPERS ================= */
  const getSubjectLimit = (courseTitle) =>
    courseTitle.toLowerCase().includes("jamb") ? 4 : 9;

  /* ================= INIT ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem("guardianStudentsTraining");
        if (!stored) {
          navigate("/register/guardian/training/selection");
          return;
        }

        const parsedStudents = JSON.parse(stored);

        // Fetch all courses
        const courseRes = await axios.get(`${API_BASE_URL}/api/courses`);
        const allCourses = courseRes.data.courses || [];

        // For each student, build their course + subject data
        const enrichedStudents = await Promise.all(
          parsedStudents.map(async (student, index) => {
            const activeCourses = allCourses.filter((c) =>
              student.selectedTraining.includes(c.id)
            );

            const subjectsByCourse = {};
            const selectedSubjects = {};
            const openDropdown = null;

            for (const course of activeCourses) {
              const res = await axios.get(
                `${API_BASE_URL}/api/courses/${course.id}/subjects/${student.department}`
              );
              subjectsByCourse[course.id] = res.data.subjects || [];
              selectedSubjects[course.id] = [];
            }

            return {
              ...student,
              activeCourses,
              subjectsByCourse,
              selectedSubjects,
              openDropdown,
              expanded: index === 0,
            };
          })
        );

        setStudents(enrichedStudents);
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };

    init();
  }, [navigate, API_BASE_URL]);

  /* ================= TOGGLE ACCORDION ================= */
  const toggleStudent = (index) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, expanded: !s.expanded } : s))
    );
  };

  /* ================= TOGGLE DROPDOWN ================= */
  const toggleDropdown = (studentIndex, courseId) => {
    setStudents((prev) =>
      prev.map((s, i) => {
        if (i !== studentIndex) return s;
        return {
          ...s,
          openDropdown: s.openDropdown === courseId ? null : courseId,
        };
      })
    );
  };

  /* ================= SUBJECT TOGGLE ================= */
  const toggleSubject = (studentIndex, courseId, subjectId) => {
    setStudents((prev) =>
      prev.map((s, i) => {
        if (i !== studentIndex) return s;

        const current = s.selectedSubjects[courseId] || [];
        const course = s.activeCourses.find((c) => c.id === courseId);
        const limit = getSubjectLimit(course.title);

        let updated;
        if (current.includes(subjectId)) {
          updated = current.filter((id) => id !== subjectId);
        } else {
          if (current.length >= limit) return s;
          updated = [...current, subjectId];
        }

        return {
          ...s,
          selectedSubjects: {
            ...s.selectedSubjects,
            [courseId]: updated,
          },
        };
      })
    );
  };

  /* ================= CONTINUE ================= */
  const handleContinue = () => {
    const valid = students.every((student) =>
      student.activeCourses.every(
        (course) => student.selectedSubjects[course.id]?.length > 0
      )
    );

    if (!valid) {
      setError(true);
      setToast({
        type: "error",
        message: "Please select at least one subject per course for each student",
      });
      return;
    }

    setError(false);
    setShowConfirmModal(true);
  };

  /* ================= FINAL CONFIRM ================= */
  const handleProceed = () => {
    setLoading(true);

    try {
      const payload = students.map((s) => ({
        name: s.name,
        email: s.email,
        firstname: s.firstname,
        surname: s.surname,
        gender: s.gender,
        date_of_birth: s.date_of_birth,
        location: s.location,
        address: s.address,
        department: s.department,
        selectedTraining: s.selectedTraining,
        selectedSubjects: s.selectedSubjects,
      }));

      localStorage.setItem(
        "guardianStudentsSubjects",
        JSON.stringify(payload)
      );

      setToast({ type: "success", message: "Subjects saved successfully!" });

      setTimeout(() => {
        setLoading(false);
        navigate("/register/guardian/training/duration");
      }, 1500);
    } catch (err) {
      console.error("Failed to store selected subjects", err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row font-sans overflow-x-hidden">
        {/* LEFT */}
        <div className="w-full md:w-1/2 bg-[#F4F4F4] px-6 py-10 lg:px-[100px] lg:py-[60px] order-2 md:order-1 overflow-y-auto">
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

          {/* HEADER */}
          <div className="relative flex justify-center mb-6">
            <button
              onClick={() => navigate("/register/guardian/training/selection")}
              className="absolute left-0 p-2 hover:bg-gray-200 rounded-full"
            >
              <img src={ReturnArrow} alt="Back" className="h-6 w-6" />
            </button>
            <img src={TC_logo} alt="Logo" className="h-[70px]" />
          </div>

          <h1 className="text-center text-2xl font-bold text-[#09314F] mb-2">
            Subject Selection
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Select subjects for each student's chosen training
          </p>

          {/* PER-STUDENT ACCORDION */}
          <div className="space-y-4">
            {students.map((student, sIndex) => (
              <div
                key={sIndex}
                className="bg-white rounded-2xl shadow-sm border border-gray-100"
                style={{ position: "relative", zIndex: students.length - sIndex }}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleStudent(sIndex)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#09314F] uppercase tracking-wide">
                      Student {sIndex + 1}
                    </span>
                    <span className="text-xs text-gray-400">
                      — {student.firstname} {student.surname}
                    </span>
                  </div>
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

                {/* Accordion Body — Subject Selection Table */}
                {student.expanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 bg-[#09314F] text-white text-sm font-bold rounded-t-lg">
                      <div className="p-2">Courses</div>
                      <div className="p-2">Subjects</div>
                      <div className="p-2 text-right">Number</div>
                    </div>

                    {/* Course Rows */}
                    {student.activeCourses.map((course) => {
                      const selectedIds =
                        student.selectedSubjects[course.id] || [];
                      const subjects =
                        student.subjectsByCourse[course.id] || [];
                      const limit = getSubjectLimit(course.title);
                      const isOpen = student.openDropdown === course.id;

                      return (
                        <div key={course.id} className="border-b py-4">
                          <div className="grid grid-cols-3 gap-4 items-center">
                            <div className="font-semibold text-sm">
                              {course.title}
                            </div>

                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleDropdown(sIndex, course.id)
                                }
                                className="w-full bg-gray-300 px-3 py-2 rounded text-xs flex justify-between"
                              >
                                {selectedIds.length
                                  ? subjects
                                      .filter((s) =>
                                        selectedIds.includes(s.id)
                                      )
                                      .map((s) => s.name)
                                      .slice(0, 2)
                                      .join(", ") +
                                    (selectedIds.length > 2 ? "..." : "")
                                  : "Select subjects"}
                                <span>{isOpen ? "▲" : "▼"}</span>
                              </button>

                              {isOpen && (
                                <div className="absolute z-50 w-full bg-white border rounded shadow overflow-y-auto" style={{ maxHeight: "170px" }}>
                                  {subjects.map((subject) => {
                                    const isSelected = selectedIds.includes(
                                      subject.id
                                    );
                                    const disabled =
                                      !isSelected &&
                                      selectedIds.length >= limit;

                                    return (
                                      <button
                                        key={subject.id}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() =>
                                          toggleSubject(
                                            sIndex,
                                            course.id,
                                            subject.id
                                          )
                                        }
                                        className={`w-full px-4 py-2 text-left text-sm ${
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

                            <div className="text-right font-semibold text-sm">
                              {selectedIds.length} / {limit}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center mt-4">
              Please select at least one subject for each course per student
            </p>
          )}

          {/* CONTINUE */}
          <button
            onClick={handleContinue}
            className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-[#09314F] to-[#E83831] text-white font-medium hover:opacity-90 transition-colors"
          >
            Continue
          </button>
        </div>

        {/* RIGHT */}
        <div
          className="w-full h-[192px] md:w-1/2 md:h-full bg-cover bg-center relative order-1 md:order-2"
          style={{ backgroundImage: `url(${signup_img})` }}
        >
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

      {/* ================= CONFIRMATION MODAL ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl rounded-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#09314F] mb-4">
              Confirm Subject Selection
            </h2>

            {students.map((student, sIndex) => (
              <div key={sIndex} className="mb-6">
                <h3 className="text-sm font-bold text-[#09314F] uppercase mb-2">
                  Student {sIndex + 1} — {student.firstname} {student.surname}
                </h3>
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left">Course</th>
                      <th className="p-2 border text-left">Subjects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.activeCourses.map((course) => {
                      const subjects =
                        student.subjectsByCourse[course.id]?.filter((s) =>
                          student.selectedSubjects[course.id]?.includes(s.id)
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
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
              >
                Make Changes
              </button>
              <button
                onClick={handleProceed}
                disabled={loading}
                className="px-6 py-2 bg-[#09314F] text-white rounded hover:opacity-90 transition-colors"
              >
                {loading ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
