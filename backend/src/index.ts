import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { CreateSketchVersionUseCase } from './application/use-cases/CreateSketchVersion';
import { DeleteSketchVersionUseCase } from './application/use-cases/DeleteSketchVersion';
import { GenerateAccessTokenUseCase } from './application/use-cases/GenerateAccessToken';
import { GetAllSketchVersionsUseCase } from './application/use-cases/GetAllSketchVersions';
import { GetSketchVersionUseCase } from './application/use-cases/GetSketchVersion';
import { UpdateSketchVersionUseCase } from './application/use-cases/UpdateSketchVersion';
import { ValidateAccessTokenUseCase } from './application/use-cases/ValidateAccessToken';
import { Database } from './infrastructure/database/Database';
import { PostgresSketchRepository } from './infrastructure/repositories/PostgresSketchRepository';
import { PostgresUserRepository } from './infrastructure/repositories/PostgresUserRepository';
import { JwtService } from './infrastructure/services/JwtService';
import { AuthController } from './interfaces/controllers/AuthController';
import { SketchController } from './interfaces/controllers/SketchController';
import { AuthMiddleware } from './interfaces/middleware/AuthMiddleware';
import { ErrorHandler } from './interfaces/middleware/ErrorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

const database = new Database();

const sketchRepository = new PostgresSketchRepository(database);
const userRepository = new PostgresUserRepository(database);

const jwtService = new JwtService();

const createSketchVersionUseCase = new CreateSketchVersionUseCase(sketchRepository);
const getSketchVersionUseCase = new GetSketchVersionUseCase(sketchRepository);
const getAllSketchVersionsUseCase = new GetAllSketchVersionsUseCase(sketchRepository);
const updateSketchVersionUseCase = new UpdateSketchVersionUseCase(sketchRepository);
const deleteSketchVersionUseCase = new DeleteSketchVersionUseCase(sketchRepository);

const generateAccessTokenUseCase = new GenerateAccessTokenUseCase(userRepository, jwtService);
const validateAccessTokenUseCase = new ValidateAccessTokenUseCase(userRepository, jwtService);

const sketchController = new SketchController(
  createSketchVersionUseCase,
  getSketchVersionUseCase,
  getAllSketchVersionsUseCase,
  deleteSketchVersionUseCase,
  updateSketchVersionUseCase,
);

const authController = new AuthController(
  generateAccessTokenUseCase,
  validateAccessTokenUseCase,
);

const authMiddleware = new AuthMiddleware(userRepository, jwtService);

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/auth/generate', (req, res) => {
  authController.generateToken(req, res);
});

app.get('/api/auth/validate', (req, res) => {
  authController.validateToken(req, res);
});

app.post('/api/sketches', (req, res, next) => {
  authMiddleware.authenticate(req, res, next);
}, (req, res) => {
  sketchController.createSketchVersion(req, res);
});

app.get('/api/sketches', (req, res, next) => {
  authMiddleware.authenticate(req, res, next);
}, (req, res) => {
  sketchController.getAllSketchVersions(req, res);
});

app.get('/api/sketches/:id', (req, res, next) => {
  authMiddleware.authenticate(req, res, next);
}, (req, res) => {
  sketchController.getSketchVersion(req, res);
});

app.put('/api/sketches/:id', (req, res, next) => {
  authMiddleware.authenticate(req, res, next);
}, (req, res) => {
  sketchController.updateSketchVersion(req, res);
});

app.delete('/api/sketches/:id', (req, res, next) => {
  authMiddleware.authenticate(req, res, next);
}, (req, res) => {
  sketchController.deleteSketchVersion(req, res);
});

app.use(ErrorHandler.handle);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  database.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  database.close();
  process.exit(0);
});