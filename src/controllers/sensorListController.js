// Appelle l'API pour obtenir la configuration de Firebase. Une fois cette configuration obtenue, le code suivant est exécuté pour la gestion des capteurs et ces logs
window.api.getFirebaseConfig().then(() => {

    // Cette fonction est utilisée pour créer et afficher une carte pour chaque capteur. Elle utilise l'ID de la capteur et les données associées à cette capteur
    function createSensorCard(sensorId, sensorData) {
        const sensorList = document.getElementById("sensor-list");

        // Création du div de la carte de la capteur
        const card = document.createElement("div");
        card.classList.add("card");

        // Création d'un div pour le contenu de la carte
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");

        // Création d'un élément h2 pour le nom de la capteur
        const sensorName = document.createElement("h2");
        sensorName.textContent = sensorData.sensor;
        cardContent.appendChild(sensorName);

        // Création d'un élément p pour l'ID de la capteur
        const sensorID = document.createElement("p");
        sensorID.textContent = `Capteur ID : ${sensorId}`;
        cardContent.appendChild(sensorID);

        // Création d'un élément p pour l'humidité de la capteur
        const sensorHumidity = document.createElement("p");
        sensorHumidity.textContent = `Humidité : ${sensorData.humidity} %`;
        cardContent.appendChild(sensorHumidity);

        // Création d'un élément button pour afficher les logs
        const showLogsButton = document.createElement("button");
        showLogsButton.textContent = "Afficher les logs";
        showLogsButton.classList.add("fancy-button");
        cardContent.appendChild(showLogsButton);

        // Création une section cachée pour les logs
        const logsSection = document.createElement("div");
        logsSection.classList.add("logs-section", "modern-logs");
        logsSection.style.display = "none"; 
        cardContent.appendChild(logsSection);

        // Affichage les logs quand cliquer sur le bouton
        showLogsButton.addEventListener('click', async () => {
            // Affichage la section des logs
            if (logsSection.style.display === "block") {
                logsSection.style.display = "none";
                showLogsButton.textContent = "Afficher les logs";
                return;
            }

            // Chargement les logs s'ils n'ont pas encore été chargés
            if(!logsSection.hasChildNodes()) {
                const logs = await window.api.getSensorLogs(sensorData.sensor);
                logsSection.innerHTML = "";
                
                
                // Remplisage avec les logs š'ils sont disponibles
                if (logs) {
                    for (const logId in logs) {
                        const logData = logs[logId];

                        // Affichage la date de du log
                        const dateItem = document.createElement("p");
                        dateItem.textContent = `Date : ${logData.datetime}`;
                        logsSection.appendChild(dateItem);

                        // Affichage l'humidité de cet log
                        const humidityItem = document.createElement("p");
                        humidityItem.textContent = `Humidité : ${logData.humidity} %`;
                        logsSection.appendChild(humidityItem);

                        // Affichage le progress Bar de l'humidité
                        const progressBarContainer = document.createElement("div");
                        progressBarContainer.classList.add("progress-container");

                        const progressBar = document.createElement("div");
                        progressBar.classList.add("progress-bar");
                        progressBar.style.width = `${logData.humidity}%`;
                        if (logData.humidity <= 50) {
                            progressBar.classList.add("range-0-50");
                        } else if (logData.humidity <= 70) {
                            progressBar.classList.add("range-50-70");
                        } else if (logData.humidity <= 90) {
                            progressBar.classList.add("range-70-90");
                        } else {
                            progressBar.classList.add("range-90-100");
                        }

                        progressBarContainer.appendChild(progressBar);
                        logsSection.appendChild(progressBarContainer);
                    }
                } else {
                    // Si il y a pas de logs
                    logsSection.innerHTML = "<p>Rien à montrer.</p>";
                    logsSection.removeAttribute(resetLogsButton);
                }

                // Bouton pour réinitialiser les logs du capteur
                const resetLogsButton = document.createElement("button");
                resetLogsButton.textContent = "Réinitialiser les logs";
                resetLogsButton.classList.add("fancy-button");
                resetLogsButton.addEventListener('click', async () => {

                    // Avertissement confirmation avant de réinitialiser les logs
                    if (confirm('Êtes-vous sûr de vouloir réinitialiser les logs de ce capteur?')) {
                        await window.api.resetSensorLogs(sensorData.sensor);
                        logsSection.innerHTML = `<h3>Logs de ${sensorData.sensor} ont été réinitialisés.</h3>`;
                    }
                });

                logsSection.appendChild(resetLogsButton);
            }

            // Fermer l'affichage de la section des logs
            logsSection.style.display = "block";
            showLogsButton.textContent = "Masquer les logs";

        });

        // Ajout du contenu de la carte à la liste des capteurs
        card.appendChild(cardContent);
        sensorList.appendChild(card);
    }

    // Cette fonction interroge l'API pour récupérer toutes les données des capteurs. Pour chaque capteur retrouvée, elle fait appel à (createSensorCard) pour afficher chaque plante sur l'UI
    window.api.getSensorList().then(sensorsData => {
        if (sensorsData) {
            for (const sensorId in sensorsData) {
                const sensorData = sensorsData[sensorId];
                createSensorCard(sensorId, sensorData);
            }
        }
    });

}).catch((err) => {
    console.error("échec de la récupération de la configuration Firebase:", err);
});
