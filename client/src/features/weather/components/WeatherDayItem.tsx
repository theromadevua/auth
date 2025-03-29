const WeatherDayItem = () => {
    return (
        <div className="weather-day-item">
            <h3>Today</h3>
            <img width="50px" src={require("../../../assets/weather-bg.png")}/>
            <h4>36/21</h4>
        </div>
    );
};

export default WeatherDayItem;