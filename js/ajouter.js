/* =================================
   ÉLÉMENTS PRINCIPAUX
================================= */

const formulaire =
    document.getElementById(
        "formulaire-recette"
    );


const conteneurIngredients =
    document.getElementById(
        "liste-champs-ingredients"
    );


const boutonAjouterIngredient =
    document.getElementById(
        "ajouter-ingredient"
    );


const boutonEnregistrer =
    document.getElementById(
        "enregistrer-recette"
    );


const messageFormulaire =
    document.getElementById(
        "message-formulaire"
    );


/* =================================
   ÉLÉMENTS PHOTOS
================================= */

const inputPhotosRecette =
    document.getElementById(
        "input-photos-recette"
    );


const boutonAjouterPhotos =
    document.getElementById(
        "bouton-ajouter-photos"
    );


const apercuPhotosRecette =
    document.getElementById(
        "apercu-photos-recette"
    );


const compteurPhotosRecette =
    document.getElementById(
        "compteur-photos-recette"
    );


const messagePhotosRecette =
    document.getElementById(
        "message-photos-recette"
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


const modeModification =
    Boolean(
        identifiantRecette
    );


/* =================================
   UTILISATEUR / FOYER
================================= */

let utilisateurConnecte =
    null;


let foyerId =
    null;


/* =================================
   RECETTES DISPONIBLES
================================= */

/*
    Elles servent dans les lignes
    de type "Recette".

    Exemple :

    100 ml | Recette | Béchamel
*/

let recettesDisponiblesPourLiaison =
    [];


/* =================================
   ÉTAT DES PHOTOS
================================= */

const NOMBRE_MAX_PHOTOS =
    5;


let nouvellesPhotos =
    [];


let photosExistantes =
    [];


let photosASupprimer =
    [];


let ordrePhotos =
    [];


let ordrePhotosModifie =
    false;


let photoEnCoursDeDrag =
    null;


let photoTactileEnCours =
    null;


let elementTactileEnCours =
    null;


/* =================================
   OUTILS POUR L'ORDRE DES PHOTOS
================================= */

function creerClePhoto(
    type,
    id
) {

    return (
        `${type}:` +
        `${String(id)}`
    );
}


/* =================================
   TROUVER UNE PHOTO DANS L'ORDRE
================================= */

function trouverIndexPhotoOrdre(
    type,
    id
) {

    const cle =
        creerClePhoto(
            type,
            id
        );


    return ordrePhotos.findIndex(
        function (
            element
        ) {

            return (
                creerClePhoto(
                    element.type,
                    element.id
                ) ===
                cle
            );
        }
    );
}


/* =================================
   AJOUTER UNE PHOTO À L'ORDRE
================================= */

function ajouterPhotoDansOrdre(
    type,
    id
) {

    if (
        !type ||
        id === null ||
        id === undefined
    ) {

        return;
    }


    const dejaPresente =
        trouverIndexPhotoOrdre(
            type,
            id
        ) !== -1;


    if (
        dejaPresente
    ) {

        return;
    }


    ordrePhotos.push(
        {

            type:
                type,

            id:
                id

        }
    );
}


/* =================================
   RETIRER UNE PHOTO DE L'ORDRE
================================= */

function retirerPhotoDeOrdre(
    type,
    id
) {

    const cle =
        creerClePhoto(
            type,
            id
        );


    ordrePhotos =
        ordrePhotos.filter(
            function (
                element
            ) {

                return (
                    creerClePhoto(
                        element.type,
                        element.id
                    ) !==
                    cle
                );
            }
        );


    ordrePhotosModifie =
        true;
}


/* =================================
   NETTOYER L'ORDRE
================================= */

function nettoyerOrdrePhotos() {

    const clesValides =
        new Set();


    photosExistantes.forEach(
        function (
            photo
        ) {

            clesValides.add(
                creerClePhoto(
                    "existante",
                    photo.id
                )
            );
        }
    );


    nouvellesPhotos.forEach(
        function (
            photo
        ) {

            clesValides.add(
                creerClePhoto(
                    "nouvelle",
                    photo.idLocal
                )
            );
        }
    );


    ordrePhotos =
        ordrePhotos.filter(
            function (
                element
            ) {

                return clesValides.has(
                    creerClePhoto(
                        element.type,
                        element.id
                    )
                );
            }
        );


    photosExistantes.forEach(
        function (
            photo
        ) {

            ajouterPhotoDansOrdre(
                "existante",
                photo.id
            );
        }
    );


    nouvellesPhotos.forEach(
        function (
            photo
        ) {

            ajouterPhotoDansOrdre(
                "nouvelle",
                photo.idLocal
            );
        }
    );
}


/* =================================
   RÉCUPÉRER UNE PHOTO PAR RÉFÉRENCE
================================= */

function obtenirPhotoDepuisOrdre(
    reference
) {

    if (
        !reference
    ) {

        return null;
    }


    if (
        reference.type ===
        "existante"
    ) {

        const photo =
            photosExistantes.find(
                function (
                    element
                ) {

                    return (
                        String(
                            element.id
                        ) ===
                        String(
                            reference.id
                        )
                    );
                }
            );


        if (
            !photo
        ) {

            return null;
        }


        return {

            type:
                "existante",

            id:
                photo.id,

            url:
                photo.url,

            nom:
                "Photo de la recette",

            photo:
                photo
        };
    }


    if (
        reference.type ===
        "nouvelle"
    ) {

        const photo =
            nouvellesPhotos.find(
                function (
                    element
                ) {

                    return (
                        String(
                            element.idLocal
                        ) ===
                        String(
                            reference.id
                        )
                    );
                }
            );


        if (
            !photo
        ) {

            return null;
        }


        return {

            type:
                "nouvelle",

            id:
                photo.idLocal,

            url:
                photo.urlApercu,

            nom:
                photo.fichier?.name ||
                "Nouvelle photo",

            photo:
                photo
        };
    }


    return null;
}


/* =================================
   LISTE DES PHOTOS DANS LE BON ORDRE
================================= */

function obtenirPhotosDansOrdre() {

    nettoyerOrdrePhotos();


    return ordrePhotos
        .map(
            function (
                reference
            ) {

                return obtenirPhotoDepuisOrdre(
                    reference
                );
            }
        )
        .filter(
            Boolean
        );
}


/* =================================
   DÉPLACER UNE PHOTO
================================= */

function deplacerPhoto(
    indexDepart,
    indexArrivee
) {

    if (
        indexDepart ===
        indexArrivee
    ) {

        return;
    }


    if (
        indexDepart < 0 ||
        indexArrivee < 0 ||
        indexDepart >=
            ordrePhotos.length ||
        indexArrivee >=
            ordrePhotos.length
    ) {

        return;
    }


    const [
        photoDeplacee
    ] =
        ordrePhotos.splice(
            indexDepart,
            1
        );


    ordrePhotos.splice(
        indexArrivee,
        0,
        photoDeplacee
    );


    ordrePhotosModifie =
        true;


    afficherApercuPhotos();
}


/* =================================
   DÉPLACER PHOTO GAUCHE / DROITE
================================= */

function deplacerPhotoDirection(
    type,
    id,
    direction
) {

    const index =
        trouverIndexPhotoOrdre(
            type,
            id
        );


    if (
        index === -1
    ) {

        return;
    }


    const nouvelIndex =
        direction ===
        "gauche"
            ? index - 1
            : index + 1;


    if (
        nouvelIndex < 0 ||
        nouvelIndex >=
            ordrePhotos.length
    ) {

        return;
    }


    deplacerPhoto(
        index,
        nouvelIndex
    );
}


/* =================================
   UTILISATEUR CONNECTÉ
================================= */

async function recupererUtilisateurConnecte() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .auth
            .getUser();


    if (
        error
    ) {

        throw error;
    }


    if (
        !data.user
    ) {

        window.location.href =
            "compte.html";


        return null;
    }


    return data.user;
}


/* =================================
   FOYER DE L'UTILISATEUR
================================= */

async function recupererFoyerUtilisateur() {

    if (
        !utilisateurConnecte
    ) {

        return null;
    }


    const {
        data,
        error
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
        !data
    ) {

        window.location.href =
            "foyer.html";


        return null;
    }


    foyerId =
        data.foyer_id;


    return foyerId;
}


/* =================================
   CHARGER LES RECETTES DISPONIBLES
================================= */

async function chargerRecettesDisponiblesPourLiaison() {

    recettesDisponiblesPourLiaison =
        [];


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "recettes"
            )
            .select(
                "id, nom, categorie, categorie_affichee, visibilite, foyer_id"
            )
            .order(
                "nom",
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


    const recettes =
        Array.isArray(
            data
        )
            ? data
            : [];


    /*
        On empêche une recette
        de s'utiliser elle-même.
    */

    recettesDisponiblesPourLiaison =
        recettes.filter(
            function (
                recette
            ) {

                if (
                    modeModification &&
                    identifiantRecette &&
                    String(
                        recette.id
                    ) ===
                    String(
                        identifiantRecette
                    )
                ) {

                    return false;
                }


                return true;
            }
        );
}


/* =================================
   ÉCHAPPER TEXTE HTML
================================= */

function echapperHtmlAjout(
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
   TROUVER UNE RECETTE
================================= */

function trouverRecetteDisponible(
    recetteId
) {

    if (
        !recetteId
    ) {

        return null;
    }


    return (
        recettesDisponiblesPourLiaison.find(
            function (
                recette
            ) {

                return (
                    String(
                        recette.id
                    ) ===
                    String(
                        recetteId
                    )
                );
            }
        ) ||
        null
    );
}


/* =================================
   OPTIONS DES RECETTES
================================= */

function creerOptionsRecettes(
    recetteSelectionneeId = ""
) {

    const valeurSelectionnee =
        String(
            recetteSelectionneeId ||
            ""
        );


    let html = `

        <option value="">
            Choisir une recette
        </option>

    `;


    recettesDisponiblesPourLiaison.forEach(
        function (
            recette
        ) {

            const id =
                String(
                    recette.id
                );


            const selectionnee =
                id ===
                valeurSelectionnee;


            const categorie =
                recette.categorie_affichee ||
                recette.categorie ||
                "";


            const suffixeCategorie =
                categorie
                    ? ` — ${categorie}`
                    : "";


            html += `

                <option
                    value="${echapperHtmlAjout(
                        id
                    )}"
                    ${
                        selectionnee
                            ? "selected"
                            : ""
                    }
                >
                    ${echapperHtmlAjout(
                        recette.nom
                    )}${echapperHtmlAjout(
                        suffixeCategorie
                    )}
                </option>

            `;
        }
    );


    return html;
}


/* =================================
   TYPE D'UNE LIGNE
================================= */

function obtenirTypeIngredientDepuisValeurs(
    valeurs = {}
) {

    /*
        Compatibilité avec les recettes
        déjà enregistrées :

        recette_liee_id présent
        = ligne de type recette.
    */

    if (
        valeurs.recette_liee_id
    ) {

        return "recette";
    }


    return "ingredient";
}


/* =================================
   METTRE À JOUR LE TYPE
   D'UNE LIGNE
================================= */

function mettreAJourTypeLigneIngredient(
    ligne
) {

    if (
        !ligne
    ) {

        return;
    }


    const selectType =
        ligne.querySelector(
            ".ingredient-type"
        );


    const champNom =
        ligne.querySelector(
            ".ingredient-nom"
        );


    const selectRecette =
        ligne.querySelector(
            ".ingredient-recette"
        );


    if (
        !selectType ||
        !champNom ||
        !selectRecette
    ) {

        return;
    }


    const type =
        selectType.value ===
        "recette"
            ? "recette"
            : "ingredient";


    if (
        type ===
        "recette"
    ) {

        champNom.hidden =
            true;


        champNom.disabled =
            true;


        selectRecette.hidden =
            false;


        selectRecette.disabled =
            false;


        ligne.classList.add(
            "ligne-type-recette"
        );


        ligne.classList.remove(
            "ligne-type-ingredient"
        );

    } else {

        champNom.hidden =
            false;


        champNom.disabled =
            false;


        selectRecette.hidden =
            true;


        selectRecette.disabled =
            true;


        ligne.classList.add(
            "ligne-type-ingredient"
        );


        ligne.classList.remove(
            "ligne-type-recette"
        );
    }
}


/* =================================
   CRÉER UNE LIGNE
================================= */

function creerLigneIngredient(
    valeurs = {}
) {

    const ligne =
        document.createElement(
            "div"
        );


    ligne.className =
        "ligne-ingredient";


    const typeInitial =
        obtenirTypeIngredientDepuisValeurs(
            valeurs
        );


    ligne.innerHTML = `

        <input
            type="text"
            inputmode="decimal"
            class="ingredient-quantite"
            aria-label="Quantité"
            placeholder="Ex. 400"
            value="${echapperHtmlAjout(
                valeurs.quantite ??
                ""
            )}"
        >


        <input
            type="text"
            class="ingredient-unite"
            aria-label="Unité"
            placeholder="g, ml…"
            value="${echapperHtmlAjout(
                valeurs.unite ??
                ""
            )}"
        >


        <select
            class="ingredient-type"
            aria-label="Type de composant"
        >

            <option
                value="ingredient"
                ${
                    typeInitial ===
                    "ingredient"
                        ? "selected"
                        : ""
                }
            >
                Ingrédient
            </option>

            <option
                value="recette"
                ${
                    typeInitial ===
                    "recette"
                        ? "selected"
                        : ""
                }
            >
                Recette
            </option>

        </select>


        <div class="ingredient-valeur-zone">

            <input
                type="text"
                class="ingredient-nom"
                aria-label="Nom de l’ingrédient"
                placeholder="Ex. farine"
                value="${echapperHtmlAjout(
                    valeurs.nom ??
                    ""
                )}"
            >


            <select
                class="ingredient-recette"
                aria-label="Choisir une recette"
            >

                ${creerOptionsRecettes(
                    valeurs.recette_liee_id ||
                    ""
                )}

            </select>

        </div>


        <label class="option-proportionnelle">

            <input
                type="checkbox"
                class="ingredient-proportionnel"
                ${
                    valeurs.proportionnel ===
                    false
                        ? ""
                        : "checked"
                }
            >

            Proportionnel

        </label>


        <button
            type="button"
            class="supprimer-ingredient"
            aria-label="Supprimer cette ligne"
            title="Supprimer cette ligne"
        >
            ×
        </button>

    `;


    /* =========================
       TYPE
    ========================= */

    const selectType =
        ligne.querySelector(
            ".ingredient-type"
        );


    selectType.addEventListener(
        "change",
        function () {

            mettreAJourTypeLigneIngredient(
                ligne
            );
        }
    );


    /* =========================
       RECETTE SÉLECTIONNÉE
    ========================= */

    const selectRecette =
        ligne.querySelector(
            ".ingredient-recette"
        );


    selectRecette.addEventListener(
        "change",
        function () {

            /*
                Le nom réel sera récupéré
                au moment de l'enregistrement.

                On ne remplit pas le champ
                texte caché pour éviter
                toute ambiguïté.
            */
        }
    );


    /* =========================
       SUPPRESSION
    ========================= */

    const boutonSupprimer =
        ligne.querySelector(
            ".supprimer-ingredient"
        );


    boutonSupprimer.addEventListener(
        "click",
        function () {

            const lignes =
                conteneurIngredients
                    .querySelectorAll(
                        ".ligne-ingredient"
                    );


            if (
                lignes.length ===
                1
            ) {

                ligne
                    .querySelector(
                        ".ingredient-quantite"
                    )
                    .value =
                        "";


                ligne
                    .querySelector(
                        ".ingredient-unite"
                    )
                    .value =
                        "";


                ligne
                    .querySelector(
                        ".ingredient-nom"
                    )
                    .value =
                        "";


                ligne
                    .querySelector(
                        ".ingredient-type"
                    )
                    .value =
                        "ingredient";


                ligne
                    .querySelector(
                        ".ingredient-recette"
                    )
                    .value =
                        "";


                ligne
                    .querySelector(
                        ".ingredient-proportionnel"
                    )
                    .checked =
                        true;


                mettreAJourTypeLigneIngredient(
                    ligne
                );


                return;
            }


            ligne.remove();
        }
    );


    conteneurIngredients
        .appendChild(
            ligne
        );


    /* =========================
       AFFICHAGE INITIAL
    ========================= */

    mettreAJourTypeLigneIngredient(
        ligne
    );
}


/* =================================
   RAFRAÎCHIR LES LISTES RECETTES
================================= */

function rafraichirSelectsRecettesLiees() {

    const selects =
        conteneurIngredients
            .querySelectorAll(
                ".ingredient-recette"
            );


    selects.forEach(
        function (
            select
        ) {

            const valeurActuelle =
                select.value;


            select.innerHTML =
                creerOptionsRecettes(
                    valeurActuelle
                );
        }
    );
}

/* =================================
   ÉDITEUR DE TEXTE — ÉTAPES
================================= */

const editeurEtapes =
    document.getElementById(
        "editeur-etapes"
    );


const champEtapes =
    document.getElementById(
        "etapes"
    );

let selectionEtapesSauvegardee =
    null;


/* =================================
   MÉMORISER LA SÉLECTION
================================= */

function sauvegarderSelectionEtapes() {

    const selection =
        window.getSelection();


    if (
        !selection ||
        selection.rangeCount === 0
    ) {

        return;
    }


    const range =
        selection.getRangeAt(
            0
        );


    if (
        editeurEtapes &&
        editeurEtapes.contains(
            range.commonAncestorContainer
        )
    ) {

        selectionEtapesSauvegardee =
            range.cloneRange();
    }
}


/* =================================
   RESTAURER LA SÉLECTION
================================= */

function restaurerSelectionEtapes() {

    if (
        !selectionEtapesSauvegardee
    ) {

        return;
    }


    const selection =
        window.getSelection();


    selection.removeAllRanges();

    selection.addRange(
        selectionEtapesSauvegardee
    );
}




/* =================================
   EXÉCUTER UNE COMMANDE
================================= */

function executerCommandeEditeur(
    commande,
    valeur = null
) {

    if (
        !editeurEtapes
    ) {

        return;
    }


    editeurEtapes.focus();


    document.execCommand(
        commande,
        false,
        valeur
    );
}


/* =================================
   BOUTONS DE LA BARRE D'OUTILS
================================= */

document
    .querySelectorAll(
        ".outil-editeur[data-commande]"
    )
    .forEach(
        function (
            bouton
        ) {

            /*
                On évite que le clic
                fasse perdre la sélection
                de texte.
            */

            bouton.addEventListener(
                "mousedown",
                function (
                    evenement
                ) {

                    evenement.preventDefault();
                }
            );


            bouton.addEventListener(
                "click",
                function () {

                    const commande =
                        bouton.dataset.commande;


                    executerCommandeEditeur(
                        commande
                    );
                }
            );
        }
    );


/* =================================
   TAILLE DU TEXTE
================================= */

const selectTailleTexte =
    document.getElementById(
        "taille-texte-etapes"
    );


function appliquerTailleTexte(
    taille
) {

    if (
        !selectionEtapesSauvegardee ||
        !editeurEtapes
    ) {

        return;
    }


    const range =
        selectionEtapesSauvegardee
            .cloneRange();


    /*
        Rien n'est sélectionné.
    */

    if (
        range.collapsed
    ) {

        return;
    }


    /*
        On vérifie que la sélection
        appartient bien à l'éditeur.
    */

    if (
        !editeurEtapes.contains(
            range.commonAncestorContainer
        )
    ) {

        return;
    }


    /*
        On récupère le contenu
        actuellement sélectionné.
    */

    const contenu =
        range.extractContents();


    /*
        On l'entoure d'un span
        avec la taille choisie.
    */

    const span =
        document.createElement(
            "span"
        );


    span.style.fontSize =
        taille;


    span.appendChild(
        contenu
    );


    range.insertNode(
        span
    );


    /*
        On remet la sélection
        autour du texte modifié.
    */

    const nouvelleSelection =
        document.createRange();


    nouvelleSelection.selectNodeContents(
        span
    );


    const selection =
        window.getSelection();


    selection.removeAllRanges();

    selection.addRange(
        nouvelleSelection
    );


    /*
        On mémorise cette nouvelle
        sélection.
    */

    selectionEtapesSauvegardee =
        nouvelleSelection.cloneRange();


    synchroniserEditeurEtapes();
}


if (
    selectTailleTexte
) {

    selectTailleTexte.addEventListener(
        "change",
        function () {

            const taille =
                selectTailleTexte.value;


            appliquerTailleTexte(
                taille
            );


            editeurEtapes.focus();
        }
    );
}
/* =================================
   SYNCHRONISER L'ÉDITEUR
================================= */

function synchroniserEditeurEtapes() {

    if (
        !editeurEtapes ||
        !champEtapes
    ) {

        return;
    }


    champEtapes.value =
        editeurEtapes.innerHTML.trim();
}


if (
    editeurEtapes
) {

    editeurEtapes.addEventListener(
        "input",
        synchroniserEditeurEtapes
    );


    editeurEtapes.addEventListener(
        "keyup",
        sauvegarderSelectionEtapes
    );


    editeurEtapes.addEventListener(
        "mouseup",
        sauvegarderSelectionEtapes
    );
}

document.addEventListener(
    "selectionchange",
    function () {

        const selection =
            window.getSelection();


        if (
            !selection ||
            selection.rangeCount === 0 ||
            !editeurEtapes
        ) {

            return;
        }


        const range =
            selection.getRangeAt(
                0
            );


        if (
            editeurEtapes.contains(
                range.commonAncestorContainer
            )
        ) {

            selectionEtapesSauvegardee =
                range.cloneRange();
        }
    }
);


/* =================================
   RÉCUPÉRER LES ÉTAPES
================================= */

function recupererEtapesEditeur() {

    if (
        !editeurEtapes
    ) {

        return [];
    }


    const texte =
        editeurEtapes
            .innerText
            .trim();


    if (
        !texte
    ) {

        return [];
    }


    /*
        On conserve le HTML.

        Chaque ligne principale devient
        une étape indépendante.
    */

    const conteneur =
        document.createElement(
            "div"
        );


    conteneur.innerHTML =
        editeurEtapes.innerHTML;


    const enfants =
        Array.from(
            conteneur.children
        );


    /*
        Si le navigateur a créé
        plusieurs blocs, chacun devient
        une étape.
    */

    if (
        enfants.length >
        0
    ) {

        return enfants
            .map(
                function (
                    element
                ) {

                    return element.outerHTML;
                }
            )
            .filter(
                function (
                    element
                ) {

                    const temporaire =
                        document.createElement(
                            "div"
                        );


                    temporaire.innerHTML =
                        element;


                    return (
                        temporaire
                            .innerText
                            .trim() !==
                        ""
                    );
                }
            );
    }


    /*
        Sécurité :
        contenu sans bloc HTML.
    */

    return [
        editeurEtapes.innerHTML.trim()
    ];
}

/* =================================
   OUTILS
================================= */

function transformerEnListe(
    valeur
) {

    return valeur
        .split(
            "\n"
        )
        .map(
            function (
                ligne
            ) {

                return ligne.trim();
            }
        )
        .filter(
            function (
                ligne
            ) {

                return (
                    ligne !==
                    ""
                );
            }
        );
}


/* =================================
   CASES COCHÉES
================================= */

function recupererCasesCochees(
    nom
) {

    return Array.from(
        document.querySelectorAll(
            `input[name="${nom}"]:checked`
        )
    )
        .map(
            function (
                caseCochee
            ) {

                return caseCochee.value;
            }
        );
}


/* =================================
   CATÉGORIE AFFICHÉE
================================= */

function obtenirCategorieAffichee(
    categorie
) {

    const categories = {

        "apéritif":
            "Apéritif",

        "entrée":
            "Entrée",

        "plat":
            "Plat",

        "dessert":
            "Dessert",

        "goûter":
            "Goûter",

        "boisson":
            "Boisson"

    };


    return (
        categories[categorie] ||
        categorie
    );
}


/* =================================
   CONVERSION QUANTITÉ
================================= */

function convertirQuantite(
    valeur
) {

    const texte =
        valeur
            .trim()
            .replace(
                ",",
                "."
            );


    if (
        texte ===
        ""
    ) {

        return null;
    }


    const nombre =
        Number(
            texte
        );


    if (
        !Number.isFinite(
            nombre
        ) ||
        nombre < 0
    ) {

        throw new Error(
            `La quantité « ${valeur} » n’est pas valide.`
        );
    }


    return nombre;
}


/* =================================
   RÉCUPÉRER LES COMPOSANTS
================================= */

function recupererIngredients() {

    const lignes =
        conteneurIngredients
            .querySelectorAll(
                ".ligne-ingredient"
            );


    const ingredients =
        [];


    lignes.forEach(
        function (
            ligne
        ) {

            const quantiteTexte =
                ligne
                    .querySelector(
                        ".ingredient-quantite"
                    )
                    .value;


            const unite =
                ligne
                    .querySelector(
                        ".ingredient-unite"
                    )
                    .value
                    .trim();


            const type =
                ligne
                    .querySelector(
                        ".ingredient-type"
                    )
                    .value ===
                    "recette"
                        ? "recette"
                        : "ingredient";


            const champNom =
                ligne.querySelector(
                    ".ingredient-nom"
                );


            const selectRecette =
                ligne.querySelector(
                    ".ingredient-recette"
                );


            const proportionnel =
                ligne
                    .querySelector(
                        ".ingredient-proportionnel"
                    )
                    .checked;


            /* =========================
               INGRÉDIENT CLASSIQUE
            ========================= */

            if (
                type ===
                "ingredient"
            ) {

                const nom =
                    champNom.value
                        .trim();


                const ligneVide =
                    quantiteTexte.trim() ===
                        "" &&
                    unite ===
                        "" &&
                    nom ===
                        "";


                if (
                    ligneVide
                ) {

                    return;
                }


                if (
                    nom ===
                    ""
                ) {

                    throw new Error(
                        "Chaque ingrédient doit avoir un nom."
                    );
                }


                ingredients.push(
                    {

                        quantite:
                            convertirQuantite(
                                quantiteTexte
                            ),

                        unite:
                            unite,

                        nom:
                            nom,

                        proportionnel:
                            proportionnel,

                        recette_liee_id:
                            null

                    }
                );


                return;
            }


            /* =========================
               RECETTE
            ========================= */

            const recetteLieeId =
                selectRecette.value
                    .trim();


            if (
                !recetteLieeId
            ) {

                throw new Error(
                    "Choisis une recette pour chaque ligne de type « Recette »."
                );
            }


            if (
                identifiantRecette &&
                String(
                    recetteLieeId
                ) ===
                String(
                    identifiantRecette
                )
            ) {

                throw new Error(
                    "Une recette ne peut pas s’utiliser elle-même."
                );
            }


            const recetteLiee =
                trouverRecetteDisponible(
                    recetteLieeId
                );


            if (
                !recetteLiee
            ) {

                throw new Error(
                    "La recette sélectionnée est introuvable."
                );
            }


            ingredients.push(
                {

                    quantite:
                        convertirQuantite(
                            quantiteTexte
                        ),

                    unite:
                        unite,

                    /*
                        On sauvegarde également
                        le nom.

                        Comme ça l'affichage
                        reste possible même si
                        la recette liée change
                        plus tard de visibilité.
                    */

                    nom:
                        recetteLiee.nom,

                    proportionnel:
                        proportionnel,

                    recette_liee_id:
                        recetteLiee.id

                }
            );
        }
    );


    if (
        ingredients.length ===
        0
    ) {

        throw new Error(
            "Ajoute au moins un ingrédient ou une recette."
        );
    }


    return ingredients;
}


/* =================================
   VISIBILITÉ
================================= */

function recupererVisibilite() {

    const champ =
        document.querySelector(
            'input[name="visibilite"]:checked'
        );


    if (
        !champ
    ) {

        return "publique";
    }


    if (
        champ.value !==
            "publique" &&
        champ.value !==
            "foyer"
    ) {

        return "publique";
    }


    return champ.value;
}


/* =================================
   CONSTRUIRE LA RECETTE
================================= */

function construireRecette() {

    const etapes =
    recupererEtapesEditeur();


    if (
        etapes.length ===
        0
    ) {

        throw new Error(
            "Ajoute au moins une étape."
        );
    }


    const categorie =
        document
            .getElementById(
                "categorie"
            )
            .value;


    const nom =
        document
            .getElementById(
                "nom"
            )
            .value
            .trim();


    if (
        !nom
    ) {

        throw new Error(
            "Renseigne le nom de la recette."
        );
    }


    const visibilite =
        recupererVisibilite();


    if (
        visibilite ===
            "foyer" &&
        !foyerId
    ) {

        throw new Error(
            "Impossible de déterminer votre foyer."
        );
    }


    return {

        nom:
            nom,

        description:
            document
                .getElementById(
                    "description"
                )
                .value
                .trim(),

        categorie:
            categorie,

        categorie_affichee:
            obtenirCategorieAffichee(
                categorie
            ),

        preparation:
            Number(
                document
                    .getElementById(
                        "preparation"
                    )
                    .value
            ),

        cuisson:
            Number(
                document
                    .getElementById(
                        "cuisson"
                    )
                    .value
            ),

        personnes:
            Number(
                document
                    .getElementById(
                        "personnes"
                    )
                    .value
            ),

        difficulte:
            document
                .getElementById(
                    "difficulte"
                )
                .value,

        ingredients:
            recupererIngredients(),

        etapes:
            etapes,

        etiquettes:
            recupererCasesCochees(
                "etiquettes"
            ),

        occasions:
            recupererCasesCochees(
                "occasions"
            ),

        saisons:
            recupererCasesCochees(
                "saisons"
            ),

        astuce:
            document
                .getElementById(
                    "astuce"
                )
                .value
                .trim(),

        visibilite:
            visibilite,

        foyer_id:
            foyerId
    };
}


/* =================================
   OUTILS PHOTOS
================================= */

function obtenirNombrePhotosActuelles() {

    return (
        photosExistantes.length +
        nouvellesPhotos.length
    );
}


/* =================================
   COMPTEUR PHOTOS
================================= */

function mettreAJourCompteurPhotos() {

    if (
        !compteurPhotosRecette
    ) {

        return;
    }


    const nombre =
        obtenirNombrePhotosActuelles();


    compteurPhotosRecette.textContent =
        `${nombre} / ${NOMBRE_MAX_PHOTOS}`;


    if (
        boutonAjouterPhotos
    ) {

        boutonAjouterPhotos.disabled =
            nombre >=
            NOMBRE_MAX_PHOTOS;
    }
}

/* =================================
   MESSAGE PHOTOS
================================= */

function afficherMessagePhotos(
    texte,
    type = ""
) {

    if (
        !messagePhotosRecette
    ) {

        return;
    }


    messagePhotosRecette.textContent =
        texte;


    messagePhotosRecette.classList.remove(
        "erreur",
        "succes"
    );


    if (
        type
    ) {

        messagePhotosRecette
            .classList
            .add(
                type
            );
    }
}


/* =================================
   IDENTIFIANT LOCAL PHOTO
================================= */

function creerIdentifiantPhotoLocal() {

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
   VÉRIFIER UN FICHIER IMAGE
================================= */

function verifierFichierPhoto(
    fichier
) {

    if (
        !fichier
    ) {

        return false;
    }


    if (
        !fichier.type ||
        !fichier.type.startsWith(
            "image/"
        )
    ) {

        throw new Error(
            `« ${fichier.name} » n'est pas une image.`
        );
    }


    const tailleMaximum =
        25 *
        1024 *
        1024;


    if (
        fichier.size >
        tailleMaximum
    ) {

        throw new Error(
            `La photo « ${fichier.name} » est trop lourde.`
        );
    }


    return true;
}


/* =================================
   AJOUTER LES FICHIERS SÉLECTIONNÉS
================================= */

function ajouterFichiersPhotos(
    fichiers
) {

    afficherMessagePhotos(
        ""
    );


    const liste =
        Array.from(
            fichiers ||
            []
        );


    if (
        liste.length ===
        0
    ) {

        return;
    }


    const placesDisponibles =
        NOMBRE_MAX_PHOTOS -
        obtenirNombrePhotosActuelles();


    if (
        placesDisponibles <=
        0
    ) {

        afficherMessagePhotos(
            "La recette contient déjà 5 photos.",
            "erreur"
        );


        return;
    }


    const fichiersAcceptes =
        liste.slice(
            0,
            placesDisponibles
        );


    try {

        fichiersAcceptes.forEach(
            function (
                fichier
            ) {

                verifierFichierPhoto(
                    fichier
                );


                const photo = {

                    idLocal:
                        creerIdentifiantPhotoLocal(),

                    fichier:
                        fichier,

                    urlApercu:
                        URL.createObjectURL(
                            fichier
                        )

                };


                nouvellesPhotos.push(
                    photo
                );


                ajouterPhotoDansOrdre(
                    "nouvelle",
                    photo.idLocal
                );
            }
        );


        if (
            liste.length >
            placesDisponibles
        ) {

            afficherMessagePhotos(
                `Maximum ${NOMBRE_MAX_PHOTOS} photos par recette. Les photos supplémentaires n'ont pas été ajoutées.`,
                "erreur"
            );
        }


        afficherApercuPhotos();


    } catch (
        erreur
    ) {

        afficherMessagePhotos(
            erreur.message ||
            "Impossible d'ajouter cette photo.",
            "erreur"
        );
    }


    if (
        inputPhotosRecette
    ) {

        inputPhotosRecette.value =
            "";
    }
}


/* =================================
   SUPPRIMER UNE NOUVELLE PHOTO
================================= */

function supprimerNouvellePhoto(
    idLocal
) {

    const photo =
        nouvellesPhotos.find(
            function (
                element
            ) {

                return (
                    String(
                        element.idLocal
                    ) ===
                    String(
                        idLocal
                    )
                );
            }
        );


    if (
        photo &&
        photo.urlApercu
    ) {

        URL.revokeObjectURL(
            photo.urlApercu
        );
    }


    nouvellesPhotos =
        nouvellesPhotos.filter(
            function (
                element
            ) {

                return (
                    String(
                        element.idLocal
                    ) !==
                    String(
                        idLocal
                    )
                );
            }
        );


    retirerPhotoDeOrdre(
        "nouvelle",
        idLocal
    );


    afficherApercuPhotos();
}


/* =================================
   RETIRER UNE PHOTO EXISTANTE
================================= */

function retirerPhotoExistante(
    photoId
) {

    const photo =
        photosExistantes.find(
            function (
                element
            ) {

                return (
                    String(
                        element.id
                    ) ===
                    String(
                        photoId
                    )
                );
            }
        );


    if (
        !photo
    ) {

        return;
    }


    const dejaPresente =
        photosASupprimer.some(
            function (
                element
            ) {

                return (
                    String(
                        element.id
                    ) ===
                    String(
                        photo.id
                    )
                );
            }
        );


    if (
        !dejaPresente
    ) {

        photosASupprimer.push(
            photo
        );
    }


    photosExistantes =
        photosExistantes.filter(
            function (
                element
            ) {

                return (
                    String(
                        element.id
                    ) !==
                    String(
                        photoId
                    )
                );
            }
        );


    retirerPhotoDeOrdre(
        "existante",
        photoId
    );


    afficherApercuPhotos();
}


/* =================================
   AFFICHER LES APERÇUS
================================= */

function afficherApercuPhotos() {

    if (
        !apercuPhotosRecette
    ) {

        return;
    }


    const toutesLesPhotos =
        obtenirPhotosDansOrdre();


    if (
        toutesLesPhotos.length ===
        0
    ) {

        apercuPhotosRecette.innerHTML =
            "";


        apercuPhotosRecette.hidden =
            true;


        mettreAJourCompteurPhotos();


        return;
    }


    apercuPhotosRecette.hidden =
        false;


    apercuPhotosRecette.innerHTML =
        toutesLesPhotos
            .map(
                function (
                    photo,
                    index
                ) {

                    const estPremiere =
                        index ===
                        0;


                    const boutonGaucheDesactive =
                        index ===
                        0;


                    const boutonDroiteDesactive =
                        index ===
                        toutesLesPhotos.length -
                        1;


                    return `

                        <div
                            class="apercu-photo-recette ${
                                estPremiere
                                    ? "photo-principale"
                                    : ""
                            }"
                            data-type-photo="${photo.type}"
                            data-photo-id="${photo.id}"
                            data-index-photo="${index}"
                            draggable="true"
                        >

                            <div
                                class="poignee-photo-recette"
                                aria-hidden="true"
                            >
                                ⋮⋮
                            </div>


                            <img
                                src="${photo.url}"
                                alt="Photo ${index + 1} de la recette"
                                draggable="false"
                            >


                            ${
                                estPremiere
                                    ? `
                                        <span
                                            class="badge-photo-principale"
                                        >
                                            Photo principale
                                        </span>
                                    `
                                    : ""
                            }


                            <span
                                class="numero-photo-recette"
                            >
                                ${index + 1}
                            </span>


                            <button
                                type="button"
                                class="supprimer-photo-recette"
                                data-type-photo="${photo.type}"
                                data-photo-id="${photo.id}"
                                aria-label="Retirer cette photo"
                                title="Retirer cette photo"
                            >
                                ×
                            </button>


                            <div
                                class="actions-ordre-photo"
                            >

                                <button
                                    type="button"
                                    class="deplacer-photo-recette deplacer-photo-gauche"
                                    data-type-photo="${photo.type}"
                                    data-photo-id="${photo.id}"
                                    aria-label="Déplacer cette photo vers la gauche"
                                    title="Déplacer vers la gauche"
                                    ${
                                        boutonGaucheDesactive
                                            ? "disabled"
                                            : ""
                                    }
                                >
                                    ←
                                </button>


                                <button
                                    type="button"
                                    class="deplacer-photo-recette deplacer-photo-droite"
                                    data-type-photo="${photo.type}"
                                    data-photo-id="${photo.id}"
                                    aria-label="Déplacer cette photo vers la droite"
                                    title="Déplacer vers la droite"
                                    ${
                                        boutonDroiteDesactive
                                            ? "disabled"
                                            : ""
                                    }
                                >
                                    →
                                </button>

                            </div>

                        </div>

                    `;
                }
            )
            .join("");


    mettreAJourCompteurPhotos();
}


/* =================================
   CLIC AJOUTER DES PHOTOS
================================= */

if (
    boutonAjouterPhotos &&
    inputPhotosRecette
) {

    boutonAjouterPhotos.addEventListener(
        "click",
        function () {

            if (
                obtenirNombrePhotosActuelles() >=
                NOMBRE_MAX_PHOTOS
            ) {

                afficherMessagePhotos(
                    "La recette contient déjà 5 photos.",
                    "erreur"
                );


                return;
            }


            inputPhotosRecette.click();
        }
    );


    inputPhotosRecette.addEventListener(
        "change",
        function () {

            ajouterFichiersPhotos(
                inputPhotosRecette.files
            );
        }
    );
}


/* =================================
   CLICS DANS LES APERÇUS
================================= */

if (
    apercuPhotosRecette
) {

    apercuPhotosRecette.addEventListener(
        "click",
        function (
            evenement
        ) {

            const boutonSuppression =
                evenement.target.closest(
                    ".supprimer-photo-recette"
                );


            if (
                boutonSuppression
            ) {

                const type =
                    boutonSuppression
                        .dataset
                        .typePhoto;


                const id =
                    boutonSuppression
                        .dataset
                        .photoId;


                if (
                    type ===
                    "nouvelle"
                ) {

                    supprimerNouvellePhoto(
                        id
                    );


                    return;
                }


                if (
                    type ===
                    "existante"
                ) {

                    retirerPhotoExistante(
                        id
                    );


                    return;
                }
            }


            const boutonGauche =
                evenement.target.closest(
                    ".deplacer-photo-gauche"
                );


            if (
                boutonGauche &&
                !boutonGauche.disabled
            ) {

                deplacerPhotoDirection(
                    boutonGauche
                        .dataset
                        .typePhoto,

                    boutonGauche
                        .dataset
                        .photoId,

                    "gauche"
                );


                return;
            }


            const boutonDroite =
                evenement.target.closest(
                    ".deplacer-photo-droite"
                );


            if (
                boutonDroite &&
                !boutonDroite.disabled
            ) {

                deplacerPhotoDirection(
                    boutonDroite
                        .dataset
                        .typePhoto,

                    boutonDroite
                        .dataset
                        .photoId,

                    "droite"
                );
            }
        }
    );
}


/* =================================
   DRAG & DROP DESKTOP
================================= */

if (
    apercuPhotosRecette
) {

    apercuPhotosRecette.addEventListener(
        "dragstart",
        function (
            evenement
        ) {

            const element =
                evenement.target.closest(
                    ".apercu-photo-recette"
                );


            if (
                !element
            ) {

                return;
            }


            photoEnCoursDeDrag = {

                type:
                    element
                        .dataset
                        .typePhoto,

                id:
                    element
                        .dataset
                        .photoId
            };


            element.classList.add(
                "photo-en-deplacement"
            );


            if (
                evenement.dataTransfer
            ) {

                evenement.dataTransfer.effectAllowed =
                    "move";


                evenement.dataTransfer.setData(
                    "text/plain",
                    creerClePhoto(
                        photoEnCoursDeDrag.type,
                        photoEnCoursDeDrag.id
                    )
                );
            }
        }
    );


    apercuPhotosRecette.addEventListener(
        "dragover",
        function (
            evenement
        ) {

            const cible =
                evenement.target.closest(
                    ".apercu-photo-recette"
                );


            if (
                !cible ||
                !photoEnCoursDeDrag
            ) {

                return;
            }


            evenement.preventDefault();


            if (
                evenement.dataTransfer
            ) {

                evenement.dataTransfer.dropEffect =
                    "move";
            }


            const elements =
                apercuPhotosRecette
                    .querySelectorAll(
                        ".apercu-photo-recette"
                    );


            elements.forEach(
                function (
                    element
                ) {

                    element.classList.remove(
                        "photo-cible-deplacement"
                    );
                }
            );


            cible.classList.add(
                "photo-cible-deplacement"
            );
        }
    );


    apercuPhotosRecette.addEventListener(
        "drop",
        function (
            evenement
        ) {

            evenement.preventDefault();


            const cible =
                evenement.target.closest(
                    ".apercu-photo-recette"
                );


            if (
                !cible ||
                !photoEnCoursDeDrag
            ) {

                return;
            }


            const indexDepart =
                trouverIndexPhotoOrdre(
                    photoEnCoursDeDrag.type,
                    photoEnCoursDeDrag.id
                );


            const indexArrivee =
                Number(
                    cible
                        .dataset
                        .indexPhoto
                );


            if (
                Number.isInteger(
                    indexArrivee
                )
            ) {

                deplacerPhoto(
                    indexDepart,
                    indexArrivee
                );
            }


            photoEnCoursDeDrag =
                null;
        }
    );


    apercuPhotosRecette.addEventListener(
        "dragend",
        function () {

            photoEnCoursDeDrag =
                null;


            const elements =
                apercuPhotosRecette
                    .querySelectorAll(
                        ".apercu-photo-recette"
                    );


            elements.forEach(
                function (
                    element
                ) {

                    element.classList.remove(
                        "photo-en-deplacement",
                        "photo-cible-deplacement"
                    );
                }
            );
        }
    );
}


/* =================================
   DÉPLACEMENT TACTILE MOBILE
================================= */

if (
    apercuPhotosRecette
) {

    apercuPhotosRecette.addEventListener(
        "touchstart",
        function (
            evenement
        ) {

            if (
                evenement.target.closest(
                    "button"
                )
            ) {

                return;
            }


            const element =
                evenement.target.closest(
                    ".apercu-photo-recette"
                );


            if (
                !element
            ) {

                return;
            }


            photoTactileEnCours = {

                type:
                    element
                        .dataset
                        .typePhoto,

                id:
                    element
                        .dataset
                        .photoId
            };


            elementTactileEnCours =
                element;


            element.classList.add(
                "photo-en-deplacement-tactile"
            );

        },
        {
            passive:
                true
        }
    );


    apercuPhotosRecette.addEventListener(
        "touchmove",
        function (
            evenement
        ) {

            if (
                !photoTactileEnCours
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


            const elementSousDoigt =
                document.elementFromPoint(
                    touche.clientX,
                    touche.clientY
                );


            const cible =
                elementSousDoigt
                    ?.closest(
                        ".apercu-photo-recette"
                    );


            if (
                !cible ||
                !apercuPhotosRecette.contains(
                    cible
                )
            ) {

                return;
            }


            const elements =
                apercuPhotosRecette
                    .querySelectorAll(
                        ".apercu-photo-recette"
                    );


            elements.forEach(
                function (
                    element
                ) {

                    element.classList.remove(
                        "photo-cible-deplacement"
                    );
                }
            );


            cible.classList.add(
                "photo-cible-deplacement"
            );


            const indexDepart =
                trouverIndexPhotoOrdre(
                    photoTactileEnCours.type,
                    photoTactileEnCours.id
                );


            const indexArrivee =
                Number(
                    cible
                        .dataset
                        .indexPhoto
                );


            if (
                indexDepart === -1 ||
                !Number.isInteger(
                    indexArrivee
                ) ||
                indexDepart ===
                    indexArrivee
            ) {

                return;
            }


            const [
                photoDeplacee
            ] =
                ordrePhotos.splice(
                    indexDepart,
                    1
                );


            ordrePhotos.splice(
                indexArrivee,
                0,
                photoDeplacee
            );


            ordrePhotosModifie =
                true;


            afficherApercuPhotos();

        },
        {
            passive:
                true
        }
    );


    function terminerDeplacementTactile() {

        photoTactileEnCours =
            null;


        elementTactileEnCours =
            null;


        if (
            !apercuPhotosRecette
        ) {

            return;
        }


        const elements =
            apercuPhotosRecette
                .querySelectorAll(
                    ".apercu-photo-recette"
                );


        elements.forEach(
            function (
                element
            ) {

                element.classList.remove(
                    "photo-en-deplacement-tactile",
                    "photo-cible-deplacement"
                );
            }
        );
    }


    apercuPhotosRecette.addEventListener(
        "touchend",
        terminerDeplacementTactile
    );


    apercuPhotosRecette.addEventListener(
        "touchcancel",
        terminerDeplacementTactile
    );
}


/* =================================
   CORRESPONDANCE DES NOUVELLES PHOTOS
   APRÈS INSERTION SUPABASE
================================= */

const idsNouvellesPhotosEnregistrees =
    new Map();

/* =================================
   CHARGER UNE IMAGE
   DANS UN ÉLÉMENT <img>
================================= */

function chargerImageDepuisFichier(
    fichier
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const image =
                new Image();


            const url =
                URL.createObjectURL(
                    fichier
                );


            image.onload =
                function () {

                    URL.revokeObjectURL(
                        url
                    );


                    resolve(
                        image
                    );
                };


            image.onerror =
                function () {

                    URL.revokeObjectURL(
                        url
                    );


                    reject(
                        new Error(
                            `Impossible de lire la photo « ${fichier.name} ».`
                        )
                    );
                };


            image.src =
                url;
        }
    );
}


/* =================================
   CALCULER LES DIMENSIONS
================================= */

function calculerDimensionsPhoto(
    largeurOriginale,
    hauteurOriginale,
    tailleMaximale = 1600
) {

    if (
        largeurOriginale <=
            tailleMaximale &&
        hauteurOriginale <=
            tailleMaximale
    ) {

        return {

            largeur:
                largeurOriginale,

            hauteur:
                hauteurOriginale

        };
    }


    const ratio =
        Math.min(

            tailleMaximale /
                largeurOriginale,

            tailleMaximale /
                hauteurOriginale

        );


    return {

        largeur:
            Math.round(
                largeurOriginale *
                ratio
            ),

        hauteur:
            Math.round(
                hauteurOriginale *
                ratio
            )

    };
}


/* =================================
   CANVAS -> BLOB
================================= */

function convertirCanvasEnBlob(
    canvas,
    type,
    qualite
) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            canvas.toBlob(
                function (
                    blob
                ) {

                    if (
                        !blob
                    ) {

                        reject(
                            new Error(
                                "Impossible de compresser la photo."
                            )
                        );


                        return;
                    }


                    resolve(
                        blob
                    );
                },

                type,

                qualite
            );
        }
    );
}


/* =================================
   COMPRESSER UNE PHOTO
================================= */

async function compresserPhoto(
    fichier
) {

    const image =
        await chargerImageDepuisFichier(
            fichier
        );


    const dimensions =
        calculerDimensionsPhoto(

            image.naturalWidth,

            image.naturalHeight,

            1600

        );


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        dimensions.largeur;


    canvas.height =
        dimensions.hauteur;


    const contexte =
        canvas.getContext(
            "2d"
        );


    if (
        !contexte
    ) {

        throw new Error(
            "Impossible de préparer la photo."
        );
    }


    contexte.fillStyle =
        "#ffffff";


    contexte.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    contexte.drawImage(
        image,
        0,
        0,
        dimensions.largeur,
        dimensions.hauteur
    );


    const typeSortie =
        "image/jpeg";


    let qualite =
        0.82;


    let blob =
        await convertirCanvasEnBlob(
            canvas,
            typeSortie,
            qualite
        );


    const tailleCible =
        1.5 *
        1024 *
        1024;


    while (
        blob.size >
            tailleCible &&
        qualite >
            0.58
    ) {

        qualite -=
            0.08;


        blob =
            await convertirCanvasEnBlob(
                canvas,
                typeSortie,
                qualite
            );
    }


    const fichierCompresse =
        new File(
            [
                blob
            ],
            "photo-recette.jpg",
            {
                type:
                    "image/jpeg"
            }
        );


    return fichierCompresse;
}


/* =================================
   NETTOYER UN NOM DE FICHIER
================================= */

function nettoyerNomFichier(
    valeur
) {

    return String(
        valeur ||
        "photo"
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        )
        .slice(
            0,
            50
        ) ||
        "photo";
}


/* =================================
   GÉNÉRER UN NOM UNIQUE
================================= */

function genererNomPhotoStorage(
    fichier,
    index
) {

    const nomOriginal =
        fichier?.name ||
        "photo";


    const nomNettoye =
        nettoyerNomFichier(
            nomOriginal.replace(
                /\.[^.]+$/,
                ""
            )
        );


    const identifiant =
        creerIdentifiantPhotoLocal();


    return (
        `${Date.now()}-` +
        `${index + 1}-` +
        `${nomNettoye}-` +
        `${identifiant}.jpg`
    );
}


/* =================================
   CHEMIN STORAGE
================================= */

function construireCheminPhotoStorage(
    recetteId,
    nomFichier
) {

    if (
        !foyerId
    ) {

        throw new Error(
            "Impossible de déterminer le foyer pour enregistrer la photo."
        );
    }


    if (
        !recetteId
    ) {

        throw new Error(
            "Impossible de déterminer la recette pour enregistrer la photo."
        );
    }


    return (
        `${foyerId}/` +
        `${recetteId}/` +
        `${nomFichier}`
    );
}


/* =================================
   CALCULER UN ORDRE TEMPORAIRE
================================= */

function obtenirOrdreTemporairePhoto(
    index
) {

    return (
        1000 +
        index
    );
}


/* =================================
   UPLOAD D'UNE PHOTO
================================= */

async function uploaderUnePhoto(
    photo,
    recetteId,
    index
) {

    const fichierCompresse =
        await compresserPhoto(
            photo.fichier
        );


    const nomFichier =
        genererNomPhotoStorage(
            photo.fichier,
            index
        );


    const chemin =
        construireCheminPhotoStorage(
            recetteId,
            nomFichier
        );


    const {
        error:
            erreurUpload
    } =
        await window.supabaseClient
            .storage
            .from(
                "recettes"
            )
            .upload(
                chemin,
                fichierCompresse,
                {

                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        "image/jpeg"

                }
            );


    if (
        erreurUpload
    ) {

        throw erreurUpload;
    }


    return {

        chemin:
            chemin,

        ordre:
            obtenirOrdreTemporairePhoto(
                index
            )

    };
}


/* =================================
   INSÉRER UNE PHOTO EN BASE
================================= */

async function enregistrerPhotoEnBase(
    recetteId,
    photo
) {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "recette_photos"
            )
            .insert(
                {

                    recette_id:
                        recetteId,

                    chemin:
                        photo.chemin,

                    ordre:
                        photo.ordre,

                    created_by:
                        utilisateurConnecte.id

                }
            )
            .select(
                "id, recette_id, chemin, ordre, created_by"
            )
            .single();


    if (
        error
    ) {

        throw error;
    }


    return data;
}


/* =================================
   NETTOYER UN FICHIER APRÈS
   UNE ERREUR SQL
================================= */

async function nettoyerPhotoStorageApresErreur(
    chemin
) {

    if (
        !chemin
    ) {

        return;
    }


    try {

        await window.supabaseClient
            .storage
            .from(
                "recettes"
            )
            .remove(
                [
                    chemin
                ]
            );


    } catch (
        erreurNettoyage
    ) {

        console.error(
            "Impossible de nettoyer la photo après erreur SQL :",
            erreurNettoyage
        );
    }
}


/* =================================
   UPLOAD DES NOUVELLES PHOTOS
================================= */

async function uploaderNouvellesPhotos(
    recetteId
) {

    if (
        nouvellesPhotos.length ===
        0
    ) {

        return;
    }


    idsNouvellesPhotosEnregistrees.clear();


    for (
        let index = 0;
        index <
            nouvellesPhotos.length;
        index++
    ) {

        const photo =
            nouvellesPhotos[
                index
            ];


        afficherMessagePhotos(
            `Envoi de la photo ${index + 1} sur ${nouvellesPhotos.length}…`
        );


        let photoUploadee =
            null;


        try {

            photoUploadee =
                await uploaderUnePhoto(
                    photo,
                    recetteId,
                    index
                );


            const photoEnregistree =
                await enregistrerPhotoEnBase(
                    recetteId,
                    photoUploadee
                );


            if (
                !photoEnregistree?.id
            ) {

                throw new Error(
                    "La photo a été enregistrée mais son identifiant est introuvable."
                );
            }


            idsNouvellesPhotosEnregistrees.set(
                String(
                    photo.idLocal
                ),
                photoEnregistree.id
            );


        } catch (
            erreur
        ) {

            if (
                photoUploadee?.chemin
            ) {

                await nettoyerPhotoStorageApresErreur(
                    photoUploadee.chemin
                );
            }


            throw erreur;
        }
    }


    afficherMessagePhotos(
        nouvellesPhotos.length ===
            1
            ? "Photo enregistrée ✓"
            : "Photos enregistrées ✓",
        "succes"
    );
}


/* =================================
   CRÉER URL TEMPORAIRE
================================= */

async function creerUrlPhotoPrivee(
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
            "Impossible de créer l'URL de la photo :",
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
   CHARGER LES PHOTOS EXISTANTES
================================= */

async function chargerPhotosRecette(
    recetteId
) {

    photosExistantes =
        [];


    photosASupprimer =
        [];


    ordrePhotos =
        [];


    ordrePhotosModifie =
        false;


    if (
        !recetteId
    ) {

        afficherApercuPhotos();

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
                "id, recette_id, chemin, ordre, created_by"
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


    photosExistantes =
        await Promise.all(
            lignes.map(
                async function (
                    photo
                ) {

                    const url =
                        await creerUrlPhotoPrivee(
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


    ordrePhotos =
        photosExistantes.map(
            function (
                photo
            ) {

                return {

                    type:
                        "existante",

                    id:
                        photo.id

                };
            }
        );


    afficherApercuPhotos();
}


/* =================================
   SUPPRIMER UNE PHOTO DU STORAGE
================================= */

async function supprimerPhotoStorage(
    chemin
) {

    if (
        !chemin
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
                [
                    chemin
                ]
            );


    if (
        error
    ) {

        throw error;
    }
}


/* =================================
   SUPPRIMER UNE PHOTO DE LA BASE
================================= */

async function supprimerPhotoBase(
    photoId
) {

    if (
        !photoId
    ) {

        return;
    }


    const {
        error
    } =
        await window.supabaseClient
            .from(
                "recette_photos"
            )
            .delete()
            .eq(
                "id",
                photoId
            );


    if (
        error
    ) {

        throw error;
    }
}


/* =================================
   SUPPRIMER LES PHOTOS RETIRÉES
================================= */

async function supprimerPhotosRetirees() {

    if (
        photosASupprimer.length ===
        0
    ) {

        return;
    }


    for (
        const photo of
            photosASupprimer
    ) {

        await supprimerPhotoBase(
            photo.id
        );


        await supprimerPhotoStorage(
            photo.chemin
        );
    }


    photosASupprimer =
        [];
}

5
5/* =================================
   CONVERTIR L'ORDRE LOCAL
   EN IDS SUPABASE
================================= */

function construireOrdreFinalSupabase() {

    const ordreFinal =
        [];


    ordrePhotos.forEach(
        function (
            reference
        ) {

            if (
                reference.type ===
                "existante"
            ) {

                const existeEncore =
                    photosExistantes.some(
                        function (
                            photo
                        ) {

                            return (
                                String(
                                    photo.id
                                ) ===
                                String(
                                    reference.id
                                )
                            );
                        }
                    );


                if (
                    existeEncore
                ) {

                    ordreFinal.push(
                        reference.id
                    );
                }


                return;
            }


            if (
                reference.type ===
                "nouvelle"
            ) {

                const idSupabase =
                    idsNouvellesPhotosEnregistrees.get(
                        String(
                            reference.id
                        )
                    );


                if (
                    idSupabase
                ) {

                    ordreFinal.push(
                        idSupabase
                    );
                }
            }
        }
    );


    return ordreFinal;
}


/* =================================
   RÉCUPÉRER L'ORDRE ACTUEL
   DEPUIS SUPABASE
================================= */

async function recupererPhotosSupabase(
    recetteId
) {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "recette_photos"
            )
            .select(
                "id, ordre"
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


    return Array.isArray(
        data
    )
        ? data
        : [];
}


/* =================================
   ENREGISTRER UN ORDRE TEMPORAIRE
================================= */

async function appliquerOrdresTemporaires(
    idsPhotos
) {

    for (
        let index = 0;
        index <
            idsPhotos.length;
        index++
    ) {

        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "recette_photos"
                )
                .update(
                    {
                        ordre:
                            10000 +
                            index +
                            1
                    }
                )
                .eq(
                    "id",
                    idsPhotos[
                        index
                    ]
                );


        if (
            error
        ) {

            throw error;
        }
    }
}


/* =================================
   APPLIQUER L'ORDRE FINAL
================================= */

async function appliquerOrdreFinal(
    idsPhotos
) {

    for (
        let index = 0;
        index <
            idsPhotos.length;
        index++
    ) {

        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "recette_photos"
                )
                .update(
                    {
                        ordre:
                            index +
                            1
                    }
                )
                .eq(
                    "id",
                    idsPhotos[
                        index
                    ]
                );


        if (
            error
        ) {

            throw error;
        }
    }
}


/* =================================
   ENREGISTRER L'ORDRE DES PHOTOS
================================= */

async function enregistrerOrdrePhotos(
    recetteId
) {

    let idsPhotos =
        construireOrdreFinalSupabase();


    const photosSupabase =
        await recupererPhotosSupabase(
            recetteId
        );


    if (
        idsPhotos.length ===
            0 &&
        photosSupabase.length >
            0
    ) {

        idsPhotos =
            photosSupabase.map(
                function (
                    photo
                ) {

                    return photo.id;
                }
            );
    }


    const idsDejaPresents =
        new Set(
            idsPhotos.map(
                function (
                    id
                ) {

                    return String(
                        id
                    );
                }
            )
        );


    photosSupabase.forEach(
        function (
            photo
        ) {

            if (
                !idsDejaPresents.has(
                    String(
                        photo.id
                    )
                )
            ) {

                idsPhotos.push(
                    photo.id
                );


                idsDejaPresents.add(
                    String(
                        photo.id
                    )
                );
            }
        }
    );


    if (
        idsPhotos.length ===
        0
    ) {

        return;
    }


    await appliquerOrdresTemporaires(
        idsPhotos
    );


    await appliquerOrdreFinal(
        idsPhotos
    );
}


/* =================================
   RECHARGER L'ÉTAT PHOTO
   APRÈS ENREGISTREMENT
================================= */

async function rechargerEtatPhotos(
    recetteId
) {

    nouvellesPhotos.forEach(
        function (
            photo
        ) {

            if (
                photo.urlApercu
            ) {

                try {

                    URL.revokeObjectURL(
                        photo.urlApercu
                    );

                } catch (
                    erreur
                ) {

                    console.warn(
                        "Impossible de libérer l'aperçu local :",
                        erreur
                    );
                }
            }
        }
    );


    nouvellesPhotos =
        [];


    photosASupprimer =
        [];


    idsNouvellesPhotosEnregistrees.clear();


    await chargerPhotosRecette(
        recetteId
    );


    ordrePhotosModifie =
        false;
}


/* =================================
   SYNCHRONISER TOUTES LES PHOTOS
================================= */

async function enregistrerPhotosRecette(
    recetteId
) {

    const ordreAvantEnregistrement =
        ordrePhotos.map(
            function (
                reference
            ) {

                return {
                    ...reference
                };
            }
        );


    await supprimerPhotosRetirees();


    await uploaderNouvellesPhotos(
        recetteId
    );


    ordrePhotos =
        ordreAvantEnregistrement;


    await enregistrerOrdrePhotos(
        recetteId
    );


    await rechargerEtatPhotos(
        recetteId
    );
}


/* =================================
   SAVOIR SI LES PHOTOS ONT CHANGÉ
================================= */

function photosOntEteModifiees() {

    return (
        nouvellesPhotos.length >
            0 ||
        photosASupprimer.length >
            0 ||
        ordrePhotosModifie
    );
}


/* =================================
   COCHER LES FILTRES
================================= */

function cocherValeurs(
    nom,
    valeurs
) {

    const cases =
        document.querySelectorAll(
            `input[name="${nom}"]`
        );


    cases.forEach(
        function (
            caseCochee
        ) {

            caseCochee.checked =
                Array.isArray(
                    valeurs
                ) &&
                valeurs.includes(
                    caseCochee.value
                );
        }
    );
}


/* =================================
   COCHER LA VISIBILITÉ
================================= */

function cocherVisibilite(
    visibilite
) {

    const valeur =
        visibilite ===
        "foyer"
            ? "foyer"
            : "publique";


    const champ =
        document.querySelector(
            `input[name="visibilite"][value="${valeur}"]`
        );


    if (
        champ
    ) {

        champ.checked =
            true;
    }
}


/* =================================
   REMPLIR LE FORMULAIRE
================================= */

function remplirFormulaire(
    recette
) {

    document
        .getElementById(
            "nom"
        )
        .value =
            recette.nom ||
            "";


    document
        .getElementById(
            "categorie"
        )
        .value =
            recette.categorie ||
            "";


    document
        .getElementById(
            "description"
        )
        .value =
            recette.description ||
            "";


    document
        .getElementById(
            "preparation"
        )
        .value =
            recette.preparation ??
            "";


    document
        .getElementById(
            "cuisson"
        )
        .value =
            recette.cuisson ??
            "";


    document
        .getElementById(
            "personnes"
        )
        .value =
            recette.personnes ??
            "";


    document
        .getElementById(
            "difficulte"
        )
        .value =
            recette.difficulte ||
            "";


    const etapesExistantes =
    Array.isArray(
        recette.etapes
    )
        ? recette.etapes
        : [];


if (
    editeurEtapes
) {

    const contientHtml =
        etapesExistantes.some(
            function (
                etape
            ) {

                return /<[a-z][\s\S]*>/i.test(
                    String(
                        etape
                    )
                );
            }
        );


    if (
        contientHtml
    ) {

        /*
            Nouvelle recette :
            les étapes contiennent déjà
            leur mise en forme HTML.
        */

        editeurEtapes.innerHTML =
            etapesExistantes.join(
                ""
            );

    } else {

        /*
            Ancienne recette :
            conversion de chaque ligne
            texte en paragraphe HTML.
        */

        editeurEtapes.innerHTML =
            etapesExistantes
                .map(
                    function (
                        etape
                    ) {

                        const p =
                            document.createElement(
                                "p"
                            );


                        p.textContent =
                            String(
                                etape
                            );


                        return p.outerHTML;
                    }
                )
                .join("");
    }


    synchroniserEditeurEtapes();
}


    document
        .getElementById(
            "astuce"
        )
        .value =
            recette.astuce ||
            "";


    cocherVisibilite(
        recette.visibilite ||
        "publique"
    );


    cocherValeurs(
        "etiquettes",
        recette.etiquettes
    );


    cocherValeurs(
        "occasions",
        recette.occasions
    );


    cocherValeurs(
        "saisons",
        recette.saisons
    );


    conteneurIngredients.innerHTML =
        "";


    /* =========================
       INGRÉDIENTS / RECETTES
    ========================= */

    if (
        Array.isArray(
            recette.ingredients
        ) &&
        recette.ingredients.length >
            0
    ) {

        recette.ingredients.forEach(
            function (
                ingredient
            ) {

                /*
                    Ancien ingrédient :

                    {
                        nom: "Farine",
                        recette_liee_id: null
                    }

                    => type "Ingrédient"


                    Recette utilisée
                    comme composant :

                    {
                        nom: "Béchamel",
                        recette_liee_id: "..."
                    }

                    => type "Recette"

                    creerLigneIngredient()
                    détecte automatiquement
                    le bon type.
                */

                creerLigneIngredient(
                    ingredient
                );
            }
        );

    } else {

        creerLigneIngredient();
    }
}


/* =================================
   CHARGER UNE RECETTE
   EN MODIFICATION
================================= */

async function chargerRecetteAModifier() {

    if (
        !modeModification
    ) {

        /*
            Nouvelle recette :
            on démarre avec trois
            lignes de type ingrédient.
        */

        creerLigneIngredient();
        creerLigneIngredient();
        creerLigneIngredient();


        photosExistantes =
            [];


        photosASupprimer =
            [];


        nouvellesPhotos =
            [];


        ordrePhotos =
            [];


        ordrePhotosModifie =
            false;


        afficherApercuPhotos();


        return;
    }


    document.title =
        "Modifier une recette | À notre table";


    const titreFormulaire =
        document.querySelector(
            ".entete-formulaire h1"
        );


    if (
        titreFormulaire
    ) {

        titreFormulaire.textContent =
            "Modifier la recette";
    }


    const texteEntete =
        document.querySelector(
            ".entete-formulaire p"
        );


    if (
        texteEntete
    ) {

        texteEntete.textContent =
            "Modifie les informations puis enregistre les changements.";
    }


    boutonEnregistrer.textContent =
        "Enregistrer les modifications";


    messageFormulaire.textContent =
        "Chargement de la recette…";


    try {

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


        if (
            data.created_by &&
            data.created_by !==
                utilisateurConnecte.id
        ) {

            throw new Error(
                "Vous ne pouvez pas modifier cette recette."
            );
        }


        /*
            Les recettes disponibles
            doivent déjà être chargées
            avant remplirFormulaire().

            Ainsi une ligne ayant
            recette_liee_id affiche
            directement le bon choix
            dans sa liste déroulante.
        */

        remplirFormulaire(
            data
        );


        afficherMessagePhotos(
            "Chargement des photos…"
        );


        await chargerPhotosRecette(
            identifiantRecette
        );


        afficherMessagePhotos(
            ""
        );


        messageFormulaire.textContent =
            "";


    } catch (
        erreur
    ) {

        console.error(
            "Erreur pendant le chargement :",
            erreur
        );


        messageFormulaire.textContent =
            erreur.message ||
            "Impossible de charger la recette.";


        boutonEnregistrer.disabled =
            true;


        afficherMessagePhotos(
            erreur.message ||
            "Impossible de charger les photos.",
            "erreur"
        );
    }
}


/* =================================
   AJOUTER UNE RECETTE
================================= */

async function ajouterRecette(
    recette
) {

    const recetteAvecCreateur = {

        ...recette,

        created_by:
            utilisateurConnecte.id

    };


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "recettes"
            )
            .insert(
                recetteAvecCreateur
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


    return data;
}


/* =================================
   MODIFIER UNE RECETTE
================================= */

async function modifierRecette(
    recette
) {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "recettes"
            )
            .update(
                recette
            )
            .eq(
                "id",
                identifiantRecette
            )
            .eq(
                "created_by",
                utilisateurConnecte.id
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


    return data;
}


/* =================================
   AJOUTER UNE LIGNE
================================= */

if (
    boutonAjouterIngredient
) {

    boutonAjouterIngredient.addEventListener(
        "click",
        function () {

            creerLigneIngredient();
        }
    );
}

/* =================================
   VÉRIFIER LES PHOTOS
================================= */

function verifierPhotosAvantEnregistrement() {

    const nombre =
        obtenirNombrePhotosActuelles();


    if (
        nombre >
        NOMBRE_MAX_PHOTOS
    ) {

        throw new Error(
            `Une recette ne peut pas contenir plus de ${NOMBRE_MAX_PHOTOS} photos.`
        );
    }


    return true;
}


/* =================================
   VERROUILLER LES COMPOSANTS
================================= */

function verrouillerComposantsRecette(
    verrouille
) {

    if (
        !conteneurIngredients
    ) {

        return;
    }


    const elements =
        conteneurIngredients
            .querySelectorAll(
                `
                .ingredient-quantite,
                .ingredient-unite,
                .ingredient-type,
                .ingredient-nom,
                .ingredient-recette,
                .ingredient-proportionnel,
                .supprimer-ingredient
                `
            );


    elements.forEach(
        function (
            element
        ) {

            /*
                Quand on déverrouille,
                ingredient-nom et
                ingredient-recette doivent
                retrouver leur état selon
                le type de ligne.

                On ne les réactive donc
                pas brutalement ici.
            */

            if (
                !verrouille &&
                (
                    element.classList.contains(
                        "ingredient-nom"
                    ) ||
                    element.classList.contains(
                        "ingredient-recette"
                    )
                )
            ) {

                return;
            }


            element.disabled =
                verrouille;
        }
    );


    if (
        !verrouille
    ) {

        const lignes =
            conteneurIngredients
                .querySelectorAll(
                    ".ligne-ingredient"
                );


        lignes.forEach(
            function (
                ligne
            ) {

                mettreAJourTypeLigneIngredient(
                    ligne
                );
            }
        );
    }
}


/* =================================
   VERROUILLER LA ZONE PHOTOS
================================= */

function verrouillerPhotos(
    verrouille
) {

    if (
        boutonAjouterPhotos
    ) {

        boutonAjouterPhotos.disabled =
            verrouille ||
            obtenirNombrePhotosActuelles() >=
                NOMBRE_MAX_PHOTOS;
    }


    if (
        inputPhotosRecette
    ) {

        inputPhotosRecette.disabled =
            verrouille;
    }


    if (
        apercuPhotosRecette
    ) {

        const boutons =
            apercuPhotosRecette
                .querySelectorAll(
                    `
                    .supprimer-photo-recette,
                    .deplacer-photo-recette
                    `
                );


        boutons.forEach(
            function (
                bouton
            ) {

                bouton.disabled =
                    verrouille ||
                    bouton.hasAttribute(
                        "data-desactive-position"
                    );
            }
        );


        const photos =
            apercuPhotosRecette
                .querySelectorAll(
                    ".apercu-photo-recette"
                );


        photos.forEach(
            function (
                photo
            ) {

                if (
                    verrouille
                ) {

                    photo.setAttribute(
                        "draggable",
                        "false"
                    );

                } else {

                    photo.setAttribute(
                        "draggable",
                        "true"
                    );
                }
            }
        );
    }
}


/* =================================
   ÉTAT ENREGISTREMENT
================================= */

function mettreFormulaireEnEnregistrement(
    actif
) {

    boutonEnregistrer.disabled =
        actif;


    verrouillerPhotos(
        actif
    );


    verrouillerComposantsRecette(
        actif
    );


    if (
        boutonAjouterIngredient
    ) {

        boutonAjouterIngredient.disabled =
            actif;
    }


    if (
        actif
    ) {

        boutonEnregistrer.textContent =
            modeModification
                ? "Modification…"
                : "Enregistrement…";

    } else {

        boutonEnregistrer.textContent =
            modeModification
                ? "Enregistrer les modifications"
                : "Enregistrer la recette";
    }
}


/* =================================
   ENREGISTRER RECETTE + PHOTOS
================================= */

async function enregistrerRecetteComplete() {

    if (
        !utilisateurConnecte
    ) {

        throw new Error(
            "Vous devez être connecté pour enregistrer une recette."
        );
    }


    if (
        !foyerId
    ) {

        throw new Error(
            "Impossible de déterminer votre foyer."
        );
    }


    verifierPhotosAvantEnregistrement();


    /*
        construireRecette() construit
        maintenant une liste pouvant
        contenir :

        - des ingrédients classiques ;
        - des recettes utilisées comme
          composants.

        recette_liee_id === null
        => ingrédient

        recette_liee_id !== null
        => recette
    */

    const recette =
        construireRecette();


    /* =========================
       1. RECETTE
    ========================= */

    messageFormulaire.textContent =
        modeModification
            ? "Modification de la recette…"
            : "Création de la recette…";


    const recetteEnregistree =
        modeModification
            ? await modifierRecette(
                recette
            )
            : await ajouterRecette(
                recette
            );


    if (
        !recetteEnregistree ||
        !recetteEnregistree.id
    ) {

        throw new Error(
            "La recette a été enregistrée mais son identifiant est introuvable."
        );
    }


    /* =========================
       2. PHOTOS
    ========================= */

    if (
        photosOntEteModifiees()
    ) {

        messageFormulaire.textContent =
            ordrePhotosModifie &&
            nouvellesPhotos.length ===
                0 &&
            photosASupprimer.length ===
                0
                ? "Enregistrement de l’ordre des photos…"
                : "Enregistrement des photos…";


        await enregistrerPhotosRecette(
            recetteEnregistree.id
        );
    }


    /* =========================
       3. SUCCÈS
    ========================= */

    messageFormulaire.textContent =
        modeModification
            ? "La recette a bien été modifiée."
            : "La recette a bien été enregistrée.";


    afficherMessagePhotos(
        ""
    );


    return recetteEnregistree;
}


/* =================================
   SOUMISSION DU FORMULAIRE
================================= */

formulaire.addEventListener(
    "submit",
    async function (
        evenement
    ) {

        evenement.preventDefault();


        if (
            boutonEnregistrer.disabled
        ) {

            return;
        }


        messageFormulaire.textContent =
            "";


        afficherMessagePhotos(
            ""
        );


        mettreFormulaireEnEnregistrement(
            true
        );


        try {

            const recetteEnregistree =
                await enregistrerRecetteComplete();


            await new Promise(
                function (
                    resolve
                ) {

                    setTimeout(
                        resolve,
                        500
                    );
                }
            );


            window.location.href =
                `recette.html?id=${encodeURIComponent(
                    recetteEnregistree.id
                )}`;


        } catch (
            erreur
        ) {

            console.error(
                "Erreur pendant l'enregistrement de la recette :",
                erreur
            );


            messageFormulaire.textContent =
                erreur?.message ||
                "Une erreur est survenue pendant l'enregistrement.";


            if (
                photosOntEteModifiees()
            ) {

                afficherMessagePhotos(
                    erreur?.message ||
                    "Impossible d'enregistrer les photos.",
                    "erreur"
                );
            }


            mettreFormulaireEnEnregistrement(
                false
            );
        }
    }
);


/* =================================
   NETTOYAGE DES APERÇUS LOCAUX
================================= */

function nettoyerApercusPhotosLocales() {

    nouvellesPhotos.forEach(
        function (
            photo
        ) {

            if (
                photo.urlApercu
            ) {

                try {

                    URL.revokeObjectURL(
                        photo.urlApercu
                    );

                } catch (
                    erreur
                ) {

                    console.warn(
                        "Impossible de libérer l'aperçu de la photo :",
                        erreur
                    );
                }
            }
        }
    );
}


/* =================================
   QUITTER LA PAGE
================================= */

window.addEventListener(
    "pagehide",
    function () {

        nettoyerApercusPhotosLocales();
    }
);


/* =================================
   INITIALISATION DES PHOTOS
================================= */

function initialiserInterfacePhotos() {

    if (
        !inputPhotosRecette ||
        !boutonAjouterPhotos ||
        !apercuPhotosRecette ||
        !compteurPhotosRecette
    ) {

        console.warn(
            "Certains éléments HTML nécessaires aux photos sont absents."
        );


        return;
    }


    mettreAJourCompteurPhotos();


    apercuPhotosRecette.hidden =
        true;


    afficherMessagePhotos(
        ""
    );
}


/* =================================
   INITIALISATION GÉNÉRALE
================================= */

async function initialiserPageAjout() {

    boutonEnregistrer.disabled =
        true;


    initialiserInterfacePhotos();


    try {

        /* =========================
           1. UTILISATEUR
        ========================= */

        utilisateurConnecte =
            await recupererUtilisateurConnecte();


        if (
            !utilisateurConnecte
        ) {

            return;
        }


        /* =========================
           2. FOYER
        ========================= */

        const foyer =
            await recupererFoyerUtilisateur();


        if (
            !foyer
        ) {

            return;
        }


        /* =========================
           3. RECETTES DISPONIBLES
        ========================= */

        /*
            La liste doit être chargée
            AVANT la création des lignes.

            Sinon une ligne de type
            "Recette" aurait un select
            vide.
        */

        messageFormulaire.textContent =
            "Chargement des recettes disponibles…";


        await chargerRecettesDisponiblesPourLiaison();


        /* =========================
           4. CRÉATION / MODIFICATION
        ========================= */

        await chargerRecetteAModifier();


        /* =========================
           5. RAFRAÎCHIR LES SELECTS
        ========================= */

        rafraichirSelectsRecettesLiees();


        /*
            On remet également chaque
            ligne dans son bon état
            visuel.

            - Ingrédient = champ texte
            - Recette = liste déroulante
        */

        const lignes =
            conteneurIngredients
                .querySelectorAll(
                    ".ligne-ingredient"
                );


        lignes.forEach(
            function (
                ligne
            ) {

                mettreAJourTypeLigneIngredient(
                    ligne
                );
            }
        );


        boutonEnregistrer.disabled =
            false;


        mettreAJourCompteurPhotos();


        messageFormulaire.textContent =
            "";


        console.log(
            "Page recette initialisée :",
            {

                modeModification:
                    modeModification,

                recetteId:
                    identifiantRecette,

                foyerId:
                    foyerId,

                recettesDisponibles:
                    recettesDisponiblesPourLiaison.length,

                composants:
                    conteneurIngredients
                        .querySelectorAll(
                            ".ligne-ingredient"
                        )
                        .length,

                photosExistantes:
                    photosExistantes.length,

                ordrePhotos:
                    ordrePhotos

            }
        );


    } catch (
        erreur
    ) {

        console.error(
            "Erreur initialisation page recette :",
            erreur
        );


        messageFormulaire.textContent =
            erreur?.message ||
            "Impossible de préparer le formulaire.";


        boutonEnregistrer.disabled =
            true;
    }
}


/* =================================
   DÉMARRAGE
================================= */

initialiserPageAjout();
