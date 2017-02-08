import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './config.json';

const app = express();
app.server = http.createServer(app);

// Logger for HTTP Request
app.use(morgan('combined'));

// 3rd party middleware
app.use(cors({
  exposedHeaders: config.corsHeaders,
}));

app.use(bodyParser.json({
  limit: config.bodyLimit,
}));

// internal middleware
// app.use(middleware({ config, db }));

// api router
// app.use('/api', api({ config, db }));

app.server.listen(process.env.PORT || config.port);

console.log(`Started on port ${app.server.address().port}`);

export default app;
