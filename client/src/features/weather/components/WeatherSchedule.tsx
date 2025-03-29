import WeatherDayItem from "./WeatherDayItem";

const WeatherSchedule = () => {
    return (
        <div className="weather-schedule">
            <WeatherDayItem/>
            <WeatherDayItem/>
            <WeatherDayItem/>
            <WeatherDayItem/>
        </div>
    );
};

export default WeatherSchedule;