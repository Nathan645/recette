const contenuRecette =
    document.getElementById("contenu-recette");

const parametres =
    new URLSearchParams(window.location.search);

const identifiantRecette =
    parametres.get("id");


/* =================================
   CHARGEMENT DE LA RECETTE
================================= */

async function chargerRecette() {
    try {
        if (!identifiantRecette) {
            throw new Error(
                "Aucune recette n’a été sélectionnée."
            );
        }

        const { data, error } =
            await window.supabaseClient
                .from("recettes")
                .select("*")
                .eq("id", identifiantRecette)
                .single();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error(
                "Cette recette n’existe pas."
            );
        }

        afficherRecette(data);

    } catch (erreur) {
        console.error(
            "Erreur de chargement de la recette :",
            erreur
        );

        contenuRecette.innerHTML = `
            <div class="message">
                <h1>Recette introuvable</h1>

                <p>
                    Cette recette n’existe pas.
                </p>

                <a href="index.html">
                    Retourner à toutes les recettes
                </a>
            </div>
        `;
    }
}


/* =================================
   OUTILS
================================= */

function creerBadges(
    valeurs,
    classeSupplementaire = ""
) {
    if (
        !Array.isArray(valeurs) ||
        valeurs.length === 0
    ) {
        return "";
    }

    const noms = {
        "gros-gros": "Gros gros",
        "healthy": "Healthy",
        "végé": "Végé",
        "rapide": "Rapide",
        "pour-recevoir": "Pour recevoir",
        "a-preparer-avance": "À préparer à l'avance",

        "quotidien": "Quotidien",
        "brunch": "Brunch",
        "barbecue": "Barbecue",
        "fetes": "Fêtes",
        "invites": "Invités",
        "apero-dinatoire": "Apéro dînatoire",

        "printemps": "Printemps",
        "été": "Été",
        "automne": "Automne",
        "hiver": "Hiver",
        "toute-annee": "Toute l'année"
    };

    return valeurs
        .map(function (valeur) {
            return `
                <span class="badge-recette ${classeSupplementaire}">
                    ${noms[valeur] || valeur}
                </span>
            `;
        })
        .join("");
}


function formaterQuantite(valeur) {
    if (Number.isInteger(valeur)) {
        return valeur.toString();
    }

    return valeur
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/0$/, "")
        .replace(".", ",");
}


/* =================================
   POP-UP DE SUPPRESSION
================================= */

function demanderConfirmationSuppression() {
    return new Promise(function (resolve) {
        const fond =
            document.createElement("div");

        fond.className = "fond-popup";

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
                    La recette sera supprimée du carnet familial.
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

        document.body.appendChild(fond);

        const boutonAnnuler =
            document.getElementById(
                "annuler-suppression"
            );

        const boutonConfirmer =
            document.getElementById(
                "confirmer-suppression"
            );

        function fermerPopup(resultat) {
            fond.remove();
            resolve(resultat);
        }

        boutonAnnuler.addEventListener(
            "click",
            function () {
                fermerPopup(false);
            }
        );

        boutonConfirmer.addEventListener(
            "click",
            function () {
                fermerPopup(true);
            }
        );

        fond.addEventListener(
            "click",
            function (evenement) {
                if (evenement.target === fond) {
                    fermerPopup(false);
                }
            }
        );
    });
}


/* =================================
   SUPPRESSION SUPABASE
================================= */

async function supprimerRecette() {
    const confirmationSuppression =
        await demanderConfirmationSuppression();

    if (!confirmationSuppression) {
        return;
    }

    const boutonSupprimer =
        document.getElementById(
            "supprimer-recette"
        );

    boutonSupprimer.disabled = true;
    boutonSupprimer.textContent =
        "Suppression…";

    try {
        const { error } =
            await window.supabaseClient
                .from("recettes")
                .delete()
                .eq(
                    "id",
                    identifiantRecette
                );

        if (error) {
            throw error;
        }

        window.location.href =
            "index.html";

    } catch (erreur) {
        console.error(
            "Erreur pendant la suppression :",
            erreur
        );

        boutonSupprimer.disabled = false;

        boutonSupprimer.textContent =
            "🗑️ Supprimer la recette";

        alert(
            "La recette n’a pas pu être supprimée."
        );
    }
}


/* =================================
   AFFICHAGE DE LA RECETTE
================================= */

function afficherRecette(recette) {
    document.title =
        `${recette.nom} | À notre table`;

    const badgesEtiquettes =
        creerBadges(
            recette.etiquettes,
            "badge-etiquette"
        );

    const badgesOccasions =
        creerBadges(
            recette.occasions,
            "badge-occasion"
        );

    const badgesSaisons =
        creerBadges(
            recette.saisons,
            "badge-saison"
        );

    const personnesInitiales =
        Number(recette.personnes) || 1;

    let personnesSelectionnees =
        personnesInitiales;


    function creerIngredientsHtml() {
        const coefficient =
            personnesSelectionnees /
            personnesInitiales;

        const ingredients =
            Array.isArray(recette.ingredients)
                ? recette.ingredients
                : [];

        return ingredients
            .map(function (ingredient, index) {
                /*
                    Compatibilité avec d'anciennes
                    recettes éventuellement stockées
                    sous forme de texte.
                */
                if (
                    typeof ingredient === "string"
                ) {
                    return `
                        <li class="ingredient-item">
                            <input
                                type="checkbox"
                                id="ingredient-${index}"
                                class="case-ingredient"
                            >

                            <label for="ingredient-${index}">
                                ${ingredient}
                            </label>
                        </li>
                    `;
                }

                const ingredientProportionnel =
                    ingredient.proportionnel !== false;

                let quantiteAffichee =
                    ingredient.quantite;

                if (
                    ingredientProportionnel &&
                    ingredient.quantite !== null &&
                    ingredient.quantite !== undefined &&
                    ingredient.quantite !== ""
                ) {
                    quantiteAffichee =
                        Number(
                            ingredient.quantite
                        ) * coefficient;
                }

                let texteIngredient =
                    ingredient.nom || "";

                if (
                    quantiteAffichee !== null &&
                    quantiteAffichee !== undefined &&
                    quantiteAffichee !== ""
                ) {
                    const unite =
                        ingredient.unite
                            ? ` ${ingredient.unite}`
                            : "";

                    texteIngredient =
                        `${formaterQuantite(
                            Number(quantiteAffichee)
                        )}${unite} ${ingredient.nom || ""}`;
                }

                return `
                    <li class="ingredient-item">
                        <input
                            type="checkbox"
                            id="ingredient-${index}"
                            class="case-ingredient"
                        >

                        <label for="ingredient-${index}">
                            ${texteIngredient}
                        </label>
                    </li>
                `;
            })
            .join("");
    }


    const etapes =
        Array.isArray(recette.etapes)
            ? recette.etapes
            : [];

    const etapesHtml =
        etapes
            .map(function (etape, index) {
                return `
                    <li class="etape-item">
                        <input
                            type="checkbox"
                            id="etape-${index}"
                            class="case-etape"
                        >

                        <label for="etape-${index}">
                            ${etape}
                        </label>
                    </li>
                `;
            })
            .join("");


    const astuceHtml =
        recette.astuce
            ? `
                <aside class="conseil">
                    <h2>Astuce</h2>
                    <p>${recette.astuce}</p>
                </aside>
            `
            : "";


    const illustrationHtml =
        recette.image
            ? `
                <img
                    src="${recette.image}"
                    alt="${recette.nom}"
                    class="photo-recette photo-recette-detail"
                >
            `
            : `
                <span
                    role="img"
                    aria-label="Illustration de ${recette.nom}"
                >
                    ${recette.emoji || "🍽️"}
                </span>
            `;


    contenuRecette.innerHTML = `
        <article class="fiche-recette">

            <div class="illustration">
                ${illustrationHtml}
            </div>

            <div class="contenu">

                <div class="badges-principaux">
                    <span class="categorie">
                        ${
                            recette.categorie_affichee ||
                            recette.categorie ||
                            ""
                        }
                    </span>
                </div>

                <h1>${recette.nom}</h1>

                <p class="introduction">
                    ${recette.description || ""}
                </p>

                <div class="details-filtres-recette">

                    ${
                        badgesEtiquettes
                            ? `
                                <div class="groupe-badges-recette">
                                    <span class="titre-badges-recette">
                                        Étiquettes
                                    </span>

                                    <div class="liste-badges-recette">
                                        ${badgesEtiquettes}
                                    </div>
                                </div>
                            `
                            : ""
                    }

                    ${
                        badgesOccasions
                            ? `
                                <div class="groupe-badges-recette">
                                    <span class="titre-badges-recette">
                                        Occasions
                                    </span>

                                    <div class="liste-badges-recette">
                                        ${badgesOccasions}
                                    </div>
                                </div>
                            `
                            : ""
                    }

                    ${
                        badgesSaisons
                            ? `
                                <div class="groupe-badges-recette">
                                    <span class="titre-badges-recette">
                                        Saisons
                                    </span>

                                    <div class="liste-badges-recette">
                                        ${badgesSaisons}
                                    </div>
                                </div>
                            `
                            : ""
                    }

                </div>

                <div class="actions-gestion-recette">
                    <a
                        href="ajouter.html?id=${
                            encodeURIComponent(
                                recette.id
                            )
                        }"
                        class="bouton-modifier"
                    >
                        ✏️ Modifier la recette
                    </a>

                    <button
                        type="button"
                        class="bouton-supprimer"
                        id="supprimer-recette"
                    >
                        🗑️ Supprimer la recette
                    </button>
                </div>

                <div class="informations-recette">

                    <div class="information">
                        <strong>Préparation</strong>

                        <span>
                            ${recette.preparation} minutes
                        </span>
                    </div>

                    <div class="information">
                        <strong>Cuisson</strong>

                        <span>
                            ${recette.cuisson} minutes
                        </span>
                    </div>

                    <div class="information information-portions">
                        <strong>Portions</strong>

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
                        <strong>Difficulté</strong>

                        <span>
                            ${recette.difficulte}
                        </span>
                    </div>

                </div>

                <div class="colonnes">

                    <section>
                        <h2>Ingrédients</h2>

                        <ul
                            class="liste-ingredients"
                            id="liste-ingredients"
                        >
                            ${creerIngredientsHtml()}
                        </ul>
                    </section>

                    <section>
                        <h2>Préparation</h2>

                        <ol class="liste-etapes">
                            ${etapesHtml}
                        </ol>
                    </section>

                </div>

                ${astuceHtml}

                <p class="auteur">
                    ${recette.auteur || ""}
                </p>

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

    const boutonSupprimer =
        document.getElementById(
            "supprimer-recette"
        );


    function activerCasesIngredients() {
        const casesIngredients =
            document.querySelectorAll(
                ".case-ingredient"
            );

        casesIngredients.forEach(
            function (caseIngredient) {
                caseIngredient.addEventListener(
                    "change",
                    function () {
                        const ligneIngredient =
                            caseIngredient.closest(
                                ".ingredient-item"
                            );

                        if (!ligneIngredient) {
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
    }


    boutonDiminuer.addEventListener(
        "click",
        function () {
            if (
                personnesSelectionnees > 1
            ) {
                personnesSelectionnees -= 1;

                mettreAJourIngredients();
            }
        }
    );


    boutonAugmenter.addEventListener(
        "click",
        function () {
            personnesSelectionnees += 1;

            mettreAJourIngredients();
        }
    );


    boutonSupprimer.addEventListener(
        "click",
        supprimerRecette
    );


    activerCasesIngredients();


    const casesEtapes =
        document.querySelectorAll(
            ".case-etape"
        );

    casesEtapes.forEach(
        function (caseEtape) {
            caseEtape.addEventListener(
                "change",
                function () {
                    const ligneEtape =
                        caseEtape.closest(
                            ".etape-item"
                        );

                    if (!ligneEtape) {
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
   DÉMARRAGE
================================= */

chargerRecette();
