require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const ApiError = require('./errors/ApiError');
const errorHandler = require('./middlewares/errorHandler');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use((req, res, next) => {
  next(ApiError.notFound('Маршрут не знайдено'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));