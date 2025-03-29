import React, { useEffect, useState } from "react";
import DegreesBar from "./DegreesBar";
import WeatherWidget from "./WeatherWidget";
import WeatherIcon from "./WeatherIcon";
import WeatherSchedule from "./WeatherSchedule";

const Weather = () => {
    const [location, setLocation] = useState<{ city: string; error?: string }>({ city: "" });

    // useEffect(() => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             async (position) => {
    //                 const { latitude, longitude } = position.coords;

    //                 const apiKey = "f30fd747cac8e51a98b53b111628a6bc";
    //                 const response = await fetch(
    //                     `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
    //                 );
    //                 const data = await response.json();

    //                 if (data && data.length > 0) {
    //                     console.log(data);
    //                     setLocation({ city: data[0].name });
    //                 }
    //             },
    //             (error) => {
    //                 setLocation({ city: "", error: error.message });
    //             }
    //         );
    //     } else {
    //         setLocation({ city: "", error: "Geolocation is not supported by this browser." });
    //     }
    // }, []);

    return (
        <div className="weather-container">
            {/* {location.error ? (
            <p>Error: {location.error}</p>
            ) : location.city ? (
            <p>City: {location.city}</p>
            ) : (
            <p>Loading location...</p>
            )} */}

            <div className="weather-container__header">
                <WeatherWidget/>
                <WeatherIcon/>
                <WeatherSchedule/>
            </div>
            <DegreesBar data={Array.from({length: 24}, (_, i) => ({temperature: Math.floor(Math.random() * 20), time: `${i}:00`}))}/>
            
        </div>
    );
};

export default Weather;