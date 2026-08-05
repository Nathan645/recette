const champRecherche = document.getElementById("recherche");
const boutonsFiltres = document.querySelectorAll(".filtre");
const grilleRecettes = document.getElementById("grille-recettes");

let recettes = [];
let categorieSelectionnee = "toutes";

async function chargerRecettes() {
    grilleRecettes.innerHTML = `
        <p class="message-chargement">
            Chargement des recettes…
        </p>
    `;

    try {
        const reponse = await fetch("./recettes.json");

        if (!reponse.ok) {
            throw new Error(
                `Le fichier recettes.json est introuvable : erreur ${reponse.status}`
            );
        }

        const donnees = await reponse.json();

        if (!Array.isArray(donnees)) {
            throw new Error(
                "Le contenu de recettes.json doit commencer par [ et finir par ]."
            );
        }

        recettes = donnees;

        console.log("Recettes chargées :", recettes);

        afficherRecettes();
    } catch (erreur) {
        console.error("Erreur de chargement :", erreur);

        grilleRecettes.innerHTML = `
            <div class="message-erreur">
                <p><strong>Impossible de charger les recettes.</strong></p>
                <p>${erreur.message}</p>
            </div>
        `;
    }
}

function creerCarteRecette(recette) {
    const tempsTotal =
        Number(recette.preparation) + Number(recette.cuisson);

    return `
        <article class="carte-recette">
            <div class="illustration-recette">
    ${
        recette.image
            ? `
                <img
                    src="${recette.image}"
                    alt="${recette.nom}"
                    class="photo-recette"
                >
            `
            : recette.emoji || "🍽️"
    }
</div>

            <div class="contenu-carte">
                <span class="categorie">
                    ${recette.categorieAffichee}
                </span>

                <h3>${recette.nom}</h3>

                <p class="description">
                    ${recette.description}
                </p>

                <div class="informations">
                    <span>⏱️ ${tempsTotal} min</span>
                    <span>👥 ${recette.personnes} personnes</span>
                    <span>● ${recette.difficulte}</span>
                </div>

                <a
                    href="recette.html?id=${encodeURIComponent(recette.id)}"
                    class="bouton-recette"
                >
                    Voir la recette
                </a>
            </div>
        </article>
    `;
}

function afficherRecettes() {
    const recherche = champRecherche.value
        .toLowerCase()
        .trim();

    const recettesFiltrees = recettes.filter(function (recette) {
        const ingredients = Array.isArray(recette.ingredients)
            ? recette.ingredients.join(" ")
            : "";

        const texteRecherche = [
            recette.nom,
            recette.description,
            recette.categorie,
            recette.categorieAffichee,
            recette.difficulte,
            ingredients
        ]
            .join(" ")
            .toLowerCase();

        const correspondRecherche =
            texteRecherche.includes(recherche);

        const correspondCategorie =
            categorieSelectionnee === "toutes" ||
            recette.categorie === categorieSelectionnee;

        return correspondRecherche && correspondCategorie;
    });

    if (recettesFiltrees.length === 0) {
        grilleRecettes.innerHTML = `
            <p class="aucun-resultat">
                Aucune recette ne correspond à votre recherche.
            </p>
        `;

        return;
    }

    grilleRecettes.innerHTML = recettesFiltrees
        .map(creerCarteRecette)
        .join("");
}

champRecherche.addEventListener("input", afficherRecettes);

boutonsFiltres.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
        boutonsFiltres.forEach(function (autreBouton) {
            autreBouton.classList.remove("actif");
        });

        bouton.classList.add("actif");

        categorieSelectionnee =
            bouton.dataset.categorie || "toutes";

        afficherRecettes();
    });
});

chargerRecettes();
