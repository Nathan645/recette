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
   COPIE DE SEMAINE
================================= */

const boutonCopierSemaine =
    document.getElementById(
        "copier-semaine"
    );


const popupCopieSemaine =
    document.getElementById(
        "popup-copie-semaine"
    );


const boutonFermerCopieSemaine =
    document.getElementById(
        "fermer-copie-semaine"
    );


const boutonValiderCopieSemaine =
    document.getElementById(
        "valider-copie-semaine"
    );


const messageCopieSemaine =
    document.getElementById(
        "message-copie-semaine"
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
   OUTIL DATE ISO POUR LA COPIE
================================= */

function decalerDateISO(
    dateISO,
    nombreJours
) {

    /*
        On parse manuellement la date
        pour éviter les décalages liés
        aux fuseaux horaires.
    */

    const morceaux =
        String(dateISO)
            .split("-")
            .map(Number);


    if (
        morceaux.length !== 3 ||
        morceaux.some(
            function (valeur) {
                return !Number.isFinite(valeur);
            }
        )
    ) {

        throw new Error(
            "Une date du planning est invalide."
        );
    }


    const date =
        new Date(
            morceaux[0],
            morceaux[1] - 1,
            morceaux[2]
        );


    date.setDate(
        date.getDate() +
        nombreJours
    );


    return formaterDateISO(
        date
    );
}


/* =================================
   OUVRIR / FERMER
   POPUP COPIE SEMAINE
================================= */

function ouvrirPopupCopieSemaine() {

    messageCopieSemaine.textContent =
        "";


    const choixSemaineSuivante =
        document.querySelector(
            'input[name="destination-copie-semaine"][value="suivante"]'
        );


    if (
        choixSemaineSuivante
    ) {

        choixSemaineSuivante.checked =
            true;
    }


    popupCopieSemaine.hidden =
        false;
}


function fermerPopupCopieSemaine() {

    popupCopieSemaine.hidden =
        true;


    messageCopieSemaine.textContent =
        "";


    boutonValiderCopieSemaine.disabled =
        false;


    boutonValiderCopieSemaine.textContent =
        "Copier les repas";
}


/* =================================
   COPIER UNE SEMAINE
================================= */

async function copierSemainePlanning() {

    /*
        S'il n'y a aucun repas dans
        la semaine affichée, inutile
        d'interroger Supabase.
    */

    if (
        repasSemaine.length === 0
    ) {

        messageCopieSemaine.textContent =
            "Il n'y a aucun repas à copier cette semaine.";

        return;
    }


    const choixDestination =
        document.querySelector(
            'input[name="destination-copie-semaine"]:checked'
        );


    const destination =
        choixDestination
            ? choixDestination.value
            : "suivante";


    const decalage =
        destination === "precedente"
            ? -7
            : 7;


    const debutSemaineCible =
        ajouterJours(
            debutSemaine,
            decalage
        );


    const finSemaineCible =
        ajouterJours(
            debutSemaineCible,
            6
        );


    const dateDebutCible =
        formaterDateISO(
            debutSemaineCible
        );


    const dateFinCible =
        formaterDateISO(
            finSemaineCible
        );


    boutonValiderCopieSemaine.disabled =
        true;


    boutonValiderCopieSemaine.textContent =
        "Copie en cours…";


    messageCopieSemaine.textContent =
        "";


    try {

        /*
            1. On récupère les créneaux
            déjà occupés dans la semaine
            de destination.
        */

        const {
            data: repasExistants,
            error: erreurRepasExistants
        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .select(`
                    id,
                    date,
                    moment
                `)
                .eq(
                    "foyer_id",
                    foyerId
                )
                .gte(
                    "date",
                    dateDebutCible
                )
                .lte(
                    "date",
                    dateFinCible
                );


        if (
            erreurRepasExistants
        ) {

            throw erreurRepasExistants;
        }


        const creneauxOccupes =
            new Set(
                (
                    Array.isArray(
                        repasExistants
                    )
                        ? repasExistants
                        : []
                )
                    .map(
                        function (repas) {

                            return (
                                repas.date +
                                "__" +
                                repas.moment
                            );
                        }
                    )
            );


        /*
            2. On prépare uniquement
            les repas dont le créneau
            cible est encore vide.
        */

        const repasACopier =
            [];


        let nombreIgnores =
            0;


        repasSemaine.forEach(
            function (repas) {

                const dateCible =
                    decalerDateISO(
                        repas.date,
                        decalage
                    );


                const cleCreneau =
                    dateCible +
                    "__" +
                    repas.moment;


                if (
                    creneauxOccupes.has(
                        cleCreneau
                    )
                ) {

                    nombreIgnores +=
                        1;

                    return;
                }


                repasACopier.push({

                    foyer_id:
                        foyerId,

                    date:
                        dateCible,

                    moment:
                        repas.moment,

                    nom:
                        repas.nom,

                    recette_id:
                        repas.recette_id ||
                        null,

                    personnes:
                        Number(
                            repas.personnes
                        ) > 0
                            ? Number(
                                repas.personnes
                            )
                            : (
                                nombrePersonnesParDefaut ||
                                2
                            ),

                    created_by:
                        utilisateurConnecte.id

                });


                /*
                    On marque immédiatement
                    le créneau comme occupé
                    pour éviter un doublon
                    éventuel dans le tableau.
                */

                creneauxOccupes.add(
                    cleCreneau
                );
            }
        );


        /*
            3. Tous les créneaux sont
            déjà occupés.
        */

        if (
            repasACopier.length === 0
        ) {

            messageCopieSemaine.textContent =
                nombreIgnores === 1
                    ? "Aucun repas copié : le créneau cible est déjà occupé."
                    : `Aucun repas copié : ${nombreIgnores} créneaux sont déjà occupés.`;


            boutonValiderCopieSemaine.disabled =
                false;


            boutonValiderCopieSemaine.textContent =
                "Copier les repas";


            return;
        }


        /*
            4. Insertion en une seule
            requête Supabase.
        */

        const {
            error: erreurInsertion
        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .insert(
                    repasACopier
                );


        if (
            erreurInsertion
        ) {

            throw erreurInsertion;
        }


        /*
            5. Message de résultat.
        */

        const nombreCopies =
            repasACopier.length;


        let message =
            nombreCopies === 1
                ? "1 repas copié"
                : `${nombreCopies} repas copiés`;


        if (
            nombreIgnores > 0
        ) {

            message +=
                nombreIgnores === 1
                    ? ", 1 créneau déjà occupé"
                    : `, ${nombreIgnores} créneaux déjà occupés`;
        }


        messageCopieSemaine.textContent =
            `${message} ✓`;


        /*
            On laisse le résultat visible
            un court instant avant de
            fermer la popup.
        */

        setTimeout(
            function () {

                fermerPopupCopieSemaine();

            },
            1400
        );


    } catch (erreur) {

        console.error(
            "Erreur copie de semaine :",
            erreur
        );


        messageCopieSemaine.textContent =
            erreur.message ||
            "Impossible de copier cette semaine.";


        boutonValiderCopieSemaine.disabled =
            false;


        boutonValiderCopieSemaine.textContent =
            "Copier les repas";
    }
}


/* =================================
   ÉVÉNEMENTS COPIE SEMAINE
================================= */

boutonCopierSemaine.addEventListener(
    "click",
    ouvrirPopupCopieSemaine
);


boutonFermerCopieSemaine.addEventListener(
    "click",
    fermerPopupCopieSemaine
);


boutonValiderCopieSemaine.addEventListener(
    "click",
    copierSemainePlanning
);


popupCopieSemaine.addEventListener(
    "click",
    function (evenement) {

        if (
            evenement.target ===
            popupCopieSemaine
        ) {

            fermerPopupCopieSemaine();
        }
    }
);


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

        /*
            Popup repas
        */

        if (
            evenement.key ===
                "Escape" &&
            !popupRepas.hidden
        ) {

            fermerPopup();

            return;
        }


        /*
            Popup copie semaine
        */

        if (
            evenement.key ===
                "Escape" &&
            !popupCopieSemaine.hidden
        ) {

            fermerPopupCopieSemaine();
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
