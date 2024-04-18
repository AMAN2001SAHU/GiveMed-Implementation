import express from 'express';
import { donationBody } from '../type';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/user/donation', async (req, res) => {
  const body = req.body;
  const token = req.cookies.token;

  const { success } = donationBody.safeParse(body);

  if (!success) {
    return res.status(403).json({ error: 'Invalid Inputs' });
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  await prisma.donation.create({
    data: {
      name: body.name,
      dose: body.does,
      quantity: body.quantity,
      mfgDate: body.mfgDate,
      expDate: body.expDate,
      donator: decoded.id,
    },
  });

  return res.json({
    message: 'Donation created successfully',
  });
});

router.post('/user/donation/:id', async (req, res) => {
  try {
    const donationId = req.params.id;

    const donation = await prisma.donation.findUnique({
      where: {
        id: parseInt(donationId),
      },
    });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const medicines = await prisma.medicines.findMany({
      where: {
        name: {
          contains: donation.name,
        },
      },
    });

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json({ medicines });
  } catch (e) {
    console.error('Error: ', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
