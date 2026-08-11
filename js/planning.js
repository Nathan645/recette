/* =================================
PLANNING.JS
À notre table

Ce fichier :
- démarre la page
- charge les données
- gère la navigation entre semaines
- ouvre les popups
- recharge l'affichage après modification

Les fonctions métier sont réparties dans :
- planning-core.js
- planning-data.js
- planning-popup.js
- planning-ui.js
================================= */


/* =================================
ÉLÉMENTS DU DOM
================================= */

const boutonSemainePrecedente =
    document.getElementById(
        "semaine-precedente"
    );

const boutonSemaineSuivante =
    document.getElementById(
        "semaine-suivante"
    );

const boutonAujourdhui =
    document.getElementById(
        "aller-aujourdhui"
    );

const boutonCopierSemaine =
    document.getElementById(
        "copier-semaine"
    );

const grilleSemaine =
    document.getElementById(
        "grille-semaine"
    );

const titreSemaine =
    document.getElementById(
        "titre-semaine"
    );

const numeroSemaine =
    document.getElementById(
        "numero-semaine"
    );


/* =================================
POPUP REPAS
================================= */

const popupRepas =
    document.getElementById(
        "popup-repas"
    );

const boutonFermerPopupRepas =
    document.getElementById(
        "fermer-popup-repas"
    );

const titrePopupRepas =
    document.getElementById(
        "titre-popup-repas"
    );

const datePopupRepas =
    document.getElementById(
        "date-popup-repas"
    );

const champPersonnesRepas =
    document.getElementById(
        "personnes-repas"
    );

const listeElementsRepas =
    document.getElementById(
        "liste-elements-repas"
    );

const champRechercheRecette =
    document.getElementById(
        "recherche-recette-planning"
    );

const resultatsRecettesPlanning =
    document.getElementById(
        "resultats-recettes-planning"
    );

const champNomRepasLibre =
    document.getElementById(
        "nom-repas-libre"
    );

const boutonAjouterPlatManuel =
    document.getElementById(
        "ajouter-plat-manuel"
    );

const boutonValiderRepas =
    document.getElementById(
        "valider-repas-libre"
    );

const boutonSupprimerRepas =
    document.getElementById(
        "supprimer-repas-planning"
    );

const messagePlanning =
    document.getElementById(
        "message-planning"
    );


/* =================================
POPUP COPIE SEMAINE
================================= */

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
ÉTAT LOCAL DE LA POPUP
================================= */

/*
    Cette liste contient temporairement
    tous les plats ajoutés dans le repas
    avant validation.

    Exemple :

    [
        {
            type: "recette",
            recette_id: 12,
            nom: "Lasagnes"
        },
        {
            type: "libre",
            recette_id: null,
            nom: "Plateau de fromages"
        }
    ]
*/

let elementsRepasEnCours = [];


/* =================================
OUTILS MESSAGE
================================= */

function afficherMessagePlanning(
    texte,
    type = ""
) {

    if (!messagePlanning) {
        return;
    }


    messagePlanning.textContent =
        texte;


    messagePlanning.classList.remove(
        "erreur",
        "succes"
    );


    if (type) {

        messagePlanning.classList.add(
            type
        );

    }

}


function afficherMessageCopie(
    texte,
    type = ""
) {

    if (!messageCopieSemaine) {
        return;
    }


    messageCopieSemaine.textContent =
        texte;


    messageCopieSemaine.classList.remove(
        "erreur",
        "succes"
    );


    if (type) {

        messageCopieSemaine.classList.add(
            type
        );

    }

}


/* =================================
ÉCHAPPER LE HTML
================================= */

function echapperHTML(texte) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        texte ?? "";


    return element.innerHTML;

}


/* =================================
AFFICHER LES ÉLÉMENTS DU REPAS
================================= */

function afficherElementsRepasEnCours() {

    if (!listeElementsRepas) {
        return;
    }


    listeElementsRepas.innerHTML = "";


    if (
        elementsRepasEnCours.length === 0
    ) {

        const messageVide =
            document.createElement(
                "p"
            );


        messageVide.className =
            "message-elements-vide";


        messageVide.textContent =
            "Aucun plat ajouté pour le moment.";


        listeElementsRepas.appendChild(
            messageVide
        );


        return;

    }


    elementsRepasEnCours.forEach(
        function (
            element,
            index
        ) {

            const ligne =
                document.createElement(
                    "div"
                );


            ligne.className =
                "element-repas-selectionne";


            const informations =
                document.createElement(
                    "div"
                );


            informations.className =
                "infos-element-repas";


            const nom =
                document.createElement(
                    "strong"
                );


            nom.textContent =
                element.nom;


            const type =
                document.createElement(
                    "span"
                );


            type.className =
                "type-element-repas";


            type.textContent =
                element.type ===
                "recette"
                    ? "Recette"
                    : "Plat libre";


            informations.appendChild(
                nom
            );


            informations.appendChild(
                type
            );


            const boutonSupprimer =
                document.createElement(
                    "button"
                );


            boutonSupprimer.type =
                "button";


            boutonSupprimer.className =
                "supprimer-element-repas";


            boutonSupprimer.textContent =
                "×";


            boutonSupprimer.setAttribute(
                "aria-label",
                "Retirer " +
                    element.nom
            );


            boutonSupprimer.addEventListener(
                "click",
                function () {

                    elementsRepasEnCours.splice(
                        index,
                        1
                    );


                    afficherElementsRepasEnCours();

                }
            );


            ligne.appendChild(
                informations
            );


            ligne.appendChild(
                boutonSupprimer
            );


            listeElementsRepas.appendChild(
                ligne
            );

        }
    );

}


/* =================================
RECHERCHE DE RECETTES
================================= */

function afficherResultatsRecettes(
    recherche = ""
) {

    if (
        !resultatsRecettesPlanning
    ) {
        return;
    }


    const rechercheNormalisee =
        recherche
            .trim()
            .toLowerCase();


    resultatsRecettesPlanning.innerHTML =
        "";


    if (
        !Array.isArray(
            recettes
        )
    ) {
        return;
    }


    let recettesFiltrees =
        recettes;


    if (
        rechercheNormalisee
    ) {

        recettesFiltrees =
            recettes.filter(
                function (
                    recette
                ) {

                    return (
                        recette.nom &&
                        recette.nom
                            .toLowerCase()
                            .includes(
                                rechercheNormalisee
                            )
                    );

                }
            );

    }


    /*
        On évite d'afficher 200 recettes
        d'un coup dans la popup.
    */

    recettesFiltrees =
        recettesFiltrees.slice(
            0,
            20
        );


    if (
        recettesFiltrees.length === 0
    ) {

        const message =
            document.createElement(
                "p"
            );


        message.className =
            "aucune-recette-planning";


        message.textContent =
            "Aucune recette trouvée.";


        resultatsRecettesPlanning
            .appendChild(
                message
            );


        return;

    }


    recettesFiltrees.forEach(
        function (
            recette
        ) {

            const bouton =
                document.createElement(
                    "button"
                );


            bouton.type =
                "button";


            bouton.className =
                "resultat-recette-planning";


            bouton.textContent =
                recette.nom;


            bouton.addEventListener(
                "click",
                function () {

                    /*
                        On empêche d'ajouter
                        exactement la même
                        recette deux fois.
                    */

                    const dejaAjoutee =
                        elementsRepasEnCours
                            .some(
                                function (
                                    element
                                ) {

                                    return (
                                        element.type ===
                                            "recette" &&
                                        String(
                                            element.recette_id
                                        ) ===
                                        String(
                                            recette.id
                                        )
                                    );

                                }
                            );


                    if (
                        dejaAjoutee
                    ) {

                        afficherMessagePlanning(
                            "Cette recette est déjà ajoutée au repas.",
                            "erreur"
                        );

                        return;

                    }


                    elementsRepasEnCours.push(
                        {

                            type:
                                "recette",

                            recette_id:
                                recette.id,

                            nom:
                                recette.nom

                        }
                    );


                    afficherElementsRepasEnCours();


                    afficherMessagePlanning(
                        ""
                    );


                    if (
                        champRechercheRecette
                    ) {

                        champRechercheRecette.value =
                            "";

                    }


                    afficherResultatsRecettes(
                        ""
                    );

                }
            );


            resultatsRecettesPlanning
                .appendChild(
                    bouton
                );

        }
    );

}


/* =================================
AJOUT MANUEL
================================= */

function ajouterPlatManuel() {

    if (!champNomRepasLibre) {
        return;
    }


    const nom =
        champNomRepasLibre
            .value
            .trim();


    if (!nom) {

        afficherMessagePlanning(
            "Indique le nom du plat à ajouter.",
            "erreur"
        );

        champNomRepasLibre.focus();

        return;

    }


    elementsRepasEnCours.push(
        {

            type:
                "libre",

            recette_id:
                null,

            nom:
                nom

        }
    );


    champNomRepasLibre.value =
        "";


    afficherElementsRepasEnCours();


    afficherMessagePlanning(
        ""
    );


    champNomRepasLibre.focus();

}


/* =================================
OUVRIR POPUP MULTI-REPAS
================================= */

function ouvrirPopupMultiRepas(
    date,
    moment
) {

    dateSelectionnee =
        formaterDateISO(
            date
        );


    momentSelectionne =
        moment;


    /*
        On récupère TOUS les repas
        du créneau.

        Avant :
        trouverRepas() retournait
        seulement le premier.

        Maintenant on veut pouvoir
        en avoir plusieurs.
    */

    const repasDuCreneau =
        repasSemaine.filter(
            function (
                repas
            ) {

                return (
                    repas.date ===
                        dateSelectionnee &&
                    repas.moment ===
                        momentSelectionne
                );

            }
        );


    /*
        On transforme les repas déjà
        présents en éléments modifiables
        dans la popup.
    */

    elementsRepasEnCours =
        repasDuCreneau.map(
            function (
                repas
            ) {

                return {

                    id:
                        repas.id,

                    type:
                        repas.recette_id
                            ? "recette"
                            : "libre",

                    recette_id:
                        repas.recette_id,

                    nom:
                        repas.nom

                };

            }
        );


    /*
        Nombre de personnes.

        S'il existe déjà un repas,
        on reprend son nombre.

        Sinon :
        valeur par défaut du foyer.
    */

    let nombrePersonnes =
        nombrePersonnesParDefaut;


    if (
        repasDuCreneau.length > 0
    ) {

        const nombreExistant =
            Number(
                repasDuCreneau[0]
                    .personnes
            );


        if (
            Number.isInteger(
                nombreExistant
            ) &&
            nombreExistant > 0
        ) {

            nombrePersonnes =
                nombreExistant;

        }

    }


    if (
        champPersonnesRepas
    ) {

        champPersonnesRepas.value =
            nombrePersonnes;

    }


    /*
        Titre
    */

    if (
        titrePopupRepas
    ) {

        titrePopupRepas.textContent =
            moment === "midi"
                ? "Repas du midi"
                : "Repas du soir";

    }


    /*
        Date
    */

    if (
        datePopupRepas
    ) {

        datePopupRepas.textContent =
            date.toLocaleDateString(
                "fr-FR",
                {
                    weekday:
                        "long",

                    day:
                        "numeric",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            );

    }


    /*
        Suppression complète du créneau
    */

    if (
        boutonSupprimerRepas
    ) {

        boutonSupprimerRepas.hidden =
            repasDuCreneau.length === 0;

    }


    /*
        Réinitialisation champs
    */

    if (
        champRechercheRecette
    ) {

        champRechercheRecette.value =
            "";

    }


    if (
        champNomRepasLibre
    ) {

        champNomRepasLibre.value =
            "";

    }


    afficherMessagePlanning(
        ""
    );


    afficherElementsRepasEnCours();


    afficherResultatsRecettes(
        ""
    );


    if (
        popupRepas
    ) {

        popupRepas.hidden =
            false;

    }

}


/* =================================
FERMER POPUP REPAS
================================= */

function fermerPopupMultiRepas() {

    if (
        popupRepas
    ) {

        popupRepas.hidden =
            true;

    }


    elementsRepasEnCours =
        [];


    dateSelectionnee =
        null;


    momentSelectionne =
        null;


    repasEnModification =
        null;


    afficherMessagePlanning(
        ""
    );

}


/* =================================
ENREGISTRER LE CRÉNEAU COMPLET
================================= */

async function enregistrerCreneauComplet() {

    if (
        !dateSelectionnee ||
        !momentSelectionne
    ) {

        afficherMessagePlanning(
            "Impossible d'identifier ce repas.",
            "erreur"
        );

        return;

    }


    if (
        elementsRepasEnCours.length === 0
    ) {

        afficherMessagePlanning(
            "Ajoute au moins un plat avant de terminer le repas.",
            "erreur"
        );

        return;

    }


    const personnes =
        Number(
            champPersonnesRepas
                ? champPersonnesRepas.value
                : nombrePersonnesParDefaut
        );


    if (
        !Number.isInteger(
            personnes
        ) ||
        personnes < 1
    ) {

        afficherMessagePlanning(
            "Le nombre de personnes est invalide.",
            "erreur"
        );

        return;

    }


    if (
        boutonValiderRepas
    ) {

        boutonValiderRepas.disabled =
            true;


        boutonValiderRepas.textContent =
            "Enregistrement…";

    }


    afficherMessagePlanning(
        "Enregistrement du repas…"
    );


    try {

        /*
            STRATÉGIE SIMPLE ET FIABLE :

            1. supprimer le contenu actuel
               de ce créneau ;

            2. recréer tous les éléments
               présents dans la popup.

            Comme ça :
            - ajout
            - suppression
            - modification

            sont tous gérés d'un coup.
        */


        const {
            error: erreurSuppression
        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .delete()
                .eq(
                    "foyer_id",
                    foyerId
                )
                .eq(
                    "date",
                    dateSelectionnee
                )
                .eq(
                    "moment",
                    momentSelectionne
                );


        if (
            erreurSuppression
        ) {

            throw erreurSuppression;

        }


        const lignesAInserer =
            elementsRepasEnCours.map(
                function (
                    element
                ) {

                    return {

                        foyer_id:
                            foyerId,

                        date:
                            dateSelectionnee,

                        moment:
                            momentSelectionne,

                        nom:
                            element.nom,

                        recette_id:
                            element.recette_id,

                        personnes:
                            personnes,

                        created_by:
                            utilisateurConnecte.id

                    };

                }
            );


        const {
            error: erreurInsertion
        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .insert(
                    lignesAInserer
                );


        if (
            erreurInsertion
        ) {

            throw erreurInsertion;

        }


        await chargerRepasSemaine();


        /*
            planning-ui.js doit contenir
            afficherSemaine().
        */

        afficherSemaine();


        fermerPopupMultiRepas();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur enregistrement du repas :",
            erreur
        );


        afficherMessagePlanning(
            erreur.message ||
            "Impossible d'enregistrer le repas.",
            "erreur"
        );


    } finally {

        if (
            boutonValiderRepas
        ) {

            boutonValiderRepas.disabled =
                false;


            boutonValiderRepas.textContent =
                "Terminer le repas";

        }

    }

}


/* =================================
VIDER COMPLÈTEMENT UN CRÉNEAU
================================= */

async function viderCreneau() {

    if (
        !dateSelectionnee ||
        !momentSelectionne
    ) {
        return;
    }


    const confirmation =
        window.confirm(
            "Supprimer tous les plats de ce repas ?"
        );


    if (
        !confirmation
    ) {
        return;
    }


    if (
        boutonSupprimerRepas
    ) {

        boutonSupprimerRepas.disabled =
            true;

    }


    try {

        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .delete()
                .eq(
                    "foyer_id",
                    foyerId
                )
                .eq(
                    "date",
                    dateSelectionnee
                )
                .eq(
                    "moment",
                    momentSelectionne
                );


        if (
            error
        ) {

            throw error;

        }


        await chargerRepasSemaine();


        afficherSemaine();


        fermerPopupMultiRepas();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur suppression créneau :",
            erreur
        );


        afficherMessagePlanning(
            erreur.message ||
            "Impossible de supprimer le repas.",
            "erreur"
        );


    } finally {

        if (
            boutonSupprimerRepas
        ) {

            boutonSupprimerRepas.disabled =
                false;

        }

    }

}


/* =================================
NAVIGATION ENTRE LES SEMAINES
================================= */

async function changerSemaine(
    nombreSemaines
) {

    debutSemaine =
        ajouterJours(
            debutSemaine,
            nombreSemaines * 7
        );


    try {

        await chargerRepasSemaine();


        afficherSemaine();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur changement semaine :",
            erreur
        );


        if (
            grilleSemaine
        ) {

            grilleSemaine.innerHTML =
                "<p>Impossible de charger cette semaine.</p>";

        }

    }

}


/* =================================
REVENIR À AUJOURD'HUI
================================= */

async function revenirAujourdhui() {

    debutSemaine =
        obtenirDebutSemaine(
            new Date()
        );


    try {

        await chargerRepasSemaine();


        afficherSemaine();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur retour aujourd'hui :",
            erreur
        );

    }

}


/* =================================
COPIE DE SEMAINE
================================= */

function ouvrirPopupCopie() {

    if (
        !popupCopieSemaine
    ) {
        return;
    }


    afficherMessageCopie(
        ""
    );


    popupCopieSemaine.hidden =
        false;

}


function fermerPopupCopie() {

    if (
        !popupCopieSemaine
    ) {
        return;
    }


    popupCopieSemaine.hidden =
        true;


    afficherMessageCopie(
        ""
    );

}


/* =================================
VALIDER COPIE SEMAINE
================================= */

async function validerCopieSemaine() {

    const choix =
        document.querySelector(
            'input[name="destination-copie-semaine"]:checked'
        );


    if (
        !choix
    ) {

        afficherMessageCopie(
            "Choisis une semaine de destination.",
            "erreur"
        );

        return;

    }


    const decalage =
        choix.value ===
            "precedente"
            ? -7
            : 7;


    const nouveauDebut =
        ajouterJours(
            debutSemaine,
            decalage
        );


    if (
        repasSemaine.length === 0
    ) {

        afficherMessageCopie(
            "Il n'y a aucun repas à copier.",
            "erreur"
        );

        return;

    }


    if (
        boutonValiderCopieSemaine
    ) {

        boutonValiderCopieSemaine.disabled =
            true;


        boutonValiderCopieSemaine.textContent =
            "Copie…";

    }


    try {

        /*
            On recrée chaque repas
            avec exactement le même
            décalage dans la semaine.
        */

        const lignes =
            repasSemaine.map(
                function (
                    repas
                ) {

                    const dateOriginale =
                        creerDateDepuisISO(
                            repas.date
                        );


                    const nouvelleDate =
                        ajouterJours(
                            dateOriginale,
                            decalage
                        );


                    return {

                        foyer_id:
                            foyerId,

                        date:
                            formaterDateISO(
                                nouvelleDate
                            ),

                        moment:
                            repas.moment,

                        nom:
                            repas.nom,

                        recette_id:
                            repas.recette_id,

                        personnes:
                            repas.personnes,

                        created_by:
                            utilisateurConnecte.id

                    };

                }
            );


        const dateFinDestination =
            ajouterJours(
                nouveauDebut,
                6
            );


        /*
            On vide d'abord la semaine
            de destination pour éviter
            les doublons.
        */

        const {
            error: erreurSuppression
        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .delete()
                .eq(
                    "foyer_id",
                    foyerId
                )
                .gte(
                    "date",
                    formaterDateISO(
                        nouveauDebut
                    )
                )
                .lte(
                    "date",
                    formaterDateISO(
                        dateFinDestination
                    )
                );


        if (
            erreurSuppression
        ) {

            throw erreurSuppression;

        }


        const {
            error: erreurInsertion
        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .insert(
                    lignes
                );


        if (
            erreurInsertion
        ) {

            throw erreurInsertion;

        }


        afficherMessageCopie(
            "La semaine a bien été copiée.",
            "succes"
        );


        /*
            Petit délai uniquement pour
            laisser voir la confirmation.
        */

        window.setTimeout(
            function () {

                fermerPopupCopie();

            },
            700
        );


    } catch (
        erreur
    ) {

        console.error(
            "Erreur copie semaine :",
            erreur
        );


        afficherMessageCopie(
            erreur.message ||
            "Impossible de copier la semaine.",
            "erreur"
        );


    } finally {

        if (
            boutonValiderCopieSemaine
        ) {

            boutonValiderCopieSemaine.disabled =
                false;


            boutonValiderCopieSemaine.textContent =
                "Copier les repas";

        }

    }

}

/* =================================
   CLICS DANS LE PLANNING
================================= */

if (
    grilleSemaine
) {

    grilleSemaine.addEventListener(
        "click",
        function (
            evenement
        ) {

            /* =========================
               AJOUTER UN REPAS
            ========================= */

            const boutonAjouter =
                evenement.target.closest(
                    ".bouton-ajouter-repas"
                );


            if (
                boutonAjouter
            ) {

                const dateISO =
                    boutonAjouter.dataset.date;


                const moment =
                    boutonAjouter.dataset.moment;


                if (
                    !dateISO ||
                    !moment
                ) {

                    console.error(
                        "Date ou moment manquant sur le bouton Ajouter."
                    );

                    return;
                }


                ouvrirPopup(
                    dateISO,
                    moment,
                    null
                );


                return;
            }


            /* =========================
               MODIFIER UN REPAS
            ========================= */

            const boutonModifier =
                evenement.target.closest(
                    ".bouton-editer-repas"
                );


            if (
                boutonModifier
            ) {

                const repasId =
                    boutonModifier.dataset.repasId;


                const repas =
                    trouverRepasParId(
                        repasId
                    );


                if (
                    !repas
                ) {

                    console.error(
                        "Repas introuvable :",
                        repasId
                    );

                    return;
                }


                ouvrirPopup(
                    repas.date,
                    repas.moment,
                    repas
                );


                return;
            }

        }
    );

}

/* =================================
ÉVÉNEMENTS NAVIGATION
================================= */

if (
    boutonSemainePrecedente
) {

    boutonSemainePrecedente
        .addEventListener(
            "click",
            function () {

                changerSemaine(
                    -1
                );

            }
        );

}


if (
    boutonSemaineSuivante
) {

    boutonSemaineSuivante
        .addEventListener(
            "click",
            function () {

                changerSemaine(
                    1
                );

            }
        );

}


if (
    boutonAujourdhui
) {

    boutonAujourdhui
        .addEventListener(
            "click",
            revenirAujourdhui
        );

}


/* =================================
ÉVÉNEMENTS POPUP REPAS
================================= */

if (
    boutonFermerPopupRepas
) {

    boutonFermerPopupRepas
        .addEventListener(
            "click",
            fermerPopupMultiRepas
        );

}


if (
    champRechercheRecette
) {

    champRechercheRecette
        .addEventListener(
            "input",
            function () {

                afficherResultatsRecettes(
                    champRechercheRecette
                        .value
                );

            }
        );

}


if (
    boutonAjouterPlatManuel
) {

    boutonAjouterPlatManuel
        .addEventListener(
            "click",
            ajouterPlatManuel
        );

}


if (
    champNomRepasLibre
) {

    champNomRepasLibre
        .addEventListener(
            "keydown",
            function (
                evenement
            ) {

                if (
                    evenement.key ===
                    "Enter"
                ) {

                    evenement.preventDefault();


                    ajouterPlatManuel();

                }

            }
        );

}


if (
    boutonValiderRepas
) {

    boutonValiderRepas
        .addEventListener(
            "click",
            enregistrerCreneauComplet
        );

}


if (
    boutonSupprimerRepas
) {

    boutonSupprimerRepas
        .addEventListener(
            "click",
            viderCreneau
        );

}


/* =================================
FERMER EN CLIQUANT SUR LE FOND
================================= */

if (
    popupRepas
) {

    popupRepas.addEventListener(
        "click",
        function (
            evenement
        ) {

            if (
                evenement.target ===
                popupRepas
            ) {

                fermerPopupMultiRepas();

            }

        }
    );

}


/* =================================
ÉVÉNEMENTS COPIE
================================= */

if (
    boutonCopierSemaine
) {

    boutonCopierSemaine
        .addEventListener(
            "click",
            ouvrirPopupCopie
        );

}


if (
    boutonFermerCopieSemaine
) {

    boutonFermerCopieSemaine
        .addEventListener(
            "click",
            fermerPopupCopie
        );

}


if (
    boutonValiderCopieSemaine
) {

    boutonValiderCopieSemaine
        .addEventListener(
            "click",
            validerCopieSemaine
        );

}


if (
    popupCopieSemaine
) {

    popupCopieSemaine
        .addEventListener(
            "click",
            function (
                evenement
            ) {

                if (
                    evenement.target ===
                    popupCopieSemaine
                ) {

                    fermerPopupCopie();

                }

            }
        );

}


/* =================================
TOUCHE ÉCHAP
================================= */

document.addEventListener(
    "keydown",
    function (
        evenement
    ) {

        if (
            evenement.key !==
            "Escape"
        ) {
            return;
        }


        if (
            popupRepas &&
            !popupRepas.hidden
        ) {

            fermerPopupMultiRepas();

            return;

        }


        if (
            popupCopieSemaine &&
            !popupCopieSemaine.hidden
        ) {

            fermerPopupCopie();

        }

    }
);


/* =================================
PERMETTRE À planning-ui.js
D'OUVRIR LA NOUVELLE POPUP
================================= */

/*
    Très important.

    Quand planning-ui.js crée les boutons
    "+ Ajouter", il pourra appeler :

    window.ouvrirPopupMultiRepas(
        date,
        "midi"
    );

    ou :

    window.ouvrirPopupMultiRepas(
        date,
        "soir"
    );
*/

window.ouvrirPopupMultiRepas =
    ouvrirPopupMultiRepas;


/* =================================
CHARGEMENT INITIAL
================================= */

async function initialiserPlanning() {

    console.log(
        "Initialisation du planning…"
    );


    try {

        /*
            1. UTILISATEUR + FOYER
        */

        const utilisateurValide =
            await recupererUtilisateurEtFoyer();


        if (
            !utilisateurValide
        ) {

            return;

        }


        /*
            2. INFORMATIONS DU HEADER

            Cette fonction vient normalement
            de session.js.

            On ne bloque surtout pas le
            planning si elle n'existe pas.
        */

        if (
            typeof chargerInformationsUtilisateur ===
            "function"
        ) {

            try {

                await chargerInformationsUtilisateur();

            } catch (
                erreur
            ) {

                console.warn(
                    "Impossible de charger les informations du header :",
                    erreur
                );

            }

        }


        /*
            3. NOMBRE DE PERSONNES
        */

        await chargerNombrePersonnesParDefaut();


        /*
            4. RECETTES
        */

        await chargerRecettes();


        /*
            5. SEMAINE ACTUELLE
        */

        debutSemaine =
            obtenirDebutSemaine(
                new Date()
            );


        /*
            6. REPAS
        */

        await chargerRepasSemaine();


        /*
            7. AFFICHAGE
        */

        afficherSemaine();


        console.log(
            "Planning chargé avec succès."
        );


    } catch (
        erreur
    ) {

        console.error(
            "ERREUR INITIALISATION PLANNING :",
            erreur
        );


        if (
            titreSemaine
        ) {

            titreSemaine.textContent =
                "Erreur de chargement";

        }


        if (
            grilleSemaine
        ) {

            grilleSemaine.innerHTML = `
                <div class="erreur-chargement-planning">

                    <strong>
                        Impossible de charger le planning.
                    </strong>

                    <p>
                        ${
                            echapperHTML(
                                erreur.message ||
                                "Une erreur est survenue."
                            )
                        }
                    </p>

                </div>
            `;

        }

    }

}


/* =================================
DÉMARRAGE
================================= */

initialiserPlanning();
