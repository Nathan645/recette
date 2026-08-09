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


let utilisateurConnecte =
    null;


/* =================================
   UTILISATEUR
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
                    .checked = true;

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
            function (ligne) {

                return ligne.trim();

            }
        )
        .filter(
            function (ligne) {

                return ligne !== "";

            }
        );
}


function recupererCasesCochees(
    nom
) {

    return Array.from(
        document.querySelectorAll(
            `input[name="${nom}"]:checked`
        )
    ).map(
        function (caseCochee) {

            return caseCochee.value;

        }
    );
}


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
        function (ligne) {

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
        ingredients.length === 0
    ) {

        throw new Error(
            "Ajoute au moins un ingrédient."
        );

    }


    return ingredients;
}


/* =================================
   CONSTRUIRE LA RECETTE
================================= */

function construireRecette() {

    const etapes =
        transformerEnListe(
            document.getElementById(
                "etapes"
            ).value
        );


    if (
        etapes.length === 0
    ) {

        throw new Error(
            "Ajoute au moins une étape."
        );

    }


    const categorie =
        document.getElementById(
            "categorie"
        ).value;


    const nom =
        document.getElementById(
            "nom"
        )
            .value
            .trim();


    if (!nom) {

        throw new Error(
            "Renseigne le nom de la recette."
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
                .trim()

    };
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
        function (caseCochee) {

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
            recette.nom || "";


    document
        .getElementById(
            "categorie"
        )
        .value =
            recette.categorie || "";


    document
        .getElementById(
            "description"
        )
        .value =
            recette.description || "";


    document
        .getElementById(
            "preparation"
        )
        .value =
            recette.preparation ?? "";


    document
        .getElementById(
            "cuisson"
        )
        .value =
            recette.cuisson ?? "";


    document
        .getElementById(
            "personnes"
        )
        .value =
            recette.personnes ?? "";


    document
        .getElementById(
            "difficulte"
        )
        .value =
            recette.difficulte || "";


    document
        .getElementById(
            "etapes"
        )
        .value =
            Array.isArray(
                recette.etapes
            )
                ? recette.etapes.join(
                    "\n"
                )
                : "";


    document
        .getElementById(
            "astuce"
        )
        .value =
            recette.astuce || "";


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
        .innerHTML = "";


    if (
        Array.isArray(
            recette.ingredients
        ) &&
        recette.ingredients.length > 0
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

        creerLigneIngredient();
        creerLigneIngredient();
        creerLigneIngredient();

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


        if (error) {
            throw error;
        }


        if (!data) {

            throw new Error(
                "Cette recette n’existe pas."
            );

        }


        /*
            Si la recette possède déjà
            un créateur, seul celui-ci
            peut accéder au formulaire
            de modification.

            Les anciennes recettes
            sans created_by restent
            modifiables pour l'instant.
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


        remplirFormulaire(
            data
        );


        messageFormulaire
            .textContent =
                "";


    } catch (erreur) {

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


    if (error) {
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
        PAS modifié ici.

        Le créateur original reste donc
        propriétaire de la recette.
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
   ENREGISTREMENT
================================= */

formulaire.addEventListener(
    "submit",
    async function (
        evenement
    ) {

        evenement.preventDefault();


        messageFormulaire
            .textContent =
                modeModification
                    ? "Modification en cours…"
                    : "Enregistrement en cours…";


        boutonEnregistrer
            .disabled =
                true;


        boutonEnregistrer
            .textContent =
                modeModification
                    ? "Modification…"
                    : "Enregistrement…";


        try {

            if (
                !utilisateurConnecte
            ) {

                throw new Error(
                    "Vous devez être connecté pour enregistrer une recette."
                );

            }


            const recette =
                construireRecette();


            const recetteEnregistree =
                modeModification
                    ? await modifierRecette(
                        recette
                    )
                    : await ajouterRecette(
                        recette
                    );


            messageFormulaire
                .textContent =
                    modeModification
                        ? "La recette a bien été modifiée."
                        : "La recette a bien été enregistrée.";


            window.location.href =
                `recette.html?id=${
                    encodeURIComponent(
                        recetteEnregistree.id
                    )
                }`;


        } catch (erreur) {

            console.error(
                "Erreur pendant l’enregistrement :",
                erreur
            );


            messageFormulaire
                .textContent =
                    erreur.message ||
                    "Impossible d’enregistrer la recette.";


            boutonEnregistrer
                .disabled =
                    false;


            boutonEnregistrer
                .textContent =
                    modeModification
                        ? "Enregistrer les modifications"
                        : "Enregistrer la recette";

        }

    }
);


/* =================================
   DÉMARRAGE
================================= */

async function initialiserPage() {

    try {

        utilisateurConnecte =
            await recupererUtilisateurConnecte();


        if (
            !utilisateurConnecte
        ) {

            return;

        }


        await chargerRecetteAModifier();


    } catch (erreur) {

        console.error(
            "Erreur d'initialisation :",
            erreur
        );


        messageFormulaire
            .textContent =
                erreur.message ||
                "Impossible de charger la page.";


        boutonEnregistrer
            .disabled =
                true;

    }
}


initialiserPage();
