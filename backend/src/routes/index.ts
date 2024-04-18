import express from 'express';
import userRouter from './user';
import medicineRouter from './medicine';
import donationRouter from './donations';

const app = express();
const router = express.Router();

router.use('/user', userRouter);
router.use('/medicine', medicineRouter);
router.use('/donation', donationRouter);

export default router;
