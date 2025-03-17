import { useQuery } from "@tanstack/react-query";
import ReactCountryFlag from "react-country-flag";
import { useState, useEffect } from "react";
import axios from "axios";

const fetchWeatherData = async ({ queryKey }) => {
  const [, { lat, lon, ip }] = queryKey;
  const response = await axios.get("/api/news/weather", {
    params: { lat, lon, ip },
  });
  return response.data;
};

const Weather = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Get user's IP for backend fallback
  const getClientIP = async () => {
    try {
      const res = await axios.get("https://api.ipify.org?format=json");
      return res.data.ip;
    } catch (err) {
      console.error("Error fetching IP:", err);
      return null;
    }
  };

  useEffect(() => {
    const getInitialLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          async (err) => {
            console.warn("Geolocation denied:", err);
            setError("Location access denied. Using approximate location.");
            const ip = await getClientIP();
            setLocation({ ip });
          },
          {
            timeout: 10000,
            maximumAge: 600000,
            enableHighAccuracy: false,
          },
        );
      } else {
        getClientIP().then((ip) => setLocation({ ip }));
      }
    };
    getInitialLocation();
  }, []);

  const { data: weatherData, isLoading } = useQuery({
    queryKey: ["weather", location],
    queryFn: fetchWeatherData,
    enabled: !!location,
    retry: 1,
    staleTime: 600000, // 10 minutes
  });

  const getUVIndexStatus = (uv) => {
    if (uv < 0) {
      return { text: "Invalid", color: "bg-gray-500", range: "N/A" };
    } else if (uv === 0) {
      return { text: "Night / No UV", color: "bg-gray-700", range: "0" }; // Gray for night
    } else if (uv <= 2) {
      return { text: "Low", color: "bg-green-500", range: "0-2" };
    } else if (uv <= 5) {
      return { text: "Moderate", color: "bg-yellow-500", range: "3-5" };
    } else if (uv <= 7) {
      return { text: "High", color: "bg-orange-500", range: "6-7" };
    } else if (uv <= 10) {
      return { text: "Very High", color: "bg-red-500", range: "8-10" };
    } else {
      return { text: "Extreme", color: "bg-purple-600", range: "11+" };
    }
  };

  // Existing getAirQualityStatus function (unchanged)
  const getAirQualityStatus = (index) => {
    const statuses = {
      1: { text: "Good", color: "text-green-600" },
      2: { text: "Moderate", color: "text-yellow-500" },
      3: { text: "Unhealthy for sensitive groups", color: "text-orange-500" },
      4: { text: "Unhealthy", color: "text-red-500" },
      5: { text: "Very Unhealthy", color: "text-purple-600" },
      6: { text: "Hazardous", color: "text-red-800" },
    };
    return statuses[index] || { text: "Unknown", color: "text-gray-500" };
  };

  if (isLoading || !location) {
    return (
      <div className="mx-auto mb-4 flex min-h-60 w-full flex-col justify-center rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-center justify-center">
          <p className="text-gray-500">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="mx-auto mb-4 flex min-h-60 w-full flex-col justify-center rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-center justify-center">
          <p className="text-red-500">
            {error || "Unable to fetch weather data"}
          </p>
        </div>
      </div>
    );
  }

  const { location: loc, current, air_quality } = weatherData;
  const airQualityStatus = getAirQualityStatus(air_quality.usEpaIndex);

  return (
    <div className="mx-auto mb-4 flex min-h-60 w-full flex-col justify-center rounded-lg bg-white p-4 shadow-lg">
      {error && (
        <div className="mb-2 rounded-md bg-yellow-50 p-2">
          <p className="text-xs text-yellow-700">{error}</p>
        </div>
      )}
      {/* Header with location and time */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold">
            {loc.name}, {loc.country}
          </h2>
          {/* <img
            src={`https://flagcdn.com/w80/${loc.countryCode?.toLowerCase()}.png`}
            // src={`https://flagcdn.com/16x12/${loc.countryCode?.toLowerCase()}.webp`}
            alt={loc.country}
            className="h-4 w-6"
            /> */}
          <ReactCountryFlag
            countryCode={loc.countryCode}
            svg
            style={{ width: "24px", height: "24px" }}
            title={loc.countryCode}
          />
        </div>
        <p className="text-xs text-gray-500">{loc.localtime}</p>
      </div>
      {/* Main weather info */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center">
          <img
            src={current.icon}
            alt={current.condition}
            className="h-16 w-16"
          />
          <div className="ml-2">
            <p className="text-xl font-bold">{current.temp_c}°C</p>
            <p className="text-sm text-gray-600">{current.condition}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm">Feels like: {current.feelslike_c}°C</p>
          <p className="text-sm">
            {current.wind_kph} km/h {current.wind_dir}
          </p>
          <p className="text-sm">Humidity: {current.humidity}%</p>
        </div>
      </div>
      {/* Air quality section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Air Quality</p>
          <p className={`text-sm ${airQualityStatus.color}`}>
            {airQualityStatus.text}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm">
            PM2.5: {Math.round(air_quality.pm2_5)} μg/m³
          </p>
          <p className="text-sm">PM10: {Math.round(air_quality.pm10)} μg/m³</p>
        </div>
      </div>
      {/* UV index */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium">UV Index:</span>
          {current.uv === 0 ? (
            <div className="flex h-2 w-24 items-center justify-center rounded-full bg-gray-200">
              <span className="text-xs text-gray-600">Night</span>
            </div>
          ) : (
            <div className="flex h-2 w-24 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full ${getUVIndexStatus(current.uv).color}`}
                style={{
                  width: `${Math.min((current.uv / 12) * 100, 100)}%`, // Scale UV to 12 max for the bar
                }}
              ></div>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs">
            {current.uv} ({getUVIndexStatus(current.uv).text})
          </p>
        </div>
      </div>
    </div>
  );
};

export default Weather;

// import { useState, useEffect } from "react";
// import axios from "axios";

// const Weather = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchWeather = async (lat, lon) => {
//       try {
//         // Request weather from backend using provided coordinates
//         const weatherRes = await axios.get(
//           `/api/news/weather?lat=${lat}&lon=${lon}`,
//         );
//         setWeatherData(weatherRes.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching weather:", err);
//         setError("Unable to fetch weather data");
//         setLoading(false);
//       }
//     };

//     const fetchWeatherByIP = async () => {
//       try {
//         // Fallback to IP-based location
//         const locationRes = await axios.get("https://ipapi.co/json/");
//         const { latitude, longitude } = locationRes.data;
//         await fetchWeather(latitude, longitude);
//       } catch (err) {
//         console.error("Error fetching location by IP:", err);
//         setError("Unable to determine your location");
//         setLoading(false);
//       }
//     };

//     // Use browser's geolocation API if available
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         // Success callback
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           fetchWeather(latitude, longitude);
//         },
//         // Error callback
//         (err) => {
//           console.warn("Geolocation permission denied:", err);
//           setError(
//             "Location access denied. Using approximate location instead.",
//           );
//           // Fall back to IP-based geolocation
//           fetchWeatherByIP();
//         },
//         // Options
//         {
//           timeout: 10000, // 10 seconds
//           maximumAge: 600000, // 10 minutes
//           enableHighAccuracy: false,
//         },
//       );
//     } else {
//       // Browser doesn't support geolocation
//       console.warn("Geolocation not supported by this browser");
//       fetchWeatherByIP();
//     }
//   }, []);

//   // Get appropriate air quality status
//   const getAirQualityStatus = (index) => {
//     const statuses = {
//       1: { text: "Good", color: "text-green-600" },
//       2: { text: "Moderate", color: "text-yellow-500" },
//       3: { text: "Unhealthy for sensitive groups", color: "text-orange-500" },
//       4: { text: "Unhealthy", color: "text-red-500" },
//       5: { text: "Very Unhealthy", color: "text-purple-600" },
//       6: { text: "Hazardous", color: "text-red-800" },
//     };
//     return statuses[index] || { text: "Unknown", color: "text-gray-500" };
//   };

//   if (loading) {
//     return (
//       <div className="mx-auto w-full rounded-lg bg-white p-4 shadow-lg">
//         <div className="flex h-32 items-center justify-center">
//           <p className="text-gray-500">Loading weather data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !weatherData) {
//     return (
//       <div className="mx-auto mb-3 w-full rounded-lg bg-white p-4 shadow-lg">
//         <div className="flex h-32 items-center justify-center">
//           <p className="text-red-500">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   // If we have an error message but also weather data, show the data with a warning
//   const showWarning = error && weatherData;

//   // Extract the weather data if available
//   if (!weatherData) return null;

//   const { location, current, air_quality } = weatherData;
//   const airQualityStatus = getAirQualityStatus(air_quality.usEpaIndex);

//   return (
//     <div className="mx-auto w-full rounded-lg bg-white p-4 shadow-lg">
//       {/* Location permission warning if applicable */}
//       {showWarning && (
//         <div className="mb-2 rounded-md bg-yellow-50 p-2">
//           <p className="text-xs text-yellow-700">{error}</p>
//         </div>
//       )}

//       {/* Header with location and time */}
//       <div className="mb-2 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <h2 className="text-lg font-bold">
//             {location.name}, {location.country}
//           </h2>
//           <img
//             src={`https://flagcdn.com/w20/${location.countryCode.toLowerCase()}.png`}
//             alt={location.country}
//             className="h-4 w-6"
//           />
//         </div>
//         <p className="text-xs text-gray-500">{location.localtime}</p>
//       </div>

//       {/* Main weather info */}
//       <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
//         <div className="flex items-center">
//           <img
//             src={current.icon}
//             alt={current.condition}
//             className="h-16 w-16"
//           />
//           <div className="ml-2">
//             <p className="text-3xl font-bold">{current.temp_c}°C</p>
//             <p className="text-sm text-gray-600">{current.condition}</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-sm">Feels like: {current.feelslike_c}°C</p>
//           <p className="text-sm">
//             {current.wind_kph} km/h {current.wind_dir}
//           </p>
//           <p className="text-sm">Humidity: {current.humidity}%</p>
//         </div>
//       </div>

//       {/* Air quality section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium">Air Quality</p>
//           <p className={`text-sm ${airQualityStatus.color}`}>
//             {airQualityStatus.text}
//           </p>
//         </div>
//         <div className="text-right">
//           <p className="text-sm">
//             PM2.5: {Math.round(air_quality.pm2_5)} μg/m³
//           </p>
//           <p className="text-sm">PM10: {Math.round(air_quality.pm10)} μg/m³</p>
//         </div>
//       </div>

//       {/* UV index */}
//       <div className="mt-2 flex items-center">
//         <span className="mr-2 text-sm font-medium">UV Index:</span>
//         <div className="flex h-2 w-24 overflow-hidden rounded-full bg-gray-200">
//           <div
//             className={`h-full ${
//               current.uv <= 2
//                 ? "bg-green-500"
//                 : current.uv <= 5
//                   ? "bg-yellow-500"
//                   : current.uv <= 7
//                     ? "bg-orange-500"
//                     : current.uv <= 10
//                       ? "bg-red-500"
//                       : "bg-purple-600"
//             }`}
//             style={{ width: `${Math.min(current.uv * 10, 100)}%` }}
//           ></div>
//         </div>
//         <span className="ml-2 text-xs">{current.uv}</span>
//       </div>
//     </div>
//   );
// };

// export default Weather;

// // import { useState, useEffect } from "react";
// // import axios from "axios";

// // const Weather = () => {
// //   const [weatherData, setWeatherData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchWeather = async () => {
// //       try {
// //         // First get user location
// //         const locationRes = await axios.get("https://ipapi.co/json/");
// //         const { latitude, longitude } = locationRes.data;
// //         console.log(locationRes);

// //         // Then request weather from YOUR backend
// //         const weatherRes = await axios.get(
// //           `/api/news/weather?lat=${latitude}&lon=${longitude}`,
// //         );
// //         setWeatherData(weatherRes.data);
// //         setLoading(false);
// //       } catch (err) {
// //         console.error("Error fetching weather:", err);
// //         setError("Unable to fetch weather data");
// //         setLoading(false);
// //       }
// //     };

// //     fetchWeather();
// //   }, []);

// //   // Get appropriate air quality status
// //   const getAirQualityStatus = (index) => {
// //     const statuses = {
// //       1: { text: "Good", color: "text-green-600" },
// //       2: { text: "Moderate", color: "text-yellow-500" },
// //       3: { text: "Unhealthy for sensitive groups", color: "text-orange-500" },
// //       4: { text: "Unhealthy", color: "text-red-500" },
// //       5: { text: "Very Unhealthy", color: "text-purple-600" },
// //       6: { text: "Hazardous", color: "text-red-800" },
// //     };
// //     return statuses[index] || { text: "Unknown", color: "text-gray-500" };
// //   };

// //   if (loading) {
// //     return (
// //       <div className="mx-auto mb-3 w-full rounded-lg bg-white p-4 shadow-lg">
// //         <div className="flex h-32 items-center justify-center">
// //           <p className="text-gray-500">Loading weather data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="mx-auto mb-3 w-full rounded-lg bg-white p-4 shadow-lg">
// //         <div className="flex h-32 items-center justify-center">
// //           <p className="text-red-500">{error}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Extract the weather data
// //   const { location, current, air_quality } = weatherData;
// //   const airQualityStatus = getAirQualityStatus(air_quality.usEpaIndex);

// //   return (
// //     <div className="mx-auto mb-3 w-full rounded-lg bg-white p-4 shadow-lg">
// //       {/* Header with location and time */}
// //       <div className="mb-2 flex items-center justify-between">
// //         <div className="flex items-center space-x-2">
// //           <h2 className="text-lg font-bold">
// //             {location.name}, {location.country}
// //           </h2>
// //           <img
// //             src={`https://flagcdn.com/w20/${location.countryCode.toLowerCase()}.png`}
// //             alt={location.country}
// //             className="h-4 w-6"
// //           />
// //         </div>
// //         <p className="text-xs text-gray-500">{location.localtime}</p>
// //       </div>

// //       {/* Main weather info */}
// //       <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
// //         <div className="flex items-center">
// //           <img
// //             src={current.icon}
// //             alt={current.condition}
// //             className="h-16 w-16"
// //           />
// //           <div className="ml-2">
// //             <p className="text-3xl font-bold">{current.temp_c}°C</p>
// //             <p className="text-sm text-gray-600">{current.condition}</p>
// //           </div>
// //         </div>
// //         <div className="text-right">
// //           <p className="text-sm">Feels like: {current.feelslike_c}°C</p>
// //           <p className="text-sm">
// //             {current.wind_kph} km/h {current.wind_dir}
// //           </p>
// //           <p className="text-sm">Humidity: {current.humidity}%</p>
// //         </div>
// //       </div>

// //       {/* Air quality section */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-sm font-medium">Air Quality</p>
// //           <p className={`text-sm ${airQualityStatus.color}`}>
// //             {airQualityStatus.text}
// //           </p>
// //         </div>
// //         <div className="text-right">
// //           <p className="text-sm">
// //             PM2.5: {Math.round(air_quality.pm2_5)} μg/m³
// //           </p>
// //           <p className="text-sm">PM10: {Math.round(air_quality.pm10)} μg/m³</p>
// //         </div>
// //       </div>

// //       {/* UV index */}
// //       <div className="mt-2 flex items-center">
// //         <span className="mr-2 text-sm font-medium">UV Index:</span>
// //         <div className="flex h-2 w-24 overflow-hidden rounded-full bg-gray-200">
// //           <div
// //             className={`h-full ${
// //               current.uv <= 2
// //                 ? "bg-green-500"
// //                 : current.uv <= 5
// //                   ? "bg-yellow-500"
// //                   : current.uv <= 7
// //                     ? "bg-orange-500"
// //                     : current.uv <= 10
// //                       ? "bg-red-500"
// //                       : "bg-purple-600"
// //             }`}
// //             style={{ width: `${Math.min(current.uv * 10, 100)}%` }}
// //           ></div>
// //         </div>
// //         <span className="ml-2 text-xs">{current.uv}</span>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Weather;

// // // import ReactCountryFlag from "react-country-flag";
// // // import { useEffect, useState } from "react";

// // // const Weather = ({ weatherData }) => {
// // //   const [weather, setWeather] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     if (weatherData) {
// // //       setWeather({
// // //         city: weatherData.location.city,
// // //         country: weatherData.location.country,
// // //         countryCode: getCountryCode(weatherData.location.country),
// // //         temperature: Math.round(weatherData.data.current.temp_c),
// // //         condition: weatherData.data.current.condition.text,
// // //         icon: weatherData.data.current.condition.icon,
// // //       });
// // //       setLoading(false);
// // //     }
// // //   }, [weatherData]);

// // //   // Helper function to get ISO country code from country name
// // //   const getCountryCode = (countryName) => {
// // //     // This is a simplified mapping - in production you might want a more complete solution
// // //     const countryCodes = {
// // //       "United States": "US",
// // //       India: "IN",
// // //       "United Kingdom": "GB",
// // //       // Add more as needed or use a library
// // //     };

// // //     return countryCodes[countryName] || "UN"; // UN as fallback
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="mx-auto mb-4 w-full rounded-lg bg-white p-3 shadow-lg">
// // //         <p className="text-center text-gray-500">Loading weather...</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="mx-auto mb-4 w-full rounded-lg bg-white p-3 shadow-lg">
// // //       {/* Header with location and flag */}
// // //       <div className="mb-4 flex items-center justify-center space-x-2 text-center">
// // //         <h2 className="text-lg font-bold">{`${weather.city}, ${weather.country}`}</h2>
// // //         <ReactCountryFlag
// // //           countryCode={weather.countryCode}
// // //           svg
// // //           style={{ width: "20px", height: "20px" }}
// // //           title={weather.country}
// // //         />
// // //       </div>

// // //       {/* Weather details */}
// // //       <div className="flex items-center justify-between">
// // //         <div className="text-center">
// // //           {weather.icon ? (
// // //             <img
// // //               src={weather.icon}
// // //               alt={weather.condition}
// // //               className="mx-auto h-10 w-10"
// // //             />
// // //           ) : (
// // //             <span className="text-4xl">☀️</span>
// // //           )}
// // //           <p className="text-sm text-gray-600">{weather.condition}</p>
// // //         </div>
// // //         <div className="text-center">
// // //           <p className="text-3xl font-bold">{weather.temperature}°C</p>
// // //           <p className="text-sm text-gray-600">Temperature</p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Weather;

// // // // import ReactCountryFlag from "react-country-flag";

// // // // const Weather = () => {
// // // //   const weatherData = {
// // // //     location: "Mumbai, India",
// // // //     countryCode: "IN", // Country code for the flag
// // // //     temperature: 28,
// // // //     condition: "Sunny",
// // // //     icon: "☀️",
// // // //   };

// // // //   return (
// // // //     // <div className="mx-auto max-w-sm rounded-lg bg-white p-4 shadow-lg">
// // // //     <div className="mx-auto mb-4 w-full rounded-lg bg-white p-3 shadow-lg">
// // // //       {/* Header with location and flag */}
// // // //       <div className="mb-4 flex items-center justify-center space-x-2 text-center">
// // // //         <h2 className="text-lg font-bold">{weatherData.location}</h2>
// // // //         <ReactCountryFlag
// // // //           countryCode={weatherData.countryCode}
// // // //           svg
// // // //           style={{ width: "20px", height: "20px" }}
// // // //           title={weatherData.location.split(", ")[1]}
// // // //         />
// // // //       </div>

// // // //       {/* Weather details */}
// // // //       <div className="flex items-center justify-between">
// // // //         <div className="text-center">
// // // //           <span className="text-4xl">{weatherData.icon}</span>
// // // //           <p className="text-sm text-gray-600">{weatherData.condition}</p>
// // // //         </div>
// // // //         <div className="text-center">
// // // //           <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
// // // //           <p className="text-sm text-gray-600">Temperature</p>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Weather;
