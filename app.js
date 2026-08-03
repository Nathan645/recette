const champRecherche = document.getElementById("recherche");
const boutonsFiltres = document.querySelectorAll(".filtre");
const grilleRecettes = document.getElementById("grille-recettes");

let recettes = [];
let categorieSelectionnee = "toutes";

async function chargerRecettes() {
    try {
        const reponse = await fetch("recettes.json");

        if (!reponse.ok) {
            throw new Error("Impossible de charger les recettes.");
        }

        recettes = await reponse.json();
        afficherRecettes();
    } catch (erreur) {
        grilleRecettes.innerHTML = `
            <p class="message-erreur">
                Une erreur est survenue pendant le chargement des recettes.
            </p>
        `;

        console.error(erreur);
    }
}

function creerCarteRecette(recette) {
    const tempsTotal = recette.preparation + recette.cuisson;

    return `
        <article class="carte-recette">
            <div class="illustration-recette">
                ${recette.emoji}
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
                    href="recette.html?id=${recette.id}"
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
        const texteRecherche = [
            recette.nom,
            recette.description,
            recette.categorie,
            recette.categorieAffichee,
            recette.difficulte,
            recette.ingredients.join(" ")
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
        categorieSelectionnee = bouton.dataset.categorie;

        afficherRecettes();
    });
});

chargerRecettes();
