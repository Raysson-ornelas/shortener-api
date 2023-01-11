import { createHash } from 'crypto';
import cors from 'cors';
import express, { Request, Response, Router } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const route = Router();

app.use(cors());
app.use(express.json());

route.post('/shorten', async (req: Request, res: Response) => {
  const { url } = req.query;
  if (typeof url !== 'string')
    return res.status(400).send('Invalid URL');

  const shortenedURL = createHash('sha256')
    .update(url)
    .digest('hex')
    .substring(0, 10);

  const shortUrl = await prisma.urlMapping.findFirst({
    where: { shortenedURL: shortenedURL },
  });

  if (shortUrl) return res.json(shortUrl);

  const urlData: Prisma.UrlMappingCreateInput = {
    originalURL: url,
    shortenedURL: shortenedURL,
  };

  const result = await prisma.urlMapping.create({ data: urlData });
  console.log(`result ${JSON.stringify(result)}`);
  res.json(result);
});

route.get('/get', async (req: Request, res: Response) => {
  const { shortenedURL } = req.query;
  if (typeof shortenedURL !== 'string')
    return res.status(400).send('Invalid URL');

  const result = await prisma.urlMapping.findFirst({
    where: { shortenedURL: shortenedURL },
  });

  if (result) return res.json(result);

  res.status(404).json({});
});


app.use(route);
app.listen(3333, () => 'server running on port 3333');

