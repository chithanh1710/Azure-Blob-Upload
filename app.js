// app.js
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const imageRoute = require("./routes/imageRoute"); // Import route upload

const app = express();
const port = process.env.PORT || 3000;

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./routes/*.js"], // Đường dẫn tới các tệp route của bạn
};

// Tạo swaggerSpec
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Sử dụng swagger-ui-express để tạo giao diện Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sử dụng route upload
app.use("/image", imageRoute); // Thêm dòng này để sử dụng route

// Chạy server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/api-docs`);
});
