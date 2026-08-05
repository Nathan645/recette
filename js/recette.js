const contenuRecette =
    document.getElementById("contenu-recette");

const parametres =
    new URLSearchParams(window.location.search);

const identifiantRecette =
    parametres.get("id");


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


function afficherRecette(recette) {
    document.title =
        `${recette.nom} | À notre table`;

    const personnesInitiales =
        Number(recette.personnes);

    let personnesSelectionnees =
        personnesInitiales;


    function creerIngredientsHtml() {
        const coefficient =
            personnesSelectionnees / personnesInitiales;

        return recette.ingredients
            .map(function (ingredient, index) {
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
                        Number(ingredient.quantite) *
                        coefficient;
                }

                let texteIngredient =
                    ingredient.nom;

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
                        `${formaterQuantite(Number(quantiteAffichee))}${unite} ${ingredient.nom}`;
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


    const etapesHtml = recette.etapes
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


    const astuceHtml = recette.astuce
        ? `
            <aside class="conseil">
                <h2>Astuce</h2>
                <p>${recette.astuce}</p>
            </aside>
        `
        : "";


    const illustrationHtml = recette.image
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

                <span class="categorie">
                    ${recette.categorieAffichee}
                </span>

                <h1>${recette.nom}</h1>

                <p class="introduction">
                    ${recette.description}
                </p>

                <div class="actions-gestion-recette">
    <a
        href="ajouter.html?id=${encodeURIComponent(recette.id)}"
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
        document.getElementById("liste-ingredients");

    const nombrePortions =
        document.getElementById("nombre-portions");

    const boutonDiminuer =
        document.getElementById("diminuer-portions");

    const boutonAugmenter =
        document.getElementById("augmenter-portions");


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

                        if (caseIngredient.checked) {
                            ligneIngredient.classList.add(
                                "ingredient-coche"
                            );
                        } else {
                            ligneIngredient.classList.remove(
                                "ingredient-coche"
                            );
                        }
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
            if (personnesSelectionnees > 1) {
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


    activerCasesIngredients();


    const casesEtapes =
        document.querySelectorAll(".case-etape");

    casesEtapes.forEach(function (caseEtape) {
        caseEtape.addEventListener(
            "change",
            function () {
                const ligneEtape =
                    caseEtape.closest(".etape-item");

                if (caseEtape.checked) {
                    ligneEtape.classList.add(
                        "etape-coche"
                    );
                } else {
                    ligneEtape.classList.remove(
                        "etape-coche"
                    );
                }
            }
        );
    });
}


chargerRecette();
