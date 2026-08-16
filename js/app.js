const champRecherche =
    document.getElementById("recherche");

const boutonsCategories =
    document.querySelectorAll(
        "#filtres-categories .filtre"
    );

const boutonsMultiples =
    document.querySelectorAll(
        ".filtre-multiple"
    );

const boutonFavoris =
    document.getElementById(
        "filtre-favoris"
    );

const boutonFiltresAvances =
    document.getElementById(
        "ouvrir-filtres-avances"
    );

const panneauFiltresAvances =
    document.getElementById(
        "panneau-filtres-avances"
    );

const flecheFiltres =
    document.getElementById(
        "fleche-filtres"
    );

const resumeFiltresActifs =
    document.getElementById(
        "resume-filtres-actifs"
    );

const grilleRecettes =
    document.getElementById(
        "grille-recettes"
    );


let recettes = [];

let utilisateurConnecte =
    null;

let favoris =
    [];

let categorieSelectionnee =
    "toutes";

let favorisSeulement =
    false;

let etiquettesSelectionnees =
    [];

let occasionsSelectionnees =
    [];

let saisonsSelectionnees =
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


    utilisateurConnecte =
        data.user;


    if (!utilisateurConnecte) {

        window.location.href =
            "compte.html";

        return false;
    }


    return true;
}


/* =================================
   FAVORIS SUPABASE
================================= */

async function chargerFavoris() {

    if (!utilisateurConnecte) {

        favoris = [];

        return;
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("favoris")
            .select("recette_id")
            .eq(
                "user_id",
                utilisateurConnecte.id
            );


    if (error) {
        throw error;
    }


    favoris =
        Array.isArray(data)
            ? data.map(
                function (favori) {

                    return favori.recette_id;

                }
            )
            : [];
}


function recetteEstFavorite(
    id
) {

    return favoris
        .map(String)
        .includes(
            String(id)
        );
}


async function basculerFavori(
    id
) {

    if (!utilisateurConnecte) {
        return;
    }


    const idTexte =
        String(id);


    const existeDeja =
        favoris
            .map(String)
            .includes(
                idTexte
            );


    try {

        if (existeDeja) {

            const {
                error
            } =
                await window.supabaseClient
                    .from("favoris")
                    .delete()
                    .eq(
                        "user_id",
                        utilisateurConnecte.id
                    )
                    .eq(
                        "recette_id",
                        id
                    );


            if (error) {
                throw error;
            }


            favoris =
                favoris.filter(
                    function (
                        favoriId
                    ) {

                        return (
                            String(
                                favoriId
                            ) !==
                            idTexte
                        );

                    }
                );


        } else {

            const {
                error
            } =
                await window.supabaseClient
                    .from("favoris")
                    .insert({

                        user_id:
                            utilisateurConnecte.id,

                        recette_id:
                            id

                    });


            if (error) {
                throw error;
            }


            favoris.push(
                id
            );
        }


        afficherRecettes();


    } catch (erreur) {

        console.error(
            "Erreur pendant la modification du favori :",
            erreur
        );

    }
}


/* =================================
   CHARGEMENT SUPABASE
================================= */

async function chargerRecettes() {

    grilleRecettes.innerHTML = `
        <p class="message-chargement">
            Chargement des recettes…
        </p>
    `;


    try {

        const utilisateurPret =
            await recupererUtilisateurConnecte();


        if (!utilisateurPret) {
            return;
        }


        await chargerFavoris();


        const {
            data,
            error
        } =
            await window.supabaseClient
                .from("recettes")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {
            throw error;
        }


        recettes =
            Array.isArray(data)
                ? data
                : [];


        afficherRecettes();


    } catch (erreur) {

        console.error(
            "Erreur de chargement Supabase :",
            erreur
        );


        grilleRecettes.innerHTML = `
            <div class="message-erreur">

                <p>
                    <strong>
                        Impossible de charger
                        les recettes.
                    </strong>
                </p>

                <p>
                    ${erreur.message}
                </p>

            </div>
        `;

    }
}


/* =================================
   INFORMATIONS DES CARTES
================================= */

function calculerTempsTotal(
    recette
) {

    const preparation =
        Number(
            recette.preparation
        ) || 0;


    const cuisson =
        Number(
            recette.cuisson
        ) || 0;


    return (
        preparation +
        cuisson
    );
}


/* =================================
   CARTE RECETTE
================================= */

function creerCarteRecette(
    recette
) {

    const tempsTotal =
        calculerTempsTotal(
            recette
        );


    const estFavorite =
        recetteEstFavorite(
            recette.id
        );


    return `

        <article
            class="carte-recette"
            data-recette-id="${recette.id}"
        >

            <div class="entete-carte">

                <button
                    type="button"
                    class="bouton-favori ${
                        estFavorite
                            ? "favori-actif"
                            : ""
                    }"
                    data-favori-id="${recette.id}"
                    aria-label="${
                        estFavorite
                            ? "Retirer des favoris"
                            : "Ajouter aux favoris"
                    }"
                    title="${
                        estFavorite
                            ? "Retirer des favoris"
                            : "Ajouter aux favoris"
                    }"
                >
                    ${
                        estFavorite
                            ? "♥"
                            : "♡"
                    }
                </button>

            </div>


            <div class="contenu-carte">

                <h3>
                    ${recette.nom}
                </h3>


                <p class="description">

                    ${
                        recette.description ||
                        ""
                    }

                </p>


                <div class="informations">

                    <span>
                        ⏱️ ${tempsTotal} min
                    </span>

                    <span>
                        ● ${recette.difficulte}
                    </span>

                </div>

            </div>

        </article>

    `;
}

/* =================================
   RECHERCHE TEXTUELLE
================================= */

function construireTexteRecherche(
    recette
) {

    const ingredients =
        Array.isArray(
            recette.ingredients
        )
            ? recette.ingredients
                .map(
                    function (
                        ingredient
                    ) {

                        if (
                            typeof ingredient ===
                            "string"
                        ) {

                            return ingredient;
                        }


                        return [

                            ingredient.quantite,

                            ingredient.unite,

                            ingredient.nom

                        ]
                            .filter(
                                function (
                                    element
                                ) {

                                    return (
                                        element !== null &&
                                        element !== undefined &&
                                        element !== ""
                                    );
                                }
                            )
                            .join(" ");
                    }
                )
                .join(" ")
            : "";


    return [

        recette.nom,

        recette.description,

        recette.categorie,

        recette.categorie_affichee,

        recette.difficulte,

        ingredients,

        Array.isArray(
            recette.etiquettes
        )
            ? recette.etiquettes
                .join(" ")
            : "",

        Array.isArray(
            recette.occasions
        )
            ? recette.occasions
                .join(" ")
            : "",

        Array.isArray(
            recette.saisons
        )
            ? recette.saisons
                .join(" ")
            : ""

    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}


/* =================================
   OUTILS DE FILTRAGE
================================= */

function recetteContientTous(
    valeursRecette,
    valeursRecherchees
) {

    if (
        valeursRecherchees.length ===
        0
    ) {

        return true;
    }


    if (
        !Array.isArray(
            valeursRecette
        )
    ) {

        return false;
    }


    return valeursRecherchees
        .every(
            function (
                valeur
            ) {

                return (
                    valeursRecette
                        .includes(
                            valeur
                        )
                );
            }
        );
}


function recetteCorrespondSaisons(
    recette,
    saisonsRecherchees
) {

    if (
        saisonsRecherchees.length ===
        0
    ) {

        return true;
    }


    if (
        !Array.isArray(
            recette.saisons
        )
    ) {

        return false;
    }


    /*
        Une recette "Toute l'année"
        apparaît quelle que soit
        la saison choisie.
    */

    if (
        recette.saisons.includes(
            "toute-annee"
        )
    ) {

        return true;
    }


    return saisonsRecherchees
        .every(
            function (
                saison
            ) {

                return (
                    recette.saisons
                        .includes(
                            saison
                        )
                );
            }
        );
}


/* =================================
   NOMS DES FILTRES
================================= */

function obtenirNomFiltre(
    valeur
) {

    const noms = {

        "Grogros":
            "Grogros",

        "healthy":
            "Healthy",

        "végé":
            "Végé",

        "rapide":
            "Rapide",

        "pour-recevoir":
            "Pour recevoir",

        "batch-cooking":
            "Batch Cooking",

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


    return (
        noms[valeur] ||
        valeur
    );
}


/* =================================
   RÉSUMÉ DES FILTRES ACTIFS
================================= */

function afficherResumeFiltres() {

    const filtresActifs =
        [];


    if (
        favorisSeulement
    ) {

        filtresActifs.push({

            type:
                "favori",

            valeur:
                "favoris",

            nom:
                "♥ Favoris"

        });
    }


    etiquettesSelectionnees
        .forEach(
            function (
                valeur
            ) {

                filtresActifs.push({

                    type:
                        "etiquette",

                    valeur:
                        valeur,

                    nom:
                        obtenirNomFiltre(
                            valeur
                        )

                });
            }
        );


    occasionsSelectionnees
        .forEach(
            function (
                valeur
            ) {

                filtresActifs.push({

                    type:
                        "occasion",

                    valeur:
                        valeur,

                    nom:
                        obtenirNomFiltre(
                            valeur
                        )

                });
            }
        );


    saisonsSelectionnees
        .forEach(
            function (
                valeur
            ) {

                filtresActifs.push({

                    type:
                        "saison",

                    valeur:
                        valeur,

                    nom:
                        obtenirNomFiltre(
                            valeur
                        )

                });
            }
        );


    if (
        filtresActifs.length ===
        0
    ) {

        resumeFiltresActifs
            .innerHTML = "";

        return;
    }


    resumeFiltresActifs.innerHTML =
        filtresActifs
            .map(
                function (
                    filtre
                ) {

                    return `

                        <button
                            type="button"
                            class="badge-filtre-actif"
                            data-retirer-type="${filtre.type}"
                            data-retirer-valeur="${filtre.valeur}"
                        >
                            ${filtre.nom}

                            <span>
                                ×
                            </span>

                        </button>

                    `;
                }
            )
            .join("");
}


/* =================================
   AFFICHAGE DES RECETTES
================================= */

function afficherRecettes() {

    const recherche =
        champRecherche
            .value
            .toLowerCase()
            .trim();


    const recettesFiltrees =
        recettes.filter(
            function (
                recette
            ) {

                const texteRecherche =
                    construireTexteRecherche(
                        recette
                    );


                const correspondRecherche =
                    texteRecherche
                        .includes(
                            recherche
                        );


                const correspondCategorie =
                    categorieSelectionnee ===
                        "toutes" ||
                    recette.categorie ===
                        categorieSelectionnee;


                const correspondFavori =
                    !favorisSeulement ||
                    recetteEstFavorite(
                        recette.id
                    );


                const correspondEtiquettes =
                    recetteContientTous(
                        recette.etiquettes,
                        etiquettesSelectionnees
                    );


                const correspondOccasions =
                    recetteContientTous(
                        recette.occasions,
                        occasionsSelectionnees
                    );


                const correspondSaisons =
                    recetteCorrespondSaisons(
                        recette,
                        saisonsSelectionnees
                    );


                return (

                    correspondRecherche &&

                    correspondCategorie &&

                    correspondFavori &&

                    correspondEtiquettes &&

                    correspondOccasions &&

                    correspondSaisons

                );
            }
        );


    if (
        recettesFiltrees.length ===
        0
    ) {

        grilleRecettes.innerHTML = `
            <p class="aucun-resultat">
                Aucune recette ne correspond
                à ces critères.
            </p>
        `;

        return;
    }


    grilleRecettes.innerHTML =
        recettesFiltrees
            .map(
                creerCarteRecette
            )
            .join("");
}


/* =================================
   CATÉGORIES
================================= */

boutonsCategories
    .forEach(
        function (
            bouton
        ) {

            bouton.addEventListener(
                "click",
                function () {

                    boutonsCategories
                        .forEach(
                            function (
                                autreBouton
                            ) {

                                autreBouton
                                    .classList
                                    .remove(
                                        "actif"
                                    );
                            }
                        );


                    bouton
                        .classList
                        .add(
                            "actif"
                        );


                    categorieSelectionnee =
                        bouton.dataset
                            .categorie ||
                        "toutes";


                    afficherRecettes();
                }
            );
        }
    );


/* =================================
   FILTRE FAVORIS
================================= */

boutonFavoris
    .addEventListener(
        "click",
        function () {

            favorisSeulement =
                !favorisSeulement;


            boutonFavoris
                .classList
                .toggle(
                    "actif",
                    favorisSeulement
                );


            boutonFavoris
                .textContent =
                    favorisSeulement
                        ? "♥ Mes favoris"
                        : "♡ Mes favoris";


            afficherResumeFiltres();

            afficherRecettes();
        }
    );


/* =================================
   OUVERTURE FILTRES AVANCÉS
================================= */

boutonFiltresAvances
    .addEventListener(
        "click",
        function () {

            const panneauOuvert =
                panneauFiltresAvances
                    .classList
                    .toggle(
                        "ouvert"
                    );


            boutonFiltresAvances
                .setAttribute(
                    "aria-expanded",
                    panneauOuvert
                );


            flecheFiltres
                .textContent =
                    panneauOuvert
                        ? "⌃"
                        : "⌄";
        }
    );


/* =================================
   ÉTIQUETTES / OCCASIONS / SAISONS
================================= */

boutonsMultiples
    .forEach(
        function (
            bouton
        ) {

            bouton.addEventListener(
                "click",
                function () {

                    const type =
                        bouton.dataset
                            .type;


                    const valeur =
                        bouton.dataset
                            .valeur;


                    let tableau;


                    if (
                        type ===
                        "etiquette"
                    ) {

                        tableau =
                            etiquettesSelectionnees;

                    } else if (
                        type ===
                        "occasion"
                    ) {

                        tableau =
                            occasionsSelectionnees;

                    } else if (
                        type ===
                        "saison"
                    ) {

                        tableau =
                            saisonsSelectionnees;

                    } else {

                        return;
                    }


                    const index =
                        tableau.indexOf(
                            valeur
                        );


                    if (
                        index ===
                        -1
                    ) {

                        tableau.push(
                            valeur
                        );


                        bouton
                            .classList
                            .add(
                                "actif"
                            );

                    } else {

                        tableau.splice(
                            index,
                            1
                        );


                        bouton
                            .classList
                            .remove(
                                "actif"
                            );
                    }


                    afficherResumeFiltres();

                    afficherRecettes();
                }
            );
        }
    );

/* =================================
   SUPPRESSION D'UN FILTRE ACTIF
================================= */

resumeFiltresActifs
    .addEventListener(
        "click",
        function (
            evenement
        ) {

            const badge =
                evenement.target
                    .closest(
                        "[data-retirer-type]"
                    );


            if (!badge) {
                return;
            }


            const type =
                badge.dataset
                    .retirerType;


            const valeur =
                badge.dataset
                    .retirerValeur;


            if (
                type ===
                "favori"
            ) {

                favorisSeulement =
                    false;


                boutonFavoris
                    .classList
                    .remove(
                        "actif"
                    );


                boutonFavoris
                    .textContent =
                        "♡ Mes favoris";


            } else {

                let tableau;


                if (
                    type ===
                    "etiquette"
                ) {

                    tableau =
                        etiquettesSelectionnees;

                } else if (
                    type ===
                    "occasion"
                ) {

                    tableau =
                        occasionsSelectionnees;

                } else if (
                    type ===
                    "saison"
                ) {

                    tableau =
                        saisonsSelectionnees;
                }


                if (
                    tableau
                ) {

                    const index =
                        tableau.indexOf(
                            valeur
                        );


                    if (
                        index !==
                        -1
                    ) {

                        tableau.splice(
                            index,
                            1
                        );
                    }
                }


                const bouton =
                    document.querySelector(
                        `.filtre-multiple[data-type="${type}"][data-valeur="${valeur}"]`
                    );


                if (
                    bouton
                ) {

                    bouton
                        .classList
                        .remove(
                            "actif"
                        );
                }
            }


            afficherResumeFiltres();

            afficherRecettes();
        }
    );


/* =================================
   CLIC SUR LE CŒUR / CARTE
================================= */

grilleRecettes
    .addEventListener(
        "click",
        async function (
            evenement
        ) {

            const boutonFavori =
                evenement.target
                    .closest(
                        "[data-favori-id]"
                    );


            if (
                boutonFavori
            ) {

                evenement.preventDefault();

                evenement.stopPropagation();


                boutonFavori.disabled =
                    true;


                try {

                    await basculerFavori(
                        boutonFavori.dataset
                            .favoriId
                    );

                } catch (erreur) {

                    console.error(
                        "Erreur clic favori :",
                        erreur
                    );

                } finally {

                    /*
                        afficherRecettes()
                        recrée normalement
                        toute la carte.
                    */

                    if (
                        document.body
                            .contains(
                                boutonFavori
                            )
                    ) {

                        boutonFavori.disabled =
                            false;
                    }
                }


                return;
            }


            const carte =
                evenement.target
                    .closest(
                        ".carte-recette"
                    );


            if (
                !carte
            ) {

                return;
            }


            window.location.href =
                `recette.html?id=${
                    encodeURIComponent(
                        carte.dataset
                            .recetteId
                    )
                }`;
        }
    );


/* =================================
   RECHERCHE
================================= */

champRecherche
    .addEventListener(
        "input",
        afficherRecettes
    );


/* =================================
   DÉMARRAGE
================================= */

async function initialiserApplication() {

    afficherResumeFiltres();


    try {

        await chargerRecettes();

    } catch (erreur) {

        console.error(
            "Erreur initialisation application :",
            erreur
        );
    }
}


initialiserApplication();
