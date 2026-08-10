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
   AJOUT MANUEL
================================= */

const formulaireArticleManuel =
    document.getElementById(
        "formulaire-article-manuel"
    );

const champNomArticleManuel =
    document.getElementById(
        "nom-article-manuel"
    );

const champQuantiteArticleManuel =
    document.getElementById(
        "quantite-article-manuel"
    );

const champCategorieArticleManuel =
    document.getElementById(
        "categorie-article-manuel"
    );

const boutonAjouterArticleManuel =
    document.getElementById(
        "ajouter-article-manuel"
    );

const messageArticleManuel =
    document.getElementById(
        "message-article-manuel"
    );

const boutonToutDecocher =
    document.getElementById(
        "tout-decocher-courses"
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

let articlesManuels =
    [];


/*
    IMPORTANT :

    Cette variable remplace maintenant
    le localStorage.

    Son contenu est chargé depuis
    public.courses_cochees.
*/

let articlesCoches =
    [];


/* =================================
   CATÉGORIES
================================= */

const categoriesCourses = {

    "fruits-legumes": {
        nom:
            "Fruits & légumes",

        emoji:
            "🥕",

        ordre:
            1
    },

    "frais": {
        nom:
            "Frais",

        emoji:
            "🧀",

        ordre:
            2
    },

    "viandes-poissons": {
        nom:
            "Viandes & poissons",

        emoji:
            "🥩",

        ordre:
            3
    },

    "epicerie": {
        nom:
            "Épicerie",

        emoji:
            "🥫",

        ordre:
            4
    },

    "boulangerie": {
        nom:
            "Boulangerie",

        emoji:
            "🥖",

        ordre:
            5
    },

    "surgeles": {
        nom:
            "Surgelés",

        emoji:
            "❄️",

        ordre:
            6
    },

    "boissons": {
        nom:
            "Boissons",

        emoji:
            "🥤",

        ordre:
            7
    },

    "maison": {
        nom:
            "Maison & entretien",

        emoji:
            "🏠",

        ordre:
            8
    },

    "divers": {
        nom:
            "Divers",

        emoji:
            "🛒",

        ordre:
            9
    }

};


/* =================================
   OUTILS DATES
================================= */

function obtenirDebutSemaine(
    date
) {

    const copie =
        new Date(
            date
        );

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
        new Date(
            date
        );

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

    return String(
        valeur
    )
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
        .normalize(
            "NFD"
        )
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
        Number(
            valeur
        );

    if (
        !Number.isFinite(
            nombre
        )
    ) {

        return "";
    }

    if (
        Number.isInteger(
            nombre
        )
    ) {

        return String(
            nombre
        );
    }

    return nombre
        .toFixed(
            2
        )
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
   CATÉGORIE AUTOMATIQUE
================================= */

function determinerCategorieIngredient(
    nomIngredient
) {

    const nom =
        normaliserTexte(
            nomIngredient
        );


    /* =========================
       FRUITS & LÉGUMES
    ========================= */

    const fruitsLegumes = [

        "tomate",
        "courgette",
        "aubergine",
        "carotte",
        "oignon",
        "echalote",
        "ail",
        "poireau",
        "poivron",
        "champignon",
        "salade",
        "laitue",
        "epinard",
        "brocoli",
        "chou",
        "haricot vert",
        "concombre",
        "avocat",
        "pomme de terre",
        "patate douce",
        "citron",
        "orange",
        "pomme",
        "poire",
        "banane",
        "fraise",
        "framboise",
        "myrtille",
        "persil",
        "coriandre",
        "basilic",
        "menthe"
    ];


    if (
        fruitsLegumes.some(
            function (
                mot
            ) {

                return nom.includes(
                    mot
                );
            }
        )
    ) {

        return "fruits-legumes";
    }


    /* =========================
       FRAIS
    ========================= */

    const frais = [

        "lait",
        "creme",
        "beurre",
        "fromage",
        "parmesan",
        "mozzarella",
        "emmental",
        "gruyere",
        "chevre",
        "feta",
        "yaourt",
        "yogourt",
        "oeuf",
        "mascarpone",
        "ricotta",
        "burrata"
    ];


    if (
        frais.some(
            function (
                mot
            ) {

                return nom.includes(
                    mot
                );
            }
        )
    ) {

        return "frais";
    }


    /* =========================
       VIANDES & POISSONS
    ========================= */

    const viandesPoissons = [

        "poulet",
        "boeuf",
        "steak",
        "porc",
        "veau",
        "agneau",
        "dinde",
        "jambon",
        "lardon",
        "saucisse",
        "merguez",
        "saumon",
        "thon",
        "cabillaud",
        "crevette",
        "poisson",
        "viande",
        "bacon"
    ];


    if (
        viandesPoissons.some(
            function (
                mot
            ) {

                return nom.includes(
                    mot
                );
            }
        )
    ) {

        return "viandes-poissons";
    }


    /* =========================
       BOULANGERIE
    ========================= */

    const boulangerie = [

        "pain",
        "baguette",
        "brioche",
        "tortilla",
        "wrap"
    ];


    if (
        boulangerie.some(
            function (
                mot
            ) {

                return nom.includes(
                    mot
                );
            }
        )
    ) {

        return "boulangerie";
    }


    /* =========================
       SURGELÉS
    ========================= */

    const surgeles = [

        "surgele",
        "glace"
    ];


    if (
        surgeles.some(
            function (
                mot
            ) {

                return nom.includes(
                    mot
                );
            }
        )
    ) {

        return "surgeles";
    }


    /* =========================
       BOISSONS
    ========================= */

    const boissons = [

        "eau",
        "jus",
        "soda",
        "limonade",
        "coca",
        "sirop"
    ];


    if (
        boissons.some(
            function (
                mot
            ) {

                return nom.includes(
                    mot
                );
            }
        )
    ) {

        return "boissons";
    }


    /* =========================
       ÉPICERIE
    ========================= */

    const epicerie = [

        "pate",
        "spaghetti",
        "tagliatelle",
        "riz",
        "farine",
        "sucre",
        "sel",
        "poivre",
        "huile",
        "vinaigre",
        "moutarde",
        "mayonnaise",
        "ketchup",
        "miel",
        "chocolat",
        "levure",
        "semoule",
        "quinoa",
        "lentille",
        "pois chiche",
        "haricot rouge",
        "conserve",
        "bouillon",
        "epice",
        "paprika",
        "curry",
        "cumin",
        "cannelle",
        "vanille",
        "maizena",
        "chapelure",
        "noix",
        "amande",
        "noisette"
    ];


    if (
        epicerie.some(
            function (
                mot
            ) {

                return nom.includes(
                    mot
                );
            }
        )
    ) {

        return "epicerie";
    }


    return "divers";
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
            .limit(
                1
            )
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
        Array.isArray(
            data
        )
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
        Array.isArray(
            data
        )
            ? data
            : [];
}


/* =================================
   CHARGER LES ARTICLES MANUELS
================================= */

async function chargerArticlesManuels() {

    const dateSemaine =
        formaterDateISO(
            debutSemaine
        );


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "courses_manuelles"
            )
            .select(`
                id,
                foyer_id,
                nom,
                quantite,
                categorie,
                semaine,
                created_by,
                created_at
            `)
            .eq(
                "foyer_id",
                foyerId
            )
            .eq(
                "semaine",
                dateSemaine
            )
            .order(
                "created_at",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        throw error;
    }


    articlesManuels =
        Array.isArray(
            data
        )
            ? data
            : [];
}


/* =================================
   CHARGER LES CASES COCHÉES
   DEPUIS SUPABASE
================================= */

async function chargerArticlesCoches() {

    const dateSemaine =
        formaterDateISO(
            debutSemaine
        );


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "courses_cochees"
            )
            .select(
                "article_cle"
            )
            .eq(
                "foyer_id",
                foyerId
            )
            .eq(
                "semaine",
                dateSemaine
            );


    if (
        error
    ) {

        throw error;
    }


    articlesCoches =
        Array.isArray(
            data
        )
            ? data
                .map(
                    function (
                        ligne
                    ) {

                        return ligne.article_cle;
                    }
                )
                .filter(Boolean)
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
        )
            .trim();


    if (!nom) {
        return;
    }


    const unite =
        String(
            ingredient.unite || ""
        )
            .trim();


    const categorie =
        determinerCategorieIngredient(
            nom
        );


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


    if (!article) {

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
                true,

            categorie:
                categorie,

            manuel:
                false,

            idManuel:
                null

        };


        collection.set(
            cle,
            article
        );
    }


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
   CALCUL DES INGRÉDIENTS
   DES RECETTES
================================= */

function calculerArticlesRecettes() {

    const collection =
        new Map();


    repasSemaine.forEach(
        function (
            repas
        ) {

            if (
                !repas.recette_id
            ) {

                return;
            }


            const recette =
                trouverRecette(
                    repas.recette_id
                );


            if (!recette) {
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


    return Array.from(
        collection.values()
    );
}


/* =================================
   ARTICLES MANUELS
================================= */

function convertirArticlesManuels() {

    return articlesManuels.map(
        function (
            article
        ) {

            const categorieExiste =
                Boolean(
                    categoriesCourses[
                        article.categorie
                    ]
                );


            return {

                cle:
                    `manuel__${article.id}`,

                nom:
                    article.nom,

                unite:
                    "",

                quantite:
                    null,

                quantiteNumerique:
                    false,

                quantiteTexte:
                    article.quantite ||
                    "",

                categorie:
                    categorieExiste
                        ? article.categorie
                        : "divers",

                manuel:
                    true,

                idManuel:
                    article.id

            };
        }
    );
}


/* =================================
   CONSTRUIRE LA LISTE COMPLÈTE
================================= */

function calculerListeCourses() {

    const articlesRecettes =
        calculerArticlesRecettes();


    const articlesManuelsFormates =
        convertirArticlesManuels();


    articlesCourses = [

        ...articlesRecettes,

        ...articlesManuelsFormates

    ];


    articlesCourses.sort(
        function (
            articleA,
            articleB
        ) {

            const categorieA =
                categoriesCourses[
                    articleA.categorie
                ] ||
                categoriesCourses.divers;


            const categorieB =
                categoriesCourses[
                    articleB.categorie
                ] ||
                categoriesCourses.divers;


            if (
                categorieA.ordre !==
                categorieB.ordre
            ) {

                return (
                    categorieA.ordre -
                    categorieB.ordre
                );
            }


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
        article.manuel
    ) {

        return article.quantiteTexte ||
            "";
    }


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
   COCHER UN ARTICLE DANS SUPABASE
================================= */

async function cocherArticleSupabase(
    cleArticle
) {

    const dateSemaine =
        formaterDateISO(
            debutSemaine
        );


    const {
        error
    } =
        await window.supabaseClient
            .from(
                "courses_cochees"
            )
            .upsert(
                {

                    foyer_id:
                        foyerId,

                    semaine:
                        dateSemaine,

                    article_cle:
                        cleArticle,

                    coche_par:
                        utilisateurConnecte.id

                },
                {
                    onConflict:
                        "foyer_id,semaine,article_cle"
                }
            );


    if (
        error
    ) {

        throw error;
    }


    if (
        !articlesCoches.includes(
            cleArticle
        )
    ) {

        articlesCoches.push(
            cleArticle
        );
    }
}


/* =================================
   DÉCOCHER UN ARTICLE DANS SUPABASE
================================= */

async function decocherArticleSupabase(
    cleArticle
) {

    const dateSemaine =
        formaterDateISO(
            debutSemaine
        );


    const {
        error
    } =
        await window.supabaseClient
            .from(
                "courses_cochees"
            )
            .delete()
            .eq(
                "foyer_id",
                foyerId
            )
            .eq(
                "semaine",
                dateSemaine
            )
            .eq(
                "article_cle",
                cleArticle
            );


    if (
        error
    ) {

        throw error;
    }


    articlesCoches =
        articlesCoches.filter(
            function (
                cle
            ) {

                return (
                    cle !==
                    cleArticle
                );
            }
        );
}


/* =================================
   TOUT DÉCOCHER DANS SUPABASE
================================= */

async function toutDecocherSupabase() {

    const dateSemaine =
        formaterDateISO(
            debutSemaine
        );


    const {
        error
    } =
        await window.supabaseClient
            .from(
                "courses_cochees"
            )
            .delete()
            .eq(
                "foyer_id",
                foyerId
            )
            .eq(
                "semaine",
                dateSemaine
            );


    if (
        error
    ) {

        throw error;
    }


    articlesCoches =
        [];
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
   GROUPER LES ARTICLES
================================= */

function grouperArticlesParCategorie() {

    const groupes =
        new Map();


    articlesCourses.forEach(
        function (
            article
        ) {

            const categorie =
                categoriesCourses[
                    article.categorie
                ]
                    ? article.categorie
                    : "divers";


            if (
                !groupes.has(
                    categorie
                )
            ) {

                groupes.set(
                    categorie,
                    []
                );
            }


            groupes
                .get(
                    categorie
                )
                .push(
                    article
                );
        }
    );


    return Array.from(
        groupes.entries()
    )
        .sort(
            function (
                groupeA,
                groupeB
            ) {

                const infosA =
                    categoriesCourses[
                        groupeA[0]
                    ];


                const infosB =
                    categoriesCourses[
                        groupeB[0]
                    ];


                return (
                    infosA.ordre -
                    infosB.ordre
                );
            }
        );
}


/* =================================
   CRÉER UNE LIGNE D'ARTICLE
================================= */

function creerHtmlArticle(
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
            } ${
                article.manuel
                    ? "article-course-manuel"
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

                    ${
                        article.manuel
                            ? `
                                <span class="badge-article-manuel">
                                    Manuel
                                </span>
                            `
                            : ""
                    }

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


            ${
                article.manuel
                    ? `
                        <button
                            type="button"
                            class="bouton-supprimer-article-manuel"
                            data-supprimer-article-id="${article.idManuel}"
                            aria-label="Supprimer cet article"
                            title="Supprimer cet article"
                        >
                            🗑️
                        </button>
                    `
                    : ""
            }

        </div>

    `;
}

/* =================================
   AFFICHER LA LISTE
================================= */

function afficherListeCourses() {

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


    const groupes =
        grouperArticlesParCategorie();


    let indexGlobal =
        0;


    listeCourses.innerHTML =
        groupes
            .map(
                function (
                    groupe
                ) {

                    const categorie =
                        groupe[0];


                    const articles =
                        groupe[1];


                    const informations =
                        categoriesCourses[
                            categorie
                        ] ||
                        categoriesCourses.divers;


                    const lignes =
                        articles
                            .map(
                                function (
                                    article
                                ) {

                                    const html =
                                        creerHtmlArticle(
                                            article,
                                            indexGlobal
                                        );


                                    indexGlobal +=
                                        1;


                                    return html;
                                }
                            )
                            .join("");


                    return `

                        <div class="groupe-courses">

                            <div class="entete-groupe-courses">

                                <span>
                                    ${informations.emoji}
                                </span>

                                <span>
                                    ${informations.nom}
                                </span>

                            </div>


                            <div class="liste-groupe-courses">

                                ${lignes}

                            </div>

                        </div>

                    `;
                }
            )
            .join("");
}


/* =================================
   COCHER / DÉCOCHER
   SYNCHRONISÉ SUPABASE
================================= */

listeCourses.addEventListener(
    "change",
    async function (
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


        const cle =
            ligne.dataset.articleCle;


        if (
            !cle
        ) {

            return;
        }


        /*
            On bloque temporairement
            la case pendant l'écriture.
        */

        caseArticle.disabled =
            true;


        try {

            if (
                caseArticle.checked
            ) {

                await cocherArticleSupabase(
                    cle
                );

            } else {

                await decocherArticleSupabase(
                    cle
                );
            }


            ligne.classList.toggle(
                "coche",
                caseArticle.checked
            );


        } catch (
            erreur
        ) {

            console.error(
                "Erreur synchronisation article :",
                erreur
            );


            /*
                On remet la case dans
                son état précédent si
                Supabase refuse.
            */

            caseArticle.checked =
                !caseArticle.checked;


            ligne.classList.toggle(
                "coche",
                caseArticle.checked
            );


        } finally {

            caseArticle.disabled =
                false;
        }
    }
);


/* =================================
   TOUT DÉCOCHER
================================= */

boutonToutDecocher.addEventListener(
    "click",
    async function () {

        boutonToutDecocher.disabled =
            true;


        const texteInitial =
            boutonToutDecocher.textContent;


        boutonToutDecocher.textContent =
            "Décochage…";


        try {

            await toutDecocherSupabase();


            afficherListeCourses();


        } catch (
            erreur
        ) {

            console.error(
                "Erreur Tout décocher :",
                erreur
            );


        } finally {

            boutonToutDecocher.disabled =
                false;


            boutonToutDecocher.textContent =
                texteInitial;
        }
    }
);


/* =================================
   AJOUT MANUEL
================================= */

formulaireArticleManuel.addEventListener(
    "submit",
    async function (
        evenement
    ) {

        evenement.preventDefault();


        messageArticleManuel.textContent =
            "";


        const nom =
            champNomArticleManuel
                .value
                .trim();


        const quantite =
            champQuantiteArticleManuel
                .value
                .trim();


        const categorie =
            champCategorieArticleManuel
                .value ||
                "divers";


        if (
            !nom
        ) {

            messageArticleManuel.textContent =
                "Renseigne le nom de l'article.";

            return;
        }


        if (
            !foyerId ||
            !utilisateurConnecte
        ) {

            messageArticleManuel.textContent =
                "Impossible de déterminer votre foyer.";

            return;
        }


        boutonAjouterArticleManuel.disabled =
            true;


        boutonAjouterArticleManuel.textContent =
            "Ajout…";


        try {

            const {
                error
            } =
                await window.supabaseClient
                    .from(
                        "courses_manuelles"
                    )
                    .insert({

                        foyer_id:
                            foyerId,

                        nom:
                            nom,

                        quantite:
                            quantite ||
                            null,

                        categorie:
                            categoriesCourses[
                                categorie
                            ]
                                ? categorie
                                : "divers",

                        semaine:
                            formaterDateISO(
                                debutSemaine
                            ),

                        created_by:
                            utilisateurConnecte.id

                    });


            if (
                error
            ) {

                throw error;
            }


            champNomArticleManuel.value =
                "";


            champQuantiteArticleManuel.value =
                "";


            champCategorieArticleManuel.value =
                "divers";


            await rafraichirCourses();


            messageArticleManuel.textContent =
                "Article ajouté ✓";


            setTimeout(
                function () {

                    messageArticleManuel.textContent =
                        "";

                },
                1800
            );


        } catch (
            erreur
        ) {

            console.error(
                "Erreur ajout article manuel :",
                erreur
            );


            messageArticleManuel.textContent =
                erreur.message ||
                "Impossible d'ajouter l'article.";


        } finally {

            boutonAjouterArticleManuel.disabled =
                false;


            boutonAjouterArticleManuel.textContent =
                "+ Ajouter";
        }
    }
);


/* =================================
   SUPPRIMER ARTICLE MANUEL
================================= */

listeCourses.addEventListener(
    "click",
    async function (
        evenement
    ) {

        const boutonSupprimer =
            evenement.target.closest(
                "[data-supprimer-article-id]"
            );


        if (
            !boutonSupprimer
        ) {

            return;
        }


        const articleId =
            boutonSupprimer.dataset
                .supprimerArticleId;


        if (
            !articleId
        ) {

            return;
        }


        boutonSupprimer.disabled =
            true;


        try {

            const {
                error
            } =
                await window.supabaseClient
                    .from(
                        "courses_manuelles"
                    )
                    .delete()
                    .eq(
                        "id",
                        articleId
                    )
                    .eq(
                        "foyer_id",
                        foyerId
                    );


            if (
                error
            ) {

                throw error;
            }


            /*
                L'article manuel peut
                aussi être coché dans
                courses_cochees.

                On supprime cette entrée
                pour garder la base propre.
            */

            const cleArticle =
                `manuel__${articleId}`;


            try {

                await decocherArticleSupabase(
                    cleArticle
                );

            } catch (
                erreurDecochage
            ) {

                /*
                    Ce n'est pas bloquant :
                    l'article peut ne pas
                    avoir été coché.
                */

                console.warn(
                    "Nettoyage de la case cochée non effectué :",
                    erreurDecochage
                );
            }


            await rafraichirCourses();


        } catch (
            erreur
        ) {

            console.error(
                "Erreur suppression article manuel :",
                erreur
            );


            boutonSupprimer.disabled =
                false;
        }
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

        /*
            1. Repas planifiés
        */

        await chargerRepasSemaine();


        /*
            2. Recettes utilisées
        */

        await chargerRecettesSemaine();


        /*
            3. Articles manuels
            de la semaine
        */

        await chargerArticlesManuels();


        /*
            4. Cases cochées synchronisées
            depuis Supabase
        */

        await chargerArticlesCoches();


        /*
            5. Calcul complet
        */

        calculerListeCourses();


        /*
            6. Résumé
        */

        afficherResume();


        /*
            7. Affichage
        */

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


            messageArticleManuel.textContent =
                "";


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


            messageArticleManuel.textContent =
                "";


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


            messageArticleManuel.textContent =
                "";


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
