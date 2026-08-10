/* =================================
   ÉLÉMENTS HTML
================================= */

const boutonSemainePrecedenteCourses =
    document.getElementById(
        "semaine-precedente-courses"
    );

const boutonSemaineSuivanteCourses =
    document.getElementById(
        "semaine-suivante-courses"
    );

const boutonAujourdhuiCourses =
    document.getElementById(
        "aller-aujourdhui-courses"
    );

const numeroSemaineCourses =
    document.getElementById(
        "numero-semaine-courses"
    );

const titreSemaineCourses =
    document.getElementById(
        "titre-semaine-courses"
    );

const nombreRepasCourses =
    document.getElementById(
        "nombre-repas-courses"
    );

const nombreRecettesCourses =
    document.getElementById(
        "nombre-recettes-courses"
    );

const nombreArticlesCourses =
    document.getElementById(
        "nombre-articles-courses"
    );

const listeCourses =
    document.getElementById(
        "liste-courses"
    );

const messageVideCourses =
    document.getElementById(
        "message-vide-courses"
    );

const messageErreurCourses =
    document.getElementById(
        "message-erreur-courses"
    );

const texteErreurCourses =
    document.getElementById(
        "texte-erreur-courses"
    );


/* =================================
   VARIABLES
================================= */

let utilisateurConnecte =
    null;

let foyerId =
    null;

let debutSemaine =
    obtenirDebutSemaine(
        new Date()
    );

let repasSemaine =
    [];

let recettesSemaine =
    [];

let articlesCourses =
    [];


/* =================================
   OUTILS DATES
================================= */

function obtenirDebutSemaine(
    date
) {

    const copie =
        new Date(date);

    copie.setHours(
        0,
        0,
        0,
        0
    );


    const jour =
        copie.getDay();


    const difference =
        jour === 0
            ? -6
            : 1 - jour;


    copie.setDate(
        copie.getDate() +
        difference
    );


    return copie;
}


function ajouterJours(
    date,
    nombre
) {

    const copie =
        new Date(date);


    copie.setDate(
        copie.getDate() +
        nombre
    );


    return copie;
}


function formaterDateISO(
    date
) {

    const annee =
        date.getFullYear();


    const mois =
        String(
            date.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    const jour =
        String(
            date.getDate()
        )
            .padStart(
                2,
                "0"
            );


    return `${annee}-${mois}-${jour}`;
}


function formaterDateCourte(
    date
) {

    return date.toLocaleDateString(
        "fr-FR",
        {
            day:
                "numeric",

            month:
                "short"
        }
    );
}


function obtenirNumeroSemaine(
    date
) {

    const copie =
        new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            )
        );


    const jour =
        copie.getUTCDay() || 7;


    copie.setUTCDate(
        copie.getUTCDate() +
        4 -
        jour
    );


    const premierJanvier =
        new Date(
            Date.UTC(
                copie.getUTCFullYear(),
                0,
                1
            )
        );


    return Math.ceil(
        (
            (
                copie -
                premierJanvier
            ) /
            86400000 +
            1
        ) /
        7
    );
}


/* =================================
   OUTILS TEXTE
================================= */

function echapperHtml(
    valeur
) {

    if (
        valeur === null ||
        valeur === undefined
    ) {

        return "";
    }


    return String(valeur)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function normaliserTexte(
    texte
) {

    return String(
        texte || ""
    )
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /\s+/g,
            " "
        );
}


function formaterQuantite(
    valeur
) {

    const nombre =
        Number(valeur);


    if (
        !Number.isFinite(nombre)
    ) {

        return "";
    }


    if (
        Number.isInteger(nombre)
    ) {

        return String(nombre);
    }


    return nombre
        .toFixed(2)
        .replace(
            /\.00$/,
            ""
        )
        .replace(
            /0$/,
            ""
        )
        .replace(
            ".",
            ","
        );
}


/* =================================
   UTILISATEUR + FOYER
================================= */

async function recupererUtilisateurEtFoyer() {

    const {
        data: donneesUtilisateur,
        error: erreurUtilisateur
    } =
        await window.supabaseClient
            .auth
            .getUser();


    if (
        erreurUtilisateur
    ) {

        throw erreurUtilisateur;
    }


    utilisateurConnecte =
        donneesUtilisateur.user;


    if (
        !utilisateurConnecte
    ) {

        window.location.href =
            "compte.html";

        return false;
    }


    const {
        data: membre,
        error: erreurMembre
    } =
        await window.supabaseClient
            .from(
                "membres_foyer"
            )
            .select(
                "foyer_id"
            )
            .eq(
                "user_id",
                utilisateurConnecte.id
            )
            .limit(1)
            .maybeSingle();


    if (
        erreurMembre
    ) {

        throw erreurMembre;
    }


    if (
        !membre
    ) {

        window.location.href =
            "foyer.html";

        return false;
    }


    foyerId =
        membre.foyer_id;


    return true;
}


/* =================================
   CHARGER LE PLANNING
================================= */

async function chargerRepasSemaine() {

    const finSemaine =
        ajouterJours(
            debutSemaine,
            6
        );


    const dateDebut =
        formaterDateISO(
            debutSemaine
        );


    const dateFin =
        formaterDateISO(
            finSemaine
        );


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "repas_planning"
            )
            .select(`
                id,
                foyer_id,
                date,
                moment,
                nom,
                recette_id,
                personnes
            `)
            .eq(
                "foyer_id",
                foyerId
            )
            .gte(
                "date",
                dateDebut
            )
            .lte(
                "date",
                dateFin
            );


    if (
        error
    ) {

        throw error;
    }


    repasSemaine =
        Array.isArray(data)
            ? data
            : [];
}


/* =================================
   CHARGER LES RECETTES UTILISÉES
================================= */

async function chargerRecettesSemaine() {

    const idsRecettes =
        [
            ...new Set(
                repasSemaine
                    .filter(
                        function (
                            repas
                        ) {

                            return Boolean(
                                repas.recette_id
                            );
                        }
                    )
                    .map(
                        function (
                            repas
                        ) {

                            return repas.recette_id;
                        }
                    )
            )
        ];


    if (
        idsRecettes.length ===
        0
    ) {

        recettesSemaine =
            [];

        return;
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "recettes"
            )
            .select(`
                id,
                nom,
                personnes,
                ingredients
            `)
            .in(
                "id",
                idsRecettes
            );


    if (
        error
    ) {

        throw error;
    }


    recettesSemaine =
        Array.isArray(data)
            ? data
            : [];
}


/* =================================
   TROUVER UNE RECETTE
================================= */

function trouverRecette(
    recetteId
) {

    return recettesSemaine.find(
        function (
            recette
        ) {

            return (
                String(
                    recette.id
                ) ===
                String(
                    recetteId
                )
            );
        }
    );
}


/* =================================
   AJOUTER / REGROUPER UN ARTICLE
================================= */

function ajouterArticle(
    collection,
    ingredient,
    quantiteCalculee
) {

    if (
        !ingredient ||
        typeof ingredient !==
            "object"
    ) {

        return;
    }


    const nom =
        String(
            ingredient.nom || ""
        ).trim();


    if (
        !nom
    ) {

        return;
    }


    const unite =
        String(
            ingredient.unite || ""
        ).trim();


    /*
        On regroupe uniquement les
        ingrédients qui ont le même
        nom ET la même unité.

        Exemple :
        tomates + tomates
        500 g pâtes + 300 g pâtes

        Mais :
        2 oeufs et 200 g oeufs
        restent séparés.
    */

    const cle =
        `${normaliserTexte(
            nom
        )}__${normaliserTexte(
            unite
        )}`;


    let article =
        collection.get(
            cle
        );


    if (
        !article
    ) {

        article = {

            cle:
                cle,

            nom:
                nom,

            unite:
                unite,

            quantite:
                null,

            quantiteNumerique:
                true

        };


        collection.set(
            cle,
            article
        );
    }


    /*
        Quantité inexistante :
        sel, poivre, huile selon goût...

        On affiche seulement
        le nom de l'article.
    */

    if (
        quantiteCalculee === null ||
        quantiteCalculee === undefined ||
        quantiteCalculee === "" ||
        !Number.isFinite(
            Number(
                quantiteCalculee
            )
        )
    ) {

        article.quantiteNumerique =
            false;

        return;
    }


    if (
        article.quantite === null
    ) {

        article.quantite =
            0;
    }


    article.quantite +=
        Number(
            quantiteCalculee
        );
}


/* =================================
   CALCUL DE LA LISTE
================================= */

function calculerListeCourses() {

    const collection =
        new Map();


    repasSemaine.forEach(
        function (
            repas
        ) {

            /*
                Les repas libres
                sont ignorés.
            */

            if (
                !repas.recette_id
            ) {

                return;
            }


            const recette =
                trouverRecette(
                    repas.recette_id
                );


            if (
                !recette
            ) {

                return;
            }


            const personnesRecette =
                Number(
                    recette.personnes
                ) || 1;


            const personnesRepas =
                Number(
                    repas.personnes
                ) ||
                personnesRecette;


            const coefficient =
                personnesRepas /
                personnesRecette;


            const ingredients =
                Array.isArray(
                    recette.ingredients
                )
                    ? recette.ingredients
                    : [];


            ingredients.forEach(
                function (
                    ingredient
                ) {

                    /*
                        Compatibilité avec
                        d'éventuelles vieilles
                        recettes enregistrées
                        simplement en texte.
                    */

                    if (
                        typeof ingredient ===
                        "string"
                    ) {

                        ajouterArticle(
                            collection,
                            {
                                nom:
                                    ingredient,

                                unite:
                                    ""
                            },
                            null
                        );


                        return;
                    }


                    const quantite =
                        ingredient.quantite;


                    let quantiteCalculee =
                        quantite;


                    /*
                        Si proportionnel = false,
                        la quantité reste telle
                        quelle pour CE repas.

                        Sinon elle évolue selon
                        le nombre de personnes.
                    */

                    if (
                        ingredient.proportionnel !==
                            false &&
                        quantite !== null &&
                        quantite !== undefined &&
                        quantite !== "" &&
                        Number.isFinite(
                            Number(
                                quantite
                            )
                        )
                    ) {

                        quantiteCalculee =
                            Number(
                                quantite
                            ) *
                            coefficient;
                    }


                    ajouterArticle(
                        collection,
                        ingredient,
                        quantiteCalculee
                    );
                }
            );
        }
    );


    articlesCourses =
        Array.from(
            collection.values()
        )
            .sort(
                function (
                    articleA,
                    articleB
                ) {

                    return articleA.nom
                        .localeCompare(
                            articleB.nom,
                            "fr"
                        );
                }
            );
}


/* =================================
   TEXTE QUANTITÉ
================================= */

function construireQuantiteArticle(
    article
) {

    if (
        article.quantite === null ||
        !article.quantiteNumerique
    ) {

        return article.unite
            ? article.unite
            : "";
    }


    const quantite =
        formaterQuantite(
            article.quantite
        );


    if (
        !article.unite
    ) {

        return quantite;
    }


    return `${quantite} ${article.unite}`;
}


/* =================================
   CASES COCHÉES
================================= */

function obtenirCleStockageCourses() {

    return (
        "courses-" +
        foyerId +
        "-" +
        formaterDateISO(
            debutSemaine
        )
    );
}


function recupererArticlesCoches() {

    try {

        const donnees =
            JSON.parse(
                localStorage.getItem(
                    obtenirCleStockageCourses()
                ) ||
                "[]"
            );


        return Array.isArray(
            donnees
        )
            ? donnees
            : [];


    } catch (
        erreur
    ) {

        return [];
    }
}


function enregistrerArticlesCoches(
    valeurs
) {

    localStorage.setItem(
        obtenirCleStockageCourses(),
        JSON.stringify(
            valeurs
        )
    );
}


/* =================================
   AFFICHER LA SEMAINE
================================= */

function afficherEnteteSemaine() {

    const finSemaine =
        ajouterJours(
            debutSemaine,
            6
        );


    numeroSemaineCourses.textContent =
        `Semaine ${obtenirNumeroSemaine(
            debutSemaine
        )}`;


    titreSemaineCourses.textContent =
        `${formaterDateCourte(
            debutSemaine
        )} – ${finSemaine.toLocaleDateString(
            "fr-FR",
            {
                day:
                    "numeric",

                month:
                    "short",

                year:
                    "numeric"
            }
        )}`;
}


/* =================================
   RÉSUMÉ
================================= */

function afficherResume() {

    nombreRepasCourses.textContent =
        repasSemaine.length;


    const recettesUniques =
        new Set(
            repasSemaine
                .filter(
                    function (
                        repas
                    ) {

                        return Boolean(
                            repas.recette_id
                        );
                    }
                )
                .map(
                    function (
                        repas
                    ) {

                        return String(
                            repas.recette_id
                        );
                    }
                )
        );


    nombreRecettesCourses.textContent =
        recettesUniques.size;


    nombreArticlesCourses.textContent =
        articlesCourses.length;
}


/* =================================
   AFFICHER LA LISTE
================================= */

function afficherListeCourses() {

    const articlesCoches =
        recupererArticlesCoches();


    if (
        articlesCourses.length ===
        0
    ) {

        listeCourses.innerHTML =
            "";

        document
            .querySelector(
                ".carte-courses"
            )
            .hidden =
                true;


        messageVideCourses.hidden =
            false;


        return;
    }


    document
        .querySelector(
            ".carte-courses"
        )
        .hidden =
            false;


    messageVideCourses.hidden =
        true;


    const lignes =
        articlesCourses
            .map(
                function (
                    article,
                    index
                ) {

                    const estCoche =
                        articlesCoches.includes(
                            article.cle
                        );


                    const quantite =
                        construireQuantiteArticle(
                            article
                        );


                    return `

                        <div
                            class="article-course ${
                                estCoche
                                    ? "coche"
                                    : ""
                            }"
                            data-article-cle="${echapperHtml(
                                article.cle
                            )}"
                        >

                            <input
                                type="checkbox"
                                id="article-course-${index}"
                                class="case-article-course"
                                ${
                                    estCoche
                                        ? "checked"
                                        : ""
                                }
                            >


                            <label
                                for="article-course-${index}"
                            >

                                <span class="nom-article-course">
                                    ${echapperHtml(
                                        article.nom
                                    )}
                                </span>

                                ${
                                    quantite
                                        ? `
                                            <span class="quantite-article-course">
                                                ${echapperHtml(
                                                    quantite
                                                )}
                                            </span>
                                        `
                                        : ""
                                }

                            </label>

                        </div>

                    `;
                }
            )
            .join("");


    /*
        Pour cette première version,
        un seul groupe suffit.

        On pourra ensuite classer
        automatiquement en :
        fruits/légumes,
        frais,
        épicerie, etc.
    */

    listeCourses.innerHTML = `

        <div class="groupe-courses">

            <div class="entete-groupe-courses">
                Liste de courses
            </div>

            <div class="liste-groupe-courses">
                ${lignes}
            </div>

        </div>

    `;
}


/* =================================
   COCHER / DÉCOCHER
================================= */

listeCourses.addEventListener(
    "change",
    function (
        evenement
    ) {

        const caseArticle =
            evenement.target.closest(
                ".case-article-course"
            );


        if (
            !caseArticle
        ) {

            return;
        }


        const ligne =
            caseArticle.closest(
                ".article-course"
            );


        if (
            !ligne
        ) {

            return;
        }


        ligne.classList.toggle(
            "coche",
            caseArticle.checked
        );


        const cle =
            ligne.dataset
                .articleCle;


        let articlesCoches =
            recupererArticlesCoches();


        if (
            caseArticle.checked
        ) {

            if (
                !articlesCoches.includes(
                    cle
                )
            ) {

                articlesCoches.push(
                    cle
                );
            }

        } else {

            articlesCoches =
                articlesCoches.filter(
                    function (
                        valeur
                    ) {

                        return (
                            valeur !==
                            cle
                        );
                    }
                );
        }


        enregistrerArticlesCoches(
            articlesCoches
        );
    }
);


/* =================================
   CHARGEMENT COMPLET
================================= */

async function rafraichirCourses() {

    listeCourses.innerHTML = `
        <p class="message-chargement-courses">
            Calcul de la liste de courses…
        </p>
    `;


    messageErreurCourses.hidden =
        true;

    messageVideCourses.hidden =
        true;


    afficherEnteteSemaine();


    try {

        await chargerRepasSemaine();


        await chargerRecettesSemaine();


        calculerListeCourses();


        afficherResume();


        afficherListeCourses();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur chargement courses :",
            erreur
        );


        document
            .querySelector(
                ".carte-courses"
            )
            .hidden =
                true;


        messageVideCourses.hidden =
            true;


        messageErreurCourses.hidden =
            false;


        texteErreurCourses.textContent =
            erreur.message ||
            "Une erreur est survenue.";
    }
}


/* =================================
   NAVIGATION SEMAINE
================================= */

boutonSemainePrecedenteCourses
    .addEventListener(
        "click",
        async function () {

            debutSemaine =
                ajouterJours(
                    debutSemaine,
                    -7
                );


            await rafraichirCourses();
        }
    );


boutonSemaineSuivanteCourses
    .addEventListener(
        "click",
        async function () {

            debutSemaine =
                ajouterJours(
                    debutSemaine,
                    7
                );


            await rafraichirCourses();
        }
    );


boutonAujourdhuiCourses
    .addEventListener(
        "click",
        async function () {

            debutSemaine =
                obtenirDebutSemaine(
                    new Date()
                );


            await rafraichirCourses();
        }
    );


/* =================================
   INITIALISATION
================================= */

async function initialiserCourses() {

    try {

        const utilisateurPret =
            await recupererUtilisateurEtFoyer();


        if (
            !utilisateurPret
        ) {

            return;
        }


        await rafraichirCourses();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur initialisation courses :",
            erreur
        );


        messageErreurCourses.hidden =
            false;


        texteErreurCourses.textContent =
            erreur.message ||
            "Impossible de charger votre liste.";
    }
}


/* =================================
   DÉMARRAGE
================================= */

initialiserCourses();
