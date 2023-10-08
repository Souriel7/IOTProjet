// (contextBridge) Expose de manière sécurisée des méthodes IPC spécifiques au renderer.
// (ipcRenderer) Envoie des messages synchronisés et asynchrones du (renderer process) au (main process).
const { contextBridge, ipcRenderer } = require("electron");

// Le contextBridge est une fonctionnalité de sécurité cruciale. Il garantit que le renderer ne peut accéder qu'aux fonctionnalités que vous exposez explicitement, offrant un bouclier contre les éventuelles menaces de sécurité du contenu web.
contextBridge.exposeInMainWorld(
  "api", {
    // Chacune de ces méthodes est un pont vers un appel IPC au(main process).
      // Récupérer  la configuration Firebase pour éventuellement l'utiliser dans le frontend.
      getFirebaseConfig: () => ipcRenderer.invoke('get-firebase-config'),

      // Demander des données sur toutes les plantes. extraction de données réside dans le (main process).
      getAllPlants: () => ipcRenderer.invoke('get-all-plants'),

      // Récupérer  les données du capteur. (sensor_name) est fourni comme paramètre
      getSensorData: (sensor_name) => ipcRenderer.invoke('get-sensor-data', sensor_name),

      // Téléchargement d'images
      uploadImage: (file, name) => ipcRenderer.invoke('upload-image', file, name),

      // Ajouter une nouvelle plante dans la base de données
      addNewPlant: (plantInfo, photoURL) => ipcRenderer.invoke('add-new-plant', plantInfo, photoURL),

      // Récupérer  des informations sur tous les capteurs
      getAllSensors: () => ipcRenderer.invoke('get-all-sensors'),

      // Récupérer  une liste complète de plantes
      getPlantList: () => ipcRenderer.invoke('plants-list'),

      // Collecter des données sur tous les capteurs du système
      getSensorList: () => ipcRenderer.invoke('get-sensors-list'),

      // Obtenir des données des logs pour un capteur spécifié
      getSensorLogs: (sensorName) => ipcRenderer.invoke('get-all-sensor-logs', sensorName),

      // Effacer ou réinitialiser les données des logs pour un capteur spécifié
      resetSensorLogs: (sensorName) => ipcRenderer.invoke('reset-sensor-logs', sensorName),
  }
)
