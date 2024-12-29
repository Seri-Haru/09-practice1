import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { TextField, Button, Typography, Box, Card, CardMedia, CardContent, AppBar, Toolbar, CircularProgress } from "@mui/material";
import sunny1 from "./images/sunny1.jpg";
import sunny2 from "./images/sunny2.jpg";
import sunny3 from "./images/sunny3.png";
import cloudy1 from "./images/cloudy1.jpg";
import cloudy2 from "./images/cloudy2.jpg";
import cloudy3 from "./images/cloudy3.png";
import rain1 from "./images/rainy1.png";
import rain2 from "./images/rainy2.png";
import rain3 from "./images/rainy3.png";
import snowImage from "./images/snow.png";
import defaultImage from "./images/default.png";

function WelcomePage() {
  return (
    <Box sx={{ textAlign: "center", padding: 3 }}>
      <Typography variant="h3" sx={{ color: "#00acc1" }} gutterBottom>
        Welcome to Weather App
      </Typography>
      <Typography variant="h5" sx={{ color: "#555", marginBottom: 3 }}>
        日本大学文理学部情報科学科 Webプログラミングの演習課題
      </Typography>
      <Typography variant="body2" sx={{ color: "#888", marginBottom: 3 }}>
        5423017 情報科学科2年 芹沢暖人
      </Typography>
      <Link to="/weather">
        <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
          現在のお天気を調べよう
        </Button>
      </Link>
      <br />
      <Link to="/sunny-cities">
        <Button variant="contained" color="primary">
          世界中の天気を調べよう！
        </Button>
      </Link>
    </Box>
  );
}

function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);  // 数時間予報
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // ローカルストレージからもらう
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const fetchWeather = async () => {
    const API_KEY = "e430ed5512a9f874f92a367c54670265";
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("都市名が見つかりません。もう一度入力してください。");
      }
      const data = await response.json();
      setWeather(data);
      setError(""); // エラーをクリア

      // 数時間後の天気情報を取得
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();
      setForecast(forecastData.list.slice(0, 6)); // 最初の6時間分の予報を取得
    } catch (err) {
      setWeather(null);
      setForecast(null);
      setError(err.message);
    } finally {
      setLoading(false);
      // 検索履歴を保存
      const updatedHistory = [...new Set([city, ...history])];  
      setHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }
  };

  const weatherImages = {
    clear: [sunny1, sunny2, sunny3],
    clouds: [cloudy1, cloudy2, cloudy3],
    rain: [rain1, rain2, rain3],
    snow: [snowImage],
  };

  const getWeatherImage = () => {
    if (!weather) return defaultImage;
    const weatherCondition = weather.weather[0].main.toLowerCase();
    const images = weatherImages[weatherCondition] || [defaultImage];
    return images[Math.floor(Math.random() * images.length)];
  };

  return (
    <Box sx={{ padding: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        現在のお天気を調べよう！
      </Typography>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
        <TextField
          label="都市名を入力(英語)"
          variant="outlined"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" color="primary" onClick={fetchWeather}>
          検索
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {loading && <CircularProgress />}
      {weather && (
        <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
          <CardMedia component="img" image={getWeatherImage()} alt="天気画像" sx={{ height: 400 }} />
          <CardContent>
            <Typography variant="h6">{weather.name}の天気</Typography>
            <Typography>気温: {weather.main.temp}°C</Typography>
            <Typography>天候: {weather.weather[0].description}</Typography>
            <Typography>湿度: {weather.main.humidity}%</Typography>
            <Typography>風速: {weather.wind.speed} m/s</Typography>
          </CardContent>
        </Card>
      )}
      {forecast && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h5">今後の天気予報</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {forecast.map((hour, index) => (
              <Card key={index} sx={{ width: 150, padding: 2 }}>
                <Typography variant="body1">
                  時間: {new Date(hour.dt_txt).toLocaleTimeString()}
                </Typography>
                <Typography>天気: {hour.weather[0].description}</Typography>
                <Typography>気温: {hour.main.temp}°C</Typography>
              </Card>
            ))}
          </Box>
        </Box>
      )}
      <Link to="/">
        <Button variant="contained" color="secondary" sx={{ marginTop: 3 }}>
          戻る
        </Button>
      </Link>

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6">検索履歴</Typography>
        <ul>
          {history.map((historyCity, index) => (
            <li key={index}>
              {historyCity}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setCity(historyCity)}
                sx={{ marginLeft: 1 }}
              >
                再検索
              </Button>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}

function SunnyCitiesPage() {
  const [cities, setCities] = useState([]);
  const [forecastData, setForecastData] = useState({}); // 都市ごとの天気予報データ(修正済み)

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
            <Button
              variant="contained"
              color="secondary"
              onClick={() => fetchForecast(city)}
            >
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
                  <Typography variant="body1">{new Date(day.dt_txt).toLocaleDateString()}</Typography>
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

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">天気予報アプリ</Typography>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/sunny-cities" element={<SunnyCitiesPage />} />
      </Routes>
    </Router>
  );
}
