import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import db from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Error handling
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models (use migrations in production)
    if (process.env.NODE_ENV !== 'production') {
      await db.sequelize.sync({ alter: true });
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();