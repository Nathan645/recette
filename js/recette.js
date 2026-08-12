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
   POPUP CONFIRMATION
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

/*
    Identifiant du foyer de
    l'utilisateur connecté.
*/

let foyerIdPlanning =
    null;


/*
    Nombre de personnes configuré
    par défaut dans le foyer.
*/

let personnesParDefautPlanning =
    1;


/*
    Sélection actuelle de la popup.
*/

let momentSelectionnePlanning =
    "midi";

let personnesSelectionneesPlanning =
    1;


/*
    Si un repas existe déjà sur
    le créneau sélectionné,
    on le conserve temporairement ici.
*/

let repasExistantPlanning =
    null;


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


    /* =========================
       MEMBRE DU FOYER
    ========================= */

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

        /*
            L'utilisateur peut toujours
            consulter la recette.

            Le bouton planning pourra
            simplement signaler qu'aucun
            foyer n'est disponible.
        */

        return;
    }


    foyerIdPlanning =
        membreFoyer.foyer_id;


    /* =========================
       PARAMÈTRES DU FOYER
    ========================= */

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


    /*
        Le bucket est privé.

        On crée donc une URL signée
        temporaire pour chaque photo.
    */

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


    /*
        Aucune photo :
        galerie complètement masquée.
    */

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


    /*
        Au moins une photo.
    */

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


    /*
        Une seule photo :
        pas de navigation.
    */

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


    /*
        Plusieurs photos :
        flèches + indicateurs.
    */

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
   INDICATEURS DU CAROUSEL
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


    /*
        Carousel en boucle.
    */

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


    /*
        Slides.
    */

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


    /*
        Indicateurs.
    */

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
   PHOTO PRÉCÉDENTE
================================= */

function afficherPhotoPrecedente() {

    afficherPhotoCarousel(
        indexPhotoActive -
        1
    );
}


/* =================================
   PHOTO SUIVANTE
================================= */

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
        function () {

            afficherPhotoPrecedente();
        }
    );
}


if (
    boutonPhotoSuivante
) {

    boutonPhotoSuivante.addEventListener(
        "click",
        function () {

            afficherPhotoSuivante();
        }
    );
}


/* =================================
   CLIC SUR LES INDICATEURS
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
   SWIPE MOBILE
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


            const seuil =
                45;


            if (
                Math.abs(
                    difference
                ) <
                seuil
            ) {

                positionTouchDebut =
                    null;

                positionTouchFin =
                    null;

                return;
            }


            /*
                Swipe gauche :
                photo suivante.
            */

            if (
                difference <
                0
            ) {

                afficherPhotoSuivante();

            } else {

                /*
                    Swipe droite :
                    photo précédente.
                */

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
   NAVIGATION CLAVIER
================================= */

document.addEventListener(
    "keydown",
    function (
        evenement
    ) {

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


        /*
            Si l'utilisateur interagit
            avec un champ de formulaire,
            on ne touche pas au carousel.
        */

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


            document.body
                .appendChild(
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


            boutonAnnuler
                .addEventListener(
                    "click",
                    function () {

                        fermerPopup(
                            false
                        );
                    }
                );


            boutonConfirmer
                .addEventListener(
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
   SUPPRESSION DES PHOTOS STORAGE
================================= */

async function supprimerPhotosRecetteStorage() {

    if (
        !Array.isArray(
            photosRecette
        ) ||
        photosRecette.length === 0
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
   SUPPRESSION DE LA RECETTE
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

        /* =========================
           PHOTOS STORAGE
        ========================= */

        await supprimerPhotosRecetteStorage();


        /* =========================
           RECETTE
        ========================= */

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
       BOUTON PLANNING
    ========================= */

    /*
        Ce bouton est disponible
        même si la recette a été créée
        par un autre membre.

        Il faut simplement appartenir
        à un foyer pour pouvoir réellement
        l'ajouter.
    */

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
       TOUTES LES ACTIONS
    ========================= */

    const actionsGestionHtml = `

        <div class="actions-gestion-recette">

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

                    /*
                        Anciennes recettes
                        éventuellement stockées
                        sous forme de texte.
                    */

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


                <!-- =========================
                     INFORMATIONS
                ========================== -->

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
                                aria-label="Diminuer le nombre de personnes"
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
                                aria-label="Augmenter le nombre de personnes"
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


                <!-- =========================
                     INGRÉDIENTS / PRÉPARATION
                ========================== -->

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
       ÉLÉMENTS APRÈS AFFICHAGE
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


    /* =================================
       AJOUT AU PLANNING
    ================================= */

    if (
        boutonAjouterPlanning
    ) {

        boutonAjouterPlanning
            .addEventListener(
                "click",
                function () {

                    /*
                        Cette fonction sera
                        définie dans la partie 4.
                    */

                    ouvrirPopupAjoutPlanning();
                }
            );
    }


    /* =================================
       SUPPRESSION
    ================================= */

    if (
        boutonSupprimer
    ) {

        boutonSupprimer
            .addEventListener(
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

                caseIngredient
                    .addEventListener(
                        "change",
                        function () {

                            const ligneIngredient =
                                caseIngredient
                                    .closest(
                                        ".ingredient-item"
                                    );


                            if (
                                !ligneIngredient
                            ) {

                                return;
                            }


                            ligneIngredient
                                .classList
                                .toggle(
                                    "ingredient-coche",
                                    caseIngredient.checked
                                );
                        }
                    );
            }
        );
    }


    /* =================================
       METTRE À JOUR LES INGRÉDIENTS
    ================================= */

    function mettreAJourIngredients() {

        nombrePortions.textContent =
            personnesSelectionnees;


        listeIngredients.innerHTML =
            creerIngredientsHtml();


        activerCasesIngredients();
    }


    /* =================================
       PORTIONS -
    ================================= */

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


    /* =================================
       PORTIONS +
    ================================= */

    boutonAugmenter.addEventListener(
        "click",
        function () {

            personnesSelectionnees +=
                1;


            mettreAJourIngredients();
        }
    );


    /* =================================
       INITIALISATION INGRÉDIENTS
    ================================= */

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
                        caseEtape
                            .closest(
                                ".etape-item"
                            );


                    if (
                        !ligneEtape
                    ) {

                        return;
                    }


                    ligneEtape
                        .classList
                        .toggle(
                            "etape-coche",
                            caseEtape.checked
                        );
                }
            );
        }
    );
}

/* =================================
   POPUP AJOUT AU PLANNING
================================= */

function ouvrirPopupAjoutPlanning() {

    if (
        !popupAjoutPlanning
    ) {

        return;
    }


    /*
        Vérification du foyer.
    */

    if (
        !foyerIdPlanning
    ) {

        window.alert(
            "Vous devez appartenir à un foyer pour ajouter une recette au planning."
        );

        return;
    }


    /* =========================
       RÉINITIALISATION
    ========================= */

    repasExistantPlanning =
        null;


    momentSelectionnePlanning =
        "midi";


    personnesSelectionneesPlanning =
        personnesParDefautPlanning;


    /* =========================
       NOM DE LA RECETTE
    ========================= */

    if (
        nomRecettePopupPlanning
    ) {

        nomRecettePopupPlanning.textContent =
            recetteChargee?.nom ||
            "";
    }


    /* =========================
       DATE = AUJOURD'HUI
    ========================= */

    if (
        dateAjoutPlanning
    ) {

        dateAjoutPlanning.value =
            obtenirDateAujourdhuiPlanning();
    }


    /* =========================
       MIDI PAR DÉFAUT
    ========================= */

    mettreAJourMomentPlanning();


    /* =========================
       PERSONNES
    ========================= */

    mettreAJourNombrePersonnesPlanning();


    /* =========================
       MESSAGE
    ========================= */

    masquerMessagePlanning();


    /* =========================
       BOUTON
    ========================= */

    if (
        confirmerAjoutPlanning
    ) {

        confirmerAjoutPlanning.disabled =
            false;


        confirmerAjoutPlanning.textContent =
            "Ajouter au planning";
    }


    /* =========================
       AFFICHAGE
    ========================= */

    popupAjoutPlanning.hidden =
        false;


    document.body.classList.add(
        "popup-ouverte"
    );
}


/* =================================
   FERMER POPUP AJOUT
================================= */

function fermerPopupAjoutPlanning() {

    if (
        !popupAjoutPlanning
    ) {

        return;
    }


    popupAjoutPlanning.hidden =
        true;


    repasExistantPlanning =
        null;


    document.body.classList.remove(
        "popup-ouverte"
    );
}


/* =================================
   MOMENT MIDI / SOIR
================================= */

function selectionnerMomentPlanning(
    moment
) {

    if (
        moment !== "midi" &&
        moment !== "soir"
    ) {

        return;
    }


    momentSelectionnePlanning =
        moment;


    mettreAJourMomentPlanning();
}


/* =================================
   AFFICHAGE MOMENT
================================= */

function mettreAJourMomentPlanning() {

    if (
        boutonMomentMidi
    ) {

        boutonMomentMidi.classList.toggle(
            "actif",
            momentSelectionnePlanning ===
                "midi"
        );


        boutonMomentMidi.setAttribute(
            "aria-pressed",
            momentSelectionnePlanning ===
                "midi"
                ? "true"
                : "false"
        );
    }


    if (
        boutonMomentSoir
    ) {

        boutonMomentSoir.classList.toggle(
            "actif",
            momentSelectionnePlanning ===
                "soir"
        );


        boutonMomentSoir.setAttribute(
            "aria-pressed",
            momentSelectionnePlanning ===
                "soir"
                ? "true"
                : "false"
        );
    }
}


/* =================================
   NOMBRE DE PERSONNES
================================= */

function mettreAJourNombrePersonnesPlanning() {

    if (
        !nombrePersonnesPlanning
    ) {

        return;
    }


    nombrePersonnesPlanning.textContent =
        personnesSelectionneesPlanning;
}


/* =================================
   MESSAGE POPUP
================================= */

function afficherMessagePlanning(
    texte,
    type = "erreur"
) {

    if (
        !messagePopupPlanning
    ) {

        return;
    }


    messagePopupPlanning.hidden =
        false;


    messagePopupPlanning.textContent =
        texte;


    messagePopupPlanning.classList.remove(
        "succes",
        "erreur"
    );


    messagePopupPlanning.classList.add(
        type
    );
}


function masquerMessagePlanning() {

    if (
        !messagePopupPlanning
    ) {

        return;
    }


    messagePopupPlanning.hidden =
        true;


    messagePopupPlanning.textContent =
        "";


    messagePopupPlanning.classList.remove(
        "succes",
        "erreur"
    );
}


/* =================================
   RECHERCHER LE REPAS DU CRÉNEAU
================================= */

async function rechercherRepasExistantPlanning(
    date,
    moment
) {

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
                    personnes,
                    repas_planning_elements (
                       id,
                       repas_planning_id,
                       recette_id,
                       nom,
                       ordre
                    )
                `
            )
            .eq(
                "foyer_id",
                foyerIdPlanning
            )
            .eq(
                "date",
                date
            )
            .eq(
                "moment",
                moment
            )
            .maybeSingle();


    if (
        error
    ) {

        throw error;
    }


    return (
        data ||
        null
    );
}


/* =================================
   NOM DES ÉLÉMENTS D'UN REPAS
================================= */

async function obtenirNomsRepasExistant(
    repas
) {

    if (
        !repas
    ) {

        return [];
    }


    const elements =
        Array.isArray(
            repas.repas_planning_elements
        )
            ? repas.repas_planning_elements
            : [];


    if (
        elements.length ===
        0
    ) {

        return [];
    }


    /*
        Les repas libres ont déjà
        leur nom dans nom_libre.
    */

    const nomsParIndex =
        new Array(
            elements.length
        ).fill(
            ""
        );


    const recettesACharger =
        [];


    elements.forEach(
        function (
            element,
            index
        ) {

            if (
               element.nom           
            ) {

                nomsParIndex[index] =
                    element.nom;

                return;
            }


            if (
                element.recette_id
            ) {

                recettesACharger.push(
                    {
                        index:
                            index,

                        recetteId:
                            element.recette_id
                    }
                );
            }
        }
    );


    /*
        On récupère les noms des recettes
        présentes dans le repas.
    */

    if (
        recettesACharger.length >
        0
    ) {

        const idsRecettes =
            [
                ...new Set(
                    recettesACharger.map(
                        function (
                            element
                        ) {

                            return element.recetteId;
                        }
                    )
                )
            ];


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
                .in(
                    "id",
                    idsRecettes
                );


        if (
            error
        ) {

            throw error;
        }


        const recettesParId =
            new Map();


        (
            Array.isArray(
                data
            )
                ? data
                : []
        ).forEach(
            function (
                recette
            ) {

                recettesParId.set(
                    recette.id,
                    recette.nom
                );
            }
        );


        recettesACharger.forEach(
            function (
                element
            ) {

                nomsParIndex[
                    element.index
                ] =
                    recettesParId.get(
                        element.recetteId
                    ) ||
                    "Une recette";
            }
        );
    }


    return nomsParIndex.filter(
        Boolean
    );
}


/* =================================
   DEMANDE D'AJOUT
================================= */

async function demanderAjoutPlanning() {

    masquerMessagePlanning();


    if (
        !foyerIdPlanning
    ) {

        afficherMessagePlanning(
            "Aucun foyer n’est associé à votre compte."
        );

        return;
    }


    if (
        !recetteChargee?.id
    ) {

        afficherMessagePlanning(
            "La recette n’a pas pu être identifiée."
        );

        return;
    }


    const date =
        dateAjoutPlanning?.value;


    if (
        !date
    ) {

        afficherMessagePlanning(
            "Choisissez une date."
        );

        return;
    }


    if (
        momentSelectionnePlanning !==
            "midi" &&
        momentSelectionnePlanning !==
            "soir"
    ) {

        afficherMessagePlanning(
            "Choisissez midi ou soir."
        );

        return;
    }


    if (
        personnesSelectionneesPlanning <
        1
    ) {

        afficherMessagePlanning(
            "Le nombre de personnes doit être supérieur à 0."
        );

        return;
    }


    if (
        confirmerAjoutPlanning
    ) {

        confirmerAjoutPlanning.disabled =
            true;


        confirmerAjoutPlanning.textContent =
            "Vérification…";
    }


    try {

        /* =========================
           REPAS EXISTANT ?
        ========================= */

        const repas =
            await rechercherRepasExistantPlanning(
                date,
                momentSelectionnePlanning
            );


        /*
            Aucun repas :
            création immédiate.
        */

        if (
            !repas
        ) {

            await creerRepasPlanningAvecRecette(
                date,
                momentSelectionnePlanning,
                personnesSelectionneesPlanning
            );


            return;
        }


        /*
            Un repas existe déjà.

            On le mémorise avant
            d'ouvrir la confirmation.
        */

        repasExistantPlanning =
            repas;


        const nomsRepas =
            await obtenirNomsRepasExistant(
                repas
            );


        afficherConfirmationRepasExistant(
            repas,
            nomsRepas
        );


    } catch (
        erreur
    ) {

        console.error(
            "Erreur pendant la vérification du planning :",
            erreur
        );


        afficherMessagePlanning(
            erreur.message ||
            "Impossible de vérifier le planning."
        );


        if (
            confirmerAjoutPlanning
        ) {

            confirmerAjoutPlanning.disabled =
                false;


            confirmerAjoutPlanning.textContent =
                "Ajouter au planning";
        }
    }
}


/* =================================
   AFFICHER CONFIRMATION
================================= */

function afficherConfirmationRepasExistant(
    repas,
    nomsRepas
) {

    /*
        On masque la première popup
        pendant la confirmation.
    */

    if (
        popupAjoutPlanning
    ) {

        popupAjoutPlanning.hidden =
            true;
    }


    const date =
        formaterDatePlanning(
            repas.date
        );


    const moment =
        repas.moment ===
        "midi"
            ? "midi"
            : "soir";


    let texteRepas =
        "un repas";


    if (
        Array.isArray(
            nomsRepas
        ) &&
        nomsRepas.length >
            0
    ) {

        texteRepas =
            nomsRepas.join(
                " + "
            );
    }


    if (
        texteConfirmationPlanning
    ) {

        texteConfirmationPlanning.textContent =
            `Vous avez déjà prévu ${texteRepas} ${date} ${moment}. Êtes-vous sûr de vouloir ajouter ${recetteChargee.nom} à ce repas ?`;
    }


    if (
        popupConfirmationPlanning
    ) {

        popupConfirmationPlanning.hidden =
            false;
    }


    if (
        confirmerAjoutPlanning
    ) {

        confirmerAjoutPlanning.disabled =
            false;


        confirmerAjoutPlanning.textContent =
            "Ajouter au planning";
    }
}


/* =================================
   FERMER CONFIRMATION
================================= */

function fermerConfirmationPlanning(
    rouvrirPopupPrincipale = true
) {

    if (
        popupConfirmationPlanning
    ) {

        popupConfirmationPlanning.hidden =
            true;
    }


    if (
        rouvrirPopupPrincipale &&
        popupAjoutPlanning
    ) {

        popupAjoutPlanning.hidden =
            false;
    }


    if (
        !rouvrirPopupPrincipale
    ) {

        document.body.classList.remove(
            "popup-ouverte"
        );
    }
}


/* =================================
   CRÉER UN NOUVEAU REPAS
================================= */

async function creerRepasPlanningAvecRecette(
    date,
    moment,
    personnes
) {

    try {

        /* =========================
           CRÉATION DU REPAS
        ========================= */

        const {
            data:
                nouveauRepas,

            error:
                erreurRepas

        } =
            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .insert(
                    {
                        foyer_id:
                            foyerIdPlanning,

                        date:
                            date,

                        moment:
                            moment,

                        personnes:
                            personnes
                    }
                )
                .select(
                    "id"
                )
                .single();


        if (
            erreurRepas
        ) {

            throw erreurRepas;
        }


        if (
            !nouveauRepas?.id
        ) {

            throw new Error(
                "Le repas n’a pas pu être créé."
            );
        }


        /* =========================
           AJOUT DE LA RECETTE
        ========================= */

        const {
            error:
                erreurElement
        } =
            await window.supabaseClient
                .from(
                    "repas_planning_elements"
                )
                .insert(
                    {
                        {
    repas_planning_id:
        nouveauRepas.id,

    recette_id:
        recetteChargee.id,

    nom:
        recetteChargee.nom,

    ordre:
        1

                    }
                );


        if (
            erreurElement
        ) {

            /*
                Si l'élément n'a pas pu être créé,
                on retire le repas vide afin
                de ne pas laisser de donnée
                inutile dans le planning.
            */

            await window.supabaseClient
                .from(
                    "repas_planning"
                )
                .delete()
                .eq(
                    "id",
                    nouveauRepas.id
                );


            throw erreurElement;
        }


        await terminerAjoutPlanning();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur pendant la création du repas :",
            erreur
        );


        afficherMessagePlanning(
            erreur.message ||
            "Impossible d’ajouter la recette au planning."
        );


        if (
            confirmerAjoutPlanning
        ) {

            confirmerAjoutPlanning.disabled =
                false;


            confirmerAjoutPlanning.textContent =
                "Ajouter au planning";
        }
    }
}


/* =================================
   AJOUTER À UN REPAS EXISTANT
================================= */

async function ajouterRecetteAuRepasExistant() {

    if (
        !repasExistantPlanning?.id
    ) {

        fermerConfirmationPlanning(
            true
        );


        afficherMessagePlanning(
            "Le repas existant n’a pas pu être identifié."
        );


        return;
    }


    if (
        confirmerAjoutMalgreRepas
    ) {

        confirmerAjoutMalgreRepas.disabled =
            true;


        confirmerAjoutMalgreRepas.textContent =
            "Ajout…";
    }


    try {

        const elements =
            Array.isArray(
                repasExistantPlanning
                    .repas_planning_elements
            )
                ? repasExistantPlanning
                    .repas_planning_elements
                : [];


        /*
            Ordre suivant.

            On ne se contente pas du nombre
            d'éléments au cas où les ordres
            ne seraient pas parfaitement
            consécutifs.
        */

        const ordres =
            elements
                .map(
                    function (
                        element
                    ) {

                        return Number(
                            element.ordre
                        ) || 0;
                    }
                );


        const ordreSuivant =
            ordres.length >
            0
                ? Math.max(
                    ...ordres
                ) + 1
                : 1;


        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "repas_planning_elements"
                )
                .insert(
                    {
                        {
    repas_planning_id:
        repasExistantPlanning.id,

    recette_id:
        recetteChargee.id,

    nom:
        recetteChargee.nom,

    ordre:
        ordreSuivant

                    }
                );


        if (
            error
        ) {

            throw error;
        }


        /*
            Important :

            on ne modifie PAS le nombre
            de personnes du repas existant.
        */

        await terminerAjoutPlanning();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur pendant l'ajout au repas existant :",
            erreur
        );


        fermerConfirmationPlanning(
            true
        );


        afficherMessagePlanning(
            erreur.message ||
            "Impossible d’ajouter la recette à ce repas."
        );


    } finally {

        if (
            confirmerAjoutMalgreRepas
        ) {

            confirmerAjoutMalgreRepas.disabled =
                false;


            confirmerAjoutMalgreRepas.textContent =
                "Ajouter quand même";
        }
    }
}


/* =================================
   AJOUT TERMINÉ
================================= */

async function terminerAjoutPlanning() {

    /*
        On ferme les deux popups.
    */

    if (
        popupConfirmationPlanning
    ) {

        popupConfirmationPlanning.hidden =
            true;
    }


    if (
        popupAjoutPlanning
    ) {

        popupAjoutPlanning.hidden =
            true;
    }


    document.body.classList.remove(
        "popup-ouverte"
    );


    repasExistantPlanning =
        null;


    /*
        Petit retour visuel directement
        sur le bouton de la fiche.
    */

    const boutonAjouterPlanning =
        document.getElementById(
            "ajouter-recette-planning"
        );


    if (
        boutonAjouterPlanning
    ) {

        const ancienTexte =
            boutonAjouterPlanning.textContent;


        boutonAjouterPlanning.textContent =
            "Ajouté au planning";


        boutonAjouterPlanning.classList.add(
            "ajoute"
        );


        /*
            Retour à l'état normal
            après un court délai.
        */

        window.setTimeout(
            function () {

                if (
                    document.body.contains(
                        boutonAjouterPlanning
                    )
                ) {

                    boutonAjouterPlanning.textContent =
                        ancienTexte;


                    boutonAjouterPlanning.classList.remove(
                        "ajoute"
                    );
                }

            },
            2200
        );
    }
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

            /*
                Limite volontairement généreuse
                pour éviter une valeur aberrante.
            */

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
   REPAS EXISTANT
================================= */

if (
    annulerConfirmationPlanning
) {

    annulerConfirmationPlanning.addEventListener(
        "click",
        function () {

            /*
                On retourne à la première
                popup sans perdre la date,
                le moment ou les personnes.
            */

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

            /*
                Si l'utilisateur change la date,
                une éventuelle détection précédente
                de repas existant n'est plus valable.
            */

            repasExistantPlanning =
                null;


            masquerMessagePlanning();
        }
    );
}


/* =================================
   CLIC HORS POPUP PRINCIPALE
================================= */

if (
    popupAjoutPlanning
) {

    popupAjoutPlanning.addEventListener(
        "click",
        function (
            evenement
        ) {

            /*
                On ferme uniquement si le clic
                est directement sur le fond.

                Un clic dans la popup ne fait rien.
            */

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

                /*
                    Même comportement que
                    le bouton Annuler :
                    retour à la première popup.
                */

                fermerConfirmationPlanning(
                    true
                );
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


        /*
            La confirmation est prioritaire.
        */

        if (
            popupConfirmationPlanning &&
            !popupConfirmationPlanning.hidden
        ) {

            fermerConfirmationPlanning(
                true
            );

            return;
        }


        /*
            Sinon on ferme la popup principale.
        */

        if (
            popupAjoutPlanning &&
            !popupAjoutPlanning.hidden
        ) {

            fermerPopupAjoutPlanning();
        }
    }
);


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
   QUITTER LA PAGE
================================= */

window.addEventListener(
    "pagehide",
    function () {

        nettoyerGalerieRecette();
    }
);


/* =================================
   VÉRIFICATION DU HTML
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


    /*
        On ne bloque pas toute la recette
        si la popup planning est absente.

        Cela permet quand même de consulter
        la fiche en cas de problème HTML.
    */

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


    return true;
}


/* =================================
   PRÉPARER LA POPUP PLANNING
================================= */

function preparerPopupPlanning() {

    /*
        Date minimum = aujourd'hui.

        Cela évite d'ajouter accidentellement
        une recette dans le passé.
    */

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


    /*
        Valeur visuelle initiale.
    */

    momentSelectionnePlanning =
        "midi";


    mettreAJourMomentPlanning();


    personnesSelectionneesPlanning =
        personnesParDefautPlanning;


    mettreAJourNombrePersonnesPlanning();


    masquerMessagePlanning();


    /*
        Les popups doivent être
        fermées au chargement.
    */

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


    /*
        On prépare d'abord l'interface.

        Le vrai nombre de personnes
        du foyer sera ensuite récupéré
        pendant chargerRecette().
    */

    preparerPopupPlanning();


    try {

        await chargerRecette();


        /*
            chargerRecette() vient de
            récupérer le foyer.

            On synchronise donc maintenant
            le nombre de personnes de la popup
            avec la vraie valeur du foyer.
        */

        personnesSelectionneesPlanning =
            personnesParDefautPlanning;


        mettreAJourNombrePersonnesPlanning();


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
                    personnesParDefautPlanning

            }
        );


    } catch (
        erreur
    ) {

        /*
            chargerRecette() gère déjà
            son affichage d'erreur.

            Ceci sert uniquement de
            sécurité supplémentaire.
        */

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
