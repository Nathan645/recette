const formulaire =
    document.getElementById("formulaire-recette");

const conteneurIngredients =
    document.getElementById("liste-champs-ingredients");

const boutonAjouterIngredient =
    document.getElementById("ajouter-ingredient");

const resultatJson =
    document.getElementById("resultat-json");

const codeJson =
    document.getElementById("code-json");

const boutonCopier =
    document.getElementById("copier-json");

const boutonRecommencer =
    document.getElementById("recommencer");

const confirmation =
    document.getElementById("confirmation");


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
            const champQuantite =
                ligne.querySelector(".ingredient-quantite");

            const champUnite =
                ligne.querySelector(".ingredient-unite");

            const champNom =
                ligne.querySelector(".ingredient-nom");

            const caseProportionnelle =
                ligne.querySelector(
                    ".ingredient-proportionnel"
                );

            champQuantite.value = "";
            champUnite.value = "";
            champNom.value = "";
            caseProportionnelle.checked = true;

            return;
        }

        ligne.remove();
    });

    conteneurIngredients.appendChild(ligne);
}


function creerIdentifiant(nom) {
    return nom
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
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
                "Chaque ligne d’ingrédient doit avoir un nom."
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


function genererRecette() {
    const nom =
        document.getElementById("nom")
            .value
            .trim();

    const categorie =
        document.getElementById("categorie")
            .value;

    const etapes =
        transformerEnListe(
            document.getElementById("etapes")
                .value
        );

    if (etapes.length === 0) {
        throw new Error(
            "Ajoute au moins une étape."
        );
    }

    return {
        id: creerIdentifiant(nom),

        nom: nom,

        description:
            document.getElementById("description")
                .value
                .trim(),

        categorie: categorie,

        categorieAffichee:
            obtenirCategorieAffichee(categorie),

        preparation:
            Number(
                document.getElementById("preparation")
                    .value
            ),

        cuisson:
            Number(
                document.getElementById("cuisson")
                    .value
            ),

        personnes:
            Number(
                document.getElementById("personnes")
                    .value
            ),

        difficulte:
            document.getElementById("difficulte")
                .value,

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


boutonAjouterIngredient.addEventListener(
    "click",
    function () {
        creerLigneIngredient();
    }
);


formulaire.addEventListener(
    "submit",
    function (evenement) {
        evenement.preventDefault();

        confirmation.textContent = "";

        try {
            const recette = genererRecette();

            codeJson.textContent =
                JSON.stringify(recette, null, 2);

            resultatJson.classList.add("visible");

            resultatJson.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } catch (erreur) {
            codeJson.textContent = "";

            confirmation.textContent =
                erreur.message;

            resultatJson.classList.add("visible");

            resultatJson.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }
);


boutonCopier.addEventListener(
    "click",
    async function () {
        if (!codeJson.textContent.trim()) {
            confirmation.textContent =
                "Génère d’abord une recette valide.";

            return;
        }

        try {
            await navigator.clipboard.writeText(
                codeJson.textContent
            );

            confirmation.textContent =
                "Le bloc JSON a bien été copié.";

        } catch (erreur) {
            confirmation.textContent =
                "La copie automatique a échoué. " +
                "Sélectionne le texte manuellement.";
        }
    }
);


boutonRecommencer.addEventListener(
    "click",
    function () {
        formulaire.reset();

        conteneurIngredients.innerHTML = "";

        creerLigneIngredient();
        creerLigneIngredient();
        creerLigneIngredient();

        resultatJson.classList.remove("visible");

        codeJson.textContent = "";
        confirmation.textContent = "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


creerLigneIngredient();
creerLigneIngredient();
creerLigneIngredient();
