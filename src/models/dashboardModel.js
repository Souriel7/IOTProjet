// La classe DashboardModel est conçue pour gérer les interactions avec (realtime database) pour récupérer les données des plantes et des capteurs
class DashboardModel {
    // Le (constructor) de la classe initialise l'instance avec l'objet firebaseInstance passé en tant que paramètre et les références nécessaires et appelé automatiquement lorsqu'un nouvel objet de cette classe est créé, voir (main.js). 
    constructor(firebaseInstance) {
        // Vérification pour s'assurer que l'objet `firebase` est passé lors de l'instanciation de la classe. Si ce n'est pas le cas, une erreur est déclenchée
        if (!firebaseInstance) throw new Error('Firebase is required');

        // Initialisation de l'objet Firebase
        this.firebase = firebaseInstance;
        // Référence vers le nœud (plante-data)
        this.plantsRef = this.firebase.database().ref("plante-data"); 
        // Référence vers le nœud (sensor-data)
        this.humidityRef = this.firebase.database().ref("sensor-data");
    }

    //  Récupération toutes les données des plantes en utilisant de méthode asynchrone
    async getAllPlants() {
        // Initialisation d'un tableau vide pour stocker les données des plantes
        let plants = [];
        // Requête à Firebase pour obtenir des données de plantes. L'utilisation de (once('value')) signifie que cela récupère une fois les données actuelles stockées à la référence "plante-data"
        await this.plantsRef.once("value", (snapshot) => {
            // Stockage des données des plantes dans le tableau (plants)
            plants = snapshot.val();
            // snapshot : Représente l'état actuel du nœud de données spécifique dans (firebase realtime database) qui a été interrogé, "snapshot" dans le contexte de la base de données (firebase realtime database) fait référence à une encapsulation des données telles qu'elles apparaissent dans la base de données au moment de la requête. Cet instantané offre une vue plus complète des données, comprenant non seulement le contenu mais aussi des métadonnées sur ces données
            // val() : Un appel de méthode sur l'objet instantané qui extrait les données réelles de l'instantané
        });
        // Renvoie les données récupérées
        return plants;
    }

    // Récupération les données du capteur en fonction de son nom en utilisant de méthode asynchrone
    async getSensorData(sensor_name) {
        // Initialisation d'une variable pour stocker les données d'humidité
        let humidityData = null;
        // Requête à Firebase pour obtenir des données spécifiques basées sur le nom du capteur
        await this.humidityRef.orderByChild("sensor").equalTo(sensor_name).once("value", (snapshot) => {
            // Stockage des données d'humidité dans la variable (humidityData) à partir du (snapshot) de la base de données
            humidityData = snapshot.val();
        });
        // Renvoie les données des plantes récupérées
        return humidityData;
    }
}
module.exports = DashboardModel;
