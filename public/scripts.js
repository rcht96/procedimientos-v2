let allFiles = [];

let folderIcons = {
  '1bpMRgHWIP2OLZY-In8eD_BYpbt4eVuY-': 'imagenes/ordenador.png',
  '1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw': 'imagenes/presupuesto.png',
  '1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv': 'imagenes/desarrollo-humano.png',
  '1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz': 'imagenes/salud_seguridad.png',
  '1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar': 'imagenes/logistica_mantenimiento.png',
  '14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK': 'imagenes/ordenador.png',

  // Añade más IDs de carpetas y sus íconos correspondientes aquí
};

// Obtén los nombres de las carpetas para mostrarlas en el filtro
let folderNames = {
  '1bpMRgHWIP2OLZY-In8eD_BYpbt4eVuY-': 'Todos',
  '14uqxuHGF82du4fI9ZTonXu9BM-y1jAXK': 'Sistemas',
  '1bsb5hmrWIr48LcOPCuqwy5Vfpm2sR3Bz': 'Salud y Seguridad',
  '1g58DX2KsR5sNpP94JrEzMiZPxc5TO7ar': 'Logística y Mantenimiento',
  '1vKyg8GvqpQdcQRdoDNyWZl4g9RA5CjWw': 'Finanzas',
  '1epv0sRvKuMiS-wWRv0mwqHWFpG2I98iv': 'Desarrollo Humano',
    // Agrega más nombres si es necesario
};

// Inicializa el filtro al cargar la página
function initializeFilter() {
  const folderFilter = document.getElementById('folder-filter');
  
  // Agregar las opciones de carpetas al filtro
  for (const folderId in folderNames) {
    const option = document.createElement('option');
    option.value = folderId;
    option.text = folderNames[folderId];
    folderFilter.appendChild(option);
  }
}


function getFolderId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('folderId').split(','); // Devuelve un array de IDs de carpetas
}

async function getFiles() {
  const folderIds = getFolderId();
  if (!folderIds) {
    console.error('Folder ID not found.');
    return;
  }

  let files = [];
  for (const folderID of folderIds) {
    try {
      const response = await fetch(`/files?folderId=${folderID}`);
      if (!response.ok) {
        console.error('Failed to fetch files:', response.statusText);
        continue; // Continuar con las demás carpetas aunque una falle
      }
      const folderFiles = await response.json();
      // Agregar los archivos de cada carpeta al array, incluyendo el folderID
      files = files.concat(folderFiles.map(file => ({ ...file, folderId: folderID })));
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }

  allFiles = files;
  displayFiles(files); // Mostrar todos los archivos obtenidos
}

function displayFiles(files) {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = ''; // Limpiar el listado de archivos

  files.forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.classList.add('file-item');
    fileItem.onclick = () => previewFile(file.id);

    const fileIcon = document.createElement('img');
    fileIcon.src = getFileIcon(file.folderId, file.mimeType); // Obtén el ícono adecuado
    fileIcon.classList.add('file-icon'); // Asegúrate de que el ícono tenga un estilo adecuado

    const fileName = document.createElement('div');
    fileName.classList.add('file-name');
    fileName.innerText = file.name;
    fileName.setAttribute('title', file.name);

    fileItem.appendChild(fileIcon);
    fileItem.appendChild(fileName);
    fileList.appendChild(fileItem);
  });
}

// Función para obtener el ícono adecuado según el ID de la carpeta o tipo de archivo
function getFileIcon(folderId, mimeType) {
  // Si la carpeta tiene un ícono personalizado, usarlo
  if (folderIcons[folderId]) {
    return folderIcons[folderId];
  }

  // Si no hay un ícono para la carpeta, usar uno por defecto según el tipo de archivo
  if (mimeType === 'application/pdf') {
    return 'imagenes/pdf_icon.png'; // Ícono de PDF
  }
  
  return 'imagenes/file_icon.png'; // Ícono por defecto
}

function previewFile(fileId) {
  const popup = document.getElementById('popup');
  const popupIframe = document.getElementById('popup-preview');

   // Establecer la URL de la previsualización
   popupIframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
    
   // Mostrar el pop-up
   popup.style.display = 'flex';
   // Cierra la previsualización del pop-up
function closePopup() {
  const popup = document.getElementById('popup');
  const popupIframe = document.getElementById('popup-preview');
  
  // Ocultar el pop-up y limpiar la URL del iframe
  popup.style.display = 'none';
  popupIframe.src = '';
}

// Evento para cerrar el pop-up al hacer clic en el botón "X"
document.getElementById('close-popup').onclick = closePopup;

// También puedes cerrar el pop-up al hacer clic fuera de la ventana de contenido
document.getElementById('popup').onclick = function(event) {
  if (event.target === this) {
      closePopup();
  }
}
}

// Modificar la función filterFiles para usar el filtro de carpetas
function filterFiles() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const selectedFolderId = document.getElementById('folder-filter').value;

  let filteredFiles = allFiles;

  // Verifica si "Todos" está seleccionado (que es el folderId '1bpMRgHWIP2OLZY-In8eD_BYpbt4eVuY-' en tu configuración)
  if (selectedFolderId !== '' && selectedFolderId !== '1bpMRgHWIP2OLZY-In8eD_BYpbt4eVuY-') {
    filteredFiles = filteredFiles.filter(file => file.folderId === selectedFolderId);
  }

  // Filtrar por búsqueda de texto
  if (searchInput) {
    filteredFiles = filteredFiles.filter(file => file.name.toLowerCase().includes(searchInput));
  }

  displayFiles(filteredFiles);
}

// Inicializar los elementos al cargar la ventana
window.addEventListener('load', function() {
  const preloader = document.getElementById('preloader');
  
  // Oculta el preloader después de 1.5 segundos
  setTimeout(function() {
    preloader.style.display = 'none';
    
    // Ahora ejecuta la inicialización del filtro y la carga de archivos
    initializeFilter();
    getFiles();
    
  }, 1500); // 1500 ms es el tiempo que el preloader estará visible antes de ocultarse
});

function logout() {
  window.location.href = '/logout';
}

window.onload = getFiles; // Iniciar la obtención de archivos cuando la ventana cargue
