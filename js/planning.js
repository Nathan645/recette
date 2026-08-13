/* =================================
   PLANNING.JS
   À notre table

   Ce fichier gère :
   - les éléments HTML
   - la composition multi-plats
   - le nombre de personnes
   - la suppression personnalisée
   - les clics du planning
   - la navigation des semaines
   - la copie d'une semaine
   - l'initialisation
================================= */


/* =================================
   ÉLÉMENTS HTML
================================= */


/* =========================
   SEMAINE
========================= */

const grilleSemaine =
    document.getElementById(
        "grille-semaine"
    );

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

const numeroSemaine =
    document.getElementById(
        "numero-semaine"
    );

const titreSemaine =
    document.getElementById(
        "titre-semaine"
    );


/* =========================
   POPUP REPAS
========================= */

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


/* =========================
   PERSONNES
========================= */

const champPersonnesRepas =
    document.getElementById(
        "personnes-repas"
    );

const boutonDiminuerPersonnes =
    document.getElementById(
        "diminuer-personnes"
    );

const boutonAugmenterPersonnes =
    document.getElementById(
        "augmenter-personnes"
    );


/* =========================
   ÉLÉMENTS DU REPAS
========================= */

const listeElementsRepas =
    document.getElementById(
        "liste-elements-repas"
    );

const popupRecettesLieesPlanning =
    document.getElementById(
        "popup-recettes-liees-planning"
    );


const listeRecettesLieesPlanning =
    document.getElementById(
        "liste-recettes-liees-planning"
    );


const boutonAnnulerRecettesLieesPlanning =
    document.getElementById(
        "annuler-recettes-liees-planning"
    );


const boutonConfirmerRecettesLieesPlanning =
    document.getElementById(
        "confirmer-recettes-liees-planning"
    );


/* =========================
   RECHERCHE RECETTE
========================= */

const champRechercheRecette =
    document.getElementById(
        "recherche-recette-planning"
    );

const resultatsRecettesPlanning =
    document.getElementById(
        "resultats-recettes-planning"
    );


/* =========================
   PLAT LIBRE
========================= */

const champNomRepasLibre =
    document.getElementById(
        "nom-repas-libre"
    );

const boutonAjouterPlatManuel =
    document.getElementById(
        "ajouter-plat-manuel"
    );


/* =========================
   ACTIONS REPAS
========================= */

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


/* =========================
   CONFIRMATION SUPPRESSION
========================= */

const popupConfirmationSuppression =
    document.getElementById(
        "popup-confirmation-suppression"
    );

const texteConfirmationSuppression =
    document.getElementById(
        "texte-confirmation-suppression"
    );

const boutonAnnulerSuppression =
    document.getElementById(
        "annuler-suppression-repas"
    );

const boutonConfirmerSuppression =
    document.getElementById(
        "confirmer-suppression-repas"
    );


/* =========================
   POPUP COPIE SEMAINE
========================= */

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
   ÉTAT DE LA POPUP
================================= */

let elementsRepasEnCours =
    [];


/* =================================
   MESSAGES
================================= */

function afficherMessagePlanning(
    texte,
    type = ""
) {

    if (
        !messagePlanning
    ) {
        return;
    }


    messagePlanning.textContent =
        texte;


    messagePlanning.classList.remove(
        "erreur",
        "succes"
    );


    if (
        type
    ) {

        messagePlanning.classList.add(
            type
        );

    }

}


function afficherMessageCopie(
    texte,
    type = ""
) {

    if (
        !messageCopieSemaine
    ) {
        return;
    }


    messageCopieSemaine.textContent =
        texte;


    messageCopieSemaine.classList.remove(
        "erreur",
        "succes"
    );


    if (
        type
    ) {

        messageCopieSemaine.classList.add(
            type
        );

    }

}


/* =================================
   SÉCURISER TEXTE HTML
================================= */

function echapperHTML(
    texte
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(
            texte ?? ""
        );


    return element.innerHTML;
}


/* =================================
   NOMBRE DE PERSONNES
================================= */

function obtenirNombrePersonnesPopup() {

    const valeur =
        Number(
            champPersonnesRepas.value
        );


    if (
        Number.isInteger(
            valeur
        ) &&
        valeur >= 1
    ) {

        return valeur;

    }


    return 1;
}


function definirNombrePersonnesPopup(
    nombre
) {

    let nouvelleValeur =
        Number(
            nombre
        );


    if (
        !Number.isInteger(
            nouvelleValeur
        ) ||
        nouvelleValeur < 1
    ) {

        nouvelleValeur =
            1;

    }


    champPersonnesRepas.value =
        nouvelleValeur;
}


function diminuerNombrePersonnes() {

    const nombreActuel =
        obtenirNombrePersonnesPopup();


    definirNombrePersonnesPopup(
        Math.max(
            1,
            nombreActuel - 1
        )
    );

}


function augmenterNombrePersonnes() {

    const nombreActuel =
        obtenirNombrePersonnesPopup();


    definirNombrePersonnesPopup(
        nombreActuel + 1
    );

}


/* =================================
   AFFICHER LES PLATS
================================= */

function afficherElementsRepasEnCours() {

    if (
        !listeElementsRepas
    ) {
        return;
    }


    listeElementsRepas.innerHTML =
        "";


    if (
        elementsRepasEnCours.length ===
        0
    ) {

        const blocVide =
            document.createElement(
                "div"
            );


        blocVide.className =
            "message-elements-vide";


        blocVide.innerHTML = `

            <span class="icone-liste-vide">
                🍽️
            </span>

            <div>

                <strong>
                    Le repas est encore vide
                </strong>

                <p>
                    Ajoutez une recette ou un plat libre ci-dessous.
                </p>

            </div>

        `;


        listeElementsRepas.appendChild(
            blocVide
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


            /* =========================
               ICÔNE
            ========================= */

            const icone =
                document.createElement(
                    "div"
                );


            icone.className =
                "icone-element-repas";


            icone.textContent =
                element.recette_id
                    ? "🍴"
                    : "✍️";


            /* =========================
               INFORMATIONS
            ========================= */

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
                element.recette_id
                    ? "Recette enregistrée"
                    : "Ajout libre";


            informations.appendChild(
                nom
            );


            informations.appendChild(
                type
            );


            /* =========================
               SUPPRIMER DE LA LISTE
            ========================= */

            const boutonRetirer =
                document.createElement(
                    "button"
                );


            boutonRetirer.type =
                "button";


            boutonRetirer.className =
                "supprimer-element-repas";


            boutonRetirer.textContent =
                "×";


            boutonRetirer.setAttribute(
                "aria-label",
                `Retirer ${element.nom}`
            );


            boutonRetirer.addEventListener(
                "click",
                function () {

                    elementsRepasEnCours.splice(
                        index,
                        1
                    );


                    afficherElementsRepasEnCours();


                    afficherMessagePlanning(
                        ""
                    );

                }
            );


            /* =========================
               CONSTRUCTION
            ========================= */

            ligne.appendChild(
                icone
            );


            ligne.appendChild(
                informations
            );


            ligne.appendChild(
                boutonRetirer
            );


            listeElementsRepas.appendChild(
                ligne
            );

        }
    );

}


/* =================================
   RECHERCHE RECETTES
================================= */

function afficherResultatsRecettes(
    recherche = ""
) {

    if (
        !resultatsRecettesPlanning
    ) {
        return;
    }


    resultatsRecettesPlanning.innerHTML =
        "";


    const texte =
        String(
            recherche
        )
            .trim()
            .toLowerCase();


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
        texte
    ) {

        recettesFiltrees =
            recettes.filter(
                function (
                    recette
                ) {

                    return String(
                        recette.nom ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            texte
                        );

                }
            );

    }


    recettesFiltrees =
        recettesFiltrees.slice(
            0,
            10
        );


    if (
        recettesFiltrees.length ===
        0
    ) {

        const message =
            document.createElement(
                "div"
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


            /* =========================
               NOM
            ========================= */

            const zoneNom =
                document.createElement(
                    "span"
                );


            zoneNom.className =
                "nom-resultat-recette";


            zoneNom.textContent =
                recette.nom;


            /* =========================
               PLUS
            ========================= */

            const plus =
                document.createElement(
                    "span"
                );


            plus.className =
                "plus-resultat-recette";


            plus.textContent =
                "+";


            bouton.appendChild(
                zoneNom
            );


            bouton.appendChild(
                plus
            );


            bouton.dataset.recetteId =
                recette.id;


            bouton.addEventListener(
                "click",
                function () {

                    ajouterRecetteDansPopup(
                        recette
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
   AJOUTER UNE RECETTE
================================= */

function ajouterRecetteDansPopup(
    recette
) {

    if (
        !recette
    ) {
        return;
    }


    const existeDeja =
        elementsRepasEnCours.some(
            function (
                element
            ) {

                return (
                    element.recette_id &&
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
        existeDeja
    ) {

        afficherMessagePlanning(
            "Cette recette est déjà présente dans le repas.",
            "erreur"
        );


        return;
    }


    elementsRepasEnCours.push(
        {

            id:
                null,

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


    champRechercheRecette.value =
        "";


    afficherResultatsRecettes(
        ""
    );

}


/* =================================
   AJOUTER UN PLAT LIBRE
================================= */

function ajouterPlatManuel() {

    const nom =
        champNomRepasLibre
            .value
            .trim();


    if (
        !nom
    ) {

        afficherMessagePlanning(
            "Indique le nom de ce que tu souhaites ajouter.",
            "erreur"
        );


        champNomRepasLibre.focus();


        return;
    }


    elementsRepasEnCours.push(
        {

            id:
                null,

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
   ENREGISTRER LE REPAS
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
        elementsRepasEnCours.length ===
        0
    ) {

        afficherMessagePlanning(
            "Ajoute au moins un plat avant de terminer le repas.",
            "erreur"
        );


        return;
    }


    const personnes =
        obtenirNombrePersonnesPopup();


    boutonValiderRepas.disabled =
        true;


    boutonValiderRepas.textContent =
        "Enregistrement…";


    afficherMessagePlanning(
        ""
    );


    try {

        if (
            repasEnModification
        ) {

            await modifierRepasComplet(
                repasEnModification.id,
                elementsRepasEnCours,
                personnes
            );

        } else {

            await enregistrerRepasComplet(
                elementsRepasEnCours,
                personnes
            );

        }


        await rafraichirPlanning();


        fermerPopup();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur enregistrement repas :",
            erreur
        );


        afficherMessagePlanning(
            erreur.message ||
            "Impossible d'enregistrer le repas.",
            "erreur"
        );


    } finally {

        boutonValiderRepas.disabled =
            false;


        boutonValiderRepas.textContent =
            repasEnModification
                ? "Enregistrer le repas"
                : "Terminer le repas";

    }

}


/* =================================
   OUVRIR CONFIRMATION SUPPRESSION
================================= */

function ouvrirConfirmationSuppression() {

    if (
        !repasEnModification
    ) {

        return;
    }


    /*
        On personnalise légèrement
        le texte avec le créneau.
    */

    let texte =
        "Tous les plats prévus pour ce repas seront supprimés.";


    if (
        datePopupRepas &&
        datePopupRepas.textContent
    ) {

        texte =
            `Tous les plats prévus pour ${datePopupRepas.textContent.toLowerCase()} seront supprimés.`;

    }


    texteConfirmationSuppression.textContent =
        texte;


    popupConfirmationSuppression.hidden =
        false;

}


/* =================================
   FERMER CONFIRMATION SUPPRESSION
================================= */

function fermerConfirmationSuppression() {

    popupConfirmationSuppression.hidden =
        true;


    boutonConfirmerSuppression.disabled =
        false;


    boutonConfirmerSuppression.textContent =
        "Vider le créneau";

}


/* =================================
   SUPPRIMER RÉELLEMENT LE REPAS
================================= */

async function confirmerSuppressionRepas() {

    if (
        !repasEnModification
    ) {

        fermerConfirmationSuppression();

        return;
    }


    boutonConfirmerSuppression.disabled =
        true;


    boutonConfirmerSuppression.textContent =
        "Suppression…";


    boutonSupprimerRepas.disabled =
        true;


    try {

        await supprimerRepas();


        await rafraichirPlanning();


        fermerConfirmationSuppression();


        fermerPopup();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur suppression repas :",
            erreur
        );


        fermerConfirmationSuppression();


        afficherMessagePlanning(
            erreur.message ||
            "Impossible de supprimer le repas.",
            "erreur"
        );


    } finally {

        boutonSupprimerRepas.disabled =
            false;


        boutonSupprimerRepas.textContent =
            "Vider ce créneau";

    }

}


/* =================================
   CLICS DANS LA GRILLE
================================= */

grilleSemaine.addEventListener(
    "click",
    function (
        evenement
    ) {

        /* =========================
           + AJOUTER
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
                    "Date ou moment absent."
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
           MODIFIER
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


/* =================================
   PERSONNES + / -
================================= */

boutonDiminuerPersonnes.addEventListener(
    "click",
    diminuerNombrePersonnes
);


boutonAugmenterPersonnes.addEventListener(
    "click",
    augmenterNombrePersonnes
);


champPersonnesRepas.addEventListener(
    "change",
    function () {

        definirNombrePersonnesPopup(
            champPersonnesRepas.value
        );

    }
);


/* =================================
   RECHERCHE RECETTE
================================= */

champRechercheRecette.addEventListener(
    "input",
    function () {

        afficherResultatsRecettes(
            champRechercheRecette.value
        );

    }
);


/* =================================
   AJOUT PLAT MANUEL
================================= */

boutonAjouterPlatManuel.addEventListener(
    "click",
    ajouterPlatManuel
);


champNomRepasLibre.addEventListener(
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


/* =================================
   VALIDATION REPAS
================================= */

boutonValiderRepas.addEventListener(
    "click",
    enregistrerCreneauComplet
);


/* =================================
   SUPPRESSION
================================= */

/*
    Plus de window.confirm().
*/

boutonSupprimerRepas.addEventListener(
    "click",
    ouvrirConfirmationSuppression
);


boutonAnnulerSuppression.addEventListener(
    "click",
    fermerConfirmationSuppression
);


boutonConfirmerSuppression.addEventListener(
    "click",
    confirmerSuppressionRepas
);


/* =================================
   CLIC FOND CONFIRMATION
================================= */

popupConfirmationSuppression.addEventListener(
    "click",
    function (
        evenement
    ) {

        if (
            evenement.target ===
            popupConfirmationSuppression
        ) {

            fermerConfirmationSuppression();

        }

    }
);


/* =================================
   FERMER POPUP REPAS
================================= */

boutonFermerPopupRepas.addEventListener(
    "click",
    fermerPopup
);


popupRepas.addEventListener(
    "click",
    function (
        evenement
    ) {

        if (
            evenement.target ===
            popupRepas
        ) {

            fermerPopup();

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
   POPUP COPIE SEMAINE
================================= */

function ouvrirPopupCopieSemaine() {

    if (
        !popupCopieSemaine
    ) {

        return;
    }


    messageCopieSemaine.textContent =
        "";


    popupCopieSemaine.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


function fermerPopupCopieSemaine() {

    if (
        !popupCopieSemaine
    ) {

        return;
    }


    popupCopieSemaine.hidden =
        true;


    document.body.style.overflow =
        "";


    messageCopieSemaine.textContent =
        "";

}


/* =================================
   COPIER LA SEMAINE
================================= */

async function copierSemainePlanning() {

    const choix =
        document.querySelector(
            'input[name="destination-copie-semaine"]:checked'
        );


    if (
        !choix
    ) {

        afficherMessageCopie(
            "Choisis la semaine de destination.",
            "erreur"
        );


        return;
    }


    if (
        repasSemaine.length ===
        0
    ) {

        afficherMessageCopie(
            "Il n'y a aucun repas à copier.",
            "erreur"
        );


        return;
    }


    const decalage =
        choix.value ===
            "precedente"
            ? -7
            : 7;


    boutonValiderCopieSemaine.disabled =
        true;


    boutonValiderCopieSemaine.textContent =
        "Copie…";


    try {

        /* =========================
           DATES DESTINATION
        ========================= */

        const debutDestination =
            ajouterJours(
                debutSemaine,
                decalage
            );


        const finDestination =
            ajouterJours(
                debutDestination,
                6
            );


        /* =========================
           CRÉNEAUX EXISTANTS
        ========================= */

        const {
            data: repasDestination,
            error: erreurDestination
        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .select(
                    "date, moment"
                )
                .eq(
                    "foyer_id",
                    foyerId
                )
                .gte(
                    "date",
                    formaterDateISO(
                        debutDestination
                    )
                )
                .lte(
                    "date",
                    formaterDateISO(
                        finDestination
                    )
                );


        if (
            erreurDestination
        ) {

            throw erreurDestination;

        }


        const occupations =
            Array.isArray(
                repasDestination
            )
                ? repasDestination
                : [];


        let nombreCopies =
            0;


        let nombreIgnores =
            0;


        /* =========================
           COPIER CHAQUE REPAS
        ========================= */

        for (
            const repasSource
            of repasSemaine
        ) {

            const dateSource =
                creerDateDepuisISO(
                    repasSource.date
                );


            const dateDestination =
                ajouterJours(
                    dateSource,
                    decalage
                );


            const dateDestinationISO =
                formaterDateISO(
                    dateDestination
                );


            const estOccupe =
                occupations.some(
                    function (
                        repas
                    ) {

                        return (
                            repas.date ===
                                dateDestinationISO &&
                            repas.moment ===
                                repasSource.moment
                        );

                    }
                );


            if (
                estOccupe
            ) {

                nombreIgnores++;


                continue;
            }


            /* =========================
               ÉLÉMENTS DU REPAS
            ========================= */

            let elements =
                Array.isArray(
                    repasSource.elements
                )
                    ? repasSource.elements
                    : [];


            /*
                Compatibilité anciens repas.
            */

            if (
                elements.length ===
                    0 &&
                repasSource.nom
            ) {

                elements = [

                    {

                        recette_id:
                            repasSource.recette_id ||
                            null,

                        nom:
                            repasSource.nom

                    }

                ];

            }


            if (
                elements.length ===
                0
            ) {

                continue;
            }


            /* =========================
               PARENT
            ========================= */

            const premierElement =
                elements[0];


            const {
                data: nouveauRepas,
                error: erreurRepas
            } =
                await window.supabaseClient
                    .from(
                        "repas_planning"
                    )
                    .insert({

                        foyer_id:
                            foyerId,

                        date:
                            dateDestinationISO,

                        moment:
                            repasSource.moment,

                        nom:
                            premierElement.nom,

                        recette_id:
                            premierElement.recette_id ||
                            null,

                        personnes:
                            repasSource.personnes,

                        created_by:
                            utilisateurConnecte.id

                    })
                    .select(
                        "id"
                    )
                    .single();


            if (
                erreurRepas
            ) {

                throw erreurRepas;

            }


            /* =========================
               ENFANTS
            ========================= */

            const lignesElements =
                elements.map(
                    function (
                        element,
                        index
                    ) {

                        return {

                            repas_planning_id:
                                nouveauRepas.id,

                            recette_id:
                                element.recette_id ||
                                null,

                            nom:
                                element.nom,

                            ordre:
                                index + 1

                        };

                    }
                );


            const {
                error: erreurElements
            } =
                await window.supabaseClient
                    .from(
                        "repas_planning_elements"
                    )
                    .insert(
                        lignesElements
                    );


            if (
                erreurElements
            ) {

                await window.supabaseClient
                    .from(
                        "repas_planning"
                    )
                    .delete()
                    .eq(
                        "id",
                        nouveauRepas.id
                    );


                throw erreurElements;

            }


            occupations.push(
                {

                    date:
                        dateDestinationISO,

                    moment:
                        repasSource.moment

                }
            );


            nombreCopies++;

        }


        /* =========================
           MESSAGE
        ========================= */

        if (
            nombreCopies ===
                0 &&
            nombreIgnores >
                0
        ) {

            afficherMessageCopie(
                `Aucun repas copié : ${nombreIgnores} créneau${
                    nombreIgnores > 1
                        ? "x sont"
                        : " est"
                } déjà occupé${
                    nombreIgnores > 1
                        ? "s"
                        : ""
                }.`,
                "erreur"
            );

        } else {

            let texte =
                `${nombreCopies} repas copié${
                    nombreCopies > 1
                        ? "s"
                        : ""
                }.`;


            if (
                nombreIgnores >
                0
            ) {

                texte +=
                    ` ${nombreIgnores} créneau${
                        nombreIgnores > 1
                            ? "x"
                            : ""
                    } déjà occupé${
                        nombreIgnores > 1
                            ? "s"
                            : ""
                    }.`;

            }


            afficherMessageCopie(
                texte,
                "succes"
            );

        }


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
    function (
        evenement
    ) {

        if (
            evenement.target ===
            popupCopieSemaine
        ) {

            fermerPopupCopieSemaine();

        }

    }
);


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


        /*
            Priorité à la confirmation
            de suppression.
        */

        if (
            popupConfirmationSuppression &&
            !popupConfirmationSuppression.hidden
        ) {

            fermerConfirmationSuppression();


            return;
        }


        if (
            popupRepas &&
            !popupRepas.hidden
        ) {

            fermerPopup();


            return;
        }


        if (
            popupCopieSemaine &&
            !popupCopieSemaine.hidden
        ) {

            fermerPopupCopieSemaine();

        }

    }
);


/* =================================
   INITIALISATION
================================= */

async function initialiserPlanning() {

    console.log(
        "Initialisation du planning…"
    );


    try {

        /* =========================
           UTILISATEUR + FOYER
        ========================= */

        const utilisateurValide =
            await recupererUtilisateurEtFoyer();


        if (
            !utilisateurValide
        ) {

            return;
        }


        /* =========================
           PERSONNES PAR DÉFAUT
        ========================= */

        await chargerNombrePersonnesParDefaut();


        /* =========================
           RECETTES
        ========================= */

        await chargerRecettes();


        /* =========================
           SEMAINE ACTUELLE
        ========================= */

        debutSemaine =
            obtenirDebutSemaine(
                new Date()
            );


        /* =========================
           REPAS
        ========================= */

        await chargerRepasSemaine();


        /* =========================
           AFFICHAGE
        ========================= */

        afficherSemaine();


        console.log(
            "Planning chargé."
        );


    } catch (
        erreur
    ) {

        console.error(
            "ERREUR INITIALISATION PLANNING :",
            erreur
        );


        titreSemaine.textContent =
            "Erreur de chargement";


        grilleSemaine.innerHTML = `

            <div class="erreur-chargement-planning">

                <strong>
                    Impossible de charger le planning.
                </strong>

                <p>
                    ${echapperHTML(
                        erreur.message ||
                        "Une erreur est survenue."
                    )}
                </p>

            </div>

        `;

    }

}


/* =================================
   DÉMARRAGE
================================= */

initialiserPlanning();
