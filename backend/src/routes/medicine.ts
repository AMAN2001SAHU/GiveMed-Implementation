import express from 'express';
import { PrismaClient } from '@prisma/client';
import { medIdType } from '../type';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/medicine', async (req, res) => {
  const medicineData = await prisma.medicines.findMany();

  return res.json({ medicineData });
});

router.get('/medicine/:id', async (req, res) => {
  const medId = req.params.id;
  const parseParams = medIdType.safeParse(medId);

  if (!parseParams.success) {
    return res.status(403).json({
      error: 'Invalid params',
    });
  }

  try {
    const medicineData = await prisma.medicines.findUnique({
      where: {
        id: parseInt(medId),
      },
    });

    return res.json({
      medicineData,
    });
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      error: 'Some error occured while fetching the details',
    });
  }
});

export default router;
