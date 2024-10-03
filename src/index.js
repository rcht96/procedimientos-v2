const express = require('express');
const { google } = require('googleapis');
const OAuth2Data = require('./credentials.json');
const path = require('path');
const app = express();
const PORT = 3000;

// Configurar OAuth2
const oAuth2Client = new google.auth.OAuth2(
  OAuth2Data.web.client_id,
  OAuth2Data.web.client_secret,
  OAuth2Data.web.redirect_uris[0]
);

// Mapeo de direcciones de correo electrónico a ID's de carpetas
const userFolderMapping = {
  'sistemas@prescott.edu.pe': ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'noreply@prescott.edu.pe':  ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'rchinchay@prescott.edu.pe': ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'jbutron@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'fsalas@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'kandia@prescott.edu.pe' :  ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'maruhuanca@prescott.edu.pe': ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'fazalgara@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'admission@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'ccardenas@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'pcardenas@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'gcayllahue@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'adavila@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'nfernandez@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'ffranco@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'yfuentes@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'cgarciacalderon@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'wgutierrez@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'fhito@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'shuacollo@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'ehuaman@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'ihurtado@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'aibanez@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'cmartinez@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'bmedina@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'fmendoza@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'kmendoza@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'amoscoso@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'sneyra@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'kpari@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'eportugal@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'iquispe@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'hramos@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'angelicarondon@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'jserrano@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'ytaco@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'lvalle@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'lvelasquezo@prescott.edu.pe': ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'myanque@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'myepez@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  'azegarra@prescott.edu.pe' : ['1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz','1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar','1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv','1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw','14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK'],
  // Agregar más usuarios y sus carpetas correspondientes aquí
};

// Servir archivos estáticos (para el frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Ruta de autenticación
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
  res.redirect(authUrl);
});

// Callback de autenticación
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
  const { data } = await oauth2.userinfo.get();
  const email = data.email;
  
  const folderId = userFolderMapping[email] || 'DEFAULT_FOLDER_ID'; // Carpeta por defecto

  // Redirigir a la vista de archivos con el folderId
  res.redirect(`/view-files?folderId=${folderId}`);
});

// Página para visualizar archivos
app.get('/view-files', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/view-files.html'));
});

// Ruta para obtener archivos (recursiva)
app.get('/files', async (req, res) => {
  const { folderId } = req.query;
  if (!folderId) {
    res.status(400).json({ error: 'Folder ID is required' });
    return;
  }

  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  
  try {
    const files = await listFilesRecursively(drive, folderId); // Función recursiva
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Función recursiva para listar archivos y subcarpetas
const listFilesRecursively = async (drive, folderId) => {
  const allFiles = [];

  const getFiles = async (folderId) => {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType)',
    });

    const files = res.data.files;

    for (let file of files) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        // Si es una carpeta, hacemos la búsqueda recursiva
        const subFolderFiles = await getFiles(file.id);
        allFiles.push(...subFolderFiles);
      } else {
        // Si es un archivo, lo agregamos a la lista
        allFiles.push(file);
      }
    }
  };

  await getFiles(folderId); // Iniciar con la carpeta raíz
  return allFiles; // Retornar todos los archivos, incluidos los de las subcarpetas
};




// Ruta para desloguear
app.get('/logout', (req, res) => {
  oAuth2Client.revokeCredentials((err) => {
    if (err) {
      console.error('Failed to revoke credentials:', err);
      res.status(500).send('Failed to revoke credentials');
      return;
    }
    res.redirect('/'); // Redirigir a la página de inicio
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
