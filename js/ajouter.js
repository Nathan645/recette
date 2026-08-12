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
    parametres.get("id");


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
    depuis le téléphone / ordinateur.

    Chaque élément aura cette forme :

    {
        idLocal: "...",
        fichier: File,
        urlApercu: "blob:...",
        ordre: 1
    }
*/

let nouvellesPhotos =
    [];


/*
    Photos déjà présentes dans Supabase
    lorsqu'on modifie une recette.

    {
        id: "...",
        chemin: "...",
        ordre: 1,
        url: "..."
    }
*/

let photosExistantes =
    [];


/*
    Photos existantes que l'utilisateur
    a demandé de supprimer.

    On ne les supprime réellement
    qu'au moment d'enregistrer la recette.

    Ça évite qu'un clic accidentel
    supprime immédiatement une photo.
*/

let photosASupprimer =
    [];


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


    if (error) {
        throw error;
    }


    if (!data.user) {

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

    if (!utilisateurConnecte) {

        return null;
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("membres_foyer")
            .select("foyer_id")
            .eq(
                "user_id",
                utilisateurConnecte.id
            )
            .limit(1)
            .maybeSingle();


    if (error) {
        throw error;
    }


    if (!data) {

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
                    valeurs.proportionnel === false
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
                lignes.length === 1
            ) {

                ligne
                    .querySelector(
                        ".ingredient-quantite"
                    )
                    .value = "";


                ligne
                    .querySelector(
                        ".ingredient-unite"
                    )
                    .value = "";


                ligne
                    .querySelector(
                        ".ingredient-nom"
                    )
                    .value = "";


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
        .split("\n")
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
                    ligne !== ""
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
        texte === ""
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
                quantiteTexte.trim() === "" &&
                unite === "" &&
                nom === "";


            if (
                ligneVide
            ) {

                return;
            }


            if (
                nom === ""
            ) {

                throw new Error(
                    "Chaque ingrédient doit avoir un nom."
                );
            }


            ingredients.push({

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

            });
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


    if (!champ) {

        return "publique";
    }


    if (
        champ.value !== "publique" &&
        champ.value !== "foyer"
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
        etapes.length === 0
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


    if (!nom) {

        throw new Error(
            "Renseigne le nom de la recette."
        );
    }


    const visibilite =
        recupererVisibilite();


    if (
        visibilite === "foyer" &&
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
    Nombre total de photos qui resteront
    sur la recette si on enregistrait
    maintenant.
*/

function obtenirNombrePhotosActuelles() {

    return (
        photosExistantes.length +
        nouvellesPhotos.length
    );
}


/*
    Met à jour le compteur 0 / 5,
    1 / 5, etc.
*/

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


    /*
        Une fois 5 photos atteintes,
        on empêche d'en ajouter davantage.
    */

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
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2)
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


    /*
        On accepte uniquement
        les fichiers image.
    */

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
        Limite de sécurité avant compression.

        Les photos de téléphone peuvent
        être lourdes.

        On accepte jusqu'à 25 Mo en entrée,
        puis on les compressera avant Supabase.
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
        liste.length === 0
    ) {

        return;
    }


    const placesDisponibles =
        NOMBRE_MAX_PHOTOS -
        obtenirNombrePhotosActuelles();


    if (
        placesDisponibles <= 0
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
        Très important :
        permet de sélectionner à nouveau
        exactement le même fichier ensuite.
    */

    inputPhotosRecette.value =
        "";
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
                    element.idLocal ===
                    idLocal
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
                    element.idLocal !==
                    idLocal
                );
            }
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


    photosASupprimer.push(
        photo
    );


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
        [

            ...photosExistantes.map(
                function (
                    photo
                ) {

                    return {

                        type:
                            "existante",

                        id:
                            photo.id,

                        url:
                            photo.url,

                        nom:
                            "Photo de la recette"

                    };
                }
            ),

            ...nouvellesPhotos.map(
                function (
                    photo
                ) {

                    return {

                        type:
                            "nouvelle",

                        id:
                            photo.idLocal,

                        url:
                            photo.urlApercu,

                        nom:
                            photo.fichier.name

                    };
                }
            )

        ];


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

                    return `

                        <div
                            class="apercu-photo-recette"
                        >

                            <img
                                src="${photo.url}"
                                alt="Photo ${index + 1} de la recette"
                            >

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
   CLIC SUPPRIMER PHOTO
================================= */

if (
    apercuPhotosRecette
) {

    apercuPhotosRecette.addEventListener(
        "click",
        function (
            evenement
        ) {

            const bouton =
                evenement.target.closest(
                    ".supprimer-photo-recette"
                );


            if (
                !bouton
            ) {

                return;
            }


            const type =
                bouton.dataset.typePhoto;


            const id =
                bouton.dataset.photoId;


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
            }
        }
    );
}

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
        Charge l'image dans le navigateur.
    */

    const image =
        await chargerImageDepuisFichier(
            fichier
        );


    /*
        On limite le plus grand côté
        à 1600 px.

        C'est largement suffisant pour
        une fiche recette.
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

        Utile notamment si un PNG
        transparent est converti en JPEG.
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
        On privilégie WebP quand
        le navigateur sait l'encoder.

        Sinon JPEG.

        Ici on part sur JPEG pour
        maximiser la compatibilité
        entre Safari / iPhone / Android.
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
        Si l'image reste encore lourde,
        on réduit progressivement
        la qualité.

        Objectif :
        environ 1,5 Mo maximum.
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
        On crée un vrai File pour
        Supabase Storage.
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
        Correspond exactement
        à la structure prévue :

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
        error
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
        error
    ) {

        throw error;
    }


    return {

        chemin:
            chemin,

        ordre:
            index + 1

    };
}


/* =================================
   INSÉRER PHOTO EN BASE
================================= */

async function enregistrerPhotoEnBase(
    recetteId,
    photo
) {

    const {
        error
    } =
        await window.supabaseClient
            .from(
                "recette_photos"
            )
            .insert({

                recette_id:
                    recetteId,

                chemin:
                    photo.chemin,

                ordre:
                    photo.ordre,

                created_by:
                    utilisateurConnecte.id

            });


    if (
        error
    ) {

        throw error;
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
        Les nouvelles photos arrivent
        après celles déjà conservées.
    */

    const ordreDepart =
        photosExistantes.length;


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


        /*
            Une fois le fichier
            bien arrivé dans Storage,
            on crée la ligne SQL.
        */

        const {
            error:
                erreurBase
        } =
            await window.supabaseClient
                .from(
                    "recette_photos"
                )
                .insert({

                    recette_id:
                        recetteId,

                    chemin:
                        chemin,

                    ordre:
                        ordreDepart +
                        index +
                        1,

                    created_by:
                        utilisateurConnecte.id

                });


        if (
            erreurBase
        ) {

            /*
                Si l'insertion SQL échoue,
                on essaie de nettoyer
                le fichier déjà uploadé.

                Ça évite les fichiers
                orphelins dans Storage.
            */

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


            throw erreurBase;
        }
    }


    afficherMessagePhotos(
        nouvellesPhotos.length === 1
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

        On utilise donc une signed URL
        temporaire uniquement pour
        afficher l'aperçu dans le formulaire.

        Durée : 1 heure.
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
        Signed URLs en parallèle.
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
            la ligne en base.

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
   RÉORDONNER LES PHOTOS
================================= */

async function enregistrerOrdrePhotos(
    recetteId
) {

    /*
        Après suppression + upload,
        on recharge les photos et
        remet un ordre propre :
        1, 2, 3, 4, 5.
    */

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


    const photos =
        Array.isArray(
            data
        )
            ? data
            : [];


    for (
        let index = 0;
        index <
            photos.length;
        index++
    ) {

        const nouvelOrdre =
            index + 1;


        if (
            photos[index].ordre ===
            nouvelOrdre
        ) {

            continue;
        }


        const {
            error:
                erreurOrdre
        } =
            await window.supabaseClient
                .from(
                    "recette_photos"
                )
                .update({

                    ordre:
                        nouvelOrdre

                })
                .eq(
                    "id",
                    photos[index].id
                );


        if (
            erreurOrdre
        ) {

            throw erreurOrdre;
        }
    }
}


/* =================================
   SYNCHRONISER TOUTES LES PHOTOS
================================= */

async function enregistrerPhotosRecette(
    recetteId
) {

    /*
        Étape 1 :
        supprimer celles retirées.
    */

    await supprimerPhotosRetirees();


    /*
        Étape 2 :
        envoyer les nouvelles.
    */

    await uploaderNouvellesPhotos(
        recetteId
    );


    /*
        Étape 3 :
        remettre les ordres au propre.
    */

    await enregistrerOrdrePhotos(
        recetteId
    );


    /*
        Important :
        après réussite, on vide
        les nouvelles photos locales.
    */

    nouvellesPhotos.forEach(
        function (
            photo
        ) {

            if (
                photo.urlApercu
            ) {

                URL.revokeObjectURL(
                    photo.urlApercu
                );
            }
        }
    );


    nouvellesPhotos =
        [];
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
        visibilite === "foyer"
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


    /*
        Visibilité.

        Les anciennes recettes
        qui n'ont pas encore ce champ
        restent publiques.
    */

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
            quelques lignes d'ingrédients
            prêtes à remplir.
        */

        creerLigneIngredient();

        creerLigneIngredient();

        creerLigneIngredient();


        /*
            Pas de photos existantes.
        */

        photosExistantes =
            [];

        photosASupprimer =
            [];

        nouvellesPhotos =
            [];


        afficherApercuPhotos();


        return;
    }


    document.title =
        "Modifier une recette | À notre table";


    document
        .querySelector(
            ".entete-formulaire h1"
        )
        .textContent =
            "Modifier la recette";


    document
        .querySelector(
            ".entete-formulaire p"
        )
        .textContent =
            "Modifie les informations puis enregistre les changements.";


    boutonEnregistrer
        .textContent =
            "Enregistrer les modifications";


    messageFormulaire
        .textContent =
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


        /*
            Seul le créateur peut
            modifier la recette.

            La RLS Supabase reste
            également la vraie sécurité.
        */

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
            Remplissage classique.
        */

        remplirFormulaire(
            data
        );


        /*
            Puis récupération
            des photos existantes.
        */

        afficherMessagePhotos(
            "Chargement des photos…"
        );


        await chargerPhotosRecette(
            identifiantRecette
        );


        afficherMessagePhotos(
            ""
        );


        messageFormulaire
            .textContent =
                "";


    } catch (
        erreur
    ) {

        console.error(
            "Erreur pendant le chargement :",
            erreur
        );


        messageFormulaire
            .textContent =
                erreur.message ||
                "Impossible de charger la recette.";


        boutonEnregistrer
            .disabled =
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

    /*
        Le créateur est ajouté
        uniquement lors de la création.
    */

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

    /*
        created_by n'est volontairement
        PAS modifié.

        Le créateur original reste
        propriétaire de la recette.

        foyer_id et visibilite peuvent
        en revanche être modifiés :
        publique <-> foyer.
    */

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
   AVANT ENREGISTREMENT
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


    /*
        Une recette peut parfaitement
        ne contenir aucune photo.
    */

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

        const boutonsSuppression =
            apercuPhotosRecette
                .querySelectorAll(
                    ".supprimer-photo-recette"
                );


        boutonsSuppression.forEach(
            function (
                bouton
            ) {

                bouton.disabled =
                    verrouille;
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


    /*
        Validation générale.
    */

    verifierPhotosAvantEnregistrement();


    const recette =
        construireRecette();


    /*
        1. Enregistrer les données
           principales de la recette.
    */

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


    /*
        2. Photos.

        À partir d'ici la recette existe
        forcément dans Supabase.
    */

    const nombreModificationsPhotos =
        nouvellesPhotos.length +
        photosASupprimer.length;


    if (
        nombreModificationsPhotos >
        0
    ) {

        messageFormulaire.textContent =
            "Enregistrement des photos…";


        await enregistrerPhotosRecette(
            recetteEnregistree.id
        );
    }


    /*
        3. Succès.
    */

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


        /*
            Évite un double clic pendant
            un enregistrement déjà en cours.
        */

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

            /*
                Cette fonction s'occupe maintenant
                de TOUT :

                1. construire la recette
                2. créer / modifier la recette
                3. supprimer les anciennes photos retirées
                4. compresser les nouvelles photos
                5. envoyer les nouvelles photos
                6. enregistrer recette_photos
            */

            const recetteEnregistree =
                await enregistrerRecetteComplete();


            /*
                On attend volontairement un petit
                instant pour que l'utilisateur
                puisse voir la confirmation.
            */

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


            /*
                La redirection arrive UNIQUEMENT
                lorsque recette + photos ont été
                correctement enregistrées.
            */

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


            /*
                Si l'erreur concerne probablement
                Storage / recette_photos, on affiche
                également le message près des photos.
            */

            if (
                nouvellesPhotos.length >
                    0 ||
                photosASupprimer.length >
                    0
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


    /*
        Au chargement :
        0 / 5 pour une nouvelle recette.

        En modification, chargerRecetteAModifier()
        remplacera ensuite cette valeur.
    */

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

    /*
        Pendant l'initialisation,
        on évite que l'utilisateur
        enregistre trop tôt.
    */

    boutonEnregistrer.disabled =
        true;


    initialiserInterfacePhotos();


    try {

        /*
            1. Utilisateur connecté
        */

        utilisateurConnecte =
            await recupererUtilisateurConnecte();


        if (
            !utilisateurConnecte
        ) {

            return;
        }


        /*
            2. Foyer
        */

        const foyer =
            await recupererFoyerUtilisateur();


        if (
            !foyer
        ) {

            return;
        }


        /*
            3. Nouvelle recette
               OU recette à modifier.

            En modification,
            chargerRecetteAModifier()
            récupère également les photos.
        */

        await chargerRecetteAModifier();


        /*
            Tout est prêt.
        */

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
                    photosExistantes.length

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
