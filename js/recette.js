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
   POPUP RECETTES LIÉES PLANNING
================================= */

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

let choixRecettesLieesPlanning =
    {};


let ajoutPlanningEnAttente =
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

let utilisateurALikeRecette =
    false;


/* =================================
   STOCKAGE LOCAL MODE CUISINE
================================= */

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

        await chargerPhotosRecette();


        /* =========================
           AFFICHAGE
        ========================= */
afficherRecette(
    recetteChargee
);

await chargerLikesRecette();

await chargerCommentairesRecette();

/* =========================
   MINUTEURS SAUVEGARDÉS
========================= */

chargerMinuteursCuisine();


} catch (
    erreur
) {

    console.error(
        "Erreur chargement recette :",
        erreur
    );


    contenuRecette.innerHTML =
        `
            <div class="message erreur">
                ${
                    echapperHtml(
                        erreur.message ||
                        "Impossible de charger la recette."
                    )
                }
            </div>
        `;
    }
}


/* =================================
   CHARGER LES LIKES
================================= */

async function chargerLikesRecette() {

    if (
        !recetteChargee?.id ||
        !utilisateurConnecte?.id
    ) {

        return;
    }


    const boutonLike =
        document.getElementById(
            "bouton-like-recette"
        );


    const compteurLike =
        document.getElementById(
            "compteur-like-recette"
        );


    try {

        const {
            data,
            error
        } =
            await window.supabaseClient
                .from(
                    "recette_likes"
                )
                .select(
                    "user_id"
                )
                .eq(
                    "recette_id",
                    recetteChargee.id
                );


        if (
            error
        ) {

            throw error;
        }


        const likes =
            Array.isArray(
                data
            )
                ? data
                : [];


        utilisateurALikeRecette =
            likes.some(
                function (
                    like
                ) {

                    return (
                        like.user_id ===
                        utilisateurConnecte.id
                    );
                }
            );


        if (
            compteurLike
        ) {

            compteurLike.textContent =
                likes.length;
        }


        if (
            boutonLike
        ) {

            boutonLike.classList.toggle(
                "actif",
                utilisateurALikeRecette
            );


            boutonLike.setAttribute(
                "aria-pressed",
                utilisateurALikeRecette
                    ? "true"
                    : "false"
            );


            boutonLike.textContent =
                utilisateurALikeRecette
                    ? "👍 Aimé"
                    : "👍 J’aime";
        }


    } catch (
        erreur
    ) {

        console.error(
            "Erreur chargement likes recette :",
            erreur
        );
    }
}


/* =================================
   AJOUTER / RETIRER UN LIKE
================================= */

async function basculerLikeRecette() {

    if (
        !recetteChargee?.id ||
        !utilisateurConnecte?.id
    ) {

        return;
    }


    const boutonLike =
        document.getElementById(
            "bouton-like-recette"
        );


    if (
        boutonLike
    ) {

        boutonLike.disabled =
            true;
    }


    try {

        if (
            utilisateurALikeRecette
        ) {

            const {
                error
            } =
                await window.supabaseClient
                    .from(
                        "recette_likes"
                    )
                    .delete()
                    .eq(
                        "recette_id",
                        recetteChargee.id
                    )
                    .eq(
                        "user_id",
                        utilisateurConnecte.id
                    );


            if (
                error
            ) {

                throw error;
            }

        } else {

            const {
                error
            } =
                await window.supabaseClient
                    .from(
                        "recette_likes"
                    )
                    .insert({
                        recette_id:
                            recetteChargee.id,

                        user_id:
                            utilisateurConnecte.id
                    });


            if (
                error
            ) {

                throw error;
            }
        }


        await chargerLikesRecette();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur modification like recette :",
            erreur
        );


    } finally {

        if (
            boutonLike
        ) {

            boutonLike.disabled =
                false;
        }
    }
}

/* =================================
   PUBLIER UN COMMENTAIRE
================================= */

async function publierCommentaireRecette(
    evenement
) {

    evenement.preventDefault();


    if (
        !recetteChargee?.id ||
        !utilisateurConnecte?.id
    ) {

        return;
    }


    const champCommentaire =
        document.getElementById(
            "champ-commentaire-recette"
        );


    const messageCommentaire =
        document.getElementById(
            "message-commentaire-recette"
        );


    const boutonPublier =
        evenement.currentTarget
            .querySelector(
                ".bouton-publier-commentaire"
            );


    const contenu =
        champCommentaire
            ?.value
            .trim();


    if (
        !contenu
    ) {

        if (
            messageCommentaire
        ) {

            messageCommentaire.textContent =
                "Écris un commentaire avant de publier.";
        }

        return;
    }


    if (
        boutonPublier
    ) {

        boutonPublier.disabled =
            true;

        boutonPublier.textContent =
            "Publication…";
    }


    if (
        messageCommentaire
    ) {

        messageCommentaire.textContent =
            "";
    }


    try {

        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "recette_commentaires"
                )
                .insert({
                    recette_id:
                        recetteChargee.id,

                    user_id:
                        utilisateurConnecte.id,

                    parent_id:
                        null,

                    contenu:
                        contenu
                });


        if (
            error
        ) {

            throw error;
        }


        champCommentaire.value =
            "";

       await chargerCommentairesRecette();


        if (
            messageCommentaire
        ) {

            messageCommentaire.textContent =
                "Commentaire publié.";
        }


    } catch (
        erreur
    ) {

        console.error(
            "Erreur publication commentaire :",
            erreur
        );


        if (
            messageCommentaire
        ) {

            messageCommentaire.textContent =
                "Impossible de publier le commentaire.";
        }


    } finally {

        if (
            boutonPublier
        ) {

            boutonPublier.disabled =
                false;

            boutonPublier.textContent =
                "Publier";
        }
    }
}

/* =================================
   CHARGER LES COMMENTAIRES
================================= */

async function chargerCommentairesRecette() {

    if (
        !recetteChargee?.id
    ) {
        return;
    }


    const listeCommentaires =
        document.getElementById(
            "liste-commentaires-recette"
        );


    const compteurCommentaires =
        document.getElementById(
            "compteur-commentaires-recette"
        );


    if (
        !listeCommentaires
    ) {
        return;
    }


    try {

        const {
    data,
    error
} =
    await window.supabaseClient
        .from(
            "recette_commentaires"
        )
        .select(
            `
            id,
            user_id,
            parent_id,
            contenu,
            supprime,
            created_at
            `
        )
        .eq(
            "recette_id",
            recetteChargee.id
        )
        .order(
            "created_at",
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


        const commentaires =
    Array.isArray(
        data
    )
        ? data
        : [];


const commentairesPrincipaux =
    commentaires.filter(
        function (
            commentaire
        ) {

            return (
                commentaire.parent_id ===
                null
            );
        }
    );

       const idsUtilisateurs =
    [
        ...new Set(
            commentaires
                .map(
                    function (
                        commentaire
                    ) {
                        return commentaire.user_id;
                    }
                )
                .filter(
                    Boolean
                )
        )
    ];


let profilsParId =
    {};


if (
    idsUtilisateurs.length >
    0
) {

    const {
        data:
            profils,
        error:
            erreurProfils
    } =
        await window.supabaseClient
            .from(
                "profiles"
            )
            .select(
                "id, prenom, nom"
            )
            .in(
                "id",
                idsUtilisateurs
            );


    if (
        erreurProfils
    ) {
        throw erreurProfils;
    }


    profilsParId =
        Object.fromEntries(
            (
                profils || []
            )
                .map(
                    function (
                        profil
                    ) {
                        return [
                            profil.id,
                            profil
                        ];
                    }
                )
        );
}

        if (
            compteurCommentaires
        ) {
            compteurCommentaires.textContent =
                commentaires.length;
        }


        if (
    commentairesPrincipaux.length ===
    0
) {

            listeCommentaires.innerHTML =
                `
                    <p>
                        Aucun commentaire pour le moment.
                    </p>
                `;

            return;
        }


        listeCommentaires.innerHTML =
    commentairesPrincipaux
        .map(
                    function (
                        commentaire
                    ) {

                        const date =
                            new Date(
                                commentaire.created_at
                            )
                                .toLocaleDateString(
                                    "fr-FR",
                                    {
                                        day:
                                            "numeric",
                                        month:
                                            "long",
                                        year:
                                            "numeric"
                                    }
                                );


                        const texte =
                            commentaire.supprime
                                ? "Commentaire supprimé"
                                : echapperHtml(
                                    commentaire.contenu
                                );
                     
                       const profil =
    profilsParId[
        commentaire.user_id
    ];

                       
   

const prenom =
    profil?.prenom ||
    "";

const nom =
    profil?.nom ||
    "";

const auteur =
    `${prenom} ${nom}`.trim() ||
    "Utilisateur";


                        return `
    <article
        class="commentaire-recette"
        data-commentaire-id="${commentaire.id}"
    >

        <div class="entete-commentaire-recette">

            <span class="auteur-commentaire-recette">
                ${echapperHtml(auteur)}
            </span>

            <span class="date-commentaire-recette">
                ${date}
            </span>

        </div>

        <p class="texte-commentaire-recette">
            ${texte}
        </p>


        ${
            commentaire.supprime
                ? ""
                : `
                    <button
                        type="button"
                        class="bouton-repondre-commentaire"
                        data-commentaire-id="${commentaire.id}"
                    >
                        Répondre
                    </button>
                `
        }


        <div
            class="zone-reponses-commentaire"
            data-reponses-parent="${commentaire.id}"
        >
        </div>

    </article>
`;
                    }
                )
                .join(
                    ""
                );
const boutonsRepondre =
    listeCommentaires.querySelectorAll(
        ".bouton-repondre-commentaire"
    );


boutonsRepondre.forEach(
    function (
        bouton
    ) {

        bouton.addEventListener(
            "click",
            function () {

                ouvrirFormulaireReponse(
                    bouton.dataset.commentaireId
                );

            }
        );
    }
);

    } catch (
        erreur
    ) {

        console.error(
            "Erreur chargement commentaires recette :",
            erreur
        );


        listeCommentaires.innerHTML =
            `
                <p>
                    Impossible de charger les commentaires.
                </p>
            `;
    }
}

/* =================================
   OUVRIR LE FORMULAIRE DE RÉPONSE
================================= */

function ouvrirFormulaireReponse(
    commentaireId
) {

    const zoneReponses =
        document.querySelector(
            `[data-reponses-parent="${commentaireId}"]`
        );


    if (
        !zoneReponses
    ) {
        return;
    }


    /*
        Si un formulaire est déjà ouvert
        pour ce commentaire, on le ferme.
    */

    const formulaireExistant =
        zoneReponses.querySelector(
            ".formulaire-reponse-commentaire"
        );


    if (
        formulaireExistant
    ) {

        formulaireExistant.remove();

        return;
    }


    /*
        Création du formulaire
    */

    const formulaire =
        document.createElement(
            "form"
        );


    formulaire.className =
        "formulaire-reponse-commentaire";


    formulaire.setAttribute(
        "action",
        "javascript:void(0);"
    );


    formulaire.dataset.parentId =
        commentaireId;


    formulaire.innerHTML =
        `
            <textarea
                class="champ-reponse-commentaire"
                placeholder="Écrire une réponse…"
                maxlength="1000"
                required
            ></textarea>

            <div class="actions-reponse-commentaire">

                <button
                    type="button"
                    class="bouton-annuler-reponse"
                >
                    Annuler
                </button>

                <button
                    type="submit"
                    class="bouton-publier-reponse"
                >
                    Répondre
                </button>

            </div>
        `;


    zoneReponses.prepend(
        formulaire
    );


    const champ =
        formulaire.querySelector(
            ".champ-reponse-commentaire"
        );


    champ?.focus();


    const boutonAnnuler =
        formulaire.querySelector(
            ".bouton-annuler-reponse"
        );


    boutonAnnuler?.addEventListener(
        "click",
        function () {

            formulaire.remove();

        }
    );

   formulaire.addEventListener(
    "submit",
    publierReponseCommentaire
);
}
/* =================================
   CHARGER LE FOYER
================================= */

async function chargerFoyerPlanning() {

    foyerIdPlanning =
        null;


    personnesParDefautPlanning =
        1;


    if (
        !utilisateurConnecte?.id
    ) {

        return;
    }


    try {

        const {
            data,
            error
        } =
            await window.supabaseClient
                .from(
                    "foyer_membres"
                )
                .select(
                    "foyer_id"
                )
                .eq(
                    "user_id",
                    utilisateurConnecte.id
                )
                .limit(
                    1
                )
                .maybeSingle();


        if (
            error
        ) {

            throw error;
        }


        if (
            !data?.foyer_id
        ) {

            return;
        }


        foyerIdPlanning =
            data.foyer_id;


        /* =========================
           NOMBRE DE MEMBRES
        ========================= */

        const {
            count,
            error:
                erreurCompteur
        } =
            await window.supabaseClient
                .from(
                    "foyer_membres"
                )
                .select(
                    "*",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                )
                .eq(
                    "foyer_id",
                    foyerIdPlanning
                );


        if (
            erreurCompteur
        ) {

            console.warn(
                "Impossible de compter les membres du foyer :",
                erreurCompteur
            );
        }


        personnesParDefautPlanning =
            Math.max(
                1,
                Number(
                    count
                ) || 1
            );


    } catch (
        erreur
    ) {

        console.error(
            "Erreur chargement foyer :",
            erreur
        );


        foyerIdPlanning =
            null;


        personnesParDefautPlanning =
            1;
    }
}

/* =================================
   PUBLIER UNE RÉPONSE
================================= */

async function publierReponseCommentaire(
    evenement
) {

    evenement.preventDefault();


    if (
        !recetteChargee?.id ||
        !utilisateurConnecte?.id
    ) {
        return;
    }


    const formulaire =
        evenement.currentTarget;


    const parentId =
        formulaire.dataset.parentId;


    const champ =
        formulaire.querySelector(
            ".champ-reponse-commentaire"
        );


    const boutonPublier =
        formulaire.querySelector(
            ".bouton-publier-reponse"
        );


    const contenu =
        champ
            ?.value
            .trim();


    if (
        !parentId ||
        !contenu
    ) {
        return;
    }


    if (
        boutonPublier
    ) {

        boutonPublier.disabled =
            true;

        boutonPublier.textContent =
            "Publication…";
    }


    try {

        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "recette_commentaires"
                )
                .insert({

                    recette_id:
                        recetteChargee.id,

                    user_id:
                        utilisateurConnecte.id,

                    parent_id:
                        parentId,

                    contenu:
                        contenu

                });


        if (
            error
        ) {
            throw error;
        }


        console.log(
            "Réponse publiée avec succès."
        );


        formulaire.remove();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur publication réponse :",
            erreur
        );


        if (
            boutonPublier
        ) {

            boutonPublier.textContent =
                "Erreur";
        }


        return;

    } finally {

        if (
            boutonPublier &&
            boutonPublier.isConnected
        ) {

            boutonPublier.disabled =
                false;

            boutonPublier.textContent =
                "Répondre";
        }
    }
}


/* =================================
   CHARGER LES PHOTOS
================================= */

async function chargerPhotosRecette() {

    photosRecette =
        [];


    indexPhotoActive =
        0;


    if (
        !recetteChargee?.id
    ) {

        afficherGalerieRecette();

        return;
    }


    try {

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
                    recetteChargee.id
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


        const photos =
            Array.isArray(
                data
            )
                ? data
                : [];


        photosRecette =
            photos
                .map(
                    function (
                        photo
                    ) {

                        const {
                            data:
                                donneesUrl
                        } =
                            window.supabaseClient
                                .storage
                                .from(
                                    "recettes"
                                )
                                .getPublicUrl(
                                    photo.chemin
                                );


                        return {
                            ...photo,

                            url:
                                donneesUrl
                                    ?.publicUrl ||
                                ""
                        };
                    }
                )
                .filter(
                    function (
                        photo
                    ) {

                        return Boolean(
                            photo.url
                        );
                    }
                );


    } catch (
        erreur
    ) {

        console.error(
            "Erreur chargement photos :",
            erreur
        );


        photosRecette =
            [];
    }


    afficherGalerieRecette();
}


/* =================================
   AFFICHER GALERIE
================================= */

function afficherGalerieRecette() {

    if (
        !galerieRecette ||
        !carouselImagesRecette
    ) {

        return;
    }


    carouselImagesRecette.innerHTML =
        "";


    if (
        photosRecette.length ===
        0
    ) {

        galerieRecette.hidden =
            true;


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


    photosRecette.forEach(
        function (
            photo,
            index
        ) {

            const slide =
                document.createElement(
                    "div"
                );


            slide.className =
                "slide-recette";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                photo.url;


            image.alt =
                recetteChargee?.nom
                    ? (
                        `${recetteChargee.nom} — photo ${index + 1}`
                    )
                    : (
                        `Photo ${index + 1}`
                    );


            image.loading =
                index === 0
                    ? "eager"
                    : "lazy";


            image.draggable =
                false;


            slide.appendChild(
                image
            );


            carouselImagesRecette.appendChild(
                slide
            );
        }
    );


    /* =========================
       INDICATEURS
    ========================= */

    if (
        indicateursCarouselRecette
    ) {

        indicateursCarouselRecette.innerHTML =
            "";


        photosRecette.forEach(
            function (
                photo,
                index
            ) {

                const bouton =
                    document.createElement(
                        "button"
                    );


                bouton.type =
                    "button";


                bouton.className =
                    "indicateur-carousel-recette";


                bouton.setAttribute(
                    "aria-label",
                    `Afficher la photo ${index + 1}`
                );


                bouton.addEventListener(
                    "click",
                    function () {

                        afficherPhotoRecette(
                            index
                        );
                    }
                );


                indicateursCarouselRecette.appendChild(
                    bouton
                );
            }
        );


        indicateursCarouselRecette.hidden =
            photosRecette.length <=
            1;
    }


    if (
        boutonPhotoPrecedente
    ) {

        boutonPhotoPrecedente.hidden =
            photosRecette.length <=
            1;
    }


    if (
        boutonPhotoSuivante
    ) {

        boutonPhotoSuivante.hidden =
            photosRecette.length <=
            1;
    }


    afficherPhotoRecette(
        0,
        false
    );
}


/* =================================
   AFFICHER UNE PHOTO
================================= */

function afficherPhotoRecette(
    index,
    animer = true
) {

    if (
        photosRecette.length ===
        0 ||
        !carouselImagesRecette
    ) {

        return;
    }


    let nouvelIndex =
        Number(
            index
        );


    if (
        !Number.isFinite(
            nouvelIndex
        )
    ) {

        nouvelIndex =
            0;
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


    if (
        !animer
    ) {

        carouselImagesRecette.style.transition =
            "none";
    }


    carouselImagesRecette.style.transform =
        `translateX(-${indexPhotoActive * 100}%)`;


    if (
        !animer
    ) {

        window.requestAnimationFrame(
            function () {

                window.requestAnimationFrame(
                    function () {

                        carouselImagesRecette.style.transition =
                            "";
                    }
                );
            }
        );
    }


    mettreAJourIndicateursCarousel();
}


/* =================================
   INDICATEURS CAROUSEL
================================= */

function mettreAJourIndicateursCarousel() {

    if (
        !indicateursCarouselRecette
    ) {

        return;
    }


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


/* =================================
   PHOTO PRÉCÉDENTE
================================= */

function afficherPhotoPrecedente() {

    if (
        photosRecette.length <=
        1
    ) {

        return;
    }


    afficherPhotoRecette(
        indexPhotoActive -
        1
    );
}


/* =================================
   PHOTO SUIVANTE
================================= */

function afficherPhotoSuivante() {

    if (
        photosRecette.length <=
        1
    ) {

        return;
    }


    afficherPhotoRecette(
        indexPhotoActive +
        1
    );
}


/* =================================
   BOUTONS CAROUSEL
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
   SWIPE TACTILE CAROUSEL
================================= */

if (
    carouselRecette
) {

    carouselRecette.style.touchAction =
        "pan-y";


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
                evenement.touches?.[0];


            if (
                !touche
            ) {

                return;
            }


            positionTouchDebut =
                touche.clientX;


            positionTouchFin =
                touche.clientX;
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
                evenement.touches?.[0];


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


            positionTouchDebut =
                null;


            positionTouchFin =
                null;


            /*
                Un petit mouvement du doigt
                ne doit pas changer de photo.
            */

            if (
                Math.abs(
                    difference
                ) <
                45
            ) {

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
        },
        {
            passive:
                true
        }
    );
}


/* =================================
   SWIPE SOURIS / STYLET
================================= */

let positionPointerDebutCarousel =
    null;


let positionPointerFinCarousel =
    null;


let pointerCarouselActif =
    false;


if (
    carouselRecette
) {

    carouselRecette.addEventListener(
        "dragstart",
        function (
            evenement
        ) {

            evenement.preventDefault();
        }
    );


    carouselRecette.addEventListener(
        "pointerdown",
        function (
            evenement
        ) {

            if (
                photosRecette.length <=
                    1 ||
                evenement.button !==
                    0
            ) {

                return;
            }


            /*
                Sur mobile, les événements
                touch ci-dessus s'occupent
                déjà du swipe.
            */

            if (
                evenement.pointerType ===
                "touch"
            ) {

                return;
            }


            pointerCarouselActif =
                true;


            positionPointerDebutCarousel =
                evenement.clientX;


            positionPointerFinCarousel =
                evenement.clientX;


            try {

                carouselRecette
                    .setPointerCapture(
                        evenement.pointerId
                    );

            } catch (
                erreur
            ) {

                /*
                    La capture du pointeur
                    est facultative.
                */
            }


            carouselRecette.classList.add(
                "carousel-en-glissement"
            );
        }
    );


    carouselRecette.addEventListener(
        "pointermove",
        function (
            evenement
        ) {

            if (
                !pointerCarouselActif
            ) {

                return;
            }


            positionPointerFinCarousel =
                evenement.clientX;
        }
    );


    function terminerSwipePointerCarousel(
        evenement
    ) {

        if (
            !pointerCarouselActif
        ) {

            return;
        }


        const difference =
            positionPointerFinCarousel -
            positionPointerDebutCarousel;


        pointerCarouselActif =
            false;


        carouselRecette.classList.remove(
            "carousel-en-glissement"
        );


        try {

            if (
                evenement &&
                carouselRecette
                    .hasPointerCapture(
                        evenement.pointerId
                    )
            ) {

                carouselRecette
                    .releasePointerCapture(
                        evenement.pointerId
                    );
            }

        } catch (
            erreur
        ) {

            /*
                Sans conséquence.
            */
        }


        if (
            Math.abs(
                difference
            ) <
            45
        ) {

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
    }


    carouselRecette.addEventListener(
        "pointerup",
        terminerSwipePointerCarousel
    );


    carouselRecette.addEventListener(
        "pointercancel",
        terminerSwipePointerCarousel
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
            Les flèches ne changent pas
            de photo si l'utilisateur est
            en train d'écrire dans un champ.
        */

        const cible =
            evenement.target;


        const saisieActive =
            cible instanceof
                HTMLInputElement ||
            cible instanceof
                HTMLTextAreaElement ||
            cible instanceof
                HTMLSelectElement;


        if (
            saisieActive ||
            photosRecette.length <=
                1 ||
            !galerieRecette ||
            galerieRecette.hidden
        ) {

            return;
        }


        if (
            evenement.key ===
            "ArrowLeft"
        ) {

            afficherPhotoPrecedente();
        }


        if (
            evenement.key ===
            "ArrowRight"
        ) {

            afficherPhotoSuivante();
        }
    }
);


/* =========================================================
   REMPLACER EN ENTIER LA FONCTION afficherRecette(recette)
   DANS js/recette.js PAR CE BLOC
   ========================================================= */

function afficherRecette(
    recette
) {

    const nom =
        recette.nom ||
        "Recette";

    const description =
        recette.description ||
        "";

    const categorie =
        recette.categorie_affichee ||
        recette.categorie ||
        "";

    const tempsPreparation =
        Number(
            recette.preparation ??
            recette.temps_preparation
        ) || 0;

    const tempsCuisson =
        Number(
            recette.cuisson ??
            recette.temps_cuisson
        ) || 0;

    const personnesInitiales =
        Math.max(
            1,
            Number(
                recette.personnes
            ) || 1
        );

    personnesModeCuisine =
        personnesInitiales;

    const ingredients =
        normaliserIngredientsRecette(
            recette.ingredients
        );

    const etapes =
        normaliserEtapesRecette(
            recette.etapes
        );

    const valeursBadges =
        [];

    [
        recette.regimes,
        recette.occasions,
        recette.saisons
    ].forEach(
        function (
            groupe
        ) {

            if (
                Array.isArray(
                    groupe
                )
            ) {

                groupe.forEach(
                    function (
                        valeur
                    ) {

                        const libellesBadges = {
    "quotidien": "Quotidien",
    "invites": "Invités",
    "brunch": "Brunch",
    "barbecue": "Barbecue",
    "fetes": "Fêtes",
    "aperitif-dinatoire": "Apéritif dînatoire",

    "ete": "Été",
    "automne": "Automne",
    "hiver": "Hiver",
    "printemps": "Printemps",
    "toute-annee": "Toute l'année"
};

const code =
    String(
        valeur ||
        ""
    ).trim();

const texte =
    libellesBadges[code] ||
    code;

                        if (
                            texte &&
                            !valeursBadges.includes(
                                texte
                            )
                        ) {

                            valeursBadges.push(
                                texte
                            );
                        }
                    }
                );
            }
        }
    );

    const badgesHtml =
        valeursBadges
            .map(
                function (
                    valeur
                ) {

                    return `
                        <span class="badge-recette">
                            ${
                                echapperHtml(
                                    valeur
                                )
                            }
                        </span>
                    `;
                }
            )
            .join(
                ""
            );

    contenuRecette.innerHTML =
        `
            <article class="fiche-recette">

                <div class="contenu">

                    ${
                        categorie
                            ? `
                                <div class="badges-principaux">
                                    <span class="categorie">
                                        ${
                                            echapperHtml(
                                                categorie
                                            )
                                        }
                                    </span>
                                </div>
                            `
                            : ""
                    }

                    <h1>
                        ${
                            echapperHtml(
                                nom
                            )
                        }
                    </h1>

                    ${
                        description
                            ? `
                                <p class="introduction">
                                    ${
                                        echapperHtml(
                                            description
                                        )
                                    }
                                </p>
                            `
                            : ""
                    }

                    ${
                        badgesHtml
                            ? `
                                <div class="badges-recette">
                                    ${badgesHtml}
                                </div>
                            `
                            : ""
                    }

                    <div class="actions-gestion-recette">

                        <button
                            type="button"
                            class="bouton-mode-cuisine"
                            id="ouvrir-mode-cuisine"
                        >
                            Mode cuisine
                        </button>

                        <button
                            type="button"
                            class="bouton-ajouter-planning"
                            id="ajouter-recette-planning"
                        >
                            Ajouter au planning
                        </button>

                    </div>

                    <div class="informations-recette">

                        <div class="information">
                            <strong>
                                Préparation
                            </strong>

                            <span>
                                ${tempsPreparation} min
                            </span>
                        </div>

                        <div class="information">
                            <strong>
                                Cuisson
                            </strong>

                            <span>
                                ${tempsCuisson} min
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
                                    ${personnesModeCuisine}
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
                            </ul>

                        </section>

                        <section>

                            <h2>
                                Préparation
                            </h2>

                            <ol class="liste-etapes">

                                ${
                                    etapes
                                        .map(
                                            function (
                                                etape,
                                                index
                                            ) {

                                                return `
    <li class="etape-item">
        <div class="contenu-etape">
            ${etape}
        </div>
    </li>
`;
                                            }
                                        )
                                        .join(
                                            ""
                                        )
                                }

                            </ol>

                        </section>

                                        </div>


                    <!-- =========================
                         INTERACTIONS
                    ========================== -->

                    <section class="section-interactions-recette">

                        <div class="zone-like-recette">

                            <button
                                type="button"
                                class="bouton-like-recette"
                                id="bouton-like-recette"
                                aria-pressed="false"
                            >
                                👍 J’aime
                            </button>


                            <span
                                class="compteur-like-recette"
                                id="compteur-like-recette"
                            >
                                0
                            </span>

                        </div>

                    </section>

                    <!-- =========================
     COMMENTAIRES
========================== -->

<section class="section-commentaires-recette">

    <div class="entete-commentaires-recette">

        <h2>
            Commentaires
        </h2>

        <span
            class="compteur-commentaires-recette"
            id="compteur-commentaires-recette"
        >
            0
        </span>

    </div>


    <form
    class="formulaire-commentaire-recette"
    id="formulaire-commentaire-recette"
    action="javascript:void(0);"
>

        <textarea
            id="champ-commentaire-recette"
            placeholder="Écrire un commentaire…"
            maxlength="1000"
            required
        ></textarea>


        <div class="actions-commentaire-recette">

            <span
                class="message-commentaire-recette"
                id="message-commentaire-recette"
            >
            </span>


            <button
                type="submit"
                class="bouton-publier-commentaire"
            >
                Publier
            </button>

        </div>

    </form>


    <div
        class="liste-commentaires-recette"
        id="liste-commentaires-recette"
    >

        <!-- Les commentaires seront injectés ici -->

    </div>

</section>


                </div>

            </article>
      
        `;


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


    function actualiserIngredientsFiche() {

    if (
        !listeIngredients
    ) {

        return;
    }


    listeIngredients.innerHTML =
        ingredients
            .map(
                function (
                    ingredient
                ) {


                   const texte =
    formaterIngredientAffichage(
        ingredient,
        personnesModeCuisine
    );


const recetteLieeId =
    ingredient.recette_liee_id
        ? String(
            ingredient.recette_liee_id
        )
        : null;


/* =========================
   RECETTE LIÉE
========================= */

if (
    recetteLieeId &&
    recetteLieeId !==
        String(
            identifiantRecette
        )
) {

    return `
        <li class="ingredient-item ingredient-recette-liee">

            <span>
                ${
                    echapperHtml(
                        texte
                    )
                }
            </span>

            <button
                type="button"
                class="bouton-recette-liee"
                data-recette-liee-id="${echapperHtml(
                    recetteLieeId
                )}"
            >
                Voir la recette ↗
            </button>

        </li>
    `;
}

                   


/* =========================
   INGRÉDIENT CLASSIQUE
========================= */

return `
    <li class="ingredient-item">

        <span>
            ${
                echapperHtml(
                    texte
                )
            }
        </span>

    </li>
`;
                }
            )
            .join(
                ""
            );

       listeIngredients
    .querySelectorAll(
        ".bouton-recette-liee"
    )
    .forEach(
        function (
            bouton
        ) {

            bouton.addEventListener(
                "click",
                function () {

                    const recetteId =
                        bouton.dataset
                            .recetteLieeId;


                    if (
                        !recetteId
                    ) {

                        return;
                    }


                    window.open(
                        `recette.html?id=${encodeURIComponent(
                            recetteId
                        )}`,
                        "_blank"
                    );
                }
            );
        }
    );
}


    function actualiserPortionsFiche() {

        personnesModeCuisine =
            Math.max(
                1,
                Math.min(
                    50,
                    Number(
                        personnesModeCuisine
                    ) || 1
                )
            );

        if (
            nombrePortions
        ) {

            nombrePortions.textContent =
                personnesModeCuisine;
        }

        actualiserIngredientsFiche();
    }


    actualiserPortionsFiche();


    if (
        boutonDiminuer
    ) {

        boutonDiminuer.addEventListener(
            "click",
            function () {

                personnesModeCuisine =
                    Math.max(
                        1,
                        personnesModeCuisine -
                            1
                    );

                actualiserPortionsFiche();
            }
        );
    }


    if (
        boutonAugmenter
    ) {

        boutonAugmenter.addEventListener(
            "click",
            function () {

                personnesModeCuisine =
                    Math.min(
                        50,
                        personnesModeCuisine +
                            1
                    );

                actualiserPortionsFiche();
            }
        );
    }


    const boutonModeCuisine =
        document.getElementById(
            "ouvrir-mode-cuisine"
        );

    if (
        boutonModeCuisine
    ) {

        boutonModeCuisine.addEventListener(
            "click",
            ouvrirModeCuisine
        );
    }


    const boutonAjouterPlanning =
        document.getElementById(
            "ajouter-recette-planning"
        );

    if (
        boutonAjouterPlanning
    ) {

        boutonAjouterPlanning.addEventListener(
            "click",
            ouvrirPopupAjoutPlanning
        );
    }

   const boutonLike =
    document.getElementById(
        "bouton-like-recette"
    );


if (
    boutonLike
) {

    boutonLike.addEventListener(
        "click",
        basculerLikeRecette
    );
}

   const formulaireCommentaire =
    document.getElementById(
        "formulaire-commentaire-recette"
    );


if (
    formulaireCommentaire
) {

    formulaireCommentaire.addEventListener(
        "submit",
        publierCommentaireRecette
    );
}
}



/* =================================
   NORMALISER LES INGRÉDIENTS
================================= */

function normaliserIngredientsRecette(
    ingredients
) {

    if (
        !Array.isArray(
            ingredients
        )
    ) {

        return [];
    }


    return ingredients
        .map(
            function (
                ingredient
            ) {

                if (
                    typeof ingredient ===
                    "string"
                ) {

                    return {
                        nom:
                            ingredient,

                        quantite:
                            null,

                        unite:
                            "",

                        proportionnel:
                            false,

                        recette_liee_id:
                            null
                    };
                }


                if (
                    !ingredient ||
                    typeof ingredient !==
                        "object"
                ) {

                    return null;
                }


                return {
                    nom:
                        ingredient.nom ||
                        "",

                    quantite:
                        ingredient.quantite ??
                        null,

                    unite:
                        ingredient.unite ||
                        "",

                    proportionnel:
                        ingredient.proportionnel !==
                        false,

                    recette_liee_id:
                        ingredient.recette_liee_id ||
                        null
                };
            }
        )
        .filter(
            Boolean
        );
}


/* =================================
   NORMALISER LES ÉTAPES
================================= */

function normaliserEtapesRecette(
    etapes
) {

    if (
        !Array.isArray(
            etapes
        )
    ) {

        return [];
    }


    return etapes
        .map(
            function (
                etape
            ) {

                if (
                    typeof etape ===
                    "string"
                ) {

                    return etape.trim();
                }


                if (
                    etape &&
                    typeof etape ===
                        "object"
                ) {

                    return String(
                        etape.texte ||
                        etape.nom ||
                        ""
                    ).trim();
                }


                return "";
            }
        )
        .filter(
            Boolean
        );
}


/* =================================
   ÉCHAPPER HTML
================================= */

function echapperHtml(
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
   FORMATER UNE QUANTITÉ
================================= */

function formaterQuantite(
    valeur
) {

    const nombre =
        Number(
            valeur
        );


    if (
        !Number.isFinite(
            nombre
        )
    ) {

        return "";
    }


    if (
        Number.isInteger(
            nombre
        )
    ) {

        return String(
            nombre
        );
    }


    return nombre
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
   AFFICHAGE D'UN INGRÉDIENT
================================= */

function formaterIngredientAffichage(
    ingredient,
    personnesCibles
) {

    if (
        !ingredient
    ) {

        return "";
    }


    const personnesRecette =
        Math.max(
            1,
            Number(
                recetteChargee?.personnes
            ) || 1
        );


    const personnes =
        Math.max(
            1,
            Number(
                personnesCibles
            ) || personnesRecette
        );


    let quantite =
        ingredient.quantite;


    if (
        ingredient.proportionnel !==
            false &&
        quantite !==
            null &&
        quantite !==
            undefined &&
        quantite !==
            ""
    ) {

        const nombre =
            Number(
                quantite
            );


        if (
            Number.isFinite(
                nombre
            )
        ) {

            quantite =
                nombre *
                (
                    personnes /
                    personnesRecette
                );
        }
    }


    const morceaux =
        [];


    if (
        quantite !==
            null &&
        quantite !==
            undefined &&
        quantite !==
            ""
    ) {

        morceaux.push(
            formaterQuantite(
                Number(
                    quantite
                )
            )
        );
    }


    if (
        ingredient.unite
    ) {

        morceaux.push(
            ingredient.unite
        );
    }


    if (
        ingredient.nom
    ) {

        morceaux.push(
            ingredient.nom
        );
    }


    return morceaux
        .filter(
            Boolean
        )
        .join(
            " "
        );
}


/* =================================
   MESSAGE POPUP PLANNING
================================= */

function afficherMessagePlanning(
    message
) {

    if (
        !messagePopupPlanning
    ) {

        return;
    }


    messagePopupPlanning.textContent =
        message ||
        "";


    messagePopupPlanning.hidden =
        !message;
}


function masquerMessagePlanning() {

    if (
        !messagePopupPlanning
    ) {

        return;
    }


    messagePopupPlanning.textContent =
        "";


    messagePopupPlanning.hidden =
        true;
}


/* =================================
   PRÉPARER POPUP PLANNING
================================= */

function preparerPopupPlanning() {

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


    masquerMessagePlanning();


    repasExistantPlanning =
        null;
}


/* =================================
   OUVRIR POPUP PLANNING
================================= */

function ouvrirPopupAjoutPlanning() {

    if (
        !popupAjoutPlanning
    ) {

        return;
    }


    /*
        Pas d'alert natif :
        le message reste dans notre popup.
    */

    if (
        !foyerIdPlanning
    ) {

        popupAjoutPlanning.hidden =
            false;


        document.body.classList.add(
            "popup-ouverte"
        );


        afficherMessagePlanning(
            "Vous devez appartenir à un foyer pour ajouter une recette au planning."
        );


        return;
    }


    repasExistantPlanning =
        null;


    momentSelectionnePlanning =
        "midi";


    personnesSelectionneesPlanning =
        Math.max(
            1,
            personnesParDefautPlanning
        );


    if (
        nomRecettePopupPlanning
    ) {

        nomRecettePopupPlanning.textContent =
            recetteChargee?.nom ||
            "";
    }


    if (
        dateAjoutPlanning
    ) {

        dateAjoutPlanning.value =
            obtenirDateAujourdhuiPlanning();


        dateAjoutPlanning.min =
            obtenirDateAujourdhuiPlanning();
    }


    mettreAJourMomentPlanning();


    mettreAJourNombrePersonnesPlanning();


    masquerMessagePlanning();


    if (
        confirmerAjoutPlanning
    ) {

        confirmerAjoutPlanning.disabled =
            false;


        confirmerAjoutPlanning.textContent =
            "Ajouter au planning";
    }


    popupAjoutPlanning.hidden =
        false;


    document.body.classList.add(
        "popup-ouverte"
    );
}


/* =================================
   FERMER POPUP PLANNING
================================= */

function fermerPopupAjoutPlanning() {

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


    repasExistantPlanning =
        null;


    document.body.classList.remove(
        "popup-ouverte"
    );


    masquerMessagePlanning();
}


/* =================================
   MOMENT MIDI / SOIR
================================= */

function selectionnerMomentPlanning(
    moment
) {

    if (
        moment !==
            "midi" &&
        moment !==
            "soir"
    ) {

        return;
    }


    momentSelectionnePlanning =
        moment;


    repasExistantPlanning =
        null;


    mettreAJourMomentPlanning();


    masquerMessagePlanning();
}


/* =================================
   AFFICHAGE MIDI / SOIR
================================= */

function mettreAJourMomentPlanning() {

    if (
        boutonMomentMidi
    ) {

        const actifMidi =
            momentSelectionnePlanning ===
            "midi";


        boutonMomentMidi.classList.toggle(
            "actif",
            actifMidi
        );


        boutonMomentMidi.setAttribute(
            "aria-pressed",
            actifMidi
                ? "true"
                : "false"
        );
    }


    if (
        boutonMomentSoir
    ) {

        const actifSoir =
            momentSelectionnePlanning ===
            "soir";


        boutonMomentSoir.classList.toggle(
            "actif",
            actifSoir
        );


        boutonMomentSoir.setAttribute(
            "aria-pressed",
            actifSoir
                ? "true"
                : "false"
        );
    }
}


/* =================================
   AFFICHAGE NOMBRE DE PERSONNES
================================= */

function mettreAJourNombrePersonnesPlanning() {

    if (
        !nombrePersonnesPlanning
    ) {

        return;
    }


    nombrePersonnesPlanning.textContent =
        Math.max(
            1,
            personnesSelectionneesPlanning
        );
}


/* =================================
   CHERCHER REPAS EXISTANT
================================= */

async function rechercherRepasExistantPlanning(
    date,
    moment
) {

    if (
        !foyerIdPlanning
    ) {

        return null;
    }


    const {
        data:
            repas,

        error:
            erreurRepas
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
                    personnes,
                    created_by
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
            .limit(
                1
            )
            .maybeSingle();


    if (
        erreurRepas
    ) {

        throw erreurRepas;
    }


    if (
        !repas
    ) {

        return null;
    }


    const {
        data:
            elements,

        error:
            erreurElements
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
            .select(
    `
        id,
        repas_planning_id,
        recette_id,
        nom,
        mode_approvisionnement,
        ordre
                `
            )
            .eq(
                "repas_planning_id",
                repas.id
            )
            .order(
                "ordre",
                {
                    ascending:
                        true
                }
            );


    if (
        erreurElements
    ) {

        throw erreurElements;
    }


    repas.repas_planning_elements =
        Array.isArray(
            elements
        )
            ? elements
            : [];


    /*
        Compatibilité avec les anciens repas
        enregistrés directement dans
        repas_planning.
    */

    if (
        repas.repas_planning_elements.length ===
            0 &&
        (
            repas.nom ||
            repas.recette_id
        )
    ) {

        repas.repas_planning_elements.push(
            {
                id:
                    null,

                repas_planning_id:
                    repas.id,

                recette_id:
                    repas.recette_id ||
                    null,

                nom:
    repas.nom ||
    "Repas",

mode_approvisionnement:
    "faire",

ordre:
    1
            }
        );
    }


    return repas;
}


/* =================================
   NOMS DU REPAS EXISTANT
================================= */

function obtenirNomsRepasExistant(
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


    const noms =
        elements
            .map(
                function (
                    element
                ) {

                    return String(
                        element?.nom ||
                        ""
                    ).trim();
                }
            )
            .filter(
                Boolean
            );


    if (
        noms.length ===
            0 &&
        repas.nom
    ) {

        noms.push(
            repas.nom
        );
    }


    return noms;
}

/* =================================
   POPUP RECETTES LIÉES
   FAIRE OU ACHETER
================================= */

async function ouvrirPopupRecettesLieesDepuisFiche() {

    if (
        !popupRecettesLieesPlanning ||
        !listeRecettesLieesPlanning
    ) {

        return false;
    }


    const ingredients =
        normaliserIngredientsRecette(
            recetteChargee?.ingredients
        );


    const ingredientsLies =
        ingredients.filter(
            function (
                ingredient
            ) {

                return Boolean(
                    ingredient?.recette_liee_id
                );
            }
        );


    if (
        ingredientsLies.length ===
        0
    ) {

        return false;
    }


    const idsRecettesLiees =
        [
            ...new Set(
                ingredientsLies.map(
                    function (
                        ingredient
                    ) {

                        return String(
                            ingredient.recette_liee_id
                        );
                    }
                )
            )
        ];


    const {
        data:
            recettesLiees,

        error:
            erreurRecettesLiees
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
                idsRecettesLiees
            );


    if (
        erreurRecettesLiees
    ) {

        throw erreurRecettesLiees;
    }


    choixRecettesLieesPlanning =
        {};


    listeRecettesLieesPlanning.innerHTML =
        ingredientsLies
            .map(
                function (
                    ingredient
                ) {

                    const recetteLieeId =
                        String(
                            ingredient.recette_liee_id
                        );


                    const recetteLiee =
                        recettesLiees
                            ?.find(
                                function (
                                    recette
                                ) {

                                    return (
                                        String(
                                            recette.id
                                        ) ===
                                        recetteLieeId
                                    );
                                }
                            );


                    const nom =
                        recetteLiee?.nom ||
                        ingredient.nom ||
                        "Recette liée";


                    choixRecettesLieesPlanning[
                        recetteLieeId
                    ] =
                        "faire";


                    const quantite =
                        ingredient.quantite ??
                        "";


                    const unite =
                        ingredient.unite ||
                        "";


                    const quantiteTexte =
                        [
                            quantite,
                            unite
                        ]
                            .filter(
                                function (
                                    valeur
                                ) {

                                    return (
                                        valeur !==
                                            "" &&
                                        valeur !==
                                            null &&
                                        valeur !==
                                            undefined
                                    );
                                }
                            )
                            .join(
                                " "
                            );


                    return `
                        <section
                            class="carte-recette-liee-planning"
                            data-recette-id="${echapperHtml(
                                recetteLieeId
                            )}"
                        >

                            <div class="entete-recette-liee-planning">

                                <strong>
                                    ${
                                        echapperHtml(
                                            nom
                                        )
                                    }
                                </strong>

                                ${
                                    quantiteTexte
                                        ? `
                                            <span>
                                                ${
                                                    echapperHtml(
                                                        quantiteTexte
                                                    )
                                                }
                                            </span>
                                        `
                                        : ""
                                }

                            </div>


                            <div class="choix-approvisionnement-recette">

                                <button
                                    type="button"
                                    class="option-approvisionnement actif"
                                    data-recette-id="${echapperHtml(
                                        recetteLieeId
                                    )}"
                                    data-mode="faire"
                                >
                                    <span class="icone-option">
                                        👩‍🍳
                                    </span>

                                    <span>
                                        <strong>
                                            Faire maison
                                        </strong>

                                        <small>
                                            Ajouter ses ingrédients aux courses.
                                        </small>
                                    </span>
                                </button>


                                <button
                                    type="button"
                                    class="option-approvisionnement"
                                    data-recette-id="${echapperHtml(
                                        recetteLieeId
                                    )}"
                                    data-mode="acheter"
                                >
                                    <span class="icone-option">
                                        🛒
                                    </span>

                                    <span>
                                        <strong>
                                            Acheter
                                        </strong>

                                        <small>
                                            Ajouter cette préparation directement aux courses.
                                        </small>
                                    </span>
                                </button>

                            </div>

                        </section>
                    `;
                }
            )
            .join(
                ""
            );


    listeRecettesLieesPlanning
        .querySelectorAll(
            ".option-approvisionnement"
        )
        .forEach(
            function (
                bouton
            ) {

                bouton.addEventListener(
                    "click",
                    function () {

                        const recetteId =
                            bouton.dataset
                                .recetteId;


                        const mode =
                            bouton.dataset
                                .mode;


                        if (
                            !recetteId ||
                            !mode
                        ) {

                            return;
                        }


                        choixRecettesLieesPlanning[
                            recetteId
                        ] =
                            mode;


                        const carte =
                            bouton.closest(
                                ".carte-recette-liee-planning"
                            );


                        if (
                            !carte
                        ) {

                            return;
                        }


                        carte
                            .querySelectorAll(
                                ".option-approvisionnement"
                            )
                            .forEach(
                                function (
                                    option
                                ) {

                                    option.classList.toggle(
                                        "actif",
                                        option ===
                                            bouton
                                    );
                                }
                            );
                    }
                );
            }
        );


    if (
        popupAjoutPlanning
    ) {

        popupAjoutPlanning.hidden =
            true;
    }


    popupRecettesLieesPlanning.hidden =
        false;


    document.body.classList.add(
        "popup-ouverte"
    );


    return true;
}

function fermerPopupRecettesLieesDepuisFiche(
    rouvrirPopupPlanning = true
) {

    if (
        popupRecettesLieesPlanning
    ) {

        popupRecettesLieesPlanning.hidden =
            true;
    }


    if (
        rouvrirPopupPlanning &&
        popupAjoutPlanning
    ) {

        popupAjoutPlanning.hidden =
            false;
    }


    if (
        !rouvrirPopupPlanning
    ) {

        document.body.classList.remove(
            "popup-ouverte"
        );
    }
}

/* =================================
   DEMANDER AJOUT AU PLANNING
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

   /* =========================
   RECETTES LIÉES ?
========================= */

const recettesLiees =
    obtenirRecettesLieesPlanning();


if (
    recettesLiees.length >
        0 &&
    !ajoutPlanningEnAttente?.choixEffectue
) {

    /*
        On mémorise les informations
        choisies dans la première popup.

        Elles serviront après le choix
        Faire maison / Acheter.
    */

    ajoutPlanningEnAttente =
        {
            date:
                date,

            moment:
                momentSelectionnePlanning,

            personnes:
                personnesSelectionneesPlanning,

            choixEffectue:
                false
        };


    try {

        const popupOuverte =
            await ouvrirPopupRecettesLieesDepuisFiche();


        if (
            popupOuverte
        ) {

            return;
        }


    } catch (
        erreur
    ) {

        console.error(
            "Erreur ouverture choix recettes liées :",
            erreur
        );


        ajoutPlanningEnAttente =
            null;


        afficherMessagePlanning(
            erreur?.message ||
            "Impossible d’afficher les préparations liées."
        );


        if (
            popupAjoutPlanning
        ) {

            popupAjoutPlanning.hidden =
                false;
        }


        return;
    }
}

    try {

        const repas =
            await rechercherRepasExistantPlanning(
                date,
                momentSelectionnePlanning
            );


        /*
            Pas de repas existant :
            on crée le repas directement.
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
            Repas existant :
            on ouvre notre popup de confirmation.
        */

        repasExistantPlanning =
            repas;


        const nomsRepas =
            obtenirNomsRepasExistant(
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
            "Erreur vérification planning :",
            erreur
        );


        afficherMessagePlanning(
            erreur?.message ||
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

    if (
        popupAjoutPlanning
    ) {

        popupAjoutPlanning.hidden =
            true;
    }


    const date =
        formaterDatePlanning(
            repas?.date
        );


    const moment =
        repas?.moment ===
            "midi"
            ? "à midi"
            : "le soir";


    const texteRepas =
        Array.isArray(
            nomsRepas
        ) &&
        nomsRepas.length >
            0
            ? nomsRepas.join(
                " + "
            )
            : "un repas";


    if (
        texteConfirmationPlanning
    ) {

        texteConfirmationPlanning.textContent =
            `Il y a déjà ${texteRepas} prévu ${date} ${moment}. Êtes-vous sûr de vouloir ajouter ${recetteChargee?.nom || "cette recette"} ?`;
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

    } else {

        document.body.classList.remove(
            "popup-ouverte"
        );
    }
}

function obtenirRecettesLieesPlanning() {

    if (
        !recetteChargee ||
        !Array.isArray(
            recetteChargee.ingredients
        )
    ) {

        return [];
    }


    const recettesLiees =
        [];


    recetteChargee.ingredients.forEach(
        function (
            ingredient
        ) {

            const recetteLieeId =
                ingredient?.recette_liee_id;


            if (
                !recetteLieeId
            ) {

                return;
            }


            const id =
                String(
                    recetteLieeId
                );


            /*
                Évite :
                - d'ajouter la recette elle-même
                - d'ajouter deux fois la même recette liée
            */

            if (
                id ===
                    String(
                        recetteChargee.id
                    ) ||
                recettesLiees.includes(
                    id
                )
            ) {

                return;
            }


            recettesLiees.push(
                id
            );
        }
    );


    return recettesLiees;
}

/* =================================
   CRÉER REPAS + RECETTE
================================= */

async function creerRepasPlanningAvecRecette(
    date,
    moment,
    personnes
) {

    let nouveauRepas =
        null;


    try {

        const {
            data,
            error
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
                            personnes,

                        created_by:
                            utilisateurConnecte?.id ||
                            null
                    }
                )
                .select(
                    "id"
                )
                .single();


        if (
            error
        ) {

            throw error;
        }


        nouveauRepas =
            data;


        if (
            !nouveauRepas?.id
        ) {

            throw new Error(
                "Le repas n’a pas pu être créé."
            );
        }


        const recettesLiees =
    obtenirRecettesLieesPlanning();


const idsRecettesACharger =
    [
        recetteChargee.id,
        ...recettesLiees
    ];


/* =========================
   RÉCUPÉRER LES NOMS
========================= */

const {
    data:
        recettesPlanning,

    error:
        erreurRecettesPlanning
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
            idsRecettesACharger
        );


if (
    erreurRecettesPlanning
) {

    throw erreurRecettesPlanning;
}


/* =========================
   PRÉPARER LES ÉLÉMENTS
========================= */

const elementsPlanning =
    idsRecettesACharger
        .map(
            function (
                recetteId,
                index
            ) {

                const recette =
                    recettesPlanning
                        ?.find(
                            function (
                                item
                            ) {

                                return String(
                                    item.id
                                ) ===
                                String(
                                    recetteId
                                );
                            }
                        );


                return {
                    repas_planning_id:
                        nouveauRepas.id,

                    recette_id:
                        recetteId,

                    nom:
    recette?.nom ||
    (
        String(
            recetteId
        ) ===
        String(
            recetteChargee.id
        )
            ? recetteChargee.nom
            : "Recette liée"
    ),

mode_approvisionnement:
    String(
        recetteId
    ) ===
    String(
        recetteChargee.id
    )
        ? "faire"
        : (
            choixRecettesLieesPlanning[
                String(
                    recetteId
                )
            ] ||
            "faire"
        ),

ordre:
    index +
    1
                };
            }
        );


/* =========================
   AJOUTER AU PLANNING
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
            elementsPlanning
        );


if (
    erreurElement
) {

    throw erreurElement;
}


        await terminerAjoutPlanning();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur création repas :",
            erreur
        );


        /*
            Si le repas a été créé mais pas
            son élément, on retire le repas
            vide.
        */

        if (
            nouveauRepas?.id
        ) {

            try {

                await window.supabaseClient
                    .from(
                        "repas_planning"
                    )
                    .delete()
                    .eq(
                        "id",
                        nouveauRepas.id
                    );

            } catch (
                erreurNettoyage
            ) {

                console.warn(
                    "Impossible de nettoyer le repas vide :",
                    erreurNettoyage
                );
            }
        }


        afficherMessagePlanning(
            erreur?.message ||
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


        const ordres =
            elements.map(
                function (
                    element
                ) {

                    return Number(
                        element?.ordre
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


        const recettesLiees =
    obtenirRecettesLieesPlanning();


const idsRecettesACharger =
    [
        recetteChargee.id,
        ...recettesLiees
    ];


/* =========================
   ÉVITER LES DOUBLONS
========================= */

const idsDejaPresents =
    new Set(
        elements
            .map(
                function (
                    element
                ) {

                    return String(
                        element?.recette_id ||
                        ""
                    );
                }
            )
            .filter(
                Boolean
            )
    );


const idsAInserer =
    idsRecettesACharger.filter(
        function (
            recetteId
        ) {

            return !idsDejaPresents.has(
                String(
                    recetteId
                )
            );
        }
    );


if (
    idsAInserer.length ===
    0
) {

    await terminerAjoutPlanning();

    return;
}


/* =========================
   RÉCUPÉRER LES NOMS
========================= */

const {
    data:
        recettesPlanning,

    error:
        erreurRecettesPlanning
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
            idsAInserer
        );


if (
    erreurRecettesPlanning
) {

    throw erreurRecettesPlanning;
}


/* =========================
   PRÉPARER LES ÉLÉMENTS
========================= */

const elementsAInserer =
    idsAInserer.map(
        function (
            recetteId,
            index
        ) {

            const recette =
                recettesPlanning
                    ?.find(
                        function (
                            item
                        ) {

                            return String(
                                item.id
                            ) ===
                            String(
                                recetteId
                            );
                        }
                    );


            return {
                repas_planning_id:
                    repasExistantPlanning.id,

                recette_id:
                    recetteId,

                nom:
    recette?.nom ||
    (
        String(
            recetteId
        ) ===
        String(
            recetteChargee.id
        )
            ? recetteChargee.nom
            : "Recette liée"
    ),

mode_approvisionnement:
    String(
        recetteId
    ) ===
    String(
        recetteChargee.id
    )
        ? "faire"
        : (
            choixRecettesLieesPlanning[
                String(
                    recetteId
                )
            ] ||
            "faire"
        ),

ordre:
    ordreSuivant +
    index
            };
        }
    );


/* =========================
   AJOUTER AU REPAS
========================= */

const {
    error
} =
    await window.supabaseClient
        .from(
            "repas_planning_elements"
        )
        .insert(
            elementsAInserer
        );


if (
    error
) {

    throw error;
}


        await terminerAjoutPlanning();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur ajout recette au repas :",
            erreur
        );


        fermerConfirmationPlanning(
            true
        );


        afficherMessagePlanning(
            erreur?.message ||
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
   AJOUT PLANNING TERMINÉ
================================= */

async function terminerAjoutPlanning() {

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


    const bouton =
        document.getElementById(
            "ajouter-recette-planning"
        );


    if (
        !bouton
    ) {

        return;
    }


    const ancienTexte =
        bouton.textContent;


    bouton.textContent =
        "Ajouté au planning";


    bouton.classList.add(
        "ajoute"
    );


    window.setTimeout(
        function () {

            if (
                document.body.contains(
                    bouton
                )
            ) {

                bouton.textContent =
                    ancienTexte;


                bouton.classList.remove(
                    "ajoute"
                );
            }
        },
        2200
    );
}


/* =================================
   ÉVÉNEMENTS POPUP PLANNING
================================= */

if (
    fermerPopupPlanning
) {

    fermerPopupPlanning.addEventListener(
        "click",
        fermerPopupAjoutPlanning
    );
}


if (
    annulerAjoutPlanning
) {

    annulerAjoutPlanning.addEventListener(
        "click",
        fermerPopupAjoutPlanning
    );
}


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


if (
    diminuerPersonnesPlanning
) {

    diminuerPersonnesPlanning.addEventListener(
        "click",
        function () {

            personnesSelectionneesPlanning =
                Math.max(
                    1,
                    personnesSelectionneesPlanning -
                        1
                );


            mettreAJourNombrePersonnesPlanning();
        }
    );
}


if (
    augmenterPersonnesPlanning
) {

    augmenterPersonnesPlanning.addEventListener(
        "click",
        function () {

            personnesSelectionneesPlanning =
                Math.min(
                    50,
                    personnesSelectionneesPlanning +
                        1
                );


            mettreAJourNombrePersonnesPlanning();
        }
    );
}

/* =================================
   POPUP RECETTES LIÉES
================================= */

if (
    boutonAnnulerRecettesLieesPlanning
) {

    boutonAnnulerRecettesLieesPlanning
        .addEventListener(
            "click",
            function () {

                /*
                    On annule le choix en cours
                    et on revient à la popup
                    date / moment / personnes.
                */

                choixRecettesLieesPlanning =
                    {};


                ajoutPlanningEnAttente =
                    null;


                fermerPopupRecettesLieesDepuisFiche(
                    true
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
        );
}


if (
    boutonConfirmerRecettesLieesPlanning
) {

    boutonConfirmerRecettesLieesPlanning
        .addEventListener(
            "click",
            async function () {

                if (
                    !ajoutPlanningEnAttente
                ) {

                    fermerPopupRecettesLieesDepuisFiche(
                        true
                    );

                    return;
                }


                /*
                    On indique à demanderAjoutPlanning()
                    que le choix Faire / Acheter
                    a déjà été fait.

                    Cela empêche la popup
                    de se rouvrir en boucle.
                */

                ajoutPlanningEnAttente
                    .choixEffectue =
                        true;


                /*
                    On remet les valeurs choisies
                    dans l'état planning.
                */

                momentSelectionnePlanning =
                    ajoutPlanningEnAttente
                        .moment;


                personnesSelectionneesPlanning =
                    ajoutPlanningEnAttente
                        .personnes;


                if (
                    dateAjoutPlanning
                ) {

                    dateAjoutPlanning.value =
                        ajoutPlanningEnAttente
                            .date;
                }


                /*
                    On ferme uniquement la popup
                    Faire / Acheter.

                    On ne rouvre pas la première
                    popup puisque l'ajout va
                    continuer automatiquement.
                */

                fermerPopupRecettesLieesDepuisFiche(
                    false
                );


                try {

                    await demanderAjoutPlanning();

                } catch (
                    erreur
                ) {

                    console.error(
                        "Erreur reprise ajout planning :",
                        erreur
                    );


                    ajoutPlanningEnAttente =
                        null;


                    if (
                        popupAjoutPlanning
                    ) {

                        popupAjoutPlanning.hidden =
                            false;


                        document.body.classList.add(
                            "popup-ouverte"
                        );
                    }


                    afficherMessagePlanning(
                        erreur?.message ||
                        "Impossible d’ajouter la recette au planning."
                    );
                }
            }
        );
}

if (
    confirmerAjoutPlanning
) {

    confirmerAjoutPlanning.addEventListener(
        "click",
        demanderAjoutPlanning
    );
}


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


if (
    confirmerAjoutMalgreRepas
) {

    confirmerAjoutMalgreRepas.addEventListener(
        "click",
        ajouterRecetteAuRepasExistant
    );
}


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
   CLIC HORS POPUP
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
   RÉCUPÉRER LES ÉTAPES CUISINE
================================= */

function obtenirEtapesCuisine() {

    if (
        !recetteChargee
    ) {

        return [];
    }


    return normaliserEtapesRecette(
        recetteChargee.etapes
    );
}


/* =================================
   RÉCUPÉRER LES INGRÉDIENTS CUISINE
================================= */

function obtenirIngredientsCuisine() {

    if (
        !recetteChargee
    ) {

        return [];
    }


    return normaliserIngredientsRecette(
        recetteChargee.ingredients
    );
}


/* =================================
   AFFICHER LES INGRÉDIENTS
   MODE CUISINE
================================= */

function afficherIngredientsCuisine() {

    if (
        !contenuIngredientsCuisine
    ) {

        return;
    }


    const ingredients =
        obtenirIngredientsCuisine();


    if (
        ingredients.length ===
        0
    ) {

        contenuIngredientsCuisine.innerHTML =
            `
                <p class="message-cuisine-vide">
                    Aucun ingrédient renseigné.
                </p>
            `;


        return;
    }


    contenuIngredientsCuisine.innerHTML =
        ingredients
            .map(
                function (
                    ingredient,
                    index
                ) {

                    const texte =
                        formaterIngredientAffichage(
                            ingredient,
                            personnesModeCuisine
                        );


                    const recetteLieeId =
    ingredient.recette_liee_id
        ? String(
            ingredient.recette_liee_id
        )
        : null;


let lienRecette =
    "";


if (
    recetteLieeId &&
    recetteLieeId !==
        String(
            identifiantRecette
        )
) {

    lienRecette =
        `
            <button
                type="button"
                class="bouton-recette-liee"
                data-recette-liee-id="${echapperHtml(
                    recetteLieeId
                )}"
            >
                Voir la recette ↗
            </button>
        `;
}

                    return `
                        <div
                            class="ingredient-cuisine"
                            data-index-ingredient="${index}"
                        >

                            <label
                                class="ingredient-cuisine-principal"
                            >

                                <input
                                    type="checkbox"
                                    class="case-ingredient-cuisine"
                                >

                                <span
                                    class="texte-ingredient-cuisine"
                                >
                                    ${
                                        echapperHtml(
                                            texte
                                        )
                                    }
                                </span>

                            </label>

                            ${lienRecette}

                        </div>
                    `;
                }
            )
            .join(
                ""
            );


    /* =========================
       COCHER / DÉCOCHER
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
                            ".ingredient-cuisine"
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

   const boutonsRecettesLiees =
    contenuIngredientsCuisine
        .querySelectorAll(
            ".bouton-recette-liee"
        );


boutonsRecettesLiees.forEach(
    function (
        bouton
    ) {

        bouton.addEventListener(
            "click",
            function () {

                const recetteId =
                    bouton.dataset
                        .recetteLieeId;


                if (
                    !recetteId
                ) {

                    return;
                }


                const url =
                    `recette.html?id=${encodeURIComponent(
                        recetteId
                    )}`;


                window.open(
                    url,
                    "_blank"
                );
            }
        );
    }
);
}


/* =================================
   REPLIER / AFFICHER INGRÉDIENTS
================================= */

function basculerIngredientsCuisine() {

    ingredientsCuisineReplies =
        !ingredientsCuisineReplies;


    if (
        ingredientsModeCuisine
    ) {

        ingredientsModeCuisine
            .classList
            .toggle(
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
   AFFICHER UNE ÉTAPE
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
                "Aucune étape";
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
                "Aucune étape de préparation n’a été renseignée.";
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
        Sécurité si l'index dépasse
        accidentellement le nombre d'étapes.
    */

    indexEtapeCuisine =
        Math.max(
            0,
            Math.min(
                indexEtapeCuisine,
                etapes.length -
                    1
            )
        );


    const numeroVisible =
        indexEtapeCuisine +
        1;


    const etape =
        etapes[
            indexEtapeCuisine
        ];


    /* =========================
       NUMÉRO
    ========================= */

    if (
        numeroEtapeCuisine
    ) {

        numeroEtapeCuisine.textContent =
            `Étape ${numeroVisible}`;
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

        texteEtapeCuisine.innerHTML =
    etape;
    }


    /* =========================
       PROGRESSION
    ========================= */

    if (
        barreProgressionCuisine
    ) {

        const progression =
            (
                numeroVisible /
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


        boutonEtapeCuisineSuivante.disabled =
            false;


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


        boutonMinuteurEtapeCuisine.textContent =
            "Lancer un minuteur";
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
        Sur la dernière étape :
        le bouton devient "Terminer".

        Les minuteurs éventuellement lancés
        continuent de fonctionner.
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

        console.warn(
            "Le mode cuisine ne peut pas être ouvert."
        );


        return;
    }


    indexEtapeCuisine =
        0;


    ingredientsCuisineReplies =
        false;


    /*
        On reprend le nombre de personnes
        actuellement utilisé sur la recette.
    */

    personnesModeCuisine =
        Math.max(
            1,
            Number(
                personnesModeCuisine
            ) ||
            Number(
                recetteChargee.personnes
            ) ||
            1
        );


    /* =========================
       NOM
    ========================= */

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

        ingredientsModeCuisine
            .classList
            .remove(
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
        On revient toujours en haut
        lorsqu'on ouvre le mode cuisine.
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
        IMPORTANT :

        on ne coupe pas les minuteurs.
        Ils continuent à tourner même
        lorsqu'on revient sur la fiche.
    */
}


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
   MINUTEUR DEPUIS UNE ÉTAPE
================================= */

if (
    boutonMinuteurEtapeCuisine
) {

    boutonMinuteurEtapeCuisine.addEventListener(
        "click",
        function () {

            ouvrirPopupMinuteurCuisine(
                indexEtapeCuisine
            );
        }
    );
}


/* =================================
   NOUVEAU MINUTEUR LIBRE
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
   NAVIGATION CLAVIER
   MODE CUISINE
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
            Si la popup minuteur est ouverte,
            on ne change pas d'étape.
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
            cible instanceof
                HTMLInputElement ||
            cible instanceof
                HTMLTextAreaElement ||
            cible instanceof
                HTMLSelectElement
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
   MESSAGE POPUP MINUTEUR
================================= */

function afficherMessageMinuteurCuisine(
    message
) {

    if (
        !messageMinuteurCuisine
    ) {

        return;
    }


    messageMinuteurCuisine.textContent =
        message ||
        "";


    messageMinuteurCuisine.hidden =
        !message;
}


function masquerMessageMinuteurCuisine() {

    if (
        !messageMinuteurCuisine
    ) {

        return;
    }


    messageMinuteurCuisine.textContent =
        "";


    messageMinuteurCuisine.hidden =
        true;
}


/* =================================
   OUVRIR POPUP MINUTEUR
================================= */

function ouvrirPopupMinuteurCuisine(
    indexEtape = null
) {

    if (
        !popupMinuteurCuisine
    ) {

        return;
    }


    indexEtapeMinuteurEnCreation =
        Number.isInteger(
            indexEtape
        )
            ? indexEtape
            : null;


    masquerMessageMinuteurCuisine();


    if (
        nomMinuteurCuisine
    ) {

        if (
            indexEtapeMinuteurEnCreation !==
            null
        ) {

            nomMinuteurCuisine.value =
                `Étape ${
                    indexEtapeMinuteurEnCreation +
                    1
                }`;

        } else {

            nomMinuteurCuisine.value =
                "";
        }
    }


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


    window.setTimeout(
        function () {

            nomMinuteurCuisine?.focus();

        },
        50
    );
}


/* =================================
   FERMER POPUP MINUTEUR
================================= */

function fermerPopupMinuteurCuisineInterface() {

    if (
        popupMinuteurCuisine
    ) {

        popupMinuteurCuisine.hidden =
            true;
    }


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

    if (
        !minutesMinuteurCuisine ||
        !secondesMinuteurCuisine
    ) {

        return;
    }


    const dureeSecondes =
        convertirDureeCuisineEnSecondes(
            minutesMinuteurCuisine.value,
            secondesMinuteurCuisine.value
        );


    if (
        dureeSecondes <=
        0
    ) {

        afficherMessageMinuteurCuisine(
            "Choisissez une durée supérieure à 0 seconde."
        );


        return;
    }


    let nom =
        String(
            nomMinuteurCuisine?.value ||
            ""
        ).trim();


    if (
        !nom
    ) {

        if (
            indexEtapeMinuteurEnCreation !==
            null
        ) {

            nom =
                `Étape ${
                    indexEtapeMinuteurEnCreation +
                    1
                }`;

        } else {

            nom =
                "Minuteur";
        }
    }


    const maintenant =
        Date.now();


    const minuteur =
        {
            id:
                creerIdentifiantLocalCuisine(),

            nom:
                nom,

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
        minuteur
    );


    sauvegarderMinuteursCuisine();


    afficherMinuteursCuisine();


    demarrerBoucleMinuteursCuisine();


    fermerPopupMinuteurCuisineInterface();
}


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

        window.localStorage.setItem(
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

function chargerMinuteursCuisine() {

    const cle =
        obtenirCleStockageMinuteursCuisine();


    if (
        !cle
    ) {

        minuteursCuisine =
            [];


        return;
    }


    try {

        const brut =
            window.localStorage.getItem(
                cle
            );


        if (
            !brut
        ) {

            minuteursCuisine =
                [];


            return;
        }


        const donnees =
            JSON.parse(
                brut
            );


        minuteursCuisine =
            Array.isArray(
                donnees
            )
                ? donnees
                : [];


        mettreAJourMinuteursCuisine();


    } catch (
        erreur
    ) {

        console.warn(
            "Impossible de charger les minuteurs :",
            erreur
        );


        minuteursCuisine =
            [];
    }
}


/* =================================
   METTRE À JOUR LES MINUTEURS
================================= */

function mettreAJourMinuteursCuisine() {

    const maintenant =
        Date.now();


    let modification =
        false;


    minuteursCuisine.forEach(
        function (
            minuteur
        ) {

            if (
                !minuteur ||
                minuteur.termine
            ) {

                return;
            }


            if (
                !minuteur.actif
            ) {

                return;
            }


            const heureFin =
                Number(
                    minuteur.heureFin
                );


            if (
                !Number.isFinite(
                    heureFin
                )
            ) {

                return;
            }


            const secondesRestantes =
                Math.max(
                    0,
                    Math.ceil(
                        (
                            heureFin -
                            maintenant
                        ) /
                        1000
                    )
                );


            if (
                secondesRestantes !==
                minuteur.secondesRestantes
            ) {

                minuteur.secondesRestantes =
                    secondesRestantes;


                modification =
                    true;
            }


            if (
                secondesRestantes <=
                0
            ) {

                minuteur.secondesRestantes =
                    0;


                minuteur.actif =
                    false;


                minuteur.termine =
                    true;


                modification =
                    true;


                notifierFinMinuteurCuisine(
                    minuteur
                );
            }
        }
    );


    if (
        modification
    ) {

        sauvegarderMinuteursCuisine();
    }


    afficherMinuteursCuisine();
}


/* =================================
   NOTIFIER FIN MINUTEUR
================================= */

function notifierFinMinuteurCuisine(
    minuteur
) {

    /*
        Vibration si le navigateur
        et l'appareil la supportent.
    */

    try {

        if (
            navigator.vibrate
        ) {

            navigator.vibrate(
                [
                    200,
                    120,
                    200
                ]
            );
        }

    } catch (
        erreur
    ) {

        /*
            Sans conséquence.
        */
    }


    /*
        Son très léger via Web Audio.
        Si le navigateur bloque l'audio,
        le minuteur reste fonctionnel.
    */

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (
            AudioContext
        ) {

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


            oscillateur.frequency.value =
                880;


            gain.gain.value =
                0.08;


            oscillateur.start();


            oscillateur.stop(
                contexte.currentTime +
                0.25
            );
        }

    } catch (
        erreur
    ) {

        /*
            Sans conséquence.
        */
    }


    console.log(
        "Minuteur terminé :",
        minuteur?.nom
    );
}


/* =================================
   AFFICHER LES MINUTEURS
================================= */

function afficherMinuteursCuisine() {

    if (
        !zoneMinuteursCuisine ||
        !listeMinuteursCuisine
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

                    const temps =
                        formaterTempsCuisine(
                            minuteur.secondesRestantes
                        );


                    const classeEtat =
                        minuteur.termine
                            ? "minuteur-termine"
                            : (
                                minuteur.actif
                                    ? "minuteur-actif"
                                    : "minuteur-pause"
                            );


                    return `
                        <article
                            class="minuteur-cuisine ${classeEtat}"
                            data-id-minuteur="${echapperHtml(
                                minuteur.id
                            )}"
                        >

                            <div class="minuteur-cuisine-info">

                                <span class="minuteur-cuisine-nom">
                                    ${
                                        echapperHtml(
                                            minuteur.nom
                                        )
                                    }
                                </span>

                                <strong class="minuteur-cuisine-temps">
                                    ${
                                        echapperHtml(
                                            temps
                                        )
                                    }
                                </strong>

                            </div>


                            <div class="actions-minuteur-cuisine">

                                ${
                                    !minuteur.termine
                                        ? `
                                            <button
                                                type="button"
                                                class="bouton-pause-minuteur"
                                                data-action-minuteur="pause"
                                            >
                                                ${
                                                    minuteur.actif
                                                        ? "Pause"
                                                        : "Reprendre"
                                                }
                                            </button>
                                        `
                                        : ""
                                }


                                ${
                                    minuteur.termine
                                        ? `
                                            <button
                                                type="button"
                                                class="bouton-relancer-minuteur"
                                                data-action-minuteur="relancer"
                                            >
                                                Relancer
                                            </button>
                                        `
                                        : ""
                                }


                                <button
                                    type="button"
                                    class="bouton-supprimer-minuteur"
                                    data-action-minuteur="supprimer"
                                >
                                    ×
                                </button>

                            </div>

                        </article>
                    `;
                }
            )
            .join(
                ""
            );
}


/* =================================
   TROUVER UN MINUTEUR
================================= */

function trouverMinuteurCuisine(
    identifiant
) {

    return minuteursCuisine.find(
        function (
            minuteur
        ) {

            return String(
                minuteur.id
            ) ===
            String(
                identifiant
            );
        }
    ) ||
    null;
}


/* =================================
   PAUSE / REPRISE
================================= */

function basculerPauseMinuteurCuisine(
    minuteur
) {

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
            On actualise une dernière fois
            le temps avant de mettre en pause.
        */

        const secondes =
            Math.max(
                0,
                Math.ceil(
                    (
                        Number(
                            minuteur.heureFin
                        ) -
                        Date.now()
                    ) /
                    1000
                )
            );


        minuteur.secondesRestantes =
            secondes;


        minuteur.actif =
            false;


        minuteur.heureFin =
            null;


    } else {

        if (
            minuteur.secondesRestantes <=
            0
        ) {

            return;
        }


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
   RELANCER MINUTEUR
================================= */

function relancerMinuteurCuisine(
    minuteur
) {

    if (
        !minuteur
    ) {

        return;
    }


    const duree =
        Math.max(
            1,
            Number(
                minuteur.dureeInitiale
            ) || 1
        );


    minuteur.secondesRestantes =
        duree;


    minuteur.termine =
        false;


    minuteur.actif =
        true;


    minuteur.heureFin =
        Date.now() +
        duree *
        1000;


    sauvegarderMinuteursCuisine();


    afficherMinuteursCuisine();


    demarrerBoucleMinuteursCuisine();
}


/* =================================
   SUPPRIMER UN MINUTEUR
================================= */

function supprimerMinuteurCuisine(
    identifiant
) {

    minuteursCuisine =
        minuteursCuisine.filter(
            function (
                minuteur
            ) {

                return String(
                    minuteur.id
                ) !==
                String(
                    identifiant
                );
            }
        );


    sauvegarderMinuteursCuisine();


    afficherMinuteursCuisine();
}


/* =================================
   CLIC SUR LES MINUTEURS
================================= */

if (
    listeMinuteursCuisine
) {

    listeMinuteursCuisine.addEventListener(
        "click",
        function (
            evenement
        ) {

            const bouton =
                evenement.target.closest(
                    "[data-action-minuteur]"
                );


            if (
                !bouton
            ) {

                return;
            }


            const carte =
                bouton.closest(
                    "[data-id-minuteur]"
                );


            if (
                !carte
            ) {

                return;
            }


            const identifiant =
                carte.dataset.idMinuteur;


            const minuteur =
                trouverMinuteurCuisine(
                    identifiant
                );


            const action =
                bouton.dataset.actionMinuteur;


            if (
                action ===
                "pause"
            ) {

                basculerPauseMinuteurCuisine(
                    minuteur
                );


                return;
            }


            if (
                action ===
                "relancer"
            ) {

                relancerMinuteurCuisine(
                    minuteur
                );


                return;
            }


            if (
                action ===
                "supprimer"
            ) {

                supprimerMinuteurCuisine(
                    identifiant
                );
            }
        }
    );
}


/* =================================
   BOUCLE DES MINUTEURS
================================= */

function demarrerBoucleMinuteursCuisine() {

    const auMoinsUnActif =
        minuteursCuisine.some(
            function (
                minuteur
            ) {

                return Boolean(
                    minuteur &&
                    minuteur.actif &&
                    !minuteur.termine
                );
            }
        );


    if (
        !auMoinsUnActif
    ) {

        if (
            intervalMinuteursCuisine
        ) {

            window.clearInterval(
                intervalMinuteursCuisine
            );


            intervalMinuteursCuisine =
                null;
        }


        return;
    }


    if (
        intervalMinuteursCuisine
    ) {

        return;
    }


    intervalMinuteursCuisine =
        window.setInterval(
            function () {

                mettreAJourMinuteursCuisine();


                const encoreActif =
                    minuteursCuisine.some(
                        function (
                            minuteur
                        ) {

                            return Boolean(
                                minuteur &&
                                minuteur.actif &&
                                !minuteur.termine
                            );
                        }
                    );


                if (
                    !encoreActif &&
                    intervalMinuteursCuisine
                ) {

                    window.clearInterval(
                        intervalMinuteursCuisine
                    );


                    intervalMinuteursCuisine =
                        null;
                }
            },
            1000
        );
}


/* =================================
   DURÉES RAPIDES
================================= */

document
    .querySelectorAll(
        "[data-duree-minuteur]"
    )
    .forEach(
        function (
            bouton
        ) {

            bouton.addEventListener(
                "click",
                function () {

                    const duree =
                        Number(
                            bouton.dataset
                                .dureeMinuteur
                        );


                    if (
                        !Number.isFinite(
                            duree
                        )
                    ) {

                        return;
                    }


                    if (
                        minutesMinuteurCuisine
                    ) {

                        minutesMinuteurCuisine.value =
                            String(
                                duree
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
        }
    );


/* =================================
   BOUTON LANCER
================================= */

if (
    lancerMinuteurCuisine
) {

    lancerMinuteurCuisine.addEventListener(
        "click",
        creerMinuteurCuisine
    );
}


/* =================================
   FERMER POPUP MINUTEUR
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
   ENTRÉE POUR LANCER
================================= */

if (
    nomMinuteurCuisine
) {

    nomMinuteurCuisine.addEventListener(
        "keydown",
        function (
            evenement
        ) {

            if (
                evenement.key ===
                "Enter"
            ) {

                evenement.preventDefault();


                creerMinuteurCuisine();
            }
        }
    );
}

/* =================================
   CORRECTION FINALE FOYER
   Compatible avec la structure
   Supabase existante du projet
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
   CORRECTION CHARGEMENT PHOTOS
   Bucket privé = URL signée
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
            "Impossible de charger la photo :",
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
   CHARGER LES PHOTOS
================================= */

async function chargerPhotosRecette(
    recetteId =
        recetteChargee?.id ||
        identifiantRecette
) {

    photosRecette =
        [];


    indexPhotoActive =
        0;


    if (
        !recetteId
    ) {

        afficherGalerieRecette();


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

        afficherGalerieRecette();


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


    afficherGalerieRecette();
}


/* =================================
   CORRECTION CAROUSEL
   Compatible avec le CSS .active
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


    carouselImagesRecette.style.transform =
        "";


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
                                alt="Photo ${index + 1} de ${echapperHtml(
                                    recetteChargee?.nom ||
                                    "la recette"
                                )}"
                                loading="${
                                    index ===
                                    0
                                        ? "eager"
                                        : "lazy"
                                }"
                                draggable="false"
                            >

                        </div>
                    `;
                }
            )
            .join(
                ""
            );


    /* =========================
       UNE SEULE PHOTO
    ========================= */

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


    /* =========================
       PLUSIEURS PHOTOS
    ========================= */

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
            .join(
                ""
            );
}


/* =================================
   AFFICHER UNE PHOTO
================================= */

function afficherPhotoRecette(
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


    /* =========================
       SLIDES
    ========================= */

    const slides =
        carouselImagesRecette
            ?.querySelectorAll(
                ".slide-recette"
            ) ||
        [];


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


    /* =========================
       POINTS
    ========================= */

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
                    indicateur.dataset
                        .indexPhoto
                );


            if (
                !Number.isInteger(
                    index
                )
            ) {

                return;
            }


            afficherPhotoRecette(
                index
            );
        }
    );
}


/* =================================
   POPUP CONFIRMATION SUPPRESSION
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


            fond.innerHTML =
                `
                    <div
                        class="popup-suppression"
                        role="dialog"
                        aria-modal="true"
                    >

                        <div class="icone-suppression">
                            🗑️
                        </div>

                        <h2>
                            Supprimer cette recette ?
                        </h2>

                        <p>
                            Cette action est définitive.
                            La recette et ses photos seront supprimées.
                        </p>

                        <div class="actions-popup">

                            <button
                                type="button"
                                class="bouton-annuler-suppression"
                                data-action="annuler"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                class="bouton-confirmer-suppression"
                                data-action="confirmer"
                            >
                                Supprimer
                            </button>

                        </div>

                    </div>
                `;


            document.body.appendChild(
                fond
            );


            function fermer(
                resultat
            ) {

                fond.remove();


                resolve(
                    resultat
                );
            }


            fond.addEventListener(
                "click",
                function (
                    evenement
                ) {

                    const action =
                        evenement.target
                            .closest(
                                "[data-action]"
                            )
                            ?.dataset
                            ?.action;


                    if (
                        action ===
                        "annuler"
                    ) {

                        fermer(
                            false
                        );


                        return;
                    }


                    if (
                        action ===
                        "confirmer"
                    ) {

                        fermer(
                            true
                        );


                        return;
                    }


                    if (
                        evenement.target ===
                        fond
                    ) {

                        fermer(
                            false
                        );
                    }
                }
            );
        }
    );
}


/* =================================
   SUPPRIMER LES PHOTOS STORAGE
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

        return;
    }


    const confirmation =
        await demanderConfirmationSuppression();


    if (
        !confirmation
    ) {

        return;
    }


    const bouton =
        document.getElementById(
            "supprimer-recette"
        );


    if (
        bouton
    ) {

        bouton.disabled =
            true;


        bouton.textContent =
            "Suppression…";
    }


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
            "Erreur suppression recette :",
            erreur
        );


        if (
            bouton
        ) {

            bouton.disabled =
                false;


            bouton.textContent =
                "Supprimer la recette";
        }
    }
}


/* =================================
   RÉTABLIR MODIFIER / SUPPRIMER
   POUR LE PROPRIÉTAIRE
================================= */

function ajouterActionsProprietaireRecette() {

    if (
        !recetteChargee ||
        !utilisateurConnecte ||
        recetteChargee.created_by !==
            utilisateurConnecte.id
    ) {

        return;
    }


    const zoneActions =
        document.querySelector(
            ".actions-gestion-recette"
        );


    if (
        !zoneActions
    ) {

        return;
    }


    /*
        Ne pas créer les boutons deux fois.
    */

    if (
        !document.getElementById(
            "modifier-recette"
        )
    ) {

        const lienModifier =
            document.createElement(
                "a"
            );


        lienModifier.id =
            "modifier-recette";


        lienModifier.href =
            `ajouter.html?id=${encodeURIComponent(
                recetteChargee.id
            )}`;


        lienModifier.className =
            "bouton-modifier";


        lienModifier.textContent =
            "Modifier la recette";


        zoneActions.appendChild(
            lienModifier
        );
    }


    if (
        !document.getElementById(
            "supprimer-recette"
        )
    ) {

        const boutonSupprimer =
            document.createElement(
                "button"
            );


        boutonSupprimer.type =
            "button";


        boutonSupprimer.id =
            "supprimer-recette";


        boutonSupprimer.className =
            "bouton-supprimer";


        boutonSupprimer.textContent =
            "Supprimer la recette";


        boutonSupprimer.addEventListener(
            "click",
            supprimerRecette
        );


        zoneActions.appendChild(
            boutonSupprimer
        );
    }
}


/* =================================
   NETTOYER LA BOUCLE MINUTEURS
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

        sauvegarderMinuteursCuisine();


        nettoyerBoucleMinuteursCuisine();


        positionTouchDebut =
            null;


        positionTouchFin =
            null;


        pointerCarouselActif =
            false;
    }
);


/* =================================
   RETOUR SUR L'ONGLET
================================= */

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
   TOUCHE ÉCHAP
   POPUPS PLANNING / MINUTEUR
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
            popupMinuteurCuisine &&
            !popupMinuteurCuisine.hidden
        ) {

            evenement.preventDefault();


            fermerPopupMinuteurCuisineInterface();


            return;
        }


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


        if (
            popupAjoutPlanning &&
            !popupAjoutPlanning.hidden
        ) {

            evenement.preventDefault();


            fermerPopupAjoutPlanning();
        }
    }
);


/* =================================
   VÉRIFIER LES ÉLÉMENTS HTML
================================= */

function verifierElementsRecette() {

    const elementsObligatoires =
        [
            [
                contenuRecette,
                "fiche-recette-contenu"
            ],

            [
                galerieRecette,
                "galerie-recette"
            ],

            [
                carouselRecette,
                "carousel-recette"
            ],

            [
                carouselImagesRecette,
                "carousel-images-recette"
            ],

            [
                popupAjoutPlanning,
                "popup-ajout-planning"
            ],

            [
                modeCuisine,
                "mode-cuisine"
            ]
        ];


    const manquants =
        elementsObligatoires
            .filter(
                function (
                    element
                ) {

                    return !element[0];
                }
            )
            .map(
                function (
                    element
                ) {

                    return element[1];
                }
            );


    if (
        manquants.length >
        0
    ) {

        console.error(
            "Éléments HTML manquants :",
            manquants
        );


        return false;
    }


    return true;
}


/* =================================
   INITIALISATION
================================= */

async function initialiserPageRecette() {

    if (
        !verifierElementsRecette()
    ) {

        return;
    }


    /* =========================
       INTERFACES FERMÉES
    ========================= */

    preparerPopupPlanning();


    preparerModeCuisine();


    /* =========================
       CHARGEMENT
    ========================= */

    contenuRecette.innerHTML =
        `
            <div class="message">
                Chargement de la recette…
            </div>
        `;


    galerieRecette.hidden =
        true;


    try {

        await chargerRecette();


        /*
            afficherRecette() vient
            d'injecter la fiche.

            On peut donc maintenant ajouter
            les actions réservées au créateur.
        */

        ajouterActionsProprietaireRecette();


        personnesSelectionneesPlanning =
            Math.max(
                1,
                personnesParDefautPlanning
            );


        mettreAJourNombrePersonnesPlanning();


        /* =========================
           MINUTEURS
        ========================= */

        mettreAJourMinuteursCuisine();


        afficherMinuteursCuisine();


        demarrerBoucleMinuteursCuisine();


        console.log(
            "Recette initialisée :",
            {
                recette:
                    recetteChargee?.id,

                photos:
                    photosRecette.length,

                foyer:
                    foyerIdPlanning,

                personnes:
                    personnesParDefautPlanning,

                etapes:
                    obtenirEtapesCuisine()
                        .length,

                minuteurs:
                    minuteursCuisine.length
            }
        );


    } catch (
        erreur
    ) {

        console.error(
            "Erreur initialisation recette :",
            erreur
        );


        contenuRecette.innerHTML =
            `
                <div class="message erreur">

                    <h1>
                        Impossible de charger la recette
                    </h1>

                    <p>
                        ${
                            echapperHtml(
                                erreur?.message ||
                                "Une erreur est survenue."
                            )
                        }
                    </p>

                    <a href="index.html">
                        Retour aux recettes
                    </a>

                </div>
            `;
    }
}


/* =================================
   DÉMARRAGE
================================= */

initialiserPageRecette();
