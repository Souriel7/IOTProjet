// La classe `PlantListModel` est conçue pour gérer les interactions avec ( firebase realtime database), pour récupérer spécifiquement les données des plantes.
class PlantListModel {
    
        // Le (constructor) de la classe initialise l'instance avec l'objet firebaseInstance passé en tant que paramètre et les références nécessaires et appelé automatiquement lorsqu'un nouvel objet de cette classe est créé, voir (main.js)
    constructor(firebase) {
        // Vérification pour s'assurer que l'objet `firebase` est passé lors de l'instanciation de la classe. Si ce n'est pas le cas, une erreur est déclenchée.
        if (!firebase) throw new Error('Firebase is required');

        // Initialisation de l'objet Firebase
        this.firebase = firebase;
        
        // Initialisation de la base de données de Firebase.
        this.db = firebase.database();
        
        // Référence vers le nœud (plante-data) dans la base de données. ici que les données des plantes sont stockées
        this.plantsRef = this.db.ref("plante-data");
    }

    // Cette méthode (getPlantsList) est utilisée pour récupérer toutes les données des plantes
    async getPlantsList() {
        // Initialisation d'une variable pour stocker les données des plantes récupérées
        let plantsData = null;

        // Requête à Firebase pour obtenir des données de plantes. L'utilisation de `once('value')` signifie que cela récupère une fois les données actuelles stockées à la référence "plante-data"
        await this.plantsRef.once('value', (snapshot) => {
            // Stockage des données des plantes dans la variable (plantsData) à partir du (snapshot) de la base de données
            plantsData = snapshot.val();
        });

        // Renvoie les données des plantes récupérées
        return plantsData;
    }
}
module.exports = PlantListModel;
