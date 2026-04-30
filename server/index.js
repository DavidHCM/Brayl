require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { toBraille } = require('./utils/braille');
const { extractText } = require('./utils/fileParser');

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

if (!isProd) {
  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
}

app.use(express.json({ limit: '1mb' }));

app.post('/api/translate', (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    return res.status(400).json({ error: 'El campo texto es requerido' });
  }
  if (text.length > 5000) {
    return res.status(400).json({ error: 'El texto no puede exceder 5000 caracteres' });
  }
  res.json({ braille: toBraille(text) });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere un archivo' });
    }
    const { originalname, buffer } = req.file;
    const text = await extractText(buffer, originalname);
    if (!text?.trim()) {
      return res.status(422).json({ error: 'No se pudo extraer texto del archivo' });
    }
    res.json({ filename: originalname, originalText: text, braille: toBraille(text) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (isProd) {
  const distDir = path.join(__dirname, '../client/dist');
  app.use(express.static(distDir));
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Brayl server corriendo en http://localhost:${PORT} [${isProd ? 'production' : 'development'}]`);
});
