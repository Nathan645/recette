const formulaire =
    document.getElementById("formulaire-recette");

const conteneurIngredients =
    document.getElementById("liste-champs-ingredients");

const boutonAjouterIngredient =
    document.getElementById("ajouter-ingredient");

const boutonEnregistrer =
    document.getElementById("enregistrer-recette");

const messageFormulaire =
    document.getElementById("message-formulaire");


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


async function enregistrerRecette(recette) {
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
            "Enregistrement en cours…";

        boutonEnregistrer.disabled = true;
        boutonEnregistrer.textContent =
            "Enregistrement…";

        try {
            const nouvelleRecette =
                construireRecette();

            const recetteEnregistree =
                await enregistrerRecette(
                    nouvelleRecette
                );

            messageFormulaire.textContent =
                "La recette a bien été enregistrée.";

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
                "Enregistrer la recette";
        }
    }
);


creerLigneIngredient();
creerLigneIngredient();
creerLigneIngredient();
