// Utilise l'API pour obtenir la configuration de Firebase. Une fois cette configuration obtenue, le code suivant est exécuté pour la gestion des plantes et leurs capteurs d'humidité
window.api.getFirebaseConfig().then(() => {
  
  // Cette fonction est pour créer une carte d'affichage pour chaque plante. Il utilise l'ID de la plante pour récupérer les données appartenant à cette plante comme la photo, le nom et le type ainsi que la valeur d'humidité du capteur d'humidité associé. La carte de plante est ensuite ajoutée à une liste des plantes affichée à l'utilisateur
  function createPlantCard(plantId, plantData, sensor_name) {
    const plantList = document.getElementById("plant-list");
    const card = document.createElement("div");
    card.classList.add("card");

    // Création du div pour la photo
    const photoContainer = document.createElement("div");
    photoContainer.classList.add("photo");
    const plantPhoto = document.createElement("img");
    plantPhoto.src = plantData.photo;
    plantPhoto.alt = "Photo de la plante";
    photoContainer.appendChild(plantPhoto);
    card.appendChild(photoContainer);

    // Création d'un div pour la carte
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

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

    // Création d'un div pour contenir la barre de progression et la valeur de l'humidité
    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");

    // Création d'un div pour la barre de progression
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    // Création d'un div pour afficher la valeur de l'humidité
    const humidityTextContainer = document.createElement("div");
    humidityTextContainer.classList.add("humidity-text-container");
    const humidityText = document.createElement("div");
    humidityText.classList.add("humidity-text");
    humidityText.textContent = "N/A";
    
    // Rassemblement les éléments
    humidityTextContainer.appendChild(humidityText);
    progressBar.appendChild(humidityTextContainer);
    progressContainer.appendChild(progressBar);
    cardContent.appendChild(progressContainer);
    card.appendChild(cardContent);

    // Ajoute la carte à la liste des plantes dans la vue
    plantList.appendChild(card);

    const progressBarElements = {
      text: humidityText,
      bar: progressBar
    };

    // Mise à jour la barre de progression avec les données d'humidité
    updateHumidity(sensor_name, progressBarElements);
  }

  // Cette fonction interroge l'API pour récupérer toutes les données des plantes. Pour chaque plante retrouvée, elle fait appel à 'createPlantCard' pour afficher chaque plante sur l'UI
  window.api.getAllPlants().then((plantsData) => {
    for (const plantId in plantsData) {
      const plantData = plantsData[plantId];
      const sensor_name = plantData.sensor;
      createPlantCard(plantId, plantData, sensor_name);
    }
  });

  // Cette fonction s'occupe de la mise à jour de l'indicateur d'humidité sur la carte de chaque plante. Elle interroge l'API pour récupérer les données d'humidité du capteur associé à une plante et ajuste la barre de progression en conséquence. De plus, elle récupère régulièrement ces données à des intervalles (chaque 20 minutes) définis pour maintenir la barre de progression à jour
  function updateHumidity(sensor_name, progressBar) {
    const fetchHumidityData = async () => {
      try {
        const humidityData = await window.api.getSensorData(sensor_name);

        if (!humidityData) {
          // Réinitialisation de la barre de progression par defaut si aucune donnee d'humidite (la fonction dans ligne 114)
          setProgressBarDefaults(progressBar);
          return;
        }

        // Pour chaque (entries) des données d'humidite
        for (const [key, value] of Object.entries(humidityData)) {
          const humidityValue = value.humidity;
          
          // Si une valeur d'humidité est définie
          if (humidityValue !== undefined) {
            // Mise à jour la barre de progression avec cette valeur.
            updateProgressBar(progressBar, humidityValue);
          } else {
            // Réinitialisation de la barre de progression par defaut
            setProgressBarDefaults(progressBar);
          }
        }
        
      } catch (err) {
        alert(`Erreur lors de la récupération des données pour le capteur ${sensor_name}: ${err}`);
      }
    };

    // Appelle la fonction pour obtenir les données d'humidité
    fetchHumidityData();
    
    // Mise à jour les données toutes les 20 minutes
    setInterval(fetchHumidityData, 5000);
  }

  // Si aucune donnée d'humidité n'est disponible ou en cas d'erreur, cette fonction est appelée pour réinitialiser la barre de progression à ses valeurs par défaut. Cela signifie que la barre de progression affichera "N/A" et sa largeur sera de 0%
  function setProgressBarDefaults(progressBar) {
    progressBar.text.textContent = "N/A";
    progressBar.bar.style.width = "0%";
    removeBarClasses(progressBar.bar);
  }

  // Cette fonction sert à nettoyer les classes CSS sur la barre de progression. Ces classes déterminent la couleur de la barre en fonction de la plage d'humidité
  function removeBarClasses(element) {
    element.classList.remove("range-0-50", "range-50-70", "range-70-90", "range-90-100");
  }

  // Cette fonction est  de la mise à jour de la barre progress d'humidité. Elle ajuste la largeur de la barre de progression en fonction de la valeur d'humidité et change sa couleur en fonction de certaines plages d'humidité. Par exemple, une humidité inférieure à 50% changera la couleur de la barre au rouge et déclenchera une notification d'alerte
  function updateProgressBar(progressBar, humidityValue, sensor_name) {
    progressBar.text.textContent = `${humidityValue}%`;
    progressBar.bar.style.width = `${humidityValue}%`;

    removeBarClasses(progressBar.bar);
    
    // Definition la couleur de la barre en fonction de la valeur d'humidite
    if (humidityValue < 50) {
      progressBar.bar.classList.add("range-0-50");
      // Envoyer une notification si la valeur moins de 50%
      notifyLowHumidity(humidityValue, sensor_name);
    } else if (humidityValue < 70) {
      progressBar.bar.classList.add("range-50-70");
    } else if (humidityValue < 90) {
      progressBar.bar.classList.add("range-70-90");
    } else if (humidityValue <= 100) {
      progressBar.bar.classList.add("range-90-100");
    }
  }

  // Si l'humidité est basse (en dessous de 50%), cette fonction est appelée. Elle envoie une notification à l'utilisateur et declancher un son d'alerte pour attirer son attention
  function notifyLowHumidity(humidityValue, sensor_name) {
    const message = `Le niveau d'humidité de ${sensor_name} est tombé en dessous de 50%.`;
    new Notification("Avertissement faible humidité", {
      body: message,
    });

    const audio = new Audio("../../assets/sounds/bell-123742.mp3");
    audio.play();
  }

});
