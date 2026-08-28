import express from 'express';
import dotenv from 'dotenv';
import {
  healthHandler,
  searchBusinessesHandler,
  analyzeLeadHandler,
} from './backendLogic';

dotenv.config();

const app = express();

app.use(express.json());

// Support both `/api/*` and direct route paths for maximum platform compatibility
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

app.post('/api/search-businesses', searchBusinessesHandler);
app.post('/search-businesses', searchBusinessesHandler);

app.post('/api/analyze-lead', analyzeLeadHandler);
app.post('/analyze-lead', analyzeLeadHandler);

export default app;
