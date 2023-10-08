// Appelle l'API pour obtenir la configuration de Firebase. Une fois cette configuration obtenue, le code suivant est exécuté pour la gestion des plantes
window.api.getFirebaseConfig().then(() => {

    // Cette fonction est utilisée pour créer et afficher une carte pour chaque plante. Elle utilise l'ID de la plante et les données associées à cette plante
    function createPlantCard(plantId, plantData) {
        const plantList = document.getElementById("plant-list");
        
        // Création du div de la carte de la plante
        const card = document.createElement("div");
        card.classList.add("card");
        
        // Création d'un div pour le contenu de la carte
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");

        // Création du div pour la photo de la plante
        const photoContainer = document.createElement("div");
        photoContainer.classList.add("photo");
        const plantPhoto = document.createElement("img");
        plantPhoto.src = plantData.photo;
        plantPhoto.alt = "Photo de la plante";
        photoContainer.appendChild(plantPhoto);
        card.appendChild(photoContainer);
        
        // Création d'un élément h2 pour le nom de la plante
        const plantName = document.createElement("h2");
        plantName.textContent = plantData.name;
        cardContent.appendChild(plantName);
        
        // Création d'un élément p pour le type de la plante
        const plantType = document.createElement("p");
        plantType.textContent = `Type : ${plantData.type}`;
        cardContent.appendChild(plantType);
        
        // Création d'un élément p pour la description de la plante
        const plantDescription = document.createElement("p");
        plantDescription.textContent = `Description : ${plantData.description}`;
        cardContent.appendChild(plantDescription);

        // Création d'un bouton "Modifier" pour permettre à l'utilisateur de modifier les détails de la plante
        const modifyButton = document.createElement("button");
        modifyButton.textContent = "Modifier";
        modifyButton.addEventListener("click", () => {
            // Redirige vers un fichier HTML qui permet de modifier les détails de la plante, en passant l'ID de la plante comme paramètre
            window.location.href = "../views/updatePlant.html?plantId=" + plantId;
        });
        cardContent.appendChild(modifyButton);
        
        card.appendChild(cardContent);
        // Ajoute la carte de la plante à la liste des plantes
        plantList.appendChild(card);
    }

    // Cette fonction interroge l'API pour récupérer toutes les données des plantes. Pour chaque plante retrouvée, elle fait appel à (createPlantCard) pour afficher chaque plante sur l'UI
    window.api.getAllPlants().then(plantsData => {
        if (plantsData) {
            for (const plantId in plantsData) {
                const plantData = plantsData[plantId];
                createPlantCard(plantId, plantData);
            }
        }
    });

}).catch((err) => {
    // En cas d'erreur lors de la récupération de la configuration de Firebase, un message d'erreur est affiché dans la console
    console.error("Échec de la récupération de la configuration Firebase:", err);
});
