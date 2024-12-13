// // VerifyVoterForm.jsx
// import { useState } from "react";
// import { verifyVoter } from "../blockchain";

// function VerifyVoter() {
//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");
//   const [country, setCountry] = useState("");

//   const handleVerify = async () => {
//     if (age && gender && country) {
//       await verifyVoter(parseInt(age), gender, country);
//     } else {
//       console.log("Please fill in all fields.");
//     }
//   };

//   return (
//     <div style={{ margin: "20px", padding: "20px", border: "1px solid #333" }}>
//       <h2>Verify Voter</h2>
//       <div>
//         <input
//           type="number"
//           placeholder="Age"
//           value={age}
//           onChange={(e) => setAge(e.target.value)}
//           style={{ margin: "5px", padding: "5px" }}
//         />
//       </div>
//       <div>
//         <input
//           type="text"
//           placeholder="Gender"
//           value={gender}
//           onChange={(e) => setGender(e.target.value)}
//           style={{ margin: "5px", padding: "5px" }}
//         />
//       </div>
//       <div>
//         <input
//           type="text"
//           placeholder="Country"
//           value={country}
//           onChange={(e) => setCountry(e.target.value)}
//           style={{ margin: "5px", padding: "5px" }}
//         />
//       </div>
//       <button onClick={handleVerify} style={{ marginTop: "10px", padding: "5px 10px" }}>
//         Verify Voter
//       </button>
//     </div>
//   );
// }

// export default VerifyVoter;