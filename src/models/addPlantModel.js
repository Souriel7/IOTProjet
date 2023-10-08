// La classe AddPlantModel est conçue pour gérer les interactions avec (firebase realtime database), principalement pour ajouter une nouvelle plante
class AddPlantModel {
    constructor(firebase) {
        // Vérification pour s'assurer que l'objet (firebase) est passé lors de l'instanciation de la classe. Si ce n'est pas le cas, une erreur est déclenchée
        if (!firebase) throw new Error('Firebase is required');

        // Initialisation de l'objet Firebase
        this.firebase = firebase;

        // Initialisation de la base de données de Firebase
        this.db = firebase.database();

        // Référence vers le nœud (plante-data) dans la base de données, où les données des plantes sont stockées
        this.plantsRef = this.db.ref("plante-data");

        // Référence vers le nœud (sensor-data) dans la base de données, où les données des capteurs sont stockées
        this.sensorData = this.db.ref("sensor-data");

        // Initialisation de la référence au service de stockage de Firebase. Cela permet de stocker des fichiers comme des images
        this.storageRef = firebase.storage().ref();
    }

    async addNewPlant(plantInfo, photoURL) {
        // Création d'une référence dans le nœud (plante-data) avec un identifiant unique.
        const newPlantRef = this.plantsRef.push();

        // Ajout d'informations sur la plante (transmises via plantInfo) et de l'URL de la photo à la référence créée
        await newPlantRef.set({
            ...plantInfo,
            photo: photoURL,
        });
    }

    async uploadImage(file, name) {
        // Création d'une référence dans le service de stockage de Firebase sous le dossier 'photos' avec le nom fourni (name (nom de fichier)).
        const photoRef = this.storageRef.child(`photos/${name}`);

        // Télécharge le fichier image sous forme de DataURL vers la référence créée
        const snapshot = await photoRef.putString(file, "data_url");

        // Récupère et renvoie l'URL pour télécharger l'image stockée.
        return await snapshot.ref.getDownloadURL();
    }

    async getAllSensors() {
        // Initialisation d'une variable pour stocker les données des capteurs récupérées.
        let sensorData = null;

        // Requête à Firebase pour obtenir des données des capteurs triées par le champ 'sensor'.
        await this.sensorData.orderByChild('sensor').once('value', (snapshot) => {
            sensorData = snapshot.val();
        });

        // Renvoie les données des capteurs récupérées.
        return sensorData;
    }
}

// Exportation de la classe AddPlantModel pour permettre son utilisation dans d'autres modules.
module.exports = AddPlantModel;
