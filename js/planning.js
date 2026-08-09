/* =================================
   NAVIGATION SEMAINE
================================= */

boutonSemainePrecedente.addEventListener("click", async function () {
    debutSemaine = ajouterJours(debutSemaine, -7);
    await rafraichirPlanning();
});

boutonSemaineSuivante.addEventListener("click", async function () {
    debutSemaine = ajouterJours(debutSemaine, 7);
    await rafraichirPlanning();
});

boutonAujourdhui.addEventListener("click", async function () {
    debutSemaine = obtenirDebutSemaine(new Date());
    await rafraichirPlanning();
});

/* =================================
   CLICS DANS LE PLANNING
================================= */

grilleSemaine.addEventListener("click", function (evenement) {
    const boutonAjouter = evenement.target.closest(".bouton-ajouter-repas");

    if (boutonAjouter) {
        ouvrirPopup(
            boutonAjouter.dataset.date,
            boutonAjouter.dataset.moment
        );
        return;
    }

    const boutonModifier = evenement.target.closest(".bouton-editer-repas");

    if (!boutonModifier) return;

    evenement.preventDefault();
    evenement.stopPropagation();

    const repas = trouverRepasParId(boutonModifier.dataset.repasId);
    if (!repas) return;

    ouvrirPopup(repas.date, repas.moment, repas);
});

/* =================================
   FERMER POP-UP
================================= */

boutonFermerPopup.addEventListener("click", fermerPopup);

popupRepas.addEventListener("click", function (evenement) {
    if (evenement.target === popupRepas) {
        fermerPopup();
    }
});

document.addEventListener("keydown", function (evenement) {
    if (evenement.key === "Escape" && !popupRepas.hidden) {
        fermerPopup();
    }
});

/* =================================
   TYPE DE REPAS
================================= */

boutonChoisirRecette.addEventListener("click", afficherModeRecette);
boutonChoisirLibre.addEventListener("click", afficherModeLibre);

/* =================================
   RECHERCHE RECETTES
================================= */

champRechercheRecette.addEventListener("input", function () {
    afficherResultatsRecettes(champRechercheRecette.value);
});

/* =================================
   CHOISIR UNE RECETTE
================================= */

resultatsRecettes.addEventListener("click", async function (evenement) {
    const bouton = evenement.target.closest("[data-recette-id]");
    if (!bouton) return;

    const recette = recettes.find(function (element) {
        return String(element.id) === String(bouton.dataset.recetteId);
    });

    if (!recette) return;

    messagePlanning.textContent = repasEnModification
        ? "Modification en cours…"
        : "Ajout en cours…";

    try {
        bouton.disabled = true;

        if (repasEnModification) {
            await modifierRepas(recette.nom, recette.id);
        } else {
            await enregistrerRepas(recette.nom, recette.id);
        }

        fermerPopup();
        await rafraichirPlanning();
    } catch (erreur) {
        console.error(
            "Erreur ajout/modification recette au planning :",
            erreur
        );
        messagePlanning.textContent =
            erreur.message || "Impossible d'enregistrer le repas.";
        bouton.disabled = false;
    }
});

/* =================================
   REPAS LIBRE
================================= */

boutonValiderRepasLibre.addEventListener("click", async function () {
    const nom = champRepasLibre.value.trim();

    if (!nom) {
        messagePlanning.textContent = "Renseigne le nom du repas.";
        return;
    }

    boutonValiderRepasLibre.disabled = true;
    boutonValiderRepasLibre.textContent = repasEnModification
        ? "Modification…"
        : "Ajout…";
    messagePlanning.textContent = "";

    try {
        if (repasEnModification) {
            await modifierRepas(nom, null);
        } else {
            await enregistrerRepas(nom, null);
        }

        fermerPopup();
        await rafraichirPlanning();
    } catch (erreur) {
        console.error("Erreur ajout/modification repas libre :", erreur);
        messagePlanning.textContent =
            erreur.message || "Impossible d'enregistrer le repas.";
    } finally {
        boutonValiderRepasLibre.disabled = false;
        boutonValiderRepasLibre.textContent = "Ajouter au planning";
    }
});

/* =================================
   VIDER UN CRÉNEAU
================================= */

boutonSupprimerRepas.addEventListener("click", async function () {
    if (!repasEnModification) return;

    boutonSupprimerRepas.disabled = true;
    boutonSupprimerRepas.textContent = "Suppression…";
    messagePlanning.textContent = "";

    try {
        await supprimerRepas();
        fermerPopup();
        await rafraichirPlanning();
    } catch (erreur) {
        console.error("Erreur suppression repas :", erreur);
        messagePlanning.textContent =
            erreur.message || "Impossible de vider ce créneau.";
    } finally {
        boutonSupprimerRepas.disabled = false;
        boutonSupprimerRepas.textContent = "Vider ce créneau";
    }
});

/* =================================
   ENTRÉE POUR REPAS LIBRE
================================= */

champRepasLibre.addEventListener("keydown", function (evenement) {
    if (evenement.key === "Enter") {
        evenement.preventDefault();
        boutonValiderRepasLibre.click();
    }
});

/* =================================
   INITIALISATION
================================= */

async function initialiserPlanning() {
    try {
        grilleSemaine.innerHTML = `
            <p>Chargement du planning…</p>
        `;

        const utilisateurPret = await recupererUtilisateurEtFoyer();
        if (!utilisateurPret) return;

        await chargerRecettes();
        await chargerRepasSemaine();
        afficherSemaine();
    } catch (erreur) {
        console.error("Erreur d'initialisation du planning :", erreur);
        grilleSemaine.innerHTML = `
            <p>
                Impossible de charger le planning.
                ${erreur.message || ""}
            </p>
        `;
    }
}

initialiserPlanning();
