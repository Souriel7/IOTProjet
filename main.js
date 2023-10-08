// (app) Contrôler le cycle de vie des événements de l'application. (BrowserWindow) Création et gestion. 
// (ipcMain) faire la communication entre main process et renderer process. (Menu) construction de la menu de l'application
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const firebase = require('firebase/compat/app');
require('firebase/compat/database');
require('firebase/compat/storage');
const DashboardModel = require('./src/models/dashboardModel');
const AddPlantModel = require('./src/models/addPlantModel');
const PlantListModel = require('./src/models/plantListModel');
const FirebaseConfig = require('./src/firebase/FirebaseConfig'); 
const SensorListModel = require('./src/models/sesnorListModel');


// Initialisation de Firebase avec la configuration fournie
let firebaseInstance = firebase.initializeApp(FirebaseConfig);

// Création des instances des différents modèles pour interagir avec la base de données Firebase
let dashboardModel = new DashboardModel(firebaseInstance);
let addPlantModel = new AddPlantModel(firebaseInstance);
let plantListModel = new PlantListModel(firebaseInstance);
let sensorListModel = new SensorListModel(firebaseInstance);

// Stockage la fenêtre principale de l'application dans un variable
let win;

// Configuration et initialisation la fenêtre principale de l'application dans cette fonction. elle définit la taille de la fenêtre, les préférences web et le fichier HTML à charger au démarrage
function createWindow () {
    win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Le script 'preload' sera exécuté avant le démarrage du renderer process.
      preload: path.join(__dirname, 'preload.js'),

      // Une fonctionnalité de sécurité qui garantit que le contexte JavaScript de la page web est isolé des APIs Electron
      contextIsolation: true
    }
  })

  win.loadFile('./src/views/dashboard.html')
}

// Structure de menu pour l'application, cette modèle sera utilisé pour la création de la barre de menu de l'application
const menuTemplate = [
  {
      label: 'Plant',
      submenu: [
          { label: 'Ajouter une plante', click() { win.loadFile('./src/views/addPlant.html'); }},
          { label: 'Exit',click() {app.quit(); }}
      ]
  },
  {
      label: 'View',
      submenu: [
          { label: 'Tableau de bord', click() { win.loadFile('./src/views/dashboard.html'); }},
          { label: 'Liste des plantes', click() { win.loadFile('./src/views/plantList.html'); }},
          { label: 'Liste des capteurs', click() { win.loadFile('./src/views/sensorList.html'); }},
          { role: 'reload' },
          { role: 'forceReload' },
          { type: 'separator' },
          { role: 'toggleDevTools' }
      ]
  }
];

// Création d'une instance de menu à partir du modèle précédemment défini. c'est la conversation de le modèle de menu en un menu réel, Ceci devient le menu par défaut pour l'application
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// cet événement sera déclenché lorsque Electron a terminé son initialisation. Une fois cela fait, la fenêtre principale de l'application est créée
app.whenReady().then(() => {
    createWindow();
});

// Les blocs suivants définissent comment l'application principale (main process) écoute les requêtes du renderer process (fenêtre de l'application) et repond aux ces requêtes.  Ces requêtes sont appelées via 'ipcMain'
// 'get-firebase-config' écoute les demandes pour obtenir la configuration de Firebase
ipcMain.handle('get-firebase-config', async () => {
    return FirebaseConfig;
});

ipcMain.handle('get-all-plants', async () => {
    return await dashboardModel.getAllPlants();
});

ipcMain.handle('get-sensor-data', async (event, sensor_name) => {
    return await dashboardModel.getSensorData(sensor_name);
});

ipcMain.handle('upload-image', async (event, file, name) => {
  return await addPlantModel.uploadImage(file, name);
});

ipcMain.handle('add-new-plant', async (event, plantInfo, photoURL) => {
  return await addPlantModel.addNewPlant(plantInfo, photoURL);
});

ipcMain.handle('get-all-sensors', async () => {
  return await addPlantModel.getAllSensors();
});

ipcMain.handle('plants-list', async () => {
  return await plantListModel.fetchPlants();
});

ipcMain.handle('get-sensors-list', async () => {
  return await sensorListModel.getSensorList();
});

ipcMain.handle('get-all-sensor-logs', async (event, sensorName) => {
  return await sensorListModel.getSensorLogs(sensorName);
});

ipcMain.handle('reset-sensor-logs', async (event, sensorName) => {
  return await sensorListModel.resetSensorLogs(sensorName);
});

// Gestion de l'événement de fermeture de toutes les fenêtres. Si le system d'operation c'est pas macOS (darwin), cette instruction va quitter l'application. Ce comportement est remplacé pour Mac pour correspondre à son comportement habituel de maintien des applications dans le dock
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});