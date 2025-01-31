import React, { useState } from "react";
import { Box, Typography, Button, Card } from "@mui/material";

function SunnyCitiesPage() {
  const [cities, setCities] = useState([]);
  const [forecastData, setForecastData] = useState({}); // 都市ごとの天気予報データ

  const API_KEY = "e430ed5512a9f874f92a367c54670265";

  // 都市を選択
  const getSunnyCities = () => {
    const sunnyCities = ["Tokyo", "Los Angeles", "New York", "Dubai", "Sydney"];
    const randomCities = [];
    while (randomCities.length < 2) {
      const city = sunnyCities[Math.floor(Math.random() * sunnyCities.length)];
      if (!randomCities.includes(city)) randomCities.push(city);
    }
    setCities(randomCities);
  };

  // 5日間の天気予報を取得
  const fetchForecast = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      const dailyData = data.list.filter((entry) => entry.dt_txt.includes("12:00:00"));

      setForecastData((prevData) => ({
        ...prevData,
        [city]: dailyData,
      }));
    } catch (err) {
      console.error("Error fetching forecast:", err);
    }
  };

  return (
    <Box sx={{ padding: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        主要都市の天気予報を確認しよう！
      </Typography>
      <Button variant="contained" color="primary" onClick={getSunnyCities} sx={{ marginBottom: 3 }}>
        都市をランダムで選択
      </Button>
      <ul>
        {cities.map((city, index) => (
          <li key={index}>
            {city}{" "}
            <Button variant="contained" color="secondary" onClick={() => fetchForecast(city)}>
              5日間の天気を見る
            </Button>
          </li>
        ))}
      </ul>
      <Box sx={{ marginTop: 3 }}>
        {Object.keys(forecastData).map((city, index) => (
          <Box key={index} sx={{ marginBottom: 3 }}>
            <Typography variant="h5">{city}の5日間の天気予報</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {forecastData[city].map((day, idx) => (
                <Card key={idx} sx={{ width: 200, padding: 2 }}>
                  <Typography variant="body1">
                    {new Date(day.dt_txt).toLocaleDateString()}
                  </Typography>
                  <Typography>天気: {day.weather[0].description}</Typography>
                  <Typography>気温: {day.main.temp}°C</Typography>
                </Card>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default SunnyCitiesPage;
