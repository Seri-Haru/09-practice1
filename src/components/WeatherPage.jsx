import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardMedia, CardContent, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import sunny1 from "../images/sunny1.jpg";
import sunny2 from "../images/sunny2.jpg";
import sunny3 from "../images/sunny3.png";
import cloudy1 from "../images/cloudy1.jpg";
import cloudy2 from "../images/cloudy2.jpg";
import cloudy3 from "../images/cloudy3.png";
import rain1 from "../images/rainy1.png";
import rain2 from "../images/rainy2.png";
import rain3 from "../images/rainy3.png";
import snowImage from "../images/snow.png";
import defaultImage from "../images/default.png";

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
        <Card className="card" sx={{ maxWidth: 600, margin: "0 auto" }}>
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

export default WeatherPage;
