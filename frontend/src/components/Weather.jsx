// // Weather.jsx

// const Weather = () => {
//   // Sample weather data (you can replace this with props or API data)
//   const weatherData = {
//     location: "Mumbai, India",
//     temperature: 28,
//     condition: "Sunny",
//     icon: "☀️", // You can use an image or weather icon library
//   };

//   return (
//     <div className="mx-auto mb-4 w-full rounded-lg bg-white p-3 shadow-lg">
//       {/* Header with location */}
//       <div className="mb-4 text-center">
//         <h2 className="text-lg font-bold">{weatherData.location}</h2>
//       </div>

//       {/* Weather details */}
//       <div className="flex items-center justify-between">
//         <div className="text-center">
//           <span className="text-4xl">{weatherData.icon}</span>
//           <p className="text-sm text-gray-600">{weatherData.condition}</p>
//         </div>
//         <div className="text-center">
//           <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
//           <p className="text-sm text-gray-600">Temperature</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Weather;

// Weather.jsx
import ReactCountryFlag from "react-country-flag";

const Weather = () => {
  const weatherData = {
    location: "Mumbai, India",
    countryCode: "IN", // Country code for the flag
    temperature: 28,
    condition: "Sunny",
    icon: "☀️",
  };

  return (
    // <div className="mx-auto max-w-sm rounded-lg bg-white p-4 shadow-lg">
    <div className="mx-auto mb-4 w-full rounded-lg bg-white p-3 shadow-lg">
      {/* Header with location and flag */}
      <div className="mb-4 flex items-center justify-center space-x-2 text-center">
        <h2 className="text-lg font-bold">{weatherData.location}</h2>
        <ReactCountryFlag
          countryCode={weatherData.countryCode}
          svg
          style={{ width: "20px", height: "20px" }}
          title={weatherData.location.split(", ")[1]}
        />
      </div>

      {/* Weather details */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <span className="text-4xl">{weatherData.icon}</span>
          <p className="text-sm text-gray-600">{weatherData.condition}</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
          <p className="text-sm text-gray-600">Temperature</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
