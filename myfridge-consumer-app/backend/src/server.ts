import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import config from './common/config';
import errorHandler from './api/middleware/error-handler';
import fridgesRouter from './api/controllers/fridges/router';

const app = express();

// configure MIDDLEWARE and define ROUTES

const corsOptions: CorsOptions = {
  origin: config.server.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
}

const requestSizeLimit = config.server.requestLimit;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: requestSizeLimit }));
app.use(express.text({ limit: requestSizeLimit }));
app.use(express.urlencoded({ extended: true, limit: requestSizeLimit }));

const router = express.Router();
router.use('/fridges', fridgesRouter);

app.use('/api/v1', router);
app.use(errorHandler);

// create SERVER

const server = http.createServer(app);

const port = config.server.port;
server.listen(port, () => {
  console.log(`Server started to listen on port ${port}`);
});

export default server;
