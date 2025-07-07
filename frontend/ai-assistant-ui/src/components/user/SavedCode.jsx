// // 📁 frontend/src/components/user/SavedCode.jsx
// import React, { useEffect, useState } from 'react';
// import { apiGet } from '../../services/api';

// const SavedAndHistory = () => {
//   const [codes, setCodes] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [expandedIndex, setExpandedIndex] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const resCodes = await apiGet('/code');
//         setCodes(Array.isArray(resCodes) ? resCodes : resCodes.codes || []);

//         const resHistory = await apiGet('/history');
//         setHistory(Array.isArray(resHistory) ? resHistory : resHistory.history || []);
//       } catch (err) {
//         console.error('Failed to load data:', err);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-6 text-white">Saved Code Snippets</h2>
//       <div className="space-y-4 mb-10">
//         {codes.length === 0 ? (
//           <p className="text-gray-400">No saved code found.</p>
//         ) : (
//           codes.map((code, index) => (
//             <div
//               key={index}
//               className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-white cursor-pointer"
//               onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
//             >
//               <h3 className="font-bold text-lg mb-2">{code.title || `Snippet ${index + 1}`}</h3>
//               {expandedIndex === index && (
//                 <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
//                   <code>{code.code}</code>
//                 </pre>
//               )}
//             </div>
//           ))
//         )}
//       </div>

//       <h2 className="text-2xl font-semibold mb-6 text-white">Search History</h2>
//       <div className="space-y-4">
//         {history.length === 0 ? (
//           <p className="text-gray-400">No search history found.</p>
//         ) : (
//           history.map((item, idx) => (
//             <div key={idx} className="bg-gray-900 border border-gray-700 text-white p-3 rounded-md">
//               <strong>{item.query}</strong>
//               <div className="text-sm text-gray-400">{new Date(item.createdAt).toLocaleString()}</div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default SavedAndHistory;
