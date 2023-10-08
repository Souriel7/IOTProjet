// Appelle l'API pour obtenir la configuration de Firebase. Une fois cette configuration obtenue, le code suivant est exécuté pour ajouter une plante
window.api.getFirebaseConfig().then(() => {

    // Formulaires d'ajouter une plante et les références des éléments de cette formulaire
    const plantForm = document.getElementById("plant-form");
    // Sélection le capteur
    const sensorSelect = document.getElementById("sensor-name");
    // La button de téléchargement de la photo de la plante
    const plantPhotoInput = document.getElementById("plant-photo");
    const uploadLabel = document.getElementById("upload-label");

    // prévisualisation de l'image téléchargé
    const previewDiv = document.querySelector(".photo-preview")
    const previewImage = document.getElementById("preview-image");

    uploadLabel.addEventListener("click", function() {
        plantPhotoInput.click();
    });
    
    // Téléchargement de la photo sélectionnée
    plantPhotoInput.addEventListener("change", function() {
        // Récupérer le fichier sélectionné
        const file = this.files[0];

        // Si un fichier est sélectionné
        if (file) {
            // Création d'un nouvel objet FileReader pour lire le contenu du fichier
            const reader = new FileReader();

            // Définition cette fonction callback pour l'événement (onload) de FileReader. Cette fonction sera exécutée une fois que FileReader aura terminé la lecture du fichier
            reader.onload = function(e) {
                // Une fois le fichier lu, (e.target.result) contiendra le fichier sous forme d'URL de données, Cette serai attribuer URL au champ (src) de l'image de prévisualisation pour l'afficher
                previewImage.src = e.target.result;
                // Affiche le conteneur de prévisualisation de l'image
                previewDiv.style.display = "block";
            }
            reader.readAsDataURL(file);

        // Si aucun fichier n'est sélectionné
        } else {
            previewImage.src = "#";
            previewImage.alt = "Plant Photo Preview";
            // Masque le conteneur de prévisualisation de l'image
            previewDiv.style.display = "none";
        }
    });

    // Lorsque le formulaire est rempli avec les données et soumet, ce bloc traite les données
    plantForm.addEventListener("submit", async function (event) {
        // Empêche le comportement de soumission par défaut
        event.preventDefault();

        // Récupéré les valeurs des champs du formulaire
        const plantName = document.getElementById("plant-name").value;
        const plantType = document.getElementById("plant-type").value;
        const plantConditions = document.getElementById("plant-conditions").value;
        const plantDescription = document.getElementById("plant-description").value;
        // Récupéré du fichier photo sélectionné
        const plantPhotoFile = document.getElementById("plant-photo").files[0];
        const sensorName = sensorSelect.value;

        // Validation des données saisies
        if (!plantName || !sensorName) {
            alert("Veuillez entrer le nom de la plante et sélectionner un capteur");
            return;
        }

        let photoURL = null;

        // Vérifier si un fichier photo est sélectionné
        if (plantPhotoFile) {
            // Conversion du fichier photo en (base64-encoded string)
            const reader = new FileReader();
            reader.onloadend = async function () {
                const photoData = reader.result;

                // Utilisation de l'IPC pour télécharger l'image
                photoURL = await window.api.uploadImage(photoData, plantPhotoFile.name);

                // Utilisation de l'IPC pour enregistrer les informations sur la plante avec l'URL de la photo
                const plantInfo = {
                    name: plantName,
                    type: plantType,
                    conditions: plantConditions,
                    description: plantDescription,
                    sensor: sensorName
                };
                await window.api.addNewPlant(plantInfo, photoURL);
                alert("Informations de la plante et photo sauvegardées");
                window.location.href = "../views/dashboard.html";
            };

            reader.readAsDataURL(plantPhotoFile);
        } else {
            // Aucun fichier photo sélectionné, enregistré les informations sur la plante sans photo à l'aide d'IPC
            const plantInfoWithoutPhoto = {
                name: plantName,
                type: plantType,
                conditions: plantConditions,
                description: plantDescription,
                sensor: sensorName
            };
            await window.api.addNewPlant(plantInfoWithoutPhoto, null);
            window.location.href = "../views/dashboard.html";
            alert("Informations de la plante sauvegardées (sans photo)");
        }
    });

    // Cette fonction récupère les capteurs disponibles et les affiche dans la liste déroulante dans la formulaire
    async function fetchAndPopulateSensors() {
        const sensorData = await window.api.getAllSensors();
        // Efface les options précédentes
        sensorSelect.innerHTML = "";

        if (sensorData) {
            // Extraction de noms de capteurs uniques et supprime toutes les valeurs non définies ou nulles
            const sensorNames = Object.values(sensorData).map(sensor => sensor?.sensor).filter(Boolean);

            // Création d'une option pour afficher les capteurs et l'ajouter au sensorName
            for (const sensorName of sensorNames) {
                const option = document.createElement("option");
                option.value = sensorName;
                option.textContent = sensorName;
                sensorSelect.appendChild(option);
            }
        } else {
            // Aucune donnée de capteur disponible, afficher un message
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No sensors available";
            option.disabled = true;
            sensorSelect.appendChild(option);
        }
    }

    // Exécution de la fonction pour remplir la liste déroulante avec les capteurs disponibles
    fetchAndPopulateSensors();

}).catch((err) => {
    console.error("Failed to retrieve Firebase configuration:", err);
});
