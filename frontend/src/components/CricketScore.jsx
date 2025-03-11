// // CricketScore.jsx

// const CricketScore = () => {
//   // Sample data (you can replace this with props or API data)
//   const matchData = {
//     team1: { name: "India", flag: "🇮🇳", score: "254/6", overs: "49 ov" },
//     team2: { name: "New Zealand", flag: "🇳🇿", score: "251/7", overs: "50 ov" },
//     result: "India won by 4 wickets",
//   };

//   return (
//     <div className="mx-auto mb-4 w-full rounded-lg bg-white p-3 shadow-lg">
//       {/* Header with team flags and "vs" */}
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <span className="text-2xl">{matchData.team1.flag}</span>
//           <span className="text-lg font-bold">
//             {/* {matchData.team1.name.slice(0, 3).toUpperCase()} */}
//             {matchData.team1.name.toUpperCase()}
//           </span>
//         </div>
//         <span className="font-semibold text-gray-500">vs</span>
//         <div className="flex items-center space-x-2">
//           <span className="text-lg font-bold">
//             {/* {matchData.team2.name.slice(0, 3).toUpperCase()} */}
//             {matchData.team2.name.toUpperCase()}
//           </span>
//           <span className="text-2xl">{matchData.team2.flag}</span>
//         </div>
//       </div>

//       {/* Scores */}
//       <div className="space-y-2">
//         <div className="flex items-center justify-between">
//           <span className="font-semibold">{matchData.team1.name}</span>
//           <span className="text-lg font-bold">
//             {matchData.team1.score} ({matchData.team1.overs})
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="font-semibold">{matchData.team2.name}</span>
//           <span className="text-lg font-bold">
//             {matchData.team2.score} ({matchData.team2.overs})
//           </span>
//         </div>
//       </div>

//       {/* Result */}
//       <div className="mt-4 text-center text-sm text-gray-600">
//         {matchData.result}
//       </div>
//     </div>
//   );
// };

// export default CricketScore;

// CricketScore.jsx
import ReactCountryFlag from "react-country-flag";

const CricketScore = () => {
  const matchData = {
    team1: { name: "India", countryCode: "IN", score: "254/6", overs: "49 ov" },
    team2: {
      name: "New Zealand",
      countryCode: "NZ",
      score: "251/7",
      overs: "50 ov",
    },
    result: "India won by 4 wickets",
  };

  return (
    <div className="mx-auto mb-4 w-full rounded-lg bg-white p-3 shadow-lg">
      {/* Header with team flags and "vs" */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ReactCountryFlag
            countryCode={matchData.team1.countryCode}
            svg
            style={{ width: "24px", height: "24px" }}
            title={matchData.team1.name}
          />
          <span className="text-lg font-bold">
            {matchData.team1.name.slice(0, 3).toUpperCase()}
          </span>
        </div>
        <span className="font-semibold text-gray-500">vs</span>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">
            {matchData.team2.name.slice(0, 3).toUpperCase()}
          </span>
          <ReactCountryFlag
            countryCode={matchData.team2.countryCode}
            svg
            style={{ width: "24px", height: "24px" }}
            title={matchData.team2.name}
          />
        </div>
      </div>

      {/* Scores */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{matchData.team1.name}</span>
          <span className="text-lg font-bold">
            {matchData.team1.score} ({matchData.team1.overs})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{matchData.team2.name}</span>
          <span className="text-lg font-bold">
            {matchData.team2.score} ({matchData.team2.overs})
          </span>
        </div>
      </div>

      {/* Result */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {matchData.result}
      </div>
    </div>
  );
};

export default CricketScore;
