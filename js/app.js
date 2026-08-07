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
    document.getElementById("filtre-favoris");

const grilleRecettes =
    document.getElementById("grille-recettes");


let recettes = [];

let categorieSelectionnee = "toutes";

let favorisSeulement = false;

let etiquettesSelectionnees = [];

let occasionsSelectionnees = [];

let saisonsSelectionnees = [];


/* =========================
   FAVORIS
========================= */

function recupererFavoris() {
    try {
        const favoris =
            JSON.parse(
                localStorage.getItem(
                    "recettes-favorites"
                )
            );

        return Array.isArray(favoris)
            ? favoris
            : [];

    } catch (erreur) {
        return [];
    }
}


function enregistrerFavoris(favoris) {
    localStorage.setItem(
        "recettes-favorites",
        JSON.stringify(favoris)
    );
}


function recetteEstFavorite(id) {
    return recupererFavoris()
        .map(String)
        .includes(String(id));
}


function basculerFavori(id) {
    let favoris = recupererFavoris();

    const idTexte = String(id);

    if (
        favoris
            .map(String)
            .includes(idTexte)
    ) {
        favoris = favoris.filter(
            function (favoriId) {
                return String(favoriId) !== idTexte;
            }
        );
    } else {
        favoris.push(id);
    }

    enregistrerFavoris(favoris);

    afficherRecettes();
}


/* =========================
   CHARGEMENT SUPABASE
========================= */

async function chargerRecettes() {

    grilleRecettes.innerHTML = `
        <p class="message-chargement">
            Chargement des recettes…
        </p>
    `;

    try {

        const { data, error } =
            await window.supabaseClient
                .from("recettes")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
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
                        Impossible de charger les recettes.
                    </strong>
                </p>

                <p>
                    ${erreur.message}
                </p>

            </div>
        `;
    }
}


/* =========================
   CARTE RECETTE
========================= */

function calculerTempsTotal(recette) {

    const preparation =
        Number(recette.preparation) || 0;

    const cuisson =
        Number(recette.cuisson) || 0;

    return preparation + cuisson;
}


function creerIllustration(recette) {

    if (recette.image) {

        return `
            <img
                src="${recette.image}"
                alt="${recette.nom}"
                class="photo-recette"
            >
        `;
    }

    return recette.emoji || "🍽️";
}


function creerCarteRecette(recette) {

    const tempsTotal =
        calculerTempsTotal(recette);

    const estFavorite =
        recetteEstFavorite(recette.id);

    return `
        <article class="carte-recette">

            <div class="illustration-recette">

                ${creerIllustration(recette)}

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
                    ${estFavorite ? "♥" : "♡"}
                </button>

            </div>

            <div class="contenu-carte">

                <span class="categorie">
                    ${
                        recette.categorie_affichee ||
                        recette.categorie
                    }
                </span>

                <h3>
                    ${recette.nom}
                </h3>

                <p class="description">
                    ${recette.description || ""}
                </p>

                <div class="informations">

                    <span>
                        ⏱️ ${tempsTotal} min
                    </span>

                    <span>
                        👥 ${recette.personnes} personnes
                    </span>

                    <span>
                        ● ${recette.difficulte}
                    </span>

                </div>

                <a
                    href="recette.html?id=${
                        encodeURIComponent(
                            recette.id
                        )
                    }"
                    class="bouton-recette"
                >
                    Voir la recette
                </a>

            </div>

        </article>
    `;
}


/* =========================
   RECHERCHE
========================= */

function construireTexteRecherche(recette) {

    const ingredients =
        Array.isArray(recette.ingredients)
            ? recette.ingredients
                .map(function (ingredient) {

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
                        .filter(function (element) {
                            return (
                                element !== null &&
                                element !== undefined &&
                                element !== ""
                            );
                        })
                        .join(" ");
                })
                .join(" ")
            : "";

    return [
        recette.nom,
        recette.description,
        recette.categorie,
        recette.categorie_affichee,
        recette.difficulte,
        recette.auteur,
        ingredients,

        Array.isArray(recette.etiquettes)
            ? recette.etiquettes.join(" ")
            : "",

        Array.isArray(recette.occasions)
            ? recette.occasions.join(" ")
            : "",

        Array.isArray(recette.saisons)
            ? recette.saisons.join(" ")
            : ""
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}


/* =========================
   FILTRES MULTIPLES
========================= */

function recetteContientTous(
    valeursRecette,
    valeursRecherchees
) {

    if (valeursRecherchees.length === 0) {
        return true;
    }

    if (!Array.isArray(valeursRecette)) {
        return false;
    }

    return valeursRecherchees.every(
        function (valeur) {
            return valeursRecette.includes(
                valeur
            );
        }
    );
}


function recetteCorrespondSaisons(
    recette,
    saisonsRecherchees
) {

    if (saisonsRecherchees.length === 0) {
        return true;
    }

    if (!Array.isArray(recette.saisons)) {
        return false;
    }

    /*
        Une recette "toute-annee"
        est disponible quelle que soit
        la saison sélectionnée.
    */

    if (
        recette.saisons.includes(
            "toute-annee"
        )
    ) {
        return true;
    }

    return saisonsRecherchees.every(
        function (saison) {
            return recette.saisons.includes(
                saison
            );
        }
    );
}


/* =========================
   AFFICHAGE
========================= */

function afficherRecettes() {

    const recherche =
        champRecherche.value
            .toLowerCase()
            .trim();

    const recettesFiltrees =
        recettes.filter(
            function (recette) {

                const texteRecherche =
                    construireTexteRecherche(
                        recette
                    );


                const correspondRecherche =
                    texteRecherche.includes(
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


    if (recettesFiltrees.length === 0) {

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
            .map(creerCarteRecette)
            .join("");
}


/* =========================
   CATÉGORIES
========================= */

boutonsCategories.forEach(
    function (bouton) {

        bouton.addEventListener(
            "click",
            function () {

                boutonsCategories.forEach(
                    function (autreBouton) {
                        autreBouton
                            .classList
                            .remove("actif");
                    }
                );

                bouton
                    .classList
                    .add("actif");

                categorieSelectionnee =
                    bouton.dataset.categorie ||
                    "toutes";

                afficherRecettes();
            }
        );
    }
);


/* =========================
   FAVORIS
========================= */

boutonFavoris.addEventListener(
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

        boutonFavoris.textContent =
            favorisSeulement
                ? "♥ Mes favoris"
                : "♡ Mes favoris";

        afficherRecettes();
    }
);


/* =========================
   ÉTIQUETTES / OCCASIONS /
   SAISONS
========================= */

boutonsMultiples.forEach(
    function (bouton) {

        bouton.addEventListener(
            "click",
            function () {

                const type =
                    bouton.dataset.type;

                const valeur =
                    bouton.dataset.valeur;


                let tableau;

                if (type === "etiquette") {

                    tableau =
                        etiquettesSelectionnees;

                } else if (
                    type === "occasion"
                ) {

                    tableau =
                        occasionsSelectionnees;

                } else if (
                    type === "saison"
                ) {

                    tableau =
                        saisonsSelectionnees;

                } else {

                    return;
                }


                const index =
                    tableau.indexOf(valeur);


                if (index === -1) {

                    tableau.push(valeur);

                    bouton
                        .classList
                        .add("actif");

                } else {

                    tableau.splice(
                        index,
                        1
                    );

                    bouton
                        .classList
                        .remove("actif");
                }


                afficherRecettes();
            }
        );
    }
);


/* =========================
   CLIC SUR LES CŒURS
========================= */

grilleRecettes.addEventListener(
    "click",
    function (evenement) {

        const boutonFavori =
            evenement.target.closest(
                "[data-favori-id]"
            );

        if (!boutonFavori) {
            return;
        }

        evenement.preventDefault();
        evenement.stopPropagation();

        basculerFavori(
            boutonFavori.dataset.favoriId
        );
    }
);


/* =========================
   RECHERCHE
========================= */

champRecherche.addEventListener(
    "input",
    afficherRecettes
);


/* =========================
   DÉMARRAGE
========================= */

chargerRecettes();
