import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";

function WelcomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        className="card"
        sx={{
          textAlign: "center",
          padding: 3,
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Typography variant="h3" sx={{ color: "#00acc1" }} gutterBottom>
          Welcome to Weather App
        </Typography>
        <Typography variant="h5" sx={{ color: "#555", marginBottom: 3 }}>
          日本大学文理学部情報科学科 Webプログラミングの課題制作
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
    </motion.div>
  );
}

export default WelcomePage;
