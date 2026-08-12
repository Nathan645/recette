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
   ÉTAT DES PHOTOS
================================= */

/*
    Maximum de photos autorisées
    par recette.
*/

const NOMBRE_MAX_PHOTOS =
    5;


/*
    Nouvelles photos choisies
    depuis le téléphone ou
    l'ordinateur.

    Structure :

    {
        idLocal: "...",
        fichier: File,
        urlApercu: "blob:..."
    }
*/

let nouvellesPhotos =
    [];


/*
    Photos déjà présentes dans
    Supabase en modification.

    Structure :

    {
        id: "...",
        recette_id: "...",
        chemin: "...",
        ordre: 1,
        created_by: "...",
        url: "..."
    }
*/

let photosExistantes =
    [];


/*
    Photos existantes que
    l'utilisateur souhaite retirer.

    La suppression réelle se fait
    uniquement à l'enregistrement.
*/

let photosASupprimer =
    [];


/*
    =================================
    ORDRE GLOBAL DES PHOTOS
    =================================

    C'est désormais CETTE liste
    qui détermine l'ordre visuel
    des photos.

    Elle permet de mélanger
    librement :

    - photos déjà enregistrées ;
    - nouvelles photos.

    Exemple :

    [
        {
            type: "existante",
            id: "abc"
        },
        {
            type: "nouvelle",
            id: "local-123"
        },
        {
            type: "existante",
            id: "def"
        }
    ]

    La première entrée correspond
    à la photo principale.
*/

let ordrePhotos =
    [];


/*
    Indique si l'utilisateur
    a réellement changé l'ordre.

    Cela permet d'enregistrer
    l'ordre même s'il n'a ajouté
    ou supprimé aucune photo.
*/

let ordrePhotosModifie =
    false;


/*
    Photo actuellement déplacée
    lors d'un drag & drop.
*/

let photoEnCoursDeDrag =
    null;


/*
    Données utilisées pour
    le déplacement tactile.
*/

let photoTactileEnCours =
    null;


let elementTactileEnCours =
    null;


/* =================================
   OUTILS POUR L'ORDRE DES PHOTOS
================================= */

/*
    Génère une clé unique pour
    identifier une photo dans
    ordrePhotos.
*/

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
        id ===
            null ||
        id ===
            undefined
    ) {

        return;
    }


    const dejaPresente =
        trouverIndexPhotoOrdre(
            type,
            id
        ) !==
        -1;


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

/*
    Supprime de ordrePhotos les
    références qui ne correspondent
    plus à une vraie photo.

    Cela sert notamment après
    suppression d'une photo.
*/

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


    /*
        Sécurité :
        si une photo existe mais n'est
        pas encore présente dans
        ordrePhotos, on l'ajoute à la fin.
    */

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
        indexDepart <
            0 ||
        indexArrivee <
            0 ||
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
        index ===
        -1
    ) {

        return;
    }


    const nouvelIndex =
        direction ===
        "gauche"
            ? index - 1
            : index + 1;


    if (
        nouvelIndex <
            0 ||
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
   INGRÉDIENTS
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


    ligne.innerHTML = `

        <input
            type="text"
            inputmode="decimal"
            class="ingredient-quantite"
            aria-label="Quantité de l’ingrédient"
            placeholder="Ex. 400"
            value="${valeurs.quantite ?? ""}"
        >

        <input
            type="text"
            class="ingredient-unite"
            aria-label="Unité de l’ingrédient"
            placeholder="g, ml…"
            value="${valeurs.unite ?? ""}"
        >

        <input
            type="text"
            class="ingredient-nom"
            aria-label="Nom de l’ingrédient"
            placeholder="Ex. farine"
            required
            value="${valeurs.nom ?? ""}"
        >

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
            aria-label="Supprimer cet ingrédient"
            title="Supprimer cet ingrédient"
        >
            ×
        </button>

    `;


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


            /*
                On conserve toujours
                au moins une ligne.
            */

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
                        ".ingredient-proportionnel"
                    )
                    .checked =
                        true;


                return;
            }


            ligne.remove();
        }
    );


    conteneurIngredients
        .appendChild(
            ligne
        );
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
        nombre <
            0
    ) {

        throw new Error(
            `La quantité « ${valeur} » n’est pas valide.`
        );
    }


    return nombre;
}


/* =================================
   RÉCUPÉRER LES INGRÉDIENTS
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


            const nom =
                ligne
                    .querySelector(
                        ".ingredient-nom"
                    )
                    .value
                    .trim();


            const proportionnel =
                ligne
                    .querySelector(
                        ".ingredient-proportionnel"
                    )
                    .checked;


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
                        proportionnel

                }
            );
        }
    );


    if (
        ingredients.length ===
        0
    ) {

        throw new Error(
            "Ajoute au moins un ingrédient."
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
        transformerEnListe(
            document
                .getElementById(
                    "etapes"
                )
                .value
        );


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

/*
    Nombre total de photos
    actuellement conservées.
*/

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


    /*
        On accepte jusqu'à 25 Mo
        avant compression.
    */

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


                /*
                    La nouvelle photo est
                    ajoutée à la fin de l'ordre
                    actuel.
                */

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


    /*
        Permet de sélectionner
        de nouveau le même fichier.
    */

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


    /*
        On évite d'ajouter deux fois
        la même photo à la liste
        des suppressions.
    */

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

            /* =========================
               SUPPRESSION
            ========================= */

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


            /* =========================
               DÉPLACEMENT GAUCHE
            ========================= */

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


            /* =========================
               DÉPLACEMENT DROITE
            ========================= */

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

    /* =========================
       DÉBUT DU DRAG
    ========================= */

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


                /*
                    Safari préfère souvent
                    avoir une donnée explicite.
                */

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


    /* =========================
       DRAG AU-DESSUS
    ========================= */

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


    /* =========================
       DROP
    ========================= */

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


    /* =========================
       FIN DU DRAG
    ========================= */

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

    /* =========================
       DÉBUT TOUCH
    ========================= */

    apercuPhotosRecette.addEventListener(
        "touchstart",
        function (
            evenement
        ) {

            /*
                On ne lance pas le drag
                si on appuie sur un bouton.
            */

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


    /* =========================
       DÉPLACEMENT TOUCH
    ========================= */

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
                indexDepart ===
                    -1 ||
                !Number.isInteger(
                    indexArrivee
                ) ||
                indexDepart ===
                    indexArrivee
            ) {

                return;
            }


            /*
                Réorganisation instantanée
                pendant le déplacement.
            */

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


            /*
                On réaffiche pour que la position
                visuelle suive le doigt.
            */

            afficherApercuPhotos();

        },
        {
            passive:
                true
        }
    );


    /* =========================
       FIN TOUCH
    ========================= */

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

/*
    Lorsqu'une nouvelle photo est
    sélectionnée, elle possède seulement
    un idLocal.

    Après son insertion dans
    recette_photos, Supabase lui donne
    un vrai id.

    Cette Map permettra ensuite
    d'enregistrer l'ordre final.

    idLocal -> id Supabase
*/

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

    /*
        Chargement de la photo
        dans le navigateur.
    */

    const image =
        await chargerImageDepuisFichier(
            fichier
        );


    /*
        Le plus grand côté sera
        limité à 1600 px.
    */

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


    /*
        Fond blanc.

        Utile si une image PNG
        contient de la transparence
        avant conversion en JPEG.
    */

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


    /*
        JPEG pour conserver une très
        bonne compatibilité mobile,
        notamment Safari / iPhone.
    */

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


    /*
        Taille cible :
        environ 1,5 Mo maximum.

        Si nécessaire, on diminue
        progressivement la qualité.
    */

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


    /*
        On transforme ensuite le Blob
        en véritable File.
    */

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


    /*
        Structure :

        foyer_id/
        recette_id/
        fichier.jpg
    */

    return (
        `${foyerId}/` +
        `${recetteId}/` +
        `${nomFichier}`
    );
}


/* =================================
   CALCULER UN ORDRE TEMPORAIRE
================================= */

/*
    Lorsqu'on ajoute une nouvelle photo,
    on ne lui donne volontairement PAS
    directement son ordre final.

    Pourquoi ?

    Exemple :

    Photo A existante
    Nouvelle photo
    Photo B existante

    A possède peut-être déjà ordre = 1
    et B ordre = 2.

    Si on insérait immédiatement
    la nouvelle avec ordre = 2,
    on pourrait créer une collision.

    On utilise donc 1000, 1001...
    puis la partie 4 remettra
    tous les ordres à 1, 2, 3...
*/

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


    /*
        On repart d'une correspondance
        propre à chaque enregistrement.
    */

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

            /* =========================
               STORAGE
            ========================= */

            photoUploadee =
                await uploaderUnePhoto(
                    photo,
                    recetteId,
                    index
                );


            /* =========================
               BASE
            ========================= */

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


            /*
                On mémorise le lien :

                idLocal
                    ↓
                id Supabase

                Il sera utilisé pour
                enregistrer l'ordre final.
            */

            idsNouvellesPhotosEnregistrees.set(
                String(
                    photo.idLocal
                ),
                photoEnregistree.id
            );


        } catch (
            erreur
        ) {

            /*
                Si Storage a fonctionné
                mais pas l'insertion SQL,
                on supprime le fichier
                devenu inutile.
            */

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


    /*
        Le bucket est privé.

        URL temporaire d'une heure
        uniquement pour l'aperçu
        du formulaire.
    */

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


    /*
        Génération des URLs signées
        en parallèle.
    */

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


    /*
        Initialisation de l'ordre global
        avec l'ordre actuellement stocké
        dans Supabase.
    */

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

        /*
            On supprime d'abord
            la ligne SQL.

            Puis le fichier Storage.
        */

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


/* =================================
   CONVERTIR L'ORDRE LOCAL
   EN IDS SUPABASE
================================= */

/*
    Avant enregistrement :

    existante
        -> possède déjà un id Supabase

    nouvelle
        -> possède un idLocal

    Après uploaderNouvellesPhotos(),
    idsNouvellesPhotosEnregistrees
    permet de retrouver son nouvel
    id Supabase.
*/

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

                /*
                    Une photo qui a été retirée
                    ne doit évidemment plus
                    faire partie de l'ordre.
                */

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

/*
    On commence par déplacer toutes
    les photos vers une plage
    temporaire très élevée.

    Exemple :

    10001
    10002
    10003

    Ensuite seulement on remet :

    1
    2
    3

    Cela évite les collisions si
    une contrainte unique existe
    éventuellement sur l'ordre.
*/

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

    /*
        Ordre souhaité par l'utilisateur.
    */

    let idsPhotos =
        construireOrdreFinalSupabase();


    /*
        En mode création, ou dans certains
        cas de sécurité, ordrePhotos peut
        ne pas encore contenir toutes les
        photos réellement présentes.

        On récupère donc les lignes SQL.
    */

    const photosSupabase =
        await recupererPhotosSupabase(
            recetteId
        );


    /*
        Si l'ordre global ne contient
        aucune entrée exploitable,
        on retombe simplement sur
        l'ordre actuellement présent
        en base.
    */

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


    /*
        Sécurité :
        toute photo réellement présente
        en base mais absente de la liste
        finale est ajoutée à la fin.

        Cela évite qu'une photo soit
        "perdue" à cause d'un état local
        incomplet.
    */

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


    /*
        Étape 1 :
        ordres temporaires.
    */

    await appliquerOrdresTemporaires(
        idsPhotos
    );


    /*
        Étape 2 :
        ordre réel 1, 2, 3...
    */

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

    /*
        Les anciennes URLs blob
        des nouvelles photos locales
        ne sont plus nécessaires.
    */

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


    /*
        On recharge ensuite les vraies
        lignes depuis Supabase avec
        le nouvel ordre.
    */

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

    /*
        Important :

        on conserve une copie de
        ordrePhotos AVANT de vider
        les états locaux.

        Elle contient encore les
        références aux nouvelles photos.
    */

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


    /* =========================
       1. SUPPRESSIONS
    ========================= */

    await supprimerPhotosRetirees();


    /* =========================
       2. UPLOAD DES NOUVELLES
    ========================= */

    await uploaderNouvellesPhotos(
        recetteId
    );


    /*
        uploaderNouvellesPhotos()
        a maintenant rempli :

        idsNouvellesPhotosEnregistrees

        On remet l'ordre local choisi
        avant l'enregistrement.
    */

    ordrePhotos =
        ordreAvantEnregistrement;


    /* =========================
       3. ORDRE FINAL
    ========================= */

    await enregistrerOrdrePhotos(
        recetteId
    );


    /* =========================
       4. RECHARGEMENT
    ========================= */

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


    document
        .getElementById(
            "etapes"
        )
        .value =
            Array.isArray(
                recette.etapes
            )
                ? recette.etapes
                    .join(
                        "\n"
                    )
                : "";


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


    conteneurIngredients
        .innerHTML =
            "";


    if (
        Array.isArray(
            recette.ingredients
        ) &&
        recette.ingredients.length >
            0
    ) {

        recette.ingredients
            .forEach(
                creerLigneIngredient
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
            quelques lignes déjà prêtes.
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
   AJOUTER UNE LIGNE INGRÉDIENT
================================= */

boutonAjouterIngredient
    .addEventListener(
        "click",
        function () {

            creerLigneIngredient();
        }
    );


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
           UTILISATEUR
        ========================= */

        utilisateurConnecte =
            await recupererUtilisateurConnecte();


        if (
            !utilisateurConnecte
        ) {

            return;
        }


        /* =========================
           FOYER
        ========================= */

        const foyer =
            await recupererFoyerUtilisateur();


        if (
            !foyer
        ) {

            return;
        }


        /* =========================
           RECETTE
        ========================= */

        await chargerRecetteAModifier();


        boutonEnregistrer.disabled =
            false;


        mettreAJourCompteurPhotos();


        console.log(
            "Page recette initialisée :",
            {

                modeModification:
                    modeModification,

                recetteId:
                    identifiantRecette,

                foyerId:
                    foyerId,

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
