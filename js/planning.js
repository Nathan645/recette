/* =================================
   ÉTAT DE LA SÉLECTION
================================= */

let recetteSelectionneePlanning =
    null;

let modeRepasPlanning =
    "recette";


const champPersonnesRepas =
    document.getElementById(
        "personnes-repas"
    );


/* =================================
   OUTILS
================================= */

function recupererNombrePersonnes() {

    const nombre =
        Number(
            champPersonnesRepas.value
        );


    if (
        !Number.isInteger(nombre) ||
        nombre < 1
    ) {

        throw new Error(
            "Le nombre de personnes doit être supérieur ou égal à 1."
        );
    }


    return nombre;
}


function definirNombrePersonnes(
    repas = null
) {

    /*
        Si le repas existe déjà,
        on reprend sa valeur.

        Pour les anciens repas qui ont
        personnes = null, on utilise
        la valeur par défaut du foyer.
    */

    if (
        repas &&
        Number(repas.personnes) > 0
    ) {

        champPersonnesRepas.value =
            repas.personnes;

        return;
    }


    champPersonnesRepas.value =
        nombrePersonnesParDefaut || 2;
}


function deselectionnerRecettes() {

    document
        .querySelectorAll(
            ".resultat-recette-planning"
        )
        .forEach(
            function (bouton) {

                bouton.classList.remove(
                    "selectionnee"
                );
            }
        );
}


function marquerRecetteSelectionnee() {

    deselectionnerRecettes();


    if (!recetteSelectionneePlanning) {
        return;
    }


    const bouton =
        document.querySelector(
            `[data-recette-id="${recetteSelectionneePlanning.id}"]`
        );


    if (bouton) {

        bouton.classList.add(
            "selectionnee"
        );
    }
}


/* =================================
   NAVIGATION SEMAINE
================================= */

boutonSemainePrecedente.addEventListener(
    "click",
    async function () {

        debutSemaine =
            ajouterJours(
                debutSemaine,
                -7
            );

        await rafraichirPlanning();
    }
);


boutonSemaineSuivante.addEventListener(
    "click",
    async function () {

        debutSemaine =
            ajouterJours(
                debutSemaine,
                7
            );

        await rafraichirPlanning();
    }
);


boutonAujourdhui.addEventListener(
    "click",
    async function () {

        debutSemaine =
            obtenirDebutSemaine(
                new Date()
            );

        await rafraichirPlanning();
    }
);


/* =================================
   CLICS DANS LE PLANNING
================================= */

grilleSemaine.addEventListener(
    "click",
    function (evenement) {

        const boutonAjouter =
            evenement.target.closest(
                ".bouton-ajouter-repas"
            );


        if (boutonAjouter) {

            recetteSelectionneePlanning =
                null;

            modeRepasPlanning =
                "recette";


            ouvrirPopup(
                boutonAjouter.dataset.date,
                boutonAjouter.dataset.moment
            );


            definirNombrePersonnes();


            boutonValiderRepasLibre.textContent =
                "Ajouter au planning";


            return;
        }


        const boutonModifier =
            evenement.target.closest(
                ".bouton-editer-repas"
            );


        if (!boutonModifier) {
            return;
        }


        evenement.preventDefault();

        evenement.stopPropagation();


        const repas =
            trouverRepasParId(
                boutonModifier.dataset.repasId
            );


        if (!repas) {
            return;
        }


        /*
            Si le repas possède une recette,
            on la sélectionne automatiquement.
        */

        if (repas.recette_id) {

            modeRepasPlanning =
                "recette";


            recetteSelectionneePlanning =
                recettes.find(
                    function (recette) {

                        return (
                            String(recette.id) ===
                            String(
                                repas.recette_id
                            )
                        );
                    }
                ) || null;

        } else {

            modeRepasPlanning =
                "libre";

            recetteSelectionneePlanning =
                null;
        }


        ouvrirPopup(
            repas.date,
            repas.moment,
            repas
        );


        definirNombrePersonnes(
            repas
        );


        boutonValiderRepasLibre.textContent =
            "Enregistrer les modifications";


        setTimeout(
            marquerRecetteSelectionnee,
            0
        );
    }
);


/* =================================
   FERMER POP-UP
================================= */

boutonFermerPopup.addEventListener(
    "click",
    fermerPopup
);


popupRepas.addEventListener(
    "click",
    function (evenement) {

        if (
            evenement.target ===
            popupRepas
        ) {

            fermerPopup();
        }
    }
);


document.addEventListener(
    "keydown",
    function (evenement) {

        if (
            evenement.key === "Escape" &&
            !popupRepas.hidden
        ) {

            fermerPopup();
        }
    }
);


/* =================================
   TYPE DE REPAS
================================= */

boutonChoisirRecette.addEventListener(
    "click",
    function () {

        modeRepasPlanning =
            "recette";


        afficherModeRecette();


        messagePlanning.textContent =
            "";


        /*
            Si une recette avait déjà
            été sélectionnée, on conserve
            la sélection.
        */

        setTimeout(
            marquerRecetteSelectionnee,
            0
        );
    }
);


boutonChoisirLibre.addEventListener(
    "click",
    function () {

        modeRepasPlanning =
            "libre";


        afficherModeLibre();


        messagePlanning.textContent =
            "";
    }
);


/* =================================
   RECHERCHE RECETTES
================================= */

champRechercheRecette.addEventListener(
    "input",
    function () {

        afficherResultatsRecettes(
            champRechercheRecette.value
        );


        marquerRecetteSelectionnee();
    }
);


/* =================================
   CHOISIR UNE RECETTE
================================= */

resultatsRecettes.addEventListener(
    "click",
    function (evenement) {

        const bouton =
            evenement.target.closest(
                "[data-recette-id]"
            );


        if (!bouton) {
            return;
        }


        const recette =
            recettes.find(
                function (element) {

                    return (
                        String(element.id) ===
                        String(
                            bouton.dataset.recetteId
                        )
                    );
                }
            );


        if (!recette) {
            return;
        }


        /*
            IMPORTANT :
            on n'enregistre plus ici.

            On sélectionne seulement
            la recette.
        */

        recetteSelectionneePlanning =
            recette;


        marquerRecetteSelectionnee();


        messagePlanning.textContent =
            `Recette sélectionnée : ${recette.nom}`;
    }
);


/* =================================
   VALIDATION DU REPAS
   RECETTE OU REPAS LIBRE
================================= */

boutonValiderRepasLibre.addEventListener(
    "click",
    async function () {

        messagePlanning.textContent =
            "";


        let personnes;


        try {

            personnes =
                recupererNombrePersonnes();

        } catch (erreur) {

            messagePlanning.textContent =
                erreur.message;

            return;
        }


        /*
            =========================
            MODE RECETTE
            =========================
        */

        if (
            modeRepasPlanning ===
            "recette"
        ) {

            if (
                !recetteSelectionneePlanning
            ) {

                messagePlanning.textContent =
                    "Choisis une recette.";

                return;
            }


            boutonValiderRepasLibre.disabled =
                true;


            boutonValiderRepasLibre.textContent =
                repasEnModification
                    ? "Modification…"
                    : "Ajout…";


            try {

                if (
                    repasEnModification
                ) {

                    await modifierRepas(
                        recetteSelectionneePlanning.nom,
                        recetteSelectionneePlanning.id,
                        personnes
                    );

                } else {

                    await enregistrerRepas(
                        recetteSelectionneePlanning.nom,
                        recetteSelectionneePlanning.id,
                        personnes
                    );
                }


                fermerPopup();


                recetteSelectionneePlanning =
                    null;


                await rafraichirPlanning();


            } catch (erreur) {

                console.error(
                    "Erreur ajout/modification recette au planning :",
                    erreur
                );


                messagePlanning.textContent =
                    erreur.message ||
                    "Impossible d'enregistrer le repas.";


            } finally {

                boutonValiderRepasLibre.disabled =
                    false;


                boutonValiderRepasLibre.textContent =
                    "Ajouter au planning";
            }


            return;
        }


        /*
            =========================
            MODE REPAS LIBRE
            =========================
        */

        const nom =
            champRepasLibre
                .value
                .trim();


        if (!nom) {

            messagePlanning.textContent =
                "Renseigne le nom du repas.";

            return;
        }


        boutonValiderRepasLibre.disabled =
            true;


        boutonValiderRepasLibre.textContent =
            repasEnModification
                ? "Modification…"
                : "Ajout…";


        try {

            if (
                repasEnModification
            ) {

                await modifierRepas(
                    nom,
                    null,
                    personnes
                );

            } else {

                await enregistrerRepas(
                    nom,
                    null,
                    personnes
                );
            }


            fermerPopup();


            recetteSelectionneePlanning =
                null;


            await rafraichirPlanning();


        } catch (erreur) {

            console.error(
                "Erreur ajout/modification repas libre :",
                erreur
            );


            messagePlanning.textContent =
                erreur.message ||
                "Impossible d'enregistrer le repas.";


        } finally {

            boutonValiderRepasLibre.disabled =
                false;


            boutonValiderRepasLibre.textContent =
                "Ajouter au planning";
        }
    }
);


/* =================================
   VIDER UN CRÉNEAU
================================= */

boutonSupprimerRepas.addEventListener(
    "click",
    async function () {

        if (
            !repasEnModification
        ) {

            return;
        }


        boutonSupprimerRepas.disabled =
            true;


        boutonSupprimerRepas.textContent =
            "Suppression…";


        messagePlanning.textContent =
            "";


        try {

            await supprimerRepas();


            fermerPopup();


            recetteSelectionneePlanning =
                null;


            await rafraichirPlanning();


        } catch (erreur) {

            console.error(
                "Erreur suppression repas :",
                erreur
            );


            messagePlanning.textContent =
                erreur.message ||
                "Impossible de vider ce créneau.";


        } finally {

            boutonSupprimerRepas.disabled =
                false;


            boutonSupprimerRepas.textContent =
                "Vider ce créneau";
        }
    }
);


/* =================================
   ENTRÉE POUR REPAS LIBRE
================================= */

champRepasLibre.addEventListener(
    "keydown",
    function (evenement) {

        if (
            evenement.key ===
            "Enter"
        ) {

            evenement.preventDefault();


            boutonValiderRepasLibre.click();
        }
    }
);


/* =================================
   CONTRÔLE DU NOMBRE DE PERSONNES
================================= */

champPersonnesRepas.addEventListener(
    "change",
    function () {

        let valeur =
            Number(
                champPersonnesRepas.value
            );


        if (
            !Number.isInteger(valeur) ||
            valeur < 1
        ) {

            valeur =
                nombrePersonnesParDefaut ||
                2;
        }


        champPersonnesRepas.value =
            valeur;
    }
);


/* =================================
   INITIALISATION
================================= */

async function initialiserPlanning() {

    try {

        grilleSemaine.innerHTML = `
            <p>
                Chargement du planning…
            </p>
        `;


        /*
            1. Utilisateur + foyer
        */

        const utilisateurPret =
            await recupererUtilisateurEtFoyer();


        if (!utilisateurPret) {
            return;
        }


        /*
            2. Nombre habituel
            de personnes du foyer
        */

        await chargerNombrePersonnesParDefaut();


        /*
            3. Recettes
        */

        await chargerRecettes();


        /*
            4. Planning
        */

        await chargerRepasSemaine();


        /*
            5. Affichage
        */

        afficherSemaine();


    } catch (erreur) {

        console.error(
            "Erreur d'initialisation du planning :",
            erreur
        );


        grilleSemaine.innerHTML = `
            <p>
                Impossible de charger le planning.
                ${erreur.message || ""}
            </p>
        `;
    }
}


/* =================================
   DÉMARRAGE
================================= */

initialiserPlanning();
