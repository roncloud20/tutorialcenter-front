export default function ProgressCard({ title, subjects = [] }) {
  // Average progress for course progress bar
  const avgProgress =
    subjects.length > 0
      ? subjects.reduce((sum, s) => sum + (s.progress || 0), 0) /
        subjects.length
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm dark:text-white">{title}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-100">
          Subjects {subjects.length}
        </span>
      </div>

      {/* Course Overall Progress */}
      <div className="h-2 bg-gray-200 rounded-full mb-4">
        <div
          className="h-2 bg-blue-900 rounded-full"
          style={{ width: `${avgProgress}%` }}
        />
      </div>

      {/* Subjects */}
      <div className="space-y-3">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-gray-100 dark:bg-gray-500 rounded-lg px-3 py-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm">{sub.name}</span>
              <span className="text-xs font-semibold">
                {Math.round(sub.progress || 0)}%
              </span>
            </div>

            <div className="h-2 bg-gray-300 rounded-full mt-1">
              <div
                className="h-2 bg-blue-900 rounded-full"
                style={{ width: `${sub.progress || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}











// export default function ProgressCard({ title, subjects }) {
//   return (
//     <>
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="font-semibold text-sm dark:text-white">{title}</h3>
//           <span className="text-xs text-gray-500 dark:text-gray-100">
//             Subjects {subjects.length}
//           </span>
//         </div>

//         <div className="h-2 bg-gray-200 rounded-full mb-4">
//           <div className="h-2 bg-blue-900 rounded-full w-[6%]" />
//         </div>

//         <div className="space-y-3">
//           {subjects.map((sub, idx) => (
//             <div key={idx} className="bg-gray-100 dark:bg-gray-500 rounded-lg px-3 py-2">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm">{sub}</span>
//                 <span className="text-xs font-semibold">86%</span>
//               </div>
//               <div className="h-2 bg-gray-300 rounded-full mt-1">
//                 <div className="h-2 bg-blue-900 rounded-full w-[86%]" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }
