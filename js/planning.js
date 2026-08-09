/* =================================
   ÉLÉMENTS HTML
================================= */

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

const numeroSemaine =
    document.getElementById(
        "numero-semaine"
    );

const titreSemaine =
    document.getElementById(
        "titre-semaine"
    );


/* POP-UP */

const popupRepas =
    document.getElementById(
        "popup-repas"
    );

const boutonFermerPopup =
    document.getElementById(
        "fermer-popup-repas"
    );

const datePopupRepas =
    document.getElementById(
        "date-popup-repas"
    );

const boutonChoisirRecette =
    document.getElementById(
        "choisir-recette"
    );

const boutonChoisirLibre =
    document.getElementById(
        "choisir-libre"
    );

const blocRecettePlanning =
    document.getElementById(
        "bloc-recette-planning"
    );

const blocRepasLibre =
    document.getElementById(
        "bloc-repas-libre"
    );

const champRechercheRecette =
    document.getElementById(
        "recherche-recette-planning"
    );

const resultatsRecettes =
    document.getElementById(
        "resultats-recettes-planning"
    );

const champRepasLibre =
    document.getElementById(
        "nom-repas-libre"
    );

const boutonValiderRepasLibre =
    document.getElementById(
        "valider-repas-libre"
    );

const messagePlanning =
    document.getElementById(
        "message-planning"
    );


/* =================================
   VARIABLES
================================= */

let utilisateurConnecte =
    null;

let foyerId =
    null;

let debutSemaine =
    obtenirDebutSemaine(
        new Date()
    );

let repasSemaine =
    [];

let recettes =
    [];


/*
    Ces deux variables indiquent
    quelle case du planning est
    actuellement en cours d'édition.
*/

let dateSelectionnee =
    null;

let momentSelectionne =
    null;


/* =================================
   OUTILS DATES
================================= */

function obtenirDebutSemaine(
    date
) {

    const resultat =
        new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );


    /*
        getDay :
        dimanche = 0
        lundi = 1
        ...
    */

    const jour =
        resultat.getDay();


    const decalage =
        jour === 0
            ? -6
            : 1 - jour;


    resultat.setDate(
        resultat.getDate() +
        decalage
    );


    resultat.setHours(
        0,
        0,
        0,
        0
    );


    return resultat;
}


function ajouterJours(
    date,
    nombre
) {

    const resultat =
        new Date(date);


    resultat.setDate(
        resultat.getDate() +
        nombre
    );


    return resultat;
}


function formaterDateISO(
    date
) {

    const annee =
        date.getFullYear();

    const mois =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const jour =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${annee}-${mois}-${jour}`;
}


function formaterDateCourte(
    date
) {

    return date.toLocaleDateString(
        "fr-FR",
        {
            day: "numeric",
            month: "short"
        }
    );
}


function formaterDateLongue(
    date
) {

    return date.toLocaleDateString(
        "fr-FR",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );
}


function capitaliser(
    texte
) {

    if (!texte) {
        return "";
    }


    return (
        texte.charAt(0).toUpperCase() +
        texte.slice(1)
    );
}


/* =================================
   NUMÉRO DE SEMAINE ISO
================================= */

function obtenirNumeroSemaine(
    date
) {

    const copie =
        new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            )
        );


    const jour =
        copie.getUTCDay() || 7;


    copie.setUTCDate(
        copie.getUTCDate() +
        4 -
        jour
    );


    const premierJanvier =
        new Date(
            Date.UTC(
                copie.getUTCFullYear(),
                0,
                1
            )
        );


    return Math.ceil(
        (
            (
                copie -
                premierJanvier
            ) /
            86400000 +
            1
        ) /
        7
    );
}


/* =================================
   VÉRIFIER AUJOURD'HUI
================================= */

function estAujourdhui(
    date
) {

    const maintenant =
        new Date();


    return (
        date.getFullYear() ===
            maintenant.getFullYear() &&

        date.getMonth() ===
            maintenant.getMonth() &&

        date.getDate() ===
            maintenant.getDate()
    );
}


/* =================================
   UTILISATEUR ET FOYER
================================= */

async function recupererUtilisateurEtFoyer() {

    const {
        data: donneesUtilisateur,
        error: erreurUtilisateur
    } =
        await window.supabaseClient
            .auth
            .getUser();


    if (erreurUtilisateur) {
        throw erreurUtilisateur;
    }


    utilisateurConnecte =
        donneesUtilisateur.user;


    if (!utilisateurConnecte) {

        window.location.href =
            "compte.html";

        return false;
    }


    const {
        data: membre,
        error: erreurMembre
    } =
        await window.supabaseClient
            .from(
                "membres_foyer"
            )
            .select(
                "foyer_id"
            )
            .eq(
                "user_id",
                utilisateurConnecte.id
            )
            .limit(1)
            .maybeSingle();


    if (erreurMembre) {
        throw erreurMembre;
    }


    if (!membre) {

        window.location.href =
            "foyer.html";

        return false;
    }


    foyerId =
        membre.foyer_id;


    return true;
}


/* =================================
   CHARGER LES RECETTES
================================= */

async function chargerRecettes() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "recettes"
            )
            .select(
                "id, nom"
            )
            .order(
                "nom",
                {
                    ascending: true
                }
            );


    if (error) {
        throw error;
    }


    recettes =
        Array.isArray(data)
            ? data
            : [];
}


/* =================================
   CHARGER LES REPAS
   DE LA SEMAINE
================================= */

async function chargerRepasSemaine() {

    const finSemaine =
        ajouterJours(
            debutSemaine,
            6
        );


    const dateDebut =
        formaterDateISO(
            debutSemaine
        );

    const dateFin =
        formaterDateISO(
            finSemaine
        );


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "repas_planning"
            )
            .select(
                `
                id,
                foyer_id,
                date,
                moment,
                nom,
                recette_id,
                created_by
                `
            )
            .eq(
                "foyer_id",
                foyerId
            )
            .gte(
                "date",
                dateDebut
            )
            .lte(
                "date",
                dateFin
            );


    if (error) {
        throw error;
    }


    repasSemaine =
        Array.isArray(data)
            ? data
            : [];
}


/* =================================
   TROUVER UN REPAS
================================= */

function trouverRepas(
    date,
    moment
) {

    const dateISO =
        formaterDateISO(
            date
        );


    return repasSemaine.find(
        function (repas) {

            return (
                repas.date ===
                    dateISO &&

                repas.moment ===
                    moment
            );

        }
    );
}


/* =================================
   CRÉER UN CRÉNEAU
================================= */

function creerCreneauRepas(
    date,
    moment
) {

    const repas =
        trouverRepas(
            date,
            moment
        );


    const titreMoment =
        moment === "midi"
            ? "Midi"
            : "Soir";


    let contenu = "";


    if (repas) {

        if (
            repas.recette_id
        ) {

            contenu = `

                <a
                    href="recette.html?id=${encodeURIComponent(
                        repas.recette_id
                    )}"
                    class="repas-planifie"
                >
                    ${repas.nom}
                </a>

            `;

        } else {

            contenu = `

                <div
                    class="repas-planifie"
                >
                    ${repas.nom}
                </div>

            `;

        }

    } else {

        contenu = `

            <button
                type="button"
                class="bouton-ajouter-repas"
                data-date="${formaterDateISO(
                    date
                )}"
                data-moment="${moment}"
            >
                + Ajouter
            </button>

        `;

    }


    return `

        <div class="creneau-repas">

            <span class="titre-creneau">
                ${titreMoment}
            </span>

            ${contenu}

        </div>

    `;
}


/* =================================
   AFFICHER LA SEMAINE
================================= */

function afficherSemaine() {

    const finSemaine =
        ajouterJours(
            debutSemaine,
            6
        );


    numeroSemaine.textContent =
        `Semaine ${
            obtenirNumeroSemaine(
                debutSemaine
            )
        }`;


    /*
        Si la semaine est sur deux mois,
        on affiche par exemple :
        31 août – 6 septembre 2026
    */

    titreSemaine.textContent =
        `${formaterDateCourte(
            debutSemaine
        )} – ${
            finSemaine.toLocaleDateString(
                "fr-FR",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )
        }`;


    const jours = [];


    for (
        let index = 0;
        index < 7;
        index++
    ) {

        const date =
            ajouterJours(
                debutSemaine,
                index
            );


        const nomJour =
            date.toLocaleDateString(
                "fr-FR",
                {
                    weekday: "long"
                }
            );


        jours.push(`

            <article
                class="jour-planning ${
                    estAujourdhui(date)
                        ? "aujourdhui"
                        : ""
                }"
            >

                <div class="entete-jour">

                    <span class="nom-jour">
                        ${capitaliser(
                            nomJour
                        )}
                    </span>

                    <div class="date-jour">
                        ${formaterDateCourte(
                            date
                        )}
                    </div>

                </div>


                ${creerCreneauRepas(
                    date,
                    "midi"
                )}


                ${creerCreneauRepas(
                    date,
                    "soir"
                )}

            </article>

        `);

    }


    grilleSemaine.innerHTML =
        jours.join("");
}


/* =================================
   RAFRAÎCHIR LE PLANNING
================================= */

async function rafraichirPlanning() {

    grilleSemaine.innerHTML =
        `
            <p>
                Chargement du planning…
            </p>
        `;


    try {

        await chargerRepasSemaine();

        afficherSemaine();


    } catch (erreur) {

        console.error(
            "Erreur chargement planning :",
            erreur
        );


        grilleSemaine.innerHTML =
            `
                <p>
                    Impossible de charger le planning.
                </p>
            `;

    }
}


/* =================================
   NAVIGATION SEMAINE
================================= */

boutonSemainePrecedente
    .addEventListener(
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


boutonSemaineSuivante
    .addEventListener(
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


boutonAujourdhui
    .addEventListener(
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
   POP-UP
================================= */

function ouvrirPopup(
    dateISO,
    moment
) {

    dateSelectionnee =
        dateISO;

    momentSelectionne =
        moment;


    const date =
        new Date(
            `${dateISO}T12:00:00`
        );


    const momentTexte =
        moment === "midi"
            ? "Midi"
            : "Soir";


    datePopupRepas.textContent =
        `${capitaliser(
            formaterDateLongue(
                date
            )
        )} • ${momentTexte}`;


    /*
        On remet la popup
        sur l'onglet recettes
        à chaque ouverture.
    */

    afficherModeRecette();


    champRechercheRecette.value =
        "";

    champRepasLibre.value =
        "";

    messagePlanning.textContent =
        "";


    afficherResultatsRecettes(
        ""
    );


    popupRepas.hidden =
        false;


    document.body.style.overflow =
        "hidden";
}


function fermerPopup() {

    popupRepas.hidden =
        true;


    document.body.style.overflow =
        "";


    dateSelectionnee =
        null;

    momentSelectionne =
        null;


    messagePlanning.textContent =
        "";
}


/* =================================
   CLIQUER SUR + AJOUTER
================================= */

grilleSemaine.addEventListener(
    "click",
    function (evenement) {

        const bouton =
            evenement.target.closest(
                ".bouton-ajouter-repas"
            );


        if (!bouton) {
            return;
        }


        ouvrirPopup(
            bouton.dataset.date,
            bouton.dataset.moment
        );

    }
);


/* =================================
   FERMER POP-UP
================================= */

boutonFermerPopup
    .addEventListener(
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
            evenement.key ===
                "Escape" &&
            !popupRepas.hidden
        ) {

            fermerPopup();

        }

    }
);


/* =================================
   TYPE DE REPAS
================================= */

function afficherModeRecette() {

    boutonChoisirRecette
        .classList
        .add(
            "actif"
        );


    boutonChoisirLibre
        .classList
        .remove(
            "actif"
        );


    blocRecettePlanning.hidden =
        false;

    blocRepasLibre.hidden =
        true;
}


function afficherModeLibre() {

    boutonChoisirLibre
        .classList
        .add(
            "actif"
        );


    boutonChoisirRecette
        .classList
        .remove(
            "actif"
        );


    blocRecettePlanning.hidden =
        true;

    blocRepasLibre.hidden =
        false;


    setTimeout(
        function () {

            champRepasLibre.focus();

        },
        50
    );
}


boutonChoisirRecette
    .addEventListener(
        "click",
        afficherModeRecette
    );


boutonChoisirLibre
    .addEventListener(
        "click",
        afficherModeLibre
    );


/* =================================
   RECHERCHE RECETTES
================================= */

function afficherResultatsRecettes(
    recherche
) {

    const texte =
        recherche
            .trim()
            .toLowerCase();


    const recettesFiltrees =
        recettes
            .filter(
                function (recette) {

                    return recette.nom
                        .toLowerCase()
                        .includes(
                            texte
                        );

                }
            )
            .slice(
                0,
                12
            );


    if (
        recettesFiltrees.length === 0
    ) {

        resultatsRecettes.innerHTML =
            `
                <p>
                    Aucune recette trouvée.
                </p>
            `;

        return;
    }


    resultatsRecettes.innerHTML =
        recettesFiltrees
            .map(
                function (recette) {

                    return `

                        <button
                            type="button"
                            class="resultat-recette-planning"
                            data-recette-id="${recette.id}"
                        >
                            ${recette.nom}
                        </button>

                    `;

                }
            )
            .join("");
}


champRechercheRecette
    .addEventListener(
        "input",
        function () {

            afficherResultatsRecettes(
                champRechercheRecette.value
            );

        }
    );


/* =================================
   ENREGISTRER UN REPAS
================================= */

async function enregistrerRepas(
    nom,
    recetteId = null
) {

    if (
        !dateSelectionnee ||
        !momentSelectionne
    ) {

        throw new Error(
            "Le créneau du repas n'est pas défini."
        );

    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "repas_planning"
            )
            .insert({

                foyer_id:
                    foyerId,

                date:
                    dateSelectionnee,

                moment:
                    momentSelectionne,

                nom:
                    nom,

                recette_id:
                    recetteId,

                created_by:
                    utilisateurConnecte.id

            })
            .select(
                "id"
            )
            .single();


    if (error) {
        throw error;
    }


    return data;
}


/* =================================
   AJOUT DEPUIS UNE RECETTE
================================= */

resultatsRecettes.addEventListener(
    "click",
    async function (
        evenement
    ) {

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
                        String(
                            element.id
                        ) ===
                        String(
                            bouton.dataset.recetteId
                        )
                    );

                }
            );


        if (!recette) {
            return;
        }


        messagePlanning.textContent =
            "Ajout en cours…";


        try {

            bouton.disabled =
                true;


            await enregistrerRepas(
                recette.nom,
                recette.id
            );


            fermerPopup();


            await rafraichirPlanning();


        } catch (erreur) {

            console.error(
                "Erreur ajout recette au planning :",
                erreur
            );


            messagePlanning.textContent =
                erreur.message ||
                "Impossible d'ajouter le repas.";


            bouton.disabled =
                false;

        }

    }
);


/* =================================
   REPAS LIBRE
================================= */

boutonValiderRepasLibre
    .addEventListener(
        "click",
        async function () {

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
                "Ajout…";


            messagePlanning.textContent =
                "";


            try {

                await enregistrerRepas(
                    nom,
                    null
                );


                fermerPopup();


                await rafraichirPlanning();


            } catch (erreur) {

                console.error(
                    "Erreur ajout repas libre :",
                    erreur
                );


                messagePlanning.textContent =
                    erreur.message ||
                    "Impossible d'ajouter le repas.";


            } finally {

                boutonValiderRepasLibre.disabled =
                    false;


                boutonValiderRepasLibre.textContent =
                    "Ajouter au planning";

            }

        }
    );


/*
    Permet de valider le repas libre
    avec la touche Entrée.
*/

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
   INITIALISATION
================================= */

async function initialiserPlanning() {

    try {

        grilleSemaine.innerHTML =
            `
                <p>
                    Chargement du planning…
                </p>
            `;


        const utilisateurPret =
            await recupererUtilisateurEtFoyer();


        if (!utilisateurPret) {
            return;
        }


        await chargerRecettes();


        await chargerRepasSemaine();


        afficherSemaine();


    } catch (erreur) {

        console.error(
            "Erreur d'initialisation du planning :",
            erreur
        );


        grilleSemaine.innerHTML =
            `
                <p>
                    Impossible de charger le planning.
                    ${erreur.message || ""}
                </p>
            `;

    }

}


initialiserPlanning();
