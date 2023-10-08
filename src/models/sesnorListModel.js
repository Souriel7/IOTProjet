// La classe SensorListModel est conçue pour gérer les interactions avec (firebase realtime database), principalement pour récupérer et manipuler les données des capteurs
class SensorListModel {
    constructor(firebase) {
        // Vérification pour s'assurer que l'objet `firebase` est passé lors de l'instanciation de la classe. Si ce n'est pas le cas, une erreur est déclenchée
        if (!firebase) throw new Error('Firebase is required');

        // Initialisation de l'objet Firebase
        this.firebase = firebase;
        
        // Initialisation de la base de données de Firebase
        this.db = firebase.database();
        
        // Référence vers le nœud (sensor-data) dans la base de données, où les données des capteurs sont stockées
        this.sensorsRef = this.db.ref("sensor-data");

        // Référence vers le nœud (logs-data) dans la base de données, où les journaux (logs) relatifs aux capteurs sont stockés
        this.logsRef = this.db.ref("logs-data");
    }

    async getSensorList() {
        // Initialisation d'une variable pour stocker les données des capteurs récupérées
        let sensorsData = null;

        // Requête à Firebase pour obtenir des données des capteurs
    await this.sensorsRef.once('value', (snapshot) => {
        // Stockage des données des capteurs dans la variable (sensorsData) à partir du (snapshot) de la base de données
        sensorsData = snapshot.val();
    });
        // Renvoie les données des capteurs récupérées
        return sensorsData;
    }

    // même explication de la méthode ci-dessus
    async getSensorLogs(sensorName) {
        let logsData = {};
        await this.logsRef.child(sensorName).once('value', (snapshot) => {
            logsData = snapshot.val();
        });
        return logsData;
    }

    // La méthode (resetSensorLogs) est utilisée pour supprimer tous les (logs) d'un capteur spécifique
    async resetSensorLogs(sensorName) {
        // Suppression des (logs) pour le capteur spécifié
        // Cest une méthode fournie par l'API de la base de données Firebaseest pour accéder à un sous-répertoire spécifique dans le nœud (logs-data). Le sous-répertoire cible correspond au nom du capteur, donné par le paramètre sensorName
        await this.logsRef.child(sensorName).remove();
    }
}
module.exports = SensorListModel;
