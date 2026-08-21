import express from 'express';
import { submitVote, getVoteResults } from '../controllers/votingController.js';

const router = express.Router();

router.post('/ballot', submitVote);
router.get('/results', getVoteResults);

export default router;
