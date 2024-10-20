import express from 'express';
import { getTrendingMovies } from '../controllers/movie.controller.js';

const router = express.Router();

router.get("/trending", getTrendingMovies);
router.get("/popular", getPopularMovies);


export default router;  