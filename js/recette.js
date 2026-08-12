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
   ÉTAT
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


        /*
            En cas d'erreur,
            on masque la galerie.
        */

        if (
            galerieRecette
        ) {

            galerieRecette.hidden =
                true;
        }


        /*
            Et on affiche le message
            dans la zone de la fiche.
        */

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


    /*
        Aucune photo :
        on laisse simplement le tableau vide.
    */

    if (
        lignes.length ===
        0
    ) {

        photosRecette =
            [];

        return;
    }


    /*
        Le bucket "recettes" est privé.

        Pour afficher les photos,
        on crée donc une URL temporaire
        pour chacune d'elles.
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


    /*
        Si une URL n'a pas pu être créée,
        on retire simplement cette photo
        de la galerie.
    */

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


    /*
        À chaque chargement de recette,
        on commence par la première photo.
    */

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

    /*
        Aucun élément HTML galerie :
        on ne fait rien.
    */

    if (
        !galerieRecette ||
        !carouselImagesRecette
    ) {

        return;
    }


    /*
        Aucune photo :
        on cache complètement le bloc.

        Les anciennes recettes restent
        donc exactement comme avant.
    */

    if (
        !Array.isArray(
            photosRecette
        ) ||
        photosRecette.length === 0
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
        Au moins une photo :
        on affiche la galerie.
    */

    galerieRecette.hidden =
        false;


    /*
        Génération des images.

        Elles sont toutes présentes
        dans le DOM.

        Seule la photo active est visible.
    */

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
                                    index === 0
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
        aucune navigation nécessaire.
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
        Boucle du carousel :

        depuis la dernière photo
        → suivante = première

        depuis la première
        → précédente = dernière
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
        Points.
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
   FLÈCHES
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
   CLIC SUR LES POINTS
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

    /*
        Début du geste.
    */

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


    /*
        Mouvement.
    */

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


    /*
        Fin du geste.
    */

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


            /*
                Il faut environ 45 px
                de mouvement horizontal.

                Ça évite de changer de photo
                au moindre petit mouvement
                de doigt.
            */

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
                Glissement vers la gauche :
                photo suivante.
            */

            if (
                difference <
                0
            ) {

                afficherPhotoSuivante();

            } else {

                /*
                    Glissement vers la droite :
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

        /*
            Pas de galerie ou seulement
            une photo : rien à faire.
        */

        if (
            !galerieRecette ||
            galerieRecette.hidden ||
            photosRecette.length <=
                1
        ) {

            return;
        }


        /*
            On évite de changer de photo
            si l'utilisateur écrit dans
            un champ quelconque.
        */

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
        chemins.length === 0
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
   SUPPRESSION SUPABASE
================================= */

async function supprimerRecette() {

    /*
        Vérification côté interface.

        La vraie sécurité reste
        assurée par les policies RLS.
    */

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

        /*
            1. Suppression des fichiers
               dans Storage.

            La table recette_photos est
            supprimée automatiquement si
            ON DELETE CASCADE est bien présent.
        */

        await supprimerPhotosRecetteStorage();


        /*
            2. Suppression de la recette.
        */

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


    const actionsGestionHtml =
        estCreateur
            ? `

                <div class="actions-gestion-recette">

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

                </div>

            `
            : "";


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
                        Compatibilité avec
                        les anciennes recettes
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
       AFFICHAGE HTML
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


                    <div class="information information-portions">

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


    /* =========================
       ÉLÉMENTS APRÈS AFFICHAGE
    ========================= */

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


    /* =========================
       SUPPRESSION
    ========================= */

    if (
        boutonSupprimer
    ) {

        boutonSupprimer
            .addEventListener(
                "click",
                supprimerRecette
            );
    }


    /* =========================
       CASES INGRÉDIENTS
    ========================= */

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


    /* =========================
       MAJ INGRÉDIENTS
    ========================= */

    function mettreAJourIngredients() {

        nombrePortions.textContent =
            personnesSelectionnees;


        listeIngredients.innerHTML =
            creerIngredientsHtml();


        activerCasesIngredients();
    }


    /* =========================
       BOUTON -
    ========================= */

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


    /* =========================
       BOUTON +
    ========================= */

    boutonAugmenter.addEventListener(
        "click",
        function () {

            personnesSelectionnees +=
                1;


            mettreAJourIngredients();
        }
    );


    /* =========================
       INITIALISER INGRÉDIENTS
    ========================= */

    activerCasesIngredients();


    /* =========================
       CASES ÉTAPES
    ========================= */

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
   NETTOYAGE DES URLS SIGNÉES
================================= */

/*
    Les signed URLs Supabase n'ont pas besoin
    d'être "révoquées" comme des blob URLs.

    On remet simplement l'état local à zéro
    lorsque la page est quittée.
*/

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
   SÉCURITÉ SI ÉLÉMENTS ABSENTS
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


    /*
        La galerie peut techniquement
        être absente sans empêcher
        l'affichage de la recette.

        On affiche simplement un warning.
    */

    if (
        !galerieRecette ||
        !carouselRecette ||
        !carouselImagesRecette
    ) {

        console.warn(
            "La galerie photo n'est pas complètement présente dans recette.html."
        );
    }


    return true;
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


    /*
        État de chargement initial.
    */

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


    try {

        await chargerRecette();


        console.log(
            "Recette chargée :",
            {

                recette:
                    recetteChargee?.id,

                photos:
                    photosRecette.length,

                photoActive:
                    indexPhotoActive

            }
        );


    } catch (
        erreur
    ) {

        /*
            chargerRecette() gère déjà
            ses propres erreurs.

            Cette sécurité existe seulement
            pour éviter une erreur silencieuse
            inattendue.
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
