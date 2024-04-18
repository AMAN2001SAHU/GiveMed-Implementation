import express from 'express';
import { signupBody, signinBody } from '../type';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import donationRouter from './donations';

const router = express.Router();
const prisma = new PrismaClient();

router.use('/donation', donationRouter);

router.post('/signup', async (req, res) => {
  const body = req.body;
  const parseBody = signupBody.safeParse(body);

  if (!parseBody.success) {
    return res.status(403).json({ error: 'The inputs are invalid' });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (user) {
    return res.status(403).json({ message: 'User already existes' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        fname: body.fname,
        lname: body.lname,
        address: body.address,
      },
    });

    if (newUser) {
      const token = jwt.sign(newUser.id, JWT_SECRET);
      res.cookie('token', token);
      return res.json({ message: 'Signed Up' });
    } else {
      return res.status(404).json({ error: 'some error occured' });
    }
  } catch (e) {
    console.log(e);
    return res.status(404).json({ error: 'some error occured' });
  }
});

router.post('/signin', async (req, res) => {
  const body = req.body;
  const parseBody = signinBody.safeParse(body);

  if (!parseBody.success) {
    return res.status(403).json({ error: 'Invalid Email or Password' });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return res.status(403).json({ message: 'User does not exist' });
  }

  const token = jwt.sign(user.id, JWT_SECRET);
  res.cookie('token', token);
  return res.json({ message: 'Logged in' });
});

router.post('/logout', (req, res) => {
  res.cookie('token', null);
  return res.json({
    message: 'Log out',
  });
});

export default router;
