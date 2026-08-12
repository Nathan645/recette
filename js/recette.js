/* =================================
   ÉLÉMENTS PRINCIPAUX
================================= */

const contenuRecette =
    document.getElementById(
        "fiche-recette-contenu"
    );


const galerieRecette =
    document.getElementById(
        "galerie-recette"
    );


const carouselRecette =
    document.getElementById(
        "carousel-recette"
    );


const carouselImagesRecette =
    document.getElementById(
        "carousel-images-recette"
    );


const boutonPhotoPrecedente =
    document.getElementById(
        "photo-precedente"
    );


const boutonPhotoSuivante =
    document.getElementById(
        "photo-suivante"
    );


const indicateursCarouselRecette =
    document.getElementById(
        "indicateurs-carousel-recette"
    );


/* =================================
   ÉLÉMENTS POPUP PLANNING
================================= */

const popupAjoutPlanning =
    document.getElementById(
        "popup-ajout-planning"
    );


const fermerPopupPlanning =
    document.getElementById(
        "fermer-popup-planning"
    );


const annulerAjoutPlanning =
    document.getElementById(
        "annuler-ajout-planning"
    );


const nomRecettePopupPlanning =
    document.getElementById(
        "nom-recette-popup-planning"
    );


const dateAjoutPlanning =
    document.getElementById(
        "date-ajout-planning"
    );


const boutonMomentMidi =
    document.getElementById(
        "moment-planning-midi"
    );


const boutonMomentSoir =
    document.getElementById(
        "moment-planning-soir"
    );


const diminuerPersonnesPlanning =
    document.getElementById(
        "diminuer-personnes-planning"
    );


const augmenterPersonnesPlanning =
    document.getElementById(
        "augmenter-personnes-planning"
    );


const nombrePersonnesPlanning =
    document.getElementById(
        "nombre-personnes-planning"
    );


const messagePopupPlanning =
    document.getElementById(
        "message-popup-planning"
    );


const confirmerAjoutPlanning =
    document.getElementById(
        "confirmer-ajout-planning"
    );


/* =================================
   POPUP CONFIRMATION PLANNING
================================= */

const popupConfirmationPlanning =
    document.getElementById(
        "popup-confirmation-planning"
    );


const texteConfirmationPlanning =
    document.getElementById(
        "texte-confirmation-planning"
    );


const annulerConfirmationPlanning =
    document.getElementById(
        "annuler-confirmation-planning"
    );


const confirmerAjoutMalgreRepas =
    document.getElementById(
        "confirmer-ajout-malgre-repas"
    );


/* =================================
   ÉLÉMENTS MODE CUISINE
================================= */

const modeCuisine =
    document.getElementById(
        "mode-cuisine"
    );


const fermerModeCuisine =
    document.getElementById(
        "fermer-mode-cuisine"
    );


const nomRecetteModeCuisine =
    document.getElementById(
        "mode-cuisine-nom-recette"
    );


const ingredientsModeCuisine =
    document.getElementById(
        "mode-cuisine-ingredients"
    );


const contenuIngredientsCuisine =
    document.getElementById(
        "contenu-ingredients-cuisine"
    );


const boutonReplierIngredientsCuisine =
    document.getElementById(
        "replier-ingredients-cuisine"
    );


const numeroEtapeCuisine =
    document.getElementById(
        "numero-etape-cuisine"
    );


const totalEtapesCuisine =
    document.getElementById(
        "total-etapes-cuisine"
    );


const barreProgressionCuisine =
    document.getElementById(
        "barre-progression-cuisine"
    );


const texteEtapeCuisine =
    document.getElementById(
        "texte-etape-cuisine"
    );


const boutonEtapeCuisinePrecedente =
    document.getElementById(
        "etape-cuisine-precedente"
    );


const boutonEtapeCuisineSuivante =
    document.getElementById(
        "etape-cuisine-suivante"
    );


const boutonMinuteurEtapeCuisine =
    document.getElementById(
        "minuteur-etape-cuisine"
    );


/* =================================
   ÉLÉMENTS MINUTEURS CUISINE
================================= */

const zoneMinuteursCuisine =
    document.getElementById(
        "zone-minuteurs-cuisine"
    );


const listeMinuteursCuisine =
    document.getElementById(
        "liste-minuteurs-cuisine"
    );


const boutonAjouterMinuteurCuisine =
    document.getElementById(
        "ajouter-minuteur-cuisine"
    );


const popupMinuteurCuisine =
    document.getElementById(
        "popup-minuteur-cuisine"
    );


const fermerPopupMinuteurCuisine =
    document.getElementById(
        "fermer-popup-minuteur"
    );


const annulerMinuteurCuisine =
    document.getElementById(
        "annuler-minuteur-cuisine"
    );


const lancerMinuteurCuisine =
    document.getElementById(
        "lancer-minuteur-cuisine"
    );


const nomMinuteurCuisine =
    document.getElementById(
        "nom-minuteur-cuisine"
    );


const minutesMinuteurCuisine =
    document.getElementById(
        "minutes-minuteur-cuisine"
    );


const secondesMinuteurCuisine =
    document.getElementById(
        "secondes-minuteur-cuisine"
    );


const messageMinuteurCuisine =
    document.getElementById(
        "message-minuteur-cuisine"
    );


/* =================================
   PARAMÈTRES URL
================================= */

const parametres =
    new URLSearchParams(
        window.location.search
    );


const identifiantRecette =
    parametres.get(
        "id"
    );


/* =================================
   ÉTAT RECETTE
================================= */

let utilisateurConnecte =
    null;


let recetteChargee =
    null;


/*
    Photos chargées depuis Supabase.

    Chaque élément contient :

    {
        id,
        recette_id,
        chemin,
        ordre,
        url
    }
*/

let photosRecette =
    [];


/*
    Index de la photo actuellement
    affichée dans le carousel.
*/

let indexPhotoActive =
    0;


/*
    Positions utilisées pour
    le swipe mobile.
*/

let positionTouchDebut =
    null;


let positionTouchFin =
    null;


/* =================================
   ÉTAT PLANNING
================================= */

let foyerIdPlanning =
    null;


let personnesParDefautPlanning =
    1;


let momentSelectionnePlanning =
    "midi";


let personnesSelectionneesPlanning =
    1;


let repasExistantPlanning =
    null;


/* =================================
   ÉTAT MODE CUISINE
================================= */

/*
    Numéro de l'étape actuellement
    affichée.

    Index interne :
    0 = première étape.
*/

let indexEtapeCuisine =
    0;


/*
    Indique si le panneau
    ingrédients est actuellement
    replié.
*/

let ingredientsCuisineReplies =
    false;


/*
    Nombre de personnes utilisé
    dans le mode cuisine.

    Il reprendra par défaut le nombre
    prévu dans la recette.
*/

let personnesModeCuisine =
    1;


/* =================================
   ÉTAT DES MINUTEURS
================================= */

/*
    Plusieurs minuteurs peuvent
    fonctionner simultanément.

    Exemple :

    {
        id: "...",
        nom: "Cuisson du riz",
        dureeInitiale: 900,
        secondesRestantes: 720,
        actif: true,
        termine: false,
        heureFin: 1234567890,
        etapeIndex: 2
    }
*/

let minuteursCuisine =
    [];


/*
    Interval global.

    On utilise UN SEUL setInterval
    pour mettre à jour tous les
    minuteurs en même temps.
*/

let intervalMinuteursCuisine =
    null;


/*
    Étape qui a demandé l'ouverture
    du minuteur.

    null = minuteur libre.

    nombre = minuteur associé
    à une étape.
*/

let indexEtapeMinuteurEnCreation =
    null;


/* =================================
   STOCKAGE LOCAL MODE CUISINE
================================= */

/*
    On sauvegarde les minuteurs
    localement pour qu'ils continuent
    même si l'utilisateur quitte
    momentanément le mode cuisine.

    La clé dépend de la recette.
*/

function obtenirCleStockageMinuteursCuisine() {

    if (
        !identifiantRecette
    ) {

        return null;
    }


    return (
        "a-notre-table-minuteurs-" +
        identifiantRecette
    );
}


/* =================================
   IDENTIFIANT LOCAL
================================= */

function creerIdentifiantLocalCuisine() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
            "function"
    ) {

        return window.crypto.randomUUID();
    }


    return (
        Date.now().toString(
            36
        ) +
        "-" +
        Math.random()
            .toString(
                36
            )
            .slice(
                2
            )
    );
}


/* =================================
   OUTILS DATE PLANNING
================================= */

function obtenirDateAujourdhuiPlanning() {

    const maintenant =
        new Date();


    const annee =
        maintenant.getFullYear();


    const mois =
        String(
            maintenant.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const jour =
        String(
            maintenant.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${annee}-${mois}-${jour}`;
}


/* =================================
   FORMATER DATE PLANNING
================================= */

function formaterDatePlanning(
    dateTexte
) {

    if (
        !dateTexte
    ) {

        return "";
    }


    const morceaux =
        dateTexte.split(
            "-"
        );


    if (
        morceaux.length !==
        3
    ) {

        return dateTexte;
    }


    const date =
        new Date(
            Number(
                morceaux[0]
            ),
            Number(
                morceaux[1]
            ) - 1,
            Number(
                morceaux[2]
            )
        );


    return date.toLocaleDateString(
        "fr-FR",
        {

            weekday:
                "long",

            day:
                "numeric",

            month:
                "long"

        }
    );
}


/* =================================
   OUTILS TEMPS CUISINE
================================= */

/*
    Transforme un nombre de secondes
    en :

    04:32

    ou

    1:04:32
*/

function formaterTempsCuisine(
    secondesTotales
) {

    const secondesPropres =
        Math.max(
            0,
            Math.floor(
                Number(
                    secondesTotales
                ) || 0
            )
        );


    const heures =
        Math.floor(
            secondesPropres /
            3600
        );


    const minutes =
        Math.floor(
            (
                secondesPropres %
                3600
            ) /
            60
        );


    const secondes =
        secondesPropres %
        60;


    if (
        heures >
        0
    ) {

        return (
            `${heures}:` +
            `${String(
                minutes
            ).padStart(
                2,
                "0"
            )}:` +
            `${String(
                secondes
            ).padStart(
                2,
                "0"
            )}`
        );
    }


    return (
        `${String(
            minutes
        ).padStart(
            2,
            "0"
        )}:` +
        `${String(
            secondes
        ).padStart(
            2,
            "0"
        )}`
    );
}


/* =================================
   CONVERTIR DURÉE EN SECONDES
================================= */

function convertirDureeCuisineEnSecondes(
    minutes,
    secondes
) {

    const minutesNombre =
        Math.max(
            0,
            Number(
                minutes
            ) || 0
        );


    const secondesNombre =
        Math.max(
            0,
            Math.min(
                59,
                Number(
                    secondes
                ) || 0
            )
        );


    return (
        Math.floor(
            minutesNombre
        ) *
        60 +
        Math.floor(
            secondesNombre
        )
    );
}


/* =================================
   CHARGEMENT DE LA RECETTE
================================= */

async function chargerRecette() {

    try {

        if (
            !identifiantRecette
        ) {

            throw new Error(
                "Aucune recette n’a été sélectionnée."
            );
        }


        /* =========================
           UTILISATEUR CONNECTÉ
        ========================= */

        const {
            data:
                donneesUtilisateur,

            error:
                erreurUtilisateur

        } =
            await window.supabaseClient
                .auth
                .getUser();


        if (
            erreurUtilisateur
        ) {

            throw erreurUtilisateur;
        }


        utilisateurConnecte =
            donneesUtilisateur.user;


        if (
            !utilisateurConnecte
        ) {

            window.location.href =
                "compte.html";


            return;
        }


        /* =========================
           FOYER / PLANNING
        ========================= */

        await chargerFoyerPlanning();


        /* =========================
           RECETTE
        ========================= */

        const {
            data,
            error
        } =
            await window.supabaseClient
                .from(
                    "recettes"
                )
                .select("*")
                .eq(
                    "id",
                    identifiantRecette
                )
                .single();


        if (
            error
        ) {

            throw error;
        }


        if (
            !data
        ) {

            throw new Error(
                "Cette recette n’existe pas."
            );
        }


        recetteChargee =
            data;


        /*
            Valeur initiale du mode cuisine.
        */

        personnesModeCuisine =
            Math.max(
                1,
                Number(
                    recetteChargee.personnes
                ) || 1
            );


        /* =========================
           PHOTOS
        ========================= */

        await chargerPhotosRecette(
            identifiantRecette
        );


        /* =========================
           AFFICHAGE
        ========================= */

        afficherGalerieRecette();


        afficherRecette(
            recetteChargee
        );


        /*
            On récupère les éventuels
            minuteurs déjà actifs pour
            cette recette.

            Leur gestion complète arrive
            dans les prochaines parties.
        */

        chargerMinuteursCuisineDepuisStockage();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur de chargement de la recette :",
            erreur
        );


        if (
            galerieRecette
        ) {

            galerieRecette.hidden =
                true;
        }


        if (
            contenuRecette
        ) {

            contenuRecette.innerHTML = `

                <div class="message">

                    <h1>
                        Recette introuvable
                    </h1>

                    <p>
                        ${
                            echapperHtmlRecette(
                                erreur?.message ||
                                "Cette recette n’existe pas."
                            )
                        }
                    </p>

                    <a href="index.html">
                        Retourner à toutes les recettes
                    </a>

                </div>

            `;
        }
    }
}


/* =================================
   CHARGER LE FOYER
================================= */

async function chargerFoyerPlanning() {

    foyerIdPlanning =
        null;


    personnesParDefautPlanning =
        1;


    personnesSelectionneesPlanning =
        1;


    if (
        !utilisateurConnecte
    ) {

        return;
    }


    const {
        data:
            membreFoyer,

        error:
            erreurMembre

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
            .maybeSingle();


    if (
        erreurMembre
    ) {

        throw erreurMembre;
    }


    if (
        !membreFoyer?.foyer_id
    ) {

        return;
    }


    foyerIdPlanning =
        membreFoyer.foyer_id;


    const {
        data:
            foyer,

        error:
            erreurFoyer

    } =
        await window.supabaseClient
            .from(
                "foyers"
            )
            .select(
                "personnes_par_defaut"
            )
            .eq(
                "id",
                foyerIdPlanning
            )
            .maybeSingle();


    if (
        erreurFoyer
    ) {

        throw erreurFoyer;
    }


    const nombre =
        Number(
            foyer?.personnes_par_defaut
        );


    if (
        Number.isFinite(
            nombre
        ) &&
        nombre >=
            1
    ) {

        personnesParDefautPlanning =
            Math.round(
                nombre
            );
    }


    personnesSelectionneesPlanning =
        personnesParDefautPlanning;
}


/* =================================
   CHARGER LES PHOTOS
================================= */

async function chargerPhotosRecette(
    recetteId
) {

    photosRecette =
        [];


    if (
        !recetteId
    ) {

        return;
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "recette_photos"
            )
            .select(
                "id, recette_id, chemin, ordre"
            )
            .eq(
                "recette_id",
                recetteId
            )
            .order(
                "ordre",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        throw error;
    }


    const lignes =
        Array.isArray(
            data
        )
            ? data
            : [];


    if (
        lignes.length ===
        0
    ) {

        photosRecette =
            [];


        return;
    }


    photosRecette =
        await Promise.all(
            lignes.map(
                async function (
                    photo
                ) {

                    const url =
                        await creerUrlPhotoRecette(
                            photo.chemin
                        );


                    return {

                        ...photo,

                        url:
                            url

                    };
                }
            )
        );


    photosRecette =
        photosRecette.filter(
            function (
                photo
            ) {

                return Boolean(
                    photo.url
                );
            }
        );


    indexPhotoActive =
        0;
}


/* =================================
   CRÉER UNE URL SIGNÉE
================================= */

async function creerUrlPhotoRecette(
    chemin
) {

    if (
        !chemin
    ) {

        return "";
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .storage
            .from(
                "recettes"
            )
            .createSignedUrl(
                chemin,
                60 * 60
            );


    if (
        error
    ) {

        console.error(
            "Impossible de charger une photo :",
            error
        );


        return "";
    }


    return (
        data?.signedUrl ||
        ""
    );
}


/* =================================
   OUTILS HTML
================================= */

function echapperHtmlRecette(
    valeur
) {

    return String(
        valeur ??
        ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =================================
   BADGES
================================= */

function creerBadges(
    valeurs,
    classeSupplementaire = ""
) {

    if (
        !Array.isArray(
            valeurs
        ) ||
        valeurs.length ===
            0
    ) {

        return "";
    }


    const noms = {

        "Grogros":
            "Grogros",

        "gros-gros":
            "Grogros",

        "healthy":
            "Healthy",

        "végé":
            "Végé",

        "rapide":
            "Rapide",

        "pour-recevoir":
            "Pour recevoir",

        "a-preparer-avance":
            "À préparer à l'avance",

        "quotidien":
            "Quotidien",

        "brunch":
            "Brunch",

        "barbecue":
            "Barbecue",

        "fetes":
            "Fêtes",

        "invites":
            "Invités",

        "apero-dinatoire":
            "Apéro dînatoire",

        "printemps":
            "Printemps",

        "été":
            "Été",

        "automne":
            "Automne",

        "hiver":
            "Hiver",

        "toute-annee":
            "Toute l'année"

    };


    return valeurs
        .map(
            function (
                valeur
            ) {

                return `

                    <span
                        class="badge-recette ${classeSupplementaire}"
                    >
                        ${
                            echapperHtmlRecette(
                                noms[valeur] ||
                                valeur
                            )
                        }
                    </span>

                `;
            }
        )
        .join("");
}


/* =================================
   QUANTITÉS
================================= */

function formaterQuantite(
    valeur
) {

    if (
        Number.isInteger(
            valeur
        )
    ) {

        return valeur.toString();
    }


    return valeur
        .toFixed(
            2
        )
        .replace(
            /\.00$/,
            ""
        )
        .replace(
            /0$/,
            ""
        )
        .replace(
            ".",
            ","
        );
}

/* =================================
   AFFICHER LA GALERIE
================================= */

function afficherGalerieRecette() {

    if (
        !galerieRecette ||
        !carouselImagesRecette
    ) {

        return;
    }


    if (
        !Array.isArray(
            photosRecette
        ) ||
        photosRecette.length ===
            0
    ) {

        galerieRecette.hidden =
            true;


        carouselImagesRecette.innerHTML =
            "";


        if (
            indicateursCarouselRecette
        ) {

            indicateursCarouselRecette.innerHTML =
                "";

            indicateursCarouselRecette.hidden =
                true;
        }


        if (
            boutonPhotoPrecedente
        ) {

            boutonPhotoPrecedente.hidden =
                true;
        }


        if (
            boutonPhotoSuivante
        ) {

            boutonPhotoSuivante.hidden =
                true;
        }


        return;
    }


    galerieRecette.hidden =
        false;


    carouselImagesRecette.innerHTML =
        photosRecette
            .map(
                function (
                    photo,
                    index
                ) {

                    return `

                        <div
                            class="slide-recette ${
                                index ===
                                indexPhotoActive
                                    ? "active"
                                    : ""
                            }"
                            data-index-photo="${index}"
                        >

                            <img
                                src="${photo.url}"
                                alt="Photo ${index + 1} de ${echapperHtmlRecette(
                                    recetteChargee?.nom ||
                                    "la recette"
                                )}"
                                loading="${
                                    index ===
                                    0
                                        ? "eager"
                                        : "lazy"
                                }"
                            >

                        </div>

                    `;
                }
            )
            .join("");


    if (
        photosRecette.length ===
        1
    ) {

        if (
            boutonPhotoPrecedente
        ) {

            boutonPhotoPrecedente.hidden =
                true;
        }


        if (
            boutonPhotoSuivante
        ) {

            boutonPhotoSuivante.hidden =
                true;
        }


        if (
            indicateursCarouselRecette
        ) {

            indicateursCarouselRecette.innerHTML =
                "";

            indicateursCarouselRecette.hidden =
                true;
        }


        return;
    }


    if (
        boutonPhotoPrecedente
    ) {

        boutonPhotoPrecedente.hidden =
            false;
    }


    if (
        boutonPhotoSuivante
    ) {

        boutonPhotoSuivante.hidden =
            false;
    }


    afficherIndicateursCarousel();
}


/* =================================
   INDICATEURS CAROUSEL
================================= */

function afficherIndicateursCarousel() {

    if (
        !indicateursCarouselRecette
    ) {

        return;
    }


    if (
        photosRecette.length <=
        1
    ) {

        indicateursCarouselRecette.innerHTML =
            "";

        indicateursCarouselRecette.hidden =
            true;


        return;
    }


    indicateursCarouselRecette.hidden =
        false;


    indicateursCarouselRecette.innerHTML =
        photosRecette
            .map(
                function (
                    photo,
                    index
                ) {

                    return `

                        <button
                            type="button"
                            class="indicateur-carousel-recette ${
                                index ===
                                indexPhotoActive
                                    ? "actif"
                                    : ""
                            }"
                            data-index-photo="${index}"
                            aria-label="Afficher la photo ${index + 1}"
                            aria-current="${
                                index ===
                                indexPhotoActive
                                    ? "true"
                                    : "false"
                            }"
                        ></button>

                    `;
                }
            )
            .join("");
}


/* =================================
   CHANGER DE PHOTO
================================= */

function afficherPhotoCarousel(
    nouvelIndex
) {

    if (
        photosRecette.length <=
        1
    ) {

        return;
    }


    if (
        nouvelIndex <
        0
    ) {

        nouvelIndex =
            photosRecette.length -
            1;
    }


    if (
        nouvelIndex >=
        photosRecette.length
    ) {

        nouvelIndex =
            0;
    }


    indexPhotoActive =
        nouvelIndex;


    const slides =
        carouselImagesRecette
            .querySelectorAll(
                ".slide-recette"
            );


    slides.forEach(
        function (
            slide,
            index
        ) {

            slide.classList.toggle(
                "active",
                index ===
                indexPhotoActive
            );
        }
    );


    if (
        indicateursCarouselRecette
    ) {

        const indicateurs =
            indicateursCarouselRecette
                .querySelectorAll(
                    ".indicateur-carousel-recette"
                );


        indicateurs.forEach(
            function (
                indicateur,
                index
            ) {

                const actif =
                    index ===
                    indexPhotoActive;


                indicateur.classList.toggle(
                    "actif",
                    actif
                );


                indicateur.setAttribute(
                    "aria-current",
                    actif
                        ? "true"
                        : "false"
                );
            }
        );
    }
}


/* =================================
   PHOTO PRÉCÉDENTE / SUIVANTE
================================= */

function afficherPhotoPrecedente() {

    afficherPhotoCarousel(
        indexPhotoActive -
        1
    );
}


function afficherPhotoSuivante() {

    afficherPhotoCarousel(
        indexPhotoActive +
        1
    );
}


/* =================================
   FLÈCHES CAROUSEL
================================= */

if (
    boutonPhotoPrecedente
) {

    boutonPhotoPrecedente.addEventListener(
        "click",
        afficherPhotoPrecedente
    );
}


if (
    boutonPhotoSuivante
) {

    boutonPhotoSuivante.addEventListener(
        "click",
        afficherPhotoSuivante
    );
}


/* =================================
   INDICATEURS CAROUSEL
================================= */

if (
    indicateursCarouselRecette
) {

    indicateursCarouselRecette.addEventListener(
        "click",
        function (
            evenement
        ) {

            const indicateur =
                evenement.target.closest(
                    ".indicateur-carousel-recette"
                );


            if (
                !indicateur
            ) {

                return;
            }


            const index =
                Number(
                    indicateur.dataset.indexPhoto
                );


            if (
                !Number.isInteger(
                    index
                )
            ) {

                return;
            }


            afficherPhotoCarousel(
                index
            );
        }
    );
}


/* =================================
   SWIPE MOBILE CAROUSEL
================================= */

if (
    carouselRecette
) {

    carouselRecette.addEventListener(
        "touchstart",
        function (
            evenement
        ) {

            if (
                photosRecette.length <=
                1
            ) {

                return;
            }


            const touche =
                evenement.touches[
                    0
                ];


            if (
                !touche
            ) {

                return;
            }


            positionTouchDebut =
                touche.clientX;


            positionTouchFin =
                null;
        },
        {
            passive:
                true
        }
    );


    carouselRecette.addEventListener(
        "touchmove",
        function (
            evenement
        ) {

            if (
                positionTouchDebut ===
                null
            ) {

                return;
            }


            const touche =
                evenement.touches[
                    0
                ];


            if (
                !touche
            ) {

                return;
            }


            positionTouchFin =
                touche.clientX;
        },
        {
            passive:
                true
        }
    );


    carouselRecette.addEventListener(
        "touchend",
        function () {

            if (
                positionTouchDebut ===
                    null ||
                positionTouchFin ===
                    null
            ) {

                positionTouchDebut =
                    null;

                positionTouchFin =
                    null;


                return;
            }


            const difference =
                positionTouchFin -
                positionTouchDebut;


            if (
                Math.abs(
                    difference
                ) <
                45
            ) {

                positionTouchDebut =
                    null;

                positionTouchFin =
                    null;


                return;
            }


            if (
                difference <
                0
            ) {

                afficherPhotoSuivante();

            } else {

                afficherPhotoPrecedente();
            }


            positionTouchDebut =
                null;


            positionTouchFin =
                null;
        },
        {
            passive:
                true
        }
    );
}


/* =================================
   CLAVIER CAROUSEL
================================= */

document.addEventListener(
    "keydown",
    function (
        evenement
    ) {

        /*
            Si le mode cuisine est ouvert,
            les flèches seront utilisées
            pour les étapes et non
            pour les photos.

            La gestion arrivera
            dans la partie 3.
        */

        if (
            modeCuisine &&
            !modeCuisine.hidden
        ) {

            return;
        }


        if (
            !galerieRecette ||
            galerieRecette.hidden ||
            photosRecette.length <=
                1
        ) {

            return;
        }


        const cible =
            evenement.target;


        if (
            cible &&
            (
                cible.tagName ===
                    "INPUT" ||
                cible.tagName ===
                    "TEXTAREA" ||
                cible.tagName ===
                    "SELECT"
            )
        ) {

            return;
        }


        if (
            evenement.key ===
            "ArrowLeft"
        ) {

            afficherPhotoPrecedente();

        } else if (
            evenement.key ===
            "ArrowRight"
        ) {

            afficherPhotoSuivante();
        }
    }
);


/* =================================
   POP-UP DE SUPPRESSION
================================= */

function demanderConfirmationSuppression() {

    return new Promise(
        function (
            resolve
        ) {

            const fond =
                document.createElement(
                    "div"
                );


            fond.className =
                "fond-popup";


            fond.innerHTML = `

                <div
                    class="popup-suppression"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titre-popup-suppression"
                >

                    <div class="icone-suppression">
                        🗑️
                    </div>

                    <h2 id="titre-popup-suppression">
                        Supprimer cette recette ?
                    </h2>

                    <p>
                        Cette action est définitive.
                        La recette ainsi que ses photos
                        seront supprimées.
                    </p>

                    <div class="actions-popup">

                        <button
                            type="button"
                            class="bouton-annuler-suppression"
                            id="annuler-suppression"
                        >
                            Annuler
                        </button>

                        <button
                            type="button"
                            class="bouton-confirmer-suppression"
                            id="confirmer-suppression"
                        >
                            Supprimer
                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(
                fond
            );


            const boutonAnnuler =
                document.getElementById(
                    "annuler-suppression"
                );


            const boutonConfirmer =
                document.getElementById(
                    "confirmer-suppression"
                );


            function fermerPopup(
                resultat
            ) {

                fond.remove();


                resolve(
                    resultat
                );
            }


            boutonAnnuler.addEventListener(
                "click",
                function () {

                    fermerPopup(
                        false
                    );
                }
            );


            boutonConfirmer.addEventListener(
                "click",
                function () {

                    fermerPopup(
                        true
                    );
                }
            );


            fond.addEventListener(
                "click",
                function (
                    evenement
                ) {

                    if (
                        evenement.target ===
                        fond
                    ) {

                        fermerPopup(
                            false
                        );
                    }
                }
            );
        }
    );
}


/* =================================
   SUPPRESSION PHOTOS STORAGE
================================= */

async function supprimerPhotosRecetteStorage() {

    if (
        !Array.isArray(
            photosRecette
        ) ||
        photosRecette.length ===
            0
    ) {

        return;
    }


    const chemins =
        photosRecette
            .map(
                function (
                    photo
                ) {

                    return photo.chemin;
                }
            )
            .filter(
                Boolean
            );


    if (
        chemins.length ===
        0
    ) {

        return;
    }


    const {
        error
    } =
        await window.supabaseClient
            .storage
            .from(
                "recettes"
            )
            .remove(
                chemins
            );


    if (
        error
    ) {

        throw error;
    }
}


/* =================================
   SUPPRIMER LA RECETTE
================================= */

async function supprimerRecette() {

    if (
        !recetteChargee ||
        !utilisateurConnecte ||
        recetteChargee.created_by !==
            utilisateurConnecte.id
    ) {

        window.alert(
            "Vous ne pouvez pas supprimer cette recette."
        );


        return;
    }


    const confirmationSuppression =
        await demanderConfirmationSuppression();


    if (
        !confirmationSuppression
    ) {

        return;
    }


    const boutonSupprimer =
        document.getElementById(
            "supprimer-recette"
        );


    if (
        !boutonSupprimer
    ) {

        return;
    }


    boutonSupprimer.disabled =
        true;


    boutonSupprimer.textContent =
        "Suppression…";


    try {

        await supprimerPhotosRecetteStorage();


        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "recettes"
                )
                .delete()
                .eq(
                    "id",
                    identifiantRecette
                )
                .eq(
                    "created_by",
                    utilisateurConnecte.id
                );


        if (
            error
        ) {

            throw error;
        }


        window.location.href =
            "index.html";


    } catch (
        erreur
    ) {

        console.error(
            "Erreur pendant la suppression :",
            erreur
        );


        boutonSupprimer.disabled =
            false;


        boutonSupprimer.textContent =
            "Supprimer la recette";


        window.alert(
            erreur.message ||
            "La recette n’a pas pu être supprimée."
        );
    }
}


/* =================================
   AFFICHAGE DE LA RECETTE
================================= */

function afficherRecette(
    recette
) {

    document.title =
        `${recette.nom} | À notre table`;


    /* =========================
       PROPRIÉTAIRE
    ========================= */

    const estCreateur =
        Boolean(
            utilisateurConnecte &&
            recette.created_by &&
            recette.created_by ===
                utilisateurConnecte.id
        );


    /* =========================
       ACTION PLANNING
    ========================= */

    const boutonPlanningHtml = `

        <button
            type="button"
            class="bouton-ajouter-planning-recette"
            id="ajouter-recette-planning"
        >
            Ajouter au planning
        </button>

    `;


    /* =========================
       MODE CUISINE
    ========================= */

    const boutonModeCuisineHtml = `

        <button
            type="button"
            class="bouton-mode-cuisine"
            id="ouvrir-mode-cuisine"
        >
            Mode cuisine
        </button>

    `;


    /* =========================
       MODIFIER / SUPPRIMER
    ========================= */

    const actionsProprietaireHtml =
        estCreateur
            ? `

                <a
                    href="ajouter.html?id=${encodeURIComponent(
                        recette.id
                    )}"
                    class="bouton-modifier"
                >
                    Modifier la recette
                </a>

                <button
                    type="button"
                    class="bouton-supprimer"
                    id="supprimer-recette"
                >
                    Supprimer la recette
                </button>

            `
            : "";


    /* =========================
       ACTIONS
    ========================= */

    const actionsGestionHtml = `

        <div class="actions-gestion-recette">

            ${boutonModeCuisineHtml}

            ${boutonPlanningHtml}

            ${actionsProprietaireHtml}

        </div>

    `;


    /* =========================
       VISIBILITÉ
    ========================= */

    const visibiliteHtml =
        recette.visibilite ===
        "foyer"
            ? `

                <div
                    class="visibilite-recette visibilite-foyer"
                >
                    🏠 Mon foyer uniquement
                </div>

            `
            : `

                <div
                    class="visibilite-recette visibilite-publique"
                >
                    🌍 Tout le monde
                </div>

            `;


    /* =========================
       BADGES
    ========================= */

    const tousLesBadges = [

        ...(
            Array.isArray(
                recette.etiquettes
            )
                ? recette.etiquettes
                : []
        ),

        ...(
            Array.isArray(
                recette.occasions
            )
                ? recette.occasions
                : []
        ),

        ...(
            Array.isArray(
                recette.saisons
            )
                ? recette.saisons
                : []
        )

    ];


    const badgesRecette =
        creerBadges(
            tousLesBadges,
            "badge-filtre-recette"
        );


    /* =========================
       PORTIONS
    ========================= */

    const personnesInitiales =
        Number(
            recette.personnes
        ) || 1;


    let personnesSelectionnees =
        personnesInitiales;


    /* =========================
       INGRÉDIENTS
    ========================= */

    function creerIngredientsHtml() {

        const coefficient =
            personnesSelectionnees /
            personnesInitiales;


        const ingredients =
            Array.isArray(
                recette.ingredients
            )
                ? recette.ingredients
                : [];


        return ingredients
            .map(
                function (
                    ingredient,
                    index
                ) {

                    if (
                        typeof ingredient ===
                        "string"
                    ) {

                        return `

                            <li class="ingredient-item">

                                <input
                                    type="checkbox"
                                    id="ingredient-${index}"
                                    class="case-ingredient"
                                >

                                <label
                                    for="ingredient-${index}"
                                >
                                    ${echapperHtmlRecette(
                                        ingredient
                                    )}
                                </label>

                            </li>

                        `;
                    }


                    const ingredientProportionnel =
                        ingredient.proportionnel !==
                        false;


                    let quantiteAffichee =
                        ingredient.quantite;


                    if (
                        ingredientProportionnel &&
                        ingredient.quantite !==
                            null &&
                        ingredient.quantite !==
                            undefined &&
                        ingredient.quantite !==
                            ""
                    ) {

                        quantiteAffichee =
                            Number(
                                ingredient.quantite
                            ) *
                            coefficient;
                    }


                    let texteIngredient =
                        ingredient.nom ||
                        "";


                    if (
                        quantiteAffichee !==
                            null &&
                        quantiteAffichee !==
                            undefined &&
                        quantiteAffichee !==
                            ""
                    ) {

                        const unite =
                            ingredient.unite
                                ? ` ${ingredient.unite}`
                                : "";


                        texteIngredient =
                            `${formaterQuantite(
                                Number(
                                    quantiteAffichee
                                )
                            )}${unite} ${
                                ingredient.nom ||
                                ""
                            }`;
                    }


                    return `

                        <li class="ingredient-item">

                            <input
                                type="checkbox"
                                id="ingredient-${index}"
                                class="case-ingredient"
                            >

                            <label
                                for="ingredient-${index}"
                            >
                                ${echapperHtmlRecette(
                                    texteIngredient
                                )}
                            </label>

                        </li>

                    `;
                }
            )
            .join("");
    }


    /* =========================
       ÉTAPES
    ========================= */

    const etapes =
        Array.isArray(
            recette.etapes
        )
            ? recette.etapes
            : [];


    const etapesHtml =
        etapes
            .map(
                function (
                    etape,
                    index
                ) {

                    return `

                        <li class="etape-item">

                            <input
                                type="checkbox"
                                id="etape-${index}"
                                class="case-etape"
                            >

                            <label
                                for="etape-${index}"
                            >
                                ${echapperHtmlRecette(
                                    etape
                                )}
                            </label>

                        </li>

                    `;
                }
            )
            .join("");


    /* =========================
       ASTUCE
    ========================= */

    const astuceHtml =
        recette.astuce
            ? `

                <aside class="conseil">

                    <h2>
                        Astuce
                    </h2>

                    <p>
                        ${echapperHtmlRecette(
                            recette.astuce
                        )}
                    </p>

                </aside>

            `
            : "";


    /* =========================
       HTML PRINCIPAL
    ========================= */

    contenuRecette.innerHTML = `

        <article class="fiche-recette">

            <div class="contenu">

                <div class="badges-principaux">

                    <span class="categorie">

                        ${echapperHtmlRecette(
                            recette.categorie_affichee ||
                            recette.categorie ||
                            ""
                        )}

                    </span>

                </div>


                <h1>
                    ${echapperHtmlRecette(
                        recette.nom
                    )}
                </h1>


                <p class="introduction">

                    ${echapperHtmlRecette(
                        recette.description ||
                        ""
                    )}

                </p>


                ${
                    badgesRecette
                        ? `

                            <div class="badges-recette">

                                ${badgesRecette}

                            </div>

                        `
                        : ""
                }


                ${actionsGestionHtml}


                <div class="informations-recette">


                    <div class="information">

                        <strong>
                            Préparation
                        </strong>

                        <span>
                            ${recette.preparation} minutes
                        </span>

                    </div>


                    <div class="information">

                        <strong>
                            Cuisson
                        </strong>

                        <span>
                            ${recette.cuisson} minutes
                        </span>

                    </div>


                    <div
                        class="information information-portions"
                    >

                        <strong>
                            Portions
                        </strong>


                        <div class="controle-portions">

                            <button
                                type="button"
                                class="bouton-portion"
                                id="diminuer-portions"
                            >
                                −
                            </button>


                            <span
                                class="nombre-portions"
                                id="nombre-portions"
                            >
                                ${personnesSelectionnees}
                            </span>


                            <button
                                type="button"
                                class="bouton-portion"
                                id="augmenter-portions"
                            >
                                +
                            </button>

                        </div>


                        <span class="texte-personnes">
                            personnes
                        </span>

                    </div>


                    <div class="information">

                        <strong>
                            Difficulté
                        </strong>

                        <span>
                            ${echapperHtmlRecette(
                                recette.difficulte ||
                                ""
                            )}
                        </span>

                    </div>


                </div>


                <div class="colonnes">


                    <section>

                        <h2>
                            Ingrédients
                        </h2>

                        <ul
                            class="liste-ingredients"
                            id="liste-ingredients"
                        >
                            ${creerIngredientsHtml()}
                        </ul>

                    </section>


                    <section>

                        <h2>
                            Préparation
                        </h2>

                        <ol class="liste-etapes">
                            ${etapesHtml}
                        </ol>

                    </section>


                </div>


                ${astuceHtml}


                ${visibiliteHtml}


            </div>

        </article>

    `;


    /* =================================
       ÉLÉMENTS APRÈS RENDU
    ================================= */

    const listeIngredients =
        document.getElementById(
            "liste-ingredients"
        );


    const nombrePortions =
        document.getElementById(
            "nombre-portions"
        );


    const boutonDiminuer =
        document.getElementById(
            "diminuer-portions"
        );


    const boutonAugmenter =
        document.getElementById(
            "augmenter-portions"
        );


    const boutonSupprimer =
        document.getElementById(
            "supprimer-recette"
        );


    const boutonAjouterPlanning =
        document.getElementById(
            "ajouter-recette-planning"
        );


    const boutonOuvrirModeCuisine =
        document.getElementById(
            "ouvrir-mode-cuisine"
        );


    /* =================================
       MODE CUISINE
    ================================= */

    if (
        boutonOuvrirModeCuisine
    ) {

        boutonOuvrirModeCuisine.addEventListener(
            "click",
            function () {

                /*
                    La fonction complète
                    arrive dans la partie 3.
                */

                ouvrirModeCuisine();
            }
        );
    }


    /* =================================
       AJOUT PLANNING
    ================================= */

    if (
        boutonAjouterPlanning
    ) {

        boutonAjouterPlanning.addEventListener(
            "click",
            ouvrirPopupAjoutPlanning
        );
    }


    /* =================================
       SUPPRESSION
    ================================= */

    if (
        boutonSupprimer
    ) {

        boutonSupprimer.addEventListener(
            "click",
            supprimerRecette
        );
    }


    /* =================================
       CASES INGRÉDIENTS
    ================================= */

    function activerCasesIngredients() {

        const casesIngredients =
            document.querySelectorAll(
                ".case-ingredient"
            );


        casesIngredients.forEach(
            function (
                caseIngredient
            ) {

                caseIngredient.addEventListener(
                    "change",
                    function () {

                        const ligneIngredient =
                            caseIngredient.closest(
                                ".ingredient-item"
                            );


                        if (
                            !ligneIngredient
                        ) {

                            return;
                        }


                        ligneIngredient.classList.toggle(
                            "ingredient-coche",
                            caseIngredient.checked
                        );
                    }
                );
            }
        );
    }


    function mettreAJourIngredients() {

        nombrePortions.textContent =
            personnesSelectionnees;


        listeIngredients.innerHTML =
            creerIngredientsHtml();


        activerCasesIngredients();


        /*
            Si on ouvre ensuite le mode cuisine,
            on récupérera également ce nombre
            de portions actuellement sélectionné.
        */

        personnesModeCuisine =
            personnesSelectionnees;
    }


    boutonDiminuer.addEventListener(
        "click",
        function () {

            if (
                personnesSelectionnees >
                1
            ) {

                personnesSelectionnees -=
                    1;


                mettreAJourIngredients();
            }
        }
    );


    boutonAugmenter.addEventListener(
        "click",
        function () {

            personnesSelectionnees +=
                1;


            mettreAJourIngredients();
        }
    );


    activerCasesIngredients();


    /* =================================
       CASES ÉTAPES
    ================================= */

    const casesEtapes =
        document.querySelectorAll(
            ".case-etape"
        );


    casesEtapes.forEach(
        function (
            caseEtape
        ) {

            caseEtape.addEventListener(
                "change",
                function () {

                    const ligneEtape =
                        caseEtape.closest(
                            ".etape-item"
                        );


                    if (
                        !ligneEtape
                    ) {

                        return;
                    }


                    ligneEtape.classList.toggle(
                        "etape-coche",
                        caseEtape.checked
                    );
                }
            );
        }
    );
}

/* =================================
   MODE CUISINE
================================= */

function obtenirEtapesCuisine() {

    if (
        !recetteChargee ||
        !Array.isArray(
            recetteChargee.etapes
        )
    ) {

        return [];
    }


    return recetteChargee.etapes;
}


/* =================================
   INGRÉDIENTS MODE CUISINE
================================= */

function creerIngredientsCuisineHtml() {

    if (
        !recetteChargee
    ) {

        return "";
    }


    const personnesInitiales =
        Math.max(
            1,
            Number(
                recetteChargee.personnes
            ) || 1
        );


    const coefficient =
        personnesModeCuisine /
        personnesInitiales;


    const ingredients =
        Array.isArray(
            recetteChargee.ingredients
        )
            ? recetteChargee.ingredients
            : [];


    if (
        ingredients.length ===
        0
    ) {

        return `

            <p class="aucun-ingredient-cuisine">
                Aucun ingrédient renseigné.
            </p>

        `;
    }


    return `

        <div class="portions-mode-cuisine">

            <span>
                Portions
            </span>

            <div class="controle-portions-cuisine">

                <button
                    type="button"
                    id="diminuer-portions-cuisine"
                    aria-label="Diminuer le nombre de personnes"
                >
                    −
                </button>

                <strong
                    id="nombre-portions-cuisine"
                >
                    ${personnesModeCuisine}
                </strong>

                <button
                    type="button"
                    id="augmenter-portions-cuisine"
                    aria-label="Augmenter le nombre de personnes"
                >
                    +
                </button>

            </div>

        </div>


        <ul class="liste-ingredients-cuisine">

            ${
                ingredients
                    .map(
                        function (
                            ingredient,
                            index
                        ) {

                            if (
                                typeof ingredient ===
                                "string"
                            ) {

                                return `

                                    <li>

                                        <input
                                            type="checkbox"
                                            id="ingredient-cuisine-${index}"
                                            class="case-ingredient-cuisine"
                                        >

                                        <label
                                            for="ingredient-cuisine-${index}"
                                        >
                                            ${echapperHtmlRecette(
                                                ingredient
                                            )}
                                        </label>

                                    </li>

                                `;
                            }


                            const proportionnel =
                                ingredient.proportionnel !==
                                false;


                            let quantite =
                                ingredient.quantite;


                            if (
                                proportionnel &&
                                quantite !==
                                    null &&
                                quantite !==
                                    undefined &&
                                quantite !==
                                    ""
                            ) {

                                quantite =
                                    Number(
                                        quantite
                                    ) *
                                    coefficient;
                            }


                            let texte =
                                ingredient.nom ||
                                "";


                            if (
                                quantite !==
                                    null &&
                                quantite !==
                                    undefined &&
                                quantite !==
                                    ""
                            ) {

                                const unite =
                                    ingredient.unite
                                        ? ` ${ingredient.unite}`
                                        : "";


                                texte =
                                    `${formaterQuantite(
                                        Number(
                                            quantite
                                        )
                                    )}${unite} ${
                                        ingredient.nom ||
                                        ""
                                    }`;
                            }


                            return `

                                <li>

                                    <input
                                        type="checkbox"
                                        id="ingredient-cuisine-${index}"
                                        class="case-ingredient-cuisine"
                                    >

                                    <label
                                        for="ingredient-cuisine-${index}"
                                    >
                                        ${echapperHtmlRecette(
                                            texte
                                        )}
                                    </label>

                                </li>

                            `;
                        }
                    )
                    .join("")
            }

        </ul>

    `;
}


/* =================================
   AFFICHER INGRÉDIENTS CUISINE
================================= */

function afficherIngredientsCuisine() {

    if (
        !contenuIngredientsCuisine
    ) {

        return;
    }


    contenuIngredientsCuisine.innerHTML =
        creerIngredientsCuisineHtml();


    /* =========================
       PORTIONS -
    ========================= */

    const boutonDiminuer =
        document.getElementById(
            "diminuer-portions-cuisine"
        );


    if (
        boutonDiminuer
    ) {

        boutonDiminuer.addEventListener(
            "click",
            function () {

                if (
                    personnesModeCuisine <=
                    1
                ) {

                    return;
                }


                personnesModeCuisine -=
                    1;


                afficherIngredientsCuisine();
            }
        );
    }


    /* =========================
       PORTIONS +
    ========================= */

    const boutonAugmenter =
        document.getElementById(
            "augmenter-portions-cuisine"
        );


    if (
        boutonAugmenter
    ) {

        boutonAugmenter.addEventListener(
            "click",
            function () {

                personnesModeCuisine +=
                    1;


                afficherIngredientsCuisine();
            }
        );
    }


    /* =========================
       CASES INGRÉDIENTS
    ========================= */

    const cases =
        contenuIngredientsCuisine
            .querySelectorAll(
                ".case-ingredient-cuisine"
            );


    cases.forEach(
        function (
            caseIngredient
        ) {

            caseIngredient.addEventListener(
                "change",
                function () {

                    const ligne =
                        caseIngredient.closest(
                            "li"
                        );


                    if (
                        !ligne
                    ) {

                        return;
                    }


                    ligne.classList.toggle(
                        "ingredient-cuisine-coche",
                        caseIngredient.checked
                    );
                }
            );
        }
    );
}


/* =================================
   AFFICHER UNE ÉTAPE CUISINE
================================= */

function afficherEtapeCuisine() {

    const etapes =
        obtenirEtapesCuisine();


    if (
        etapes.length ===
        0
    ) {

        if (
            numeroEtapeCuisine
        ) {

            numeroEtapeCuisine.textContent =
                "";
        }


        if (
            totalEtapesCuisine
        ) {

            totalEtapesCuisine.textContent =
                "";
        }


        if (
            texteEtapeCuisine
        ) {

            texteEtapeCuisine.textContent =
                "Aucune étape n’a été renseignée pour cette recette.";
        }


        if (
            barreProgressionCuisine
        ) {

            barreProgressionCuisine.style.width =
                "0%";
        }


        if (
            boutonEtapeCuisinePrecedente
        ) {

            boutonEtapeCuisinePrecedente.disabled =
                true;
        }


        if (
            boutonEtapeCuisineSuivante
        ) {

            boutonEtapeCuisineSuivante.disabled =
                true;
        }


        if (
            boutonMinuteurEtapeCuisine
        ) {

            boutonMinuteurEtapeCuisine.disabled =
                true;
        }


        return;
    }


    /*
        Sécurité sur l'index.
    */

    if (
        indexEtapeCuisine <
        0
    ) {

        indexEtapeCuisine =
            0;
    }


    if (
        indexEtapeCuisine >=
        etapes.length
    ) {

        indexEtapeCuisine =
            etapes.length -
            1;
    }


    /* =========================
       NUMÉRO
    ========================= */

    if (
        numeroEtapeCuisine
    ) {

        numeroEtapeCuisine.textContent =
            `Étape ${indexEtapeCuisine + 1}`;
    }


    if (
        totalEtapesCuisine
    ) {

        totalEtapesCuisine.textContent =
            `sur ${etapes.length}`;
    }


    /* =========================
       TEXTE
    ========================= */

    if (
        texteEtapeCuisine
    ) {

        texteEtapeCuisine.textContent =
            etapes[
                indexEtapeCuisine
            ];
    }


    /* =========================
       PROGRESSION
    ========================= */

    if (
        barreProgressionCuisine
    ) {

        const progression =
            (
                (
                    indexEtapeCuisine +
                    1
                ) /
                etapes.length
            ) *
            100;


        barreProgressionCuisine.style.width =
            `${progression}%`;
    }


    /* =========================
       BOUTON PRÉCÉDENT
    ========================= */

    if (
        boutonEtapeCuisinePrecedente
    ) {

        boutonEtapeCuisinePrecedente.disabled =
            indexEtapeCuisine ===
            0;
    }


    /* =========================
       BOUTON SUIVANT
    ========================= */

    if (
        boutonEtapeCuisineSuivante
    ) {

        const derniereEtape =
            indexEtapeCuisine ===
            etapes.length -
            1;


        boutonEtapeCuisineSuivante.textContent =
            derniereEtape
                ? "Terminer"
                : "Suivant";
    }


    /* =========================
       MINUTEUR
    ========================= */

    if (
        boutonMinuteurEtapeCuisine
    ) {

        boutonMinuteurEtapeCuisine.disabled =
            false;
    }
}


/* =================================
   ÉTAPE PRÉCÉDENTE
================================= */

function allerEtapeCuisinePrecedente() {

    if (
        indexEtapeCuisine <=
        0
    ) {

        return;
    }


    indexEtapeCuisine -=
        1;


    afficherEtapeCuisine();
}


/* =================================
   ÉTAPE SUIVANTE
================================= */

function allerEtapeCuisineSuivante() {

    const etapes =
        obtenirEtapesCuisine();


    if (
        etapes.length ===
        0
    ) {

        return;
    }


    /*
        Dernière étape :
        on ferme le mode cuisine.

        Les minuteurs, eux,
        continuent de tourner.
    */

    if (
        indexEtapeCuisine >=
        etapes.length -
        1
    ) {

        fermerModeCuisineInterface();


        return;
    }


    indexEtapeCuisine +=
        1;


    afficherEtapeCuisine();
}


/* =================================
   OUVRIR MODE CUISINE
================================= */

function ouvrirModeCuisine() {

    if (
        !modeCuisine ||
        !recetteChargee
    ) {

        return;
    }


    const etapes =
        obtenirEtapesCuisine();


    /*
        À chaque nouvelle ouverture,
        on repart de l'étape 1.

        Les minuteurs existants
        restent actifs.
    */

    indexEtapeCuisine =
        0;


    ingredientsCuisineReplies =
        false;


    if (
        nomRecetteModeCuisine
    ) {

        nomRecetteModeCuisine.textContent =
            recetteChargee.nom ||
            "Recette";
    }


    /* =========================
       INGRÉDIENTS
    ========================= */

    afficherIngredientsCuisine();


    if (
        ingredientsModeCuisine
    ) {

        ingredientsModeCuisine.classList.remove(
            "replie"
        );
    }


    if (
        boutonReplierIngredientsCuisine
    ) {

        boutonReplierIngredientsCuisine.textContent =
            "Masquer";
    }


    /* =========================
       ÉTAPE
    ========================= */

    afficherEtapeCuisine();


    /* =========================
       MINUTEURS
    ========================= */

    afficherMinuteursCuisine();


    /*
        Si des minuteurs ont été
        restaurés du localStorage
        mais que l'intervalle n'est
        pas encore actif, on le lance.
    */

    demarrerBoucleMinuteursCuisine();


    /* =========================
       AFFICHAGE
    ========================= */

    modeCuisine.hidden =
        false;


    document.body.classList.add(
        "mode-cuisine-ouvert"
    );


    /*
        Sur mobile, on remonte
        systématiquement en haut.
    */

    modeCuisine.scrollTop =
        0;
}


/* =================================
   FERMER MODE CUISINE
================================= */

function fermerModeCuisineInterface() {

    if (
        !modeCuisine
    ) {

        return;
    }


    modeCuisine.hidden =
        true;


    document.body.classList.remove(
        "mode-cuisine-ouvert"
    );


    /*
        Très important :
        on ne stoppe PAS les minuteurs.
    */
}


/* =================================
   REPLIER LES INGRÉDIENTS
================================= */

function basculerIngredientsCuisine() {

    ingredientsCuisineReplies =
        !ingredientsCuisineReplies;


    if (
        ingredientsModeCuisine
    ) {

        ingredientsModeCuisine.classList.toggle(
            "replie",
            ingredientsCuisineReplies
        );
    }


    if (
        boutonReplierIngredientsCuisine
    ) {

        boutonReplierIngredientsCuisine.textContent =
            ingredientsCuisineReplies
                ? "Afficher"
                : "Masquer";
    }
}


/* =================================
   CLIC FERMER MODE CUISINE
================================= */

if (
    fermerModeCuisine
) {

    fermerModeCuisine.addEventListener(
        "click",
        fermerModeCuisineInterface
    );
}


/* =================================
   CLIC REPLIER INGRÉDIENTS
================================= */

if (
    boutonReplierIngredientsCuisine
) {

    boutonReplierIngredientsCuisine.addEventListener(
        "click",
        basculerIngredientsCuisine
    );
}


/* =================================
   CLIC ÉTAPE PRÉCÉDENTE
================================= */

if (
    boutonEtapeCuisinePrecedente
) {

    boutonEtapeCuisinePrecedente.addEventListener(
        "click",
        allerEtapeCuisinePrecedente
    );
}


/* =================================
   CLIC ÉTAPE SUIVANTE
================================= */

if (
    boutonEtapeCuisineSuivante
) {

    boutonEtapeCuisineSuivante.addEventListener(
        "click",
        allerEtapeCuisineSuivante
    );
}


/* =================================
   LANCER MINUTEUR DEPUIS UNE ÉTAPE
================================= */

if (
    boutonMinuteurEtapeCuisine
) {

    boutonMinuteurEtapeCuisine.addEventListener(
        "click",
        function () {

            /*
                Cette fonction sera
                définie dans la partie 4.
            */

            ouvrirPopupMinuteurCuisine(
                indexEtapeCuisine
            );
        }
    );
}


/* =================================
   NAVIGATION CLAVIER MODE CUISINE
================================= */

document.addEventListener(
    "keydown",
    function (
        evenement
    ) {

        if (
            !modeCuisine ||
            modeCuisine.hidden
        ) {

            return;
        }


        /*
            Si une popup minuteur
            est ouverte, on ne navigue
            pas entre les étapes.
        */

        if (
            popupMinuteurCuisine &&
            !popupMinuteurCuisine.hidden
        ) {

            return;
        }


        const cible =
            evenement.target;


        if (
            cible &&
            (
                cible.tagName ===
                    "INPUT" ||
                cible.tagName ===
                    "TEXTAREA" ||
                cible.tagName ===
                    "SELECT"
            )
        ) {

            return;
        }


        if (
            evenement.key ===
            "ArrowLeft"
        ) {

            evenement.preventDefault();


            allerEtapeCuisinePrecedente();


            return;
        }


        if (
            evenement.key ===
            "ArrowRight"
        ) {

            evenement.preventDefault();


            allerEtapeCuisineSuivante();


            return;
        }


        if (
            evenement.key ===
            "Escape"
        ) {

            evenement.preventDefault();


            fermerModeCuisineInterface();
        }
    }
);

/* =================================
   MINUTEURS CUISINE
================================= */


/* =================================
   SAUVEGARDER LES MINUTEURS
================================= */

function sauvegarderMinuteursCuisine() {

    const cle =
        obtenirCleStockageMinuteursCuisine();


    if (
        !cle
    ) {

        return;
    }


    try {

        localStorage.setItem(
            cle,
            JSON.stringify(
                minuteursCuisine
            )
        );

    } catch (
        erreur
    ) {

        console.warn(
            "Impossible de sauvegarder les minuteurs :",
            erreur
        );
    }
}


/* =================================
   CHARGER LES MINUTEURS
================================= */

function chargerMinuteursCuisineDepuisStockage() {

    const cle =
        obtenirCleStockageMinuteursCuisine();


    if (
        !cle
    ) {

        return;
    }


    try {

        const valeur =
            localStorage.getItem(
                cle
            );


        if (
            !valeur
        ) {

            minuteursCuisine =
                [];


            return;
        }


        const donnees =
            JSON.parse(
                valeur
            );


        if (
            !Array.isArray(
                donnees
            )
        ) {

            minuteursCuisine =
                [];


            return;
        }


        minuteursCuisine =
            donnees
                .filter(
                    function (
                        minuteur
                    ) {

                        return (
                            minuteur &&
                            minuteur.id
                        );
                    }
                )
                .map(
                    function (
                        minuteur
                    ) {

                        const copie = {
                            ...minuteur
                        };


                        /*
                            Si le minuteur était actif,
                            on recalcule le temps restant
                            à partir de son heure de fin.
                        */

                        if (
                            copie.actif &&
                            copie.heureFin
                        ) {

                            const restant =
                                Math.ceil(
                                    (
                                        copie.heureFin -
                                        Date.now()
                                    ) /
                                    1000
                                );


                            copie.secondesRestantes =
                                Math.max(
                                    0,
                                    restant
                                );


                            if (
                                copie.secondesRestantes <=
                                0
                            ) {

                                copie.actif =
                                    false;


                                copie.termine =
                                    true;
                            }
                        }


                        return copie;
                    }
                );


        /*
            On retire les anciens minuteurs
            terminés depuis longtemps si besoin.

            Pour l'instant on les garde :
            l'utilisateur peut les voir
            et les supprimer lui-même.
        */


        afficherMinuteursCuisine();


        demarrerBoucleMinuteursCuisine();


    } catch (
        erreur
    ) {

        console.warn(
            "Impossible de restaurer les minuteurs :",
            erreur
        );


        minuteursCuisine =
            [];
    }
}


/* =================================
   MESSAGE POPUP MINUTEUR
================================= */

function afficherMessageMinuteurCuisine(
    texte
) {

    if (
        !messageMinuteurCuisine
    ) {

        return;
    }


    messageMinuteurCuisine.hidden =
        false;


    messageMinuteurCuisine.textContent =
        texte;
}


function masquerMessageMinuteurCuisine() {

    if (
        !messageMinuteurCuisine
    ) {

        return;
    }


    messageMinuteurCuisine.hidden =
        true;


    messageMinuteurCuisine.textContent =
        "";
}


/* =================================
   OUVRIR POPUP MINUTEUR
================================= */

function ouvrirPopupMinuteurCuisine(
    etapeIndex = null
) {

    if (
        !popupMinuteurCuisine
    ) {

        return;
    }


    indexEtapeMinuteurEnCreation =
        Number.isInteger(
            etapeIndex
        )
            ? etapeIndex
            : null;


    masquerMessageMinuteurCuisine();


    /* =========================
       NOM PAR DÉFAUT
    ========================= */

    if (
        nomMinuteurCuisine
    ) {

        if (
            indexEtapeMinuteurEnCreation !==
            null
        ) {

            nomMinuteurCuisine.value =
                `Étape ${indexEtapeMinuteurEnCreation + 1}`;

        } else {

            nomMinuteurCuisine.value =
                "";
        }
    }


    /* =========================
       DURÉE PAR DÉFAUT
    ========================= */

    if (
        minutesMinuteurCuisine
    ) {

        minutesMinuteurCuisine.value =
            "10";
    }


    if (
        secondesMinuteurCuisine
    ) {

        secondesMinuteurCuisine.value =
            "0";
    }


    popupMinuteurCuisine.hidden =
        false;


    document.body.classList.add(
        "popup-minuteur-ouverte"
    );


    if (
        nomMinuteurCuisine
    ) {

        window.setTimeout(
            function () {

                nomMinuteurCuisine.focus();

            },
            50
        );
    }
}


/* =================================
   FERMER POPUP MINUTEUR
================================= */

function fermerPopupMinuteurCuisineInterface() {

    if (
        !popupMinuteurCuisine
    ) {

        return;
    }


    popupMinuteurCuisine.hidden =
        true;


    document.body.classList.remove(
        "popup-minuteur-ouverte"
    );


    indexEtapeMinuteurEnCreation =
        null;


    masquerMessageMinuteurCuisine();
}


/* =================================
   CRÉER UN MINUTEUR
================================= */

function creerMinuteurCuisine() {

    const nom =
        (
            nomMinuteurCuisine?.value ||
            ""
        ).trim();


    const dureeSecondes =
        convertirDureeCuisineEnSecondes(

            minutesMinuteurCuisine?.value,

            secondesMinuteurCuisine?.value

        );


    if (
        dureeSecondes <=
        0
    ) {

        afficherMessageMinuteurCuisine(
            "Choisis une durée supérieure à 0 seconde."
        );


        return;
    }


    const nomFinal =
        nom ||
        (
            indexEtapeMinuteurEnCreation !==
            null
                ? `Étape ${indexEtapeMinuteurEnCreation + 1}`
                : "Minuteur"
        );


    const maintenant =
        Date.now();


    const nouveauMinuteur = {

        id:
            creerIdentifiantLocalCuisine(),

        nom:
            nomFinal,

        dureeInitiale:
            dureeSecondes,

        secondesRestantes:
            dureeSecondes,

        actif:
            true,

        termine:
            false,

        heureFin:
            maintenant +
            dureeSecondes *
            1000,

        etapeIndex:
            indexEtapeMinuteurEnCreation

    };


    minuteursCuisine.push(
        nouveauMinuteur
    );


    sauvegarderMinuteursCuisine();


    afficherMinuteursCuisine();


    demarrerBoucleMinuteursCuisine();


    fermerPopupMinuteurCuisineInterface();
}


/* =================================
   AFFICHER LES MINUTEURS
================================= */

function afficherMinuteursCuisine() {

    if (
        !listeMinuteursCuisine ||
        !zoneMinuteursCuisine
    ) {

        return;
    }


    if (
        minuteursCuisine.length ===
        0
    ) {

        zoneMinuteursCuisine.hidden =
            true;


        listeMinuteursCuisine.innerHTML =
            "";


        return;
    }


    zoneMinuteursCuisine.hidden =
        false;


    listeMinuteursCuisine.innerHTML =
        minuteursCuisine
            .map(
                function (
                    minuteur
                ) {

                    const classes = [
                        "minuteur-cuisine"
                    ];


                    if (
                        minuteur.termine
                    ) {

                        classes.push(
                            "minuteur-termine"
                        );
                    }


                    if (
                        !minuteur.actif &&
                        !minuteur.termine
                    ) {

                        classes.push(
                            "minuteur-pause"
                        );
                    }


                    const texteEtat =
                        minuteur.termine
                            ? "Terminé"
                            : minuteur.actif
                                ? "En cours"
                                : "En pause";


                    return `

                        <div
                            class="${classes.join(" ")}"
                            data-minuteur-id="${echapperHtmlRecette(
                                minuteur.id
                            )}"
                        >

                            <div class="minuteur-cuisine-infos">

                                <strong
                                    class="minuteur-cuisine-nom"
                                >
                                    ${echapperHtmlRecette(
                                        minuteur.nom
                                    )}
                                </strong>


                                <span
                                    class="minuteur-cuisine-etat"
                                >
                                    ${texteEtat}
                                </span>

                            </div>


                            <div
                                class="minuteur-cuisine-temps"
                            >
                                ${
                                    minuteur.termine
                                        ? "00:00"
                                        : formaterTempsCuisine(
                                            minuteur.secondesRestantes
                                        )
                                }
                            </div>


                            <div class="actions-minuteur-cuisine">

                                ${
                                    minuteur.termine
                                        ? `
                                            <button
                                                type="button"
                                                class="relancer-minuteur-cuisine"
                                                data-minuteur-id="${echapperHtmlRecette(
                                                    minuteur.id
                                                )}"
                                            >
                                                Relancer
                                            </button>
                                        `
                                        : `
                                            <button
                                                type="button"
                                                class="pause-minuteur-cuisine"
                                                data-minuteur-id="${echapperHtmlRecette(
                                                    minuteur.id
                                                )}"
                                            >
                                                ${
                                                    minuteur.actif
                                                        ? "Pause"
                                                        : "Reprendre"
                                                }
                                            </button>
                                        `
                                }


                                <button
                                    type="button"
                                    class="supprimer-minuteur-cuisine"
                                    data-minuteur-id="${echapperHtmlRecette(
                                        minuteur.id
                                    )}"
                                >
                                    Supprimer
                                </button>

                            </div>

                        </div>

                    `;
                }
            )
            .join("");
}


/* =================================
   TROUVER UN MINUTEUR
================================= */

function trouverMinuteurCuisine(
    id
) {

    return minuteursCuisine.find(
        function (
            minuteur
        ) {

            return (
                String(
                    minuteur.id
                ) ===
                String(
                    id
                )
            );
        }
    );
}


/* =================================
   PAUSE / REPRISE
================================= */

function basculerPauseMinuteurCuisine(
    id
) {

    const minuteur =
        trouverMinuteurCuisine(
            id
        );


    if (
        !minuteur ||
        minuteur.termine
    ) {

        return;
    }


    if (
        minuteur.actif
    ) {

        /*
            Pause :
            on calcule précisément
            ce qu'il reste.
        */

        const restant =
            Math.ceil(
                (
                    minuteur.heureFin -
                    Date.now()
                ) /
                1000
            );


        minuteur.secondesRestantes =
            Math.max(
                0,
                restant
            );


        minuteur.actif =
            false;


        minuteur.heureFin =
            null;


    } else {

        /*
            Reprise :
            nouvelle heure de fin.
        */

        minuteur.actif =
            true;


        minuteur.heureFin =
            Date.now() +
            minuteur.secondesRestantes *
            1000;
    }


    sauvegarderMinuteursCuisine();


    afficherMinuteursCuisine();


    demarrerBoucleMinuteursCuisine();
}


/* =================================
   RELANCER UN MINUTEUR
================================= */

function relancerMinuteurCuisine(
    id
) {

    const minuteur =
        trouverMinuteurCuisine(
            id
        );


    if (
        !minuteur
    ) {

        return;
    }


    minuteur.secondesRestantes =
        minuteur.dureeInitiale;


    minuteur.termine =
        false;


    minuteur.actif =
        true;


    minuteur.heureFin =
        Date.now() +
        minuteur.dureeInitiale *
        1000;


    sauvegarderMinuteursCuisine();


    afficherMinuteursCuisine();


    demarrerBoucleMinuteursCuisine();
}


/* =================================
   SUPPRIMER UN MINUTEUR
================================= */

function supprimerMinuteurCuisine(
    id
) {

    minuteursCuisine =
        minuteursCuisine.filter(
            function (
                minuteur
            ) {

                return (
                    String(
                        minuteur.id
                    ) !==
                    String(
                        id
                    )
                );
            }
        );


    sauvegarderMinuteursCuisine();


    afficherMinuteursCuisine();


    gererEtatBoucleMinuteursCuisine();
}


/* =================================
   BOUCLE DES MINUTEURS
================================= */

function mettreAJourMinuteursCuisine() {

    let changement =
        false;


    const maintenant =
        Date.now();


    minuteursCuisine.forEach(
        function (
            minuteur
        ) {

            if (
                !minuteur.actif ||
                minuteur.termine ||
                !minuteur.heureFin
            ) {

                return;
            }


            const restant =
                Math.ceil(
                    (
                        minuteur.heureFin -
                        maintenant
                    ) /
                    1000
                );


            const restantPropre =
                Math.max(
                    0,
                    restant
                );


            if (
                minuteur.secondesRestantes !==
                restantPropre
            ) {

                minuteur.secondesRestantes =
                    restantPropre;


                changement =
                    true;
            }


            if (
                restantPropre <=
                0
            ) {

                minuteur.actif =
                    false;


                minuteur.termine =
                    true;


                minuteur.heureFin =
                    null;


                changement =
                    true;


                signalerFinMinuteurCuisine(
                    minuteur
                );
            }
        }
    );


    if (
        changement
    ) {

        sauvegarderMinuteursCuisine();


        afficherMinuteursCuisine();
    }


    gererEtatBoucleMinuteursCuisine();
}


/* =================================
   DÉMARRER LA BOUCLE
================================= */

function demarrerBoucleMinuteursCuisine() {

    const minuteurActif =
        minuteursCuisine.some(
            function (
                minuteur
            ) {

                return (
                    minuteur.actif &&
                    !minuteur.termine
                );
            }
        );


    if (
        !minuteurActif
    ) {

        gererEtatBoucleMinuteursCuisine();


        return;
    }


    if (
        intervalMinuteursCuisine
    ) {

        return;
    }


    intervalMinuteursCuisine =
        window.setInterval(
            mettreAJourMinuteursCuisine,
            1000
        );
}


/* =================================
   STOPPER BOUCLE SI INUTILE
================================= */

function gererEtatBoucleMinuteursCuisine() {

    const resteUnActif =
        minuteursCuisine.some(
            function (
                minuteur
            ) {

                return (
                    minuteur.actif &&
                    !minuteur.termine
                );
            }
        );


    if (
        !resteUnActif &&
        intervalMinuteursCuisine
    ) {

        window.clearInterval(
            intervalMinuteursCuisine
        );


        intervalMinuteursCuisine =
            null;
    }
}


/* =================================
   ALERTE FIN MINUTEUR
================================= */

function signalerFinMinuteurCuisine(
    minuteur
) {

    /*
        Vibration si le navigateur
        la permet.
    */

    if (
        navigator.vibrate
    ) {

        try {

            navigator.vibrate(
                [
                    250,
                    120,
                    250,
                    120,
                    400
                ]
            );

        } catch (
            erreur
        ) {

            console.warn(
                "Vibration non disponible :",
                erreur
            );
        }
    }


    /*
        Petite alerte sonore native
        via Web Audio.

        Aucun fichier audio externe
        n'est nécessaire.
    */

    jouerSonMinuteurCuisine();


    /*
        Si le mode cuisine est ouvert,
        la carte devient déjà visuellement
        "Terminée".

        On ajoute aussi une notification
        navigateur si elle est autorisée.
    */

    envoyerNotificationMinuteurCuisine(
        minuteur
    );
}


/* =================================
   SON DU MINUTEUR
================================= */

function jouerSonMinuteurCuisine() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (
            !AudioContext
        ) {

            return;
        }


        const contexte =
            new AudioContext();


        const oscillateur =
            contexte.createOscillator();


        const gain =
            contexte.createGain();


        oscillateur.connect(
            gain
        );


        gain.connect(
            contexte.destination
        );


        oscillateur.type =
            "sine";


        oscillateur.frequency.value =
            760;


        gain.gain.setValueAtTime(
            0.0001,
            contexte.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.22,
            contexte.currentTime +
            0.03
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            contexte.currentTime +
            0.8
        );


        oscillateur.start();


        oscillateur.stop(
            contexte.currentTime +
            0.85
        );


    } catch (
        erreur
    ) {

        console.warn(
            "Son du minuteur indisponible :",
            erreur
        );
    }
}


/* =================================
   NOTIFICATION NAVIGATEUR
================================= */

function envoyerNotificationMinuteurCuisine(
    minuteur
) {

    if (
        !("Notification" in window)
    ) {

        return;
    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return;
    }


    try {

        new Notification(
            "Minuteur terminé",
            {
                body:
                    minuteur.nom
            }
        );

    } catch (
        erreur
    ) {

        console.warn(
            "Notification indisponible :",
            erreur
        );
    }
}


/* =================================
   DEMANDER AUTORISATION NOTIFICATION
================================= */

async function demanderAutorisationNotificationCuisine() {

    if (
        !("Notification" in window)
    ) {

        return;
    }


    if (
        Notification.permission !==
        "default"
    ) {

        return;
    }


    try {

        await Notification.requestPermission();

    } catch (
        erreur
    ) {

        console.warn(
            "Impossible de demander l'autorisation de notification :",
            erreur
        );
    }
}


/* =================================
   CLIC NOUVEAU MINUTEUR
================================= */

if (
    boutonAjouterMinuteurCuisine
) {

    boutonAjouterMinuteurCuisine.addEventListener(
        "click",
        function () {

            ouvrirPopupMinuteurCuisine(
                null
            );
        }
    );
}


/* =================================
   FERMETURE POPUP
================================= */

if (
    fermerPopupMinuteurCuisine
) {

    fermerPopupMinuteurCuisine.addEventListener(
        "click",
        fermerPopupMinuteurCuisineInterface
    );
}


if (
    annulerMinuteurCuisine
) {

    annulerMinuteurCuisine.addEventListener(
        "click",
        fermerPopupMinuteurCuisineInterface
    );
}


/* =================================
   LANCER LE MINUTEUR
================================= */

if (
    lancerMinuteurCuisine
) {

    lancerMinuteurCuisine.addEventListener(
        "click",
        function () {

            creerMinuteurCuisine();


            demanderAutorisationNotificationCuisine();
        }
    );
}


/* =================================
   DURÉES RAPIDES
================================= */

document.addEventListener(
    "click",
    function (
        evenement
    ) {

        const bouton =
            evenement.target.closest(
                "[data-duree-minuteur]"
            );


        if (
            !bouton
        ) {

            return;
        }


        const minutes =
            Number(
                bouton.dataset.dureeMinuteur
            );


        if (
            !Number.isFinite(
                minutes
            )
        ) {

            return;
        }


        if (
            minutesMinuteurCuisine
        ) {

            minutesMinuteurCuisine.value =
                String(
                    minutes
                );
        }


        if (
            secondesMinuteurCuisine
        ) {

            secondesMinuteurCuisine.value =
                "0";
        }
    }
);


/* =================================
   ACTIONS SUR LES MINUTEURS
================================= */

if (
    listeMinuteursCuisine
) {

    listeMinuteursCuisine.addEventListener(
        "click",
        function (
            evenement
        ) {

            const boutonPause =
                evenement.target.closest(
                    ".pause-minuteur-cuisine"
                );


            if (
                boutonPause
            ) {

                basculerPauseMinuteurCuisine(
                    boutonPause.dataset.minuteurId
                );


                return;
            }


            const boutonRelancer =
                evenement.target.closest(
                    ".relancer-minuteur-cuisine"
                );


            if (
                boutonRelancer
            ) {

                relancerMinuteurCuisine(
                    boutonRelancer.dataset.minuteurId
                );


                return;
            }


            const boutonSupprimer =
                evenement.target.closest(
                    ".supprimer-minuteur-cuisine"
                );


            if (
                boutonSupprimer
            ) {

                supprimerMinuteurCuisine(
                    boutonSupprimer.dataset.minuteurId
                );
            }
        }
    );
}


/* =================================
   CLIC HORS POPUP MINUTEUR
================================= */

if (
    popupMinuteurCuisine
) {

    popupMinuteurCuisine.addEventListener(
        "click",
        function (
            evenement
        ) {

            if (
                evenement.target ===
                popupMinuteurCuisine
            ) {

                fermerPopupMinuteurCuisineInterface();
            }
        }
    );
}


/* =================================
   TOUCHE ENTRÉE DANS POPUP
================================= */

if (
    popupMinuteurCuisine
) {

    popupMinuteurCuisine.addEventListener(
        "keydown",
        function (
            evenement
        ) {

            if (
                evenement.key !==
                "Enter"
            ) {

                return;
            }


            const cible =
                evenement.target;


            if (
                cible?.tagName ===
                "BUTTON"
            ) {

                return;
            }


            evenement.preventDefault();


            creerMinuteurCuisine();


            demanderAutorisationNotificationCuisine();
        }
    );
}

/* =================================
   ÉVÉNEMENTS POPUP PLANNING
================================= */


/* =================================
   FERMER AVEC LA CROIX
================================= */

if (
    fermerPopupPlanning
) {

    fermerPopupPlanning.addEventListener(
        "click",
        function () {

            fermerPopupAjoutPlanning();
        }
    );
}


/* =================================
   BOUTON ANNULER
================================= */

if (
    annulerAjoutPlanning
) {

    annulerAjoutPlanning.addEventListener(
        "click",
        function () {

            fermerPopupAjoutPlanning();
        }
    );
}


/* =================================
   CHOIX MIDI
================================= */

if (
    boutonMomentMidi
) {

    boutonMomentMidi.addEventListener(
        "click",
        function () {

            selectionnerMomentPlanning(
                "midi"
            );
        }
    );
}


/* =================================
   CHOIX SOIR
================================= */

if (
    boutonMomentSoir
) {

    boutonMomentSoir.addEventListener(
        "click",
        function () {

            selectionnerMomentPlanning(
                "soir"
            );
        }
    );
}


/* =================================
   DIMINUER PERSONNES
================================= */

if (
    diminuerPersonnesPlanning
) {

    diminuerPersonnesPlanning.addEventListener(
        "click",
        function () {

            if (
                personnesSelectionneesPlanning <=
                1
            ) {

                return;
            }


            personnesSelectionneesPlanning -=
                1;


            mettreAJourNombrePersonnesPlanning();
        }
    );
}


/* =================================
   AUGMENTER PERSONNES
================================= */

if (
    augmenterPersonnesPlanning
) {

    augmenterPersonnesPlanning.addEventListener(
        "click",
        function () {

            if (
                personnesSelectionneesPlanning >=
                50
            ) {

                return;
            }


            personnesSelectionneesPlanning +=
                1;


            mettreAJourNombrePersonnesPlanning();
        }
    );
}


/* =================================
   CONFIRMER AJOUT
================================= */

if (
    confirmerAjoutPlanning
) {

    confirmerAjoutPlanning.addEventListener(
        "click",
        function () {

            demanderAjoutPlanning();
        }
    );
}


/* =================================
   ANNULER CONFIRMATION
================================= */

if (
    annulerConfirmationPlanning
) {

    annulerConfirmationPlanning.addEventListener(
        "click",
        function () {

            fermerConfirmationPlanning(
                true
            );
        }
    );
}


/* =================================
   AJOUTER QUAND MÊME
================================= */

if (
    confirmerAjoutMalgreRepas
) {

    confirmerAjoutMalgreRepas.addEventListener(
        "click",
        function () {

            ajouterRecetteAuRepasExistant();
        }
    );
}


/* =================================
   CHANGEMENT DE DATE
================================= */

if (
    dateAjoutPlanning
) {

    dateAjoutPlanning.addEventListener(
        "change",
        function () {

            repasExistantPlanning =
                null;


            masquerMessagePlanning();
        }
    );
}


/* =================================
   CLIC HORS POPUP PLANNING
================================= */

if (
    popupAjoutPlanning
) {

    popupAjoutPlanning.addEventListener(
        "click",
        function (
            evenement
        ) {

            if (
                evenement.target ===
                popupAjoutPlanning
            ) {

                fermerPopupAjoutPlanning();
            }
        }
    );
}


/* =================================
   CLIC HORS CONFIRMATION
================================= */

if (
    popupConfirmationPlanning
) {

    popupConfirmationPlanning.addEventListener(
        "click",
        function (
            evenement
        ) {

            if (
                evenement.target ===
                popupConfirmationPlanning
            ) {

                fermerConfirmationPlanning(
                    true
                );
            }
        }
    );
}


/* =================================
   ÉCHAP GLOBAL
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
            1.
            Popup minuteur prioritaire.
        */

        if (
            popupMinuteurCuisine &&
            !popupMinuteurCuisine.hidden
        ) {

            evenement.preventDefault();


            fermerPopupMinuteurCuisineInterface();


            return;
        }


        /*
            2.
            Confirmation planning.
        */

        if (
            popupConfirmationPlanning &&
            !popupConfirmationPlanning.hidden
        ) {

            evenement.preventDefault();


            fermerConfirmationPlanning(
                true
            );


            return;
        }


        /*
            3.
            Popup planning.
        */

        if (
            popupAjoutPlanning &&
            !popupAjoutPlanning.hidden
        ) {

            evenement.preventDefault();


            fermerPopupAjoutPlanning();


            return;
        }


        /*
            4.
            Mode cuisine.
        */

        if (
            modeCuisine &&
            !modeCuisine.hidden
        ) {

            evenement.preventDefault();


            fermerModeCuisineInterface();
        }
    }
);


/* =================================
   PRÉPARER MODE CUISINE
================================= */

function preparerModeCuisine() {

    if (
        modeCuisine
    ) {

        modeCuisine.hidden =
            true;
    }


    if (
        popupMinuteurCuisine
    ) {

        popupMinuteurCuisine.hidden =
            true;
    }


    if (
        zoneMinuteursCuisine
    ) {

        zoneMinuteursCuisine.hidden =
            true;
    }


    indexEtapeCuisine =
        0;


    ingredientsCuisineReplies =
        false;


    indexEtapeMinuteurEnCreation =
        null;


    masquerMessageMinuteurCuisine();
}


/* =================================
   PRÉPARER POPUP PLANNING
================================= */

function preparerPopupPlanning() {

    if (
        dateAjoutPlanning
    ) {

        const aujourdHui =
            obtenirDateAujourdhuiPlanning();


        dateAjoutPlanning.min =
            aujourdHui;


        dateAjoutPlanning.value =
            aujourdHui;
    }


    momentSelectionnePlanning =
        "midi";


    mettreAJourBoutonsMomentPlanning();


    personnesSelectionneesPlanning =
        personnesParDefautPlanning;


    mettreAJourNombrePersonnesPlanning();


    masquerMessagePlanning();


    if (
        popupAjoutPlanning
    ) {

        popupAjoutPlanning.hidden =
            true;
    }


    if (
        popupConfirmationPlanning
    ) {

        popupConfirmationPlanning.hidden =
            true;
    }
}


/* =================================
   VÉRIFIER LES ÉLÉMENTS HTML
================================= */

function verifierElementsRecette() {

    if (
        !contenuRecette
    ) {

        console.error(
            "Le conteneur #fiche-recette-contenu est introuvable."
        );


        return false;
    }


    if (
        !galerieRecette ||
        !carouselRecette ||
        !carouselImagesRecette
    ) {

        console.warn(
            "La galerie photo n'est pas complètement présente dans recette.html."
        );
    }


    if (
        !popupAjoutPlanning
    ) {

        console.warn(
            "La popup #popup-ajout-planning est introuvable."
        );
    }


    if (
        !popupConfirmationPlanning
    ) {

        console.warn(
            "La popup #popup-confirmation-planning est introuvable."
        );
    }


    if (
        !modeCuisine
    ) {

        console.warn(
            "Le bloc #mode-cuisine est introuvable."
        );
    }


    if (
        !popupMinuteurCuisine
    ) {

        console.warn(
            "La popup #popup-minuteur-cuisine est introuvable."
        );
    }


    return true;
}


/* =================================
   NETTOYAGE GALERIE
================================= */

function nettoyerGalerieRecette() {

    photosRecette =
        [];


    indexPhotoActive =
        0;


    positionTouchDebut =
        null;


    positionTouchFin =
        null;
}


/* =================================
   NETTOYAGE MINUTEURS
================================= */

function nettoyerBoucleMinuteursCuisine() {

    if (
        intervalMinuteursCuisine
    ) {

        window.clearInterval(
            intervalMinuteursCuisine
        );


        intervalMinuteursCuisine =
            null;
    }
}


/* =================================
   QUITTER LA PAGE
================================= */

window.addEventListener(
    "pagehide",
    function () {

        /*
            On sauvegarde une dernière
            fois les minuteurs avant
            de quitter la page.
        */

        sauvegarderMinuteursCuisine();


        nettoyerBoucleMinuteursCuisine();


        nettoyerGalerieRecette();
    }
);


/* =================================
   VISIBILITÉ DE L'ONGLET
================================= */

/*
    Les navigateurs ralentissent parfois
    les setInterval lorsque l'onglet
    est en arrière-plan.

    Comme chaque minuteur possède
    heureFin, on peut recalculer
    exactement le temps restant
    quand l'utilisateur revient.
*/

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState !==
            "visible"
        ) {

            return;
        }


        mettreAJourMinuteursCuisine();


        demarrerBoucleMinuteursCuisine();
    }
);


/* =================================
   INITIALISATION
================================= */

async function initialiserPageRecette() {

    const elementsValides =
        verifierElementsRecette();


    if (
        !elementsValides
    ) {

        return;
    }


    /* =========================
       ÉTAT DE CHARGEMENT
    ========================= */

    contenuRecette.innerHTML = `

        <div class="message">
            Chargement de la recette…
        </div>

    `;


    if (
        galerieRecette
    ) {

        galerieRecette.hidden =
            true;
    }


    /* =========================
       INTERFACES FERMÉES
    ========================= */

    preparerPopupPlanning();


    preparerModeCuisine();


    try {

        /* =========================
           RECETTE
        ========================= */

        await chargerRecette();


        /* =========================
           PLANNING
        ========================= */

        personnesSelectionneesPlanning =
            personnesParDefautPlanning;


        mettreAJourNombrePersonnesPlanning();


        /* =========================
           MODE CUISINE
        ========================= */

        personnesModeCuisine =
            Math.max(
                1,
                Number(
                    recetteChargee?.personnes
                ) || 1
            );


        /*
            chargerRecette() recharge déjà
            les minuteurs depuis localStorage.

            On force juste un rafraîchissement
            final de leur affichage.
        */

        mettreAJourMinuteursCuisine();


        afficherMinuteursCuisine();


        demarrerBoucleMinuteursCuisine();


        /* =========================
           DEBUG
        ========================= */

        console.log(
            "Recette chargée :",
            {

                recette:
                    recetteChargee?.id,

                photos:
                    photosRecette.length,

                foyer:
                    foyerIdPlanning,

                personnesParDefaut:
                    personnesParDefautPlanning,

                etapes:
                    Array.isArray(
                        recetteChargee?.etapes
                    )
                        ? recetteChargee.etapes.length
                        : 0,

                minuteurs:
                    minuteursCuisine.length

            }
        );


    } catch (
        erreur
    ) {

        console.error(
            "Erreur inattendue pendant l'initialisation :",
            erreur
        );
    }
}


/* =================================
   DÉMARRAGE
================================= */

initialiserPageRecette();
