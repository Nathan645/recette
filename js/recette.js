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


async function supprimerRecette() {
    const confirmationSuppression =
        window.confirm(
            "Voulez-vous vraiment supprimer cette recette ? Cette action est définitive."
        );

    if (!confirmationSuppression) {
        return;
    }

    const boutonSupprimer =
        document.getElementById("supprimer-recette");

    boutonSupprimer.disabled = true;
    boutonSupprimer.textContent = "Suppression…";

    try {
        const { error } =
            await window.supabaseClient
                .from("recettes")
                .delete()
                .eq("id", identifiantRecette);

        if (error) {
            throw error;
        }

        window.location.href = "index.html";

    } catch (erreur) {
        console.error(
            "Erreur pendant la suppression :",
            erreur
        );

        window.alert(
            erreur.message ||
            "La recette n’a pas pu être supprimée."
        );

        boutonSupprimer.disabled = false;
        boutonSupprimer.textContent =
            "🗑️ Supprimer la recette";
    }
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
                        `${formaterQuantite(
                            Number(quantiteAffichee)
                        )}${unite} ${ingredient.nom}`;
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
                    ${recette.categorie_affichee || recette.categorie}
                </span>

                <h1>${recette.nom}</h1>

                <p class="introduction">
                    ${recette.description || ""}
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

    const boutonSupprimer =
        document.getElementById("supprimer-recette");


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


    boutonSupprimer.addEventListener(
        "click",
        supprimerRecette
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
'''

ajouter_js = r'''const formulaire =
    document.getElementById("formulaire-recette");

const conteneurIngredients =
    document.getElementById("liste-champs-ingredients");

const boutonAjouterIngredient =
    document.getElementById("ajouter-ingredient");

const boutonEnregistrer =
    document.getElementById("enregistrer-recette");

const messageFormulaire =
    document.getElementById("message-formulaire");

const parametres =
    new URLSearchParams(window.location.search);

const identifiantRecette =
    parametres.get("id");

const modeModification =
    Boolean(identifiantRecette);


function creerLigneIngredient(valeurs = {}) {
    const ligne = document.createElement("div");

    ligne.className = "ligne-ingredient";

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
            placeholder="Ex. de farine"
            required
            value="${valeurs.nom ?? ""}"
        >

        <label class="option-proportionnelle">
            <input
                type="checkbox"
                class="ingredient-proportionnel"
                ${valeurs.proportionnel === false ? "" : "checked"}
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
        ligne.querySelector(".supprimer-ingredient");

    boutonSupprimer.addEventListener("click", function () {
        const lignes =
            conteneurIngredients.querySelectorAll(
                ".ligne-ingredient"
            );

        if (lignes.length === 1) {
            ligne.querySelector(".ingredient-quantite").value = "";
            ligne.querySelector(".ingredient-unite").value = "";
            ligne.querySelector(".ingredient-nom").value = "";

            ligne.querySelector(
                ".ingredient-proportionnel"
            ).checked = true;

            return;
        }

        ligne.remove();
    });

    conteneurIngredients.appendChild(ligne);
}


function transformerEnListe(valeur) {
    return valeur
        .split("\n")
        .map(function (ligne) {
            return ligne.trim();
        })
        .filter(function (ligne) {
            return ligne !== "";
        });
}


function obtenirCategorieAffichee(categorie) {
    const categories = {
        "apéritif": "Apéritif",
        "entrée": "Entrée",
        "plat": "Plat",
        "dessert": "Dessert",
        "boisson": "Boisson"
    };

    return categories[categorie] || categorie;
}


function convertirQuantite(valeur) {
    const texte =
        valeur
            .trim()
            .replace(",", ".");

    if (texte === "") {
        return null;
    }

    const nombre = Number(texte);

    if (!Number.isFinite(nombre) || nombre < 0) {
        throw new Error(
            `La quantité « ${valeur} » n’est pas valide.`
        );
    }

    return nombre;
}


function recupererIngredients() {
    const lignes =
        conteneurIngredients.querySelectorAll(
            ".ligne-ingredient"
        );

    const ingredients = [];

    lignes.forEach(function (ligne) {
        const quantiteTexte =
            ligne.querySelector(".ingredient-quantite")
                .value;

        const unite =
            ligne.querySelector(".ingredient-unite")
                .value
                .trim();

        const nom =
            ligne.querySelector(".ingredient-nom")
                .value
                .trim();

        const proportionnel =
            ligne.querySelector(
                ".ingredient-proportionnel"
            ).checked;

        const ligneEstVide =
            quantiteTexte.trim() === "" &&
            unite === "" &&
            nom === "";

        if (ligneEstVide) {
            return;
        }

        if (nom === "") {
            throw new Error(
                "Chaque ingrédient doit avoir un nom."
            );
        }

        ingredients.push({
            quantite: convertirQuantite(quantiteTexte),
            unite: unite,
            nom: nom,
            proportionnel: proportionnel
        });
    });

    if (ingredients.length === 0) {
        throw new Error(
            "Ajoute au moins un ingrédient."
        );
    }

    return ingredients;
}


function construireRecette() {
    const etapes =
        transformerEnListe(
            document.getElementById("etapes").value
        );

    if (etapes.length === 0) {
        throw new Error(
            "Ajoute au moins une étape."
        );
    }

    const categorie =
        document.getElementById("categorie").value;

    return {
        nom:
            document.getElementById("nom")
                .value
                .trim(),

        description:
            document.getElementById("description")
                .value
                .trim(),

        categorie: categorie,

        categorie_affichee:
            obtenirCategorieAffichee(categorie),

        preparation:
            Number(
                document.getElementById("preparation").value
            ),

        cuisson:
            Number(
                document.getElementById("cuisson").value
            ),

        personnes:
            Number(
                document.getElementById("personnes").value
            ),

        difficulte:
            document.getElementById("difficulte").value,

        emoji:
            document.getElementById("emoji")
                .value
                .trim() || "🍽️",

        image:
            document.getElementById("image")
                .value
                .trim(),

        auteur:
            document.getElementById("auteur")
                .value
                .trim(),

        ingredients:
            recupererIngredients(),

        etapes: etapes,

        astuce:
            document.getElementById("astuce")
                .value
                .trim()
    };
}


async function chargerRecetteAModifier() {
    if (!modeModification) {
        creerLigneIngredient();
        creerLigneIngredient();
        creerLigneIngredient();
        return;
    }

    document.title =
        "Modifier une recette | À notre table";

    const titrePage =
        document.querySelector(".entete-formulaire h1");

    const textePage =
        document.querySelector(".entete-formulaire p");

    titrePage.textContent =
        "Modifier la recette";

    textePage.textContent =
        "Modifie les informations puis enregistre les changements.";

    boutonEnregistrer.textContent =
        "Enregistrer les modifications";

    messageFormulaire.textContent =
        "Chargement de la recette…";

    try {
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

        remplirFormulaire(data);

        messageFormulaire.textContent = "";

    } catch (erreur) {
        console.error(
            "Erreur pendant le chargement :",
            erreur
        );

        messageFormulaire.textContent =
            erreur.message ||
            "Impossible de charger la recette.";

        boutonEnregistrer.disabled = true;
    }
}


function remplirFormulaire(recette) {
    document.getElementById("nom").value =
        recette.nom || "";

    document.getElementById("categorie").value =
        recette.categorie || "";

    document.getElementById("description").value =
        recette.description || "";

    document.getElementById("preparation").value =
        recette.preparation ?? "";

    document.getElementById("cuisson").value =
        recette.cuisson ?? "";

    document.getElementById("personnes").value =
        recette.personnes ?? "";

    document.getElementById("difficulte").value =
        recette.difficulte || "";

    document.getElementById("emoji").value =
        recette.emoji || "";

    document.getElementById("image").value =
        recette.image || "";

    document.getElementById("auteur").value =
        recette.auteur || "";

    document.getElementById("etapes").value =
        Array.isArray(recette.etapes)
            ? recette.etapes.join("\n")
            : "";

    document.getElementById("astuce").value =
        recette.astuce || "";

    conteneurIngredients.innerHTML = "";

    if (
        Array.isArray(recette.ingredients) &&
        recette.ingredients.length > 0
    ) {
        recette.ingredients.forEach(
            function (ingredient) {
                creerLigneIngredient(ingredient);
            }
        );
    } else {
        creerLigneIngredient();
    }
}


async function ajouterRecette(recette) {
    const { data, error } =
        await window.supabaseClient
            .from("recettes")
            .insert(recette)
            .select("id")
            .single();

    if (error) {
        throw error;
    }

    return data;
}


async function modifierRecette(recette) {
    const { data, error } =
        await window.supabaseClient
            .from("recettes")
            .update(recette)
            .eq("id", identifiantRecette)
            .select("id")
            .single();

    if (error) {
        throw error;
    }

    return data;
}


boutonAjouterIngredient.addEventListener(
    "click",
    function () {
        creerLigneIngredient();
    }
);


formulaire.addEventListener(
    "submit",
    async function (evenement) {
        evenement.preventDefault();

        messageFormulaire.textContent =
            modeModification
                ? "Modification en cours…"
                : "Enregistrement en cours…";

        boutonEnregistrer.disabled = true;

        boutonEnregistrer.textContent =
            modeModification
                ? "Modification…"
                : "Enregistrement…";

        try {
            const recette =
                construireRecette();

            const recetteEnregistree =
                modeModification
                    ? await modifierRecette(recette)
                    : await ajouterRecette(recette);

            messageFormulaire.textContent =
                modeModification
                    ? "La recette a bien été modifiée."
                    : "La recette a bien été enregistrée.";

            window.location.href =
                `recette.html?id=${encodeURIComponent(
                    recetteEnregistree.id
                )}`;

        } catch (erreur) {
            console.error(
                "Erreur pendant l’enregistrement :",
                erreur
            );

            messageFormulaire.textContent =
                erreur.message ||
                "Impossible d’enregistrer la recette.";

            boutonEnregistrer.disabled = false;

            boutonEnregistrer.textContent =
                modeModification
                    ? "Enregistrer les modifications"
                    : "Enregistrer la recette";
        }
    }
);


chargerRecetteAModifier();
