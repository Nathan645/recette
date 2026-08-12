/* ==========================================
   COURSES-DATA.JS
   À notre table

   Ce fichier gère uniquement :
   - utilisateur / foyer
   - liste active
   - période de courses
   - planning compris dans la période
   - recettes et plats libres
   - calcul des ingrédients
   - synchronisation Supabase
   - articles manuels
   - coches

   Aucun affichage HTML ici.
========================================== */


/* ==========================================
   ÉTAT
========================================== */

let utilisateurCourses =
    null;

let foyerCoursesId =
    null;

let listeCoursesActive =
    null;

let repasPeriodeCourses =
    [];

let recettesPeriodeCourses =
    [];

let platsLibresCourses =
    [];

let articlesListeCourses =
    [];


/* ==========================================
   CATÉGORIES
========================================== */

const categoriesCourses = {

    "fruits-legumes": {
        nom: "Fruits & légumes",
        emoji: "🥕",
        ordre: 1
    },

    "frais": {
        nom: "Frais",
        emoji: "🧀",
        ordre: 2
    },

    "viandes-poissons": {
        nom: "Viandes & poissons",
        emoji: "🥩",
        ordre: 3
    },

    "epicerie": {
        nom: "Épicerie",
        emoji: "🥫",
        ordre: 4
    },

    "boulangerie": {
        nom: "Boulangerie",
        emoji: "🥖",
        ordre: 5
    },

    "surgeles": {
        nom: "Surgelés",
        emoji: "❄️",
        ordre: 6
    },

    "boissons": {
        nom: "Boissons",
        emoji: "🥤",
        ordre: 7
    },

    "maison": {
        nom: "Maison & entretien",
        emoji: "🏠",
        ordre: 8
    },

    "divers": {
        nom: "Divers",
        emoji: "🛒",
        ordre: 9
    }

};


/* ==========================================
   OUTILS DATES
========================================== */

function formaterDateISOCourses(
    date
) {

    const annee =
        date.getFullYear();

    const mois =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const jour =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${annee}-${mois}-${jour}`;
}


function creerDateDepuisISOCourses(
    dateISO
) {

    const [
        annee,
        mois,
        jour
    ] =
        String(
            dateISO
        )
            .split("-")
            .map(Number);


    return new Date(
        annee,
        mois - 1,
        jour,
        12,
        0,
        0,
        0
    );
}


function ajouterJoursCourses(
    date,
    nombre
) {

    const resultat =
        new Date(
            date
        );


    resultat.setDate(
        resultat.getDate() +
        nombre
    );


    return resultat;
}


/* ==========================================
   AUJOURD'HUI
========================================== */

function obtenirAujourdHuiCourses() {

    const maintenant =
        new Date();


    return new Date(
        maintenant.getFullYear(),
        maintenant.getMonth(),
        maintenant.getDate(),
        12,
        0,
        0,
        0
    );
}


/* ==========================================
   PROCHAIN DIMANCHE
========================================== */

function obtenirProchainDimancheCourses(
    dateDepart
) {

    const date =
        new Date(
            dateDepart
        );


    const jour =
        date.getDay();


    /*
        JS :
        dimanche = 0
        lundi    = 1
        ...
        samedi   = 6
    */

    let joursAJouter;


    /*
        Si aujourd'hui est dimanche,
        on prend le dimanche suivant.
    */

    if (
        jour === 0
    ) {

        joursAJouter =
            7;

    } else {

        joursAJouter =
            7 - jour;

    }


    return ajouterJoursCourses(
        date,
        joursAJouter
    );
}


/* ==========================================
   PÉRIODE PAR DÉFAUT
========================================== */

function obtenirPeriodeCoursesParDefaut() {

    const debut =
        obtenirAujourdHuiCourses();


    const fin =
        obtenirProchainDimancheCourses(
            debut
        );


    return {

        dateDebut:
            formaterDateISOCourses(
                debut
            ),

        dateFin:
            formaterDateISOCourses(
                fin
            )

    };
}


/* ==========================================
   VALIDATION PÉRIODE
========================================== */

function verifierPeriodeCourses(
    dateDebut,
    dateFin
) {

    if (
        !dateDebut ||
        !dateFin
    ) {

        throw new Error(
            "Les deux dates doivent être renseignées."
        );
    }


    if (
        dateFin <
        dateDebut
    ) {

        throw new Error(
            "La date de fin ne peut pas être antérieure à la date de début."
        );
    }


    return true;
}


/* ==========================================
   NORMALISATION TEXTE
========================================== */

function normaliserTexteCourses(
    texte
) {

    return String(
        texte ||
        ""
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


/* ==========================================
   UNITÉS
========================================== */

function normaliserUniteCourses(
    unite
) {

    const valeur =
        normaliserTexteCourses(
            unite
        );


    if (
        [
            "g",
            "gr",
            "gramme",
            "grammes"
        ].includes(
            valeur
        )
    ) {

        return "g";
    }


    if (
        [
            "kg",
            "kgs",
            "kilo",
            "kilos",
            "kilogramme",
            "kilogrammes"
        ].includes(
            valeur
        )
    ) {

        return "kg";
    }


    if (
        [
            "ml",
            "millilitre",
            "millilitres"
        ].includes(
            valeur
        )
    ) {

        return "ml";
    }


    if (
        [
            "cl",
            "centilitre",
            "centilitres"
        ].includes(
            valeur
        )
    ) {

        return "cl";
    }


    if (
        [
            "l",
            "litre",
            "litres"
        ].includes(
            valeur
        )
    ) {

        return "l";
    }


    return valeur;
}


/* ==========================================
   FAMILLE UNITÉ
========================================== */

function obtenirFamilleUniteCourses(
    unite
) {

    const uniteNormalisee =
        normaliserUniteCourses(
            unite
        );


    if (
        uniteNormalisee === "g" ||
        uniteNormalisee === "kg"
    ) {

        return "masse";
    }


    if (
        uniteNormalisee === "ml" ||
        uniteNormalisee === "cl" ||
        uniteNormalisee === "l"
    ) {

        return "volume";
    }


    return (
        "autre__" +
        uniteNormalisee
    );
}


/* ==========================================
   CONVERSION UNITÉ DE BASE
========================================== */

function convertirVersBaseCourses(
    quantite,
    unite
) {

    const nombre =
        Number(
            quantite
        );


    if (
        !Number.isFinite(
            nombre
        )
    ) {

        return null;
    }


    const uniteNormalisee =
        normaliserUniteCourses(
            unite
        );


    if (
        uniteNormalisee ===
        "kg"
    ) {

        return nombre * 1000;
    }


    if (
        uniteNormalisee ===
        "g"
    ) {

        return nombre;
    }


    if (
        uniteNormalisee ===
        "l"
    ) {

        return nombre * 1000;
    }


    if (
        uniteNormalisee ===
        "cl"
    ) {

        return nombre * 10;
    }


    if (
        uniteNormalisee ===
        "ml"
    ) {

        return nombre;
    }


    return nombre;
}


/* ==========================================
   CONVERSION POUR AFFICHAGE
========================================== */

function convertirDepuisBaseCourses(
    quantiteBase,
    famille,
    unitesOrigine = []
) {

    const quantite =
        Number(
            quantiteBase
        );


    if (
        !Number.isFinite(
            quantite
        )
    ) {

        return {
            quantite: null,
            unite: ""
        };
    }


    if (
        famille ===
        "masse"
    ) {

        if (
            quantite >=
            1000
        ) {

            return {

                quantite:
                    quantite /
                    1000,

                unite:
                    "kg"

            };
        }


        return {

            quantite:
                quantite,

            unite:
                "g"

        };
    }


    if (
        famille ===
        "volume"
    ) {

        if (
            quantite >=
            1000
        ) {

            return {

                quantite:
                    quantite /
                    1000,

                unite:
                    "L"

            };
        }


        const contientCl =
            unitesOrigine.includes(
                "cl"
            );


        if (
            contientCl &&
            quantite >= 100 &&
            quantite % 10 === 0
        ) {

            return {

                quantite:
                    quantite /
                    10,

                unite:
                    "cl"

            };
        }


        return {

            quantite:
                quantite,

            unite:
                "ml"

        };
    }


    return {

        quantite:
            quantite,

        unite:
            ""

    };
}


/* ==========================================
   CATÉGORIE AUTOMATIQUE
========================================== */

function determinerCategorieCourses(
    nomIngredient
) {

    const nom =
        normaliserTexteCourses(
            nomIngredient
        );


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
            mot =>
                nom.includes(
                    mot
                )
        )
    ) {

        return "fruits-legumes";
    }


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
            mot =>
                nom.includes(
                    mot
                )
        )
    ) {

        return "frais";
    }


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
            mot =>
                nom.includes(
                    mot
                )
        )
    ) {

        return "viandes-poissons";
    }


    const boulangerie = [

        "pain",
        "baguette",
        "brioche",
        "tortilla",
        "wrap"

    ];


    if (
        boulangerie.some(
            mot =>
                nom.includes(
                    mot
                )
        )
    ) {

        return "boulangerie";
    }


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
            mot =>
                nom.includes(
                    mot
                )
        )
    ) {

        return "boissons";
    }


    const surgeles = [
        "surgele",
        "glace"
    ];


    if (
        surgeles.some(
            mot =>
                nom.includes(
                    mot
                )
        )
    ) {

        return "surgeles";
    }


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
            mot =>
                nom.includes(
                    mot
                )
        )
    ) {

        return "epicerie";
    }


    return "divers";
}


/* ==========================================
   UTILISATEUR + FOYER
========================================== */

async function recupererUtilisateurEtFoyerCourses() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .auth
            .getUser();


    if (
        error
    ) {

        throw error;
    }


    utilisateurCourses =
        data.user;


    if (
        !utilisateurCourses
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
                utilisateurCourses.id
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


    foyerCoursesId =
        membre.foyer_id;


    return true;
}


/* ==========================================
   CHERCHER LA LISTE ACTIVE
========================================== */

async function chargerListeCoursesActive() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "listes_courses"
            )
            .select(`
                id,
                foyer_id,
                date_debut,
                date_fin,
                statut,
                created_by,
                created_at,
                updated_at,
                terminee_at
            `)
            .eq(
                "foyer_id",
                foyerCoursesId
            )
            .eq(
                "statut",
                "active"
            )
            .maybeSingle();


    if (
        error
    ) {

        throw error;
    }


    listeCoursesActive =
        data || null;


    return listeCoursesActive;
}


/* ==========================================
   CRÉER UNE LISTE ACTIVE
========================================== */

async function creerListeCoursesActive() {

    const periode =
        obtenirPeriodeCoursesParDefaut();


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "listes_courses"
            )
            .insert({

                foyer_id:
                    foyerCoursesId,

                date_debut:
                    periode.dateDebut,

                date_fin:
                    periode.dateFin,

                statut:
                    "active",

                created_by:
                    utilisateurCourses.id

            })
            .select()
            .single();


    if (
        error
    ) {

        throw error;
    }


    listeCoursesActive =
        data;


    return data;
}


/* ==========================================
   LISTE ACTIVE OU CRÉATION
========================================== */

async function obtenirOuCreerListeCoursesActive() {

    await chargerListeCoursesActive();


    if (
        listeCoursesActive
    ) {

        return listeCoursesActive;
    }


    return await creerListeCoursesActive();
}


/* ==========================================
   MODIFIER LA PÉRIODE
========================================== */

async function modifierPeriodeListeCourses(
    dateDebut,
    dateFin
) {

    verifierPeriodeCourses(
        dateDebut,
        dateFin
    );


    if (
        !listeCoursesActive
    ) {

        throw new Error(
            "Aucune liste de courses active."
        );
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "listes_courses"
            )
            .update({

                date_debut:
                    dateDebut,

                date_fin:
                    dateFin

            })
            .eq(
                "id",
                listeCoursesActive.id
            )
            .eq(
                "foyer_id",
                foyerCoursesId
            )
            .select()
            .single();


    if (
        error
    ) {

        throw error;
    }


    listeCoursesActive =
        data;


    return data;
}


/* ==========================================
   CHARGER LE PLANNING DE LA PÉRIODE
========================================== */

async function chargerPlanningPeriodeCourses() {

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
                personnes,
                nom,
                recette_id,

                repas_planning_elements (
                    id,
                    recette_id,
                    nom,
                    ordre
                )
            `)
            .eq(
                "foyer_id",
                foyerCoursesId
            )
            .gte(
                "date",
                listeCoursesActive.date_debut
            )
            .lte(
                "date",
                listeCoursesActive.date_fin
            )
            .order(
                "date",
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


    repasPeriodeCourses =
        Array.isArray(
            data
        )
            ? data
            : [];


    return repasPeriodeCourses;
}


/* ==========================================
   TOUS LES ÉLÉMENTS DU PLANNING
========================================== */

function obtenirElementsPlanningCourses() {

    const elements =
        [];


    repasPeriodeCourses.forEach(
        function (
            repas
        ) {

            let elementsRepas =
                Array.isArray(
                    repas.repas_planning_elements
                )
                    ? repas.repas_planning_elements
                    : [];


            /*
                Compatibilité avec
                les anciens repas.
            */

            if (
                elementsRepas.length === 0 &&
                repas.nom
            ) {

                elementsRepas = [

                    {
                        id:
                            null,

                        recette_id:
                            repas.recette_id ||
                            null,

                        nom:
                            repas.nom,

                        ordre:
                            1
                    }

                ];
            }


            elementsRepas.forEach(
                function (
                    element
                ) {

                    elements.push({

                        repas_id:
                            repas.id,

                        date:
                            repas.date,

                        moment:
                            repas.moment,

                        personnes:
                            repas.personnes,

                        element_id:
                            element.id,

                        recette_id:
                            element.recette_id,

                        nom:
                            element.nom

                    });

                }
            );

        }
    );


    return elements;
}


/* ==========================================
   DÉTECTER LES PLATS LIBRES
========================================== */

function calculerPlatsLibresCourses() {

    platsLibresCourses =
        obtenirElementsPlanningCourses()
            .filter(
                function (
                    element
                ) {

                    return (
                        !element.recette_id
                    );
                }
            );


    return platsLibresCourses;
}


/* ==========================================
   CHARGER LES RECETTES
========================================== */

async function chargerRecettesPeriodeCourses() {

    const ids =
        [
            ...new Set(
                obtenirElementsPlanningCourses()
                    .filter(
                        element =>
                            Boolean(
                                element.recette_id
                            )
                    )
                    .map(
                        element =>
                            element.recette_id
                    )
            )
        ];


    if (
        ids.length ===
        0
    ) {

        recettesPeriodeCourses =
            [];

        return [];
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
                ids
            );


    if (
        error
    ) {

        throw error;
    }


    recettesPeriodeCourses =
        Array.isArray(
            data
        )
            ? data
            : [];


    return recettesPeriodeCourses;
}


/* ==========================================
   TROUVER UNE RECETTE
========================================== */

function trouverRecetteCourses(
    recetteId
) {

    return recettesPeriodeCourses.find(
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


/* ==========================================
   AJOUTER / REGROUPER UN INGRÉDIENT
========================================== */

function ajouterIngredientCourses(
    collection,
    ingredient,
    quantiteCalculee
) {

    if (
        !ingredient
    ) {

        return;
    }


    const objetIngredient =
        typeof ingredient ===
        "string"
            ? {
                nom:
                    ingredient,

                unite:
                    ""
            }
            : ingredient;


    const nom =
        String(
            objetIngredient.nom ||
            ""
        ).trim();


    if (
        !nom
    ) {

        return;
    }


    const unite =
        normaliserUniteCourses(
            objetIngredient.unite ||
            ""
        );


    const famille =
        obtenirFamilleUniteCourses(
            unite
        );


    const cle =
        `${normaliserTexteCourses(
            nom
        )}__${famille}`;


    let article =
        collection.get(
            cle
        );


    if (
        !article
    ) {

        article = {

            cle_article:
                cle,

            nom:
                nom,

            categorie:
                determinerCategorieCourses(
                    nom
                ),

            famille:
                famille,

            uniteInitiale:
                unite,

            unitesOrigine:
                [],

            quantiteBase:
                0,

            quantiteNumerique:
                true

        };


        collection.set(
            cle,
            article
        );
    }


    if (
        unite &&
        !article.unitesOrigine.includes(
            unite
        )
    ) {

        article.unitesOrigine.push(
            unite
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


    const quantiteBase =
        convertirVersBaseCourses(
            quantiteCalculee,
            unite
        );


    if (
        quantiteBase === null
    ) {

        article.quantiteNumerique =
            false;

        return;
    }


    article.quantiteBase +=
        quantiteBase;
}


/* ==========================================
   CALCULER LES INGRÉDIENTS
========================================== */

function calculerArticlesPlanningCourses() {

    const collection =
        new Map();


    const elements =
        obtenirElementsPlanningCourses();


    elements.forEach(
        function (
            element
        ) {

            if (
                !element.recette_id
            ) {

                return;
            }


            const recette =
                trouverRecetteCourses(
                    element.recette_id
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
                    element.personnes
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

                        ajouterIngredientCourses(
                            collection,
                            ingredient,
                            null
                        );

                        return;
                    }


                    let quantite =
                        ingredient.quantite;


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

                        quantite =
                            Number(
                                quantite
                            ) *
                            coefficient;
                    }


                    ajouterIngredientCourses(
                        collection,
                        ingredient,
                        quantite
                    );

                }
            );

        }
    );


    return Array.from(
        collection.values()
    )
        .map(
            function (
                article
            ) {

                /*
                    Pas de quantité numérique.
                */

                if (
                    !article.quantiteNumerique
                ) {

                    return {

                        cle_article:
                            article.cle_article,

                        nom:
                            article.nom,

                        quantite:
                            null,

                        unite:
                            article.uniteInitiale ||
                            null,

                        categorie:
                            article.categorie

                    };
                }


                const affichage =
                    convertirDepuisBaseCourses(
                        article.quantiteBase,
                        article.famille,
                        article.unitesOrigine
                    );


                return {

                    cle_article:
                        article.cle_article,

                    nom:
                        article.nom,

                    quantite:
                        affichage.quantite,

                    unite:
                        affichage.unite ||
                        article.uniteInitiale ||
                        null,

                    categorie:
                        article.categorie

                };

            }
        );
}


/* ==========================================
   CHARGER LES ARTICLES DE LA LISTE
========================================== */

async function chargerArticlesListeCourses() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "liste_courses_articles"
            )
            .select(`
                id,
                liste_id,
                nom,
                quantite,
                unite,
                categorie,
                coche,
                source,
                recette_id,
                cle_article,
                created_at,
                updated_at
            `)
            .eq(
                "liste_id",
                listeCoursesActive.id
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


    articlesListeCourses =
        Array.isArray(
            data
        )
            ? data
            : [];


    return articlesListeCourses;
}


/* ==========================================
   SYNCHRONISER ARTICLES DU PLANNING
========================================== */

async function synchroniserArticlesPlanningCourses() {

    const calcules =
        calculerArticlesPlanningCourses();


    const clesCalculees =
        new Set(
            calcules.map(
                article =>
                    article.cle_article
            )
        );


    /*
        1. Supprimer les anciens articles
        automatiques qui ne servent plus.

        Les articles manuels ne sont
        JAMAIS touchés ici.
    */

    const anciensPlanning =
        articlesListeCourses.filter(
            function (
                article
            ) {

                return (
                    article.source ===
                        "planning" &&
                    article.cle_article &&
                    !clesCalculees.has(
                        article.cle_article
                    )
                );
            }
        );


    if (
        anciensPlanning.length >
        0
    ) {

        const idsASupprimer =
            anciensPlanning.map(
                article =>
                    article.id
            );


        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "liste_courses_articles"
                )
                .delete()
                .in(
                    "id",
                    idsASupprimer
                );


        if (
            error
        ) {

            throw error;
        }
    }


    /*
        2. Upsert des ingrédients actuels.

        IMPORTANT :
        on ne transmet PAS "coche".

        Ainsi, un article déjà coché
        reste coché lorsque la période
        ou le planning est actualisé.
    */

    if (
        calcules.length >
        0
    ) {

        const lignes =
            calcules.map(
                function (
                    article
                ) {

                    return {

                        liste_id:
                            listeCoursesActive.id,

                        nom:
                            article.nom,

                        quantite:
                            article.quantite,

                        unite:
                            article.unite,

                        categorie:
                            article.categorie,

                        source:
                            "planning",

                        recette_id:
                            null,

                        cle_article:
                            article.cle_article

                    };

                }
            );


        const {
            error
        } =
            await window.supabaseClient
                .from(
                    "liste_courses_articles"
                )
                .upsert(
                    lignes,
                    {
                        onConflict:
                            "liste_id,cle_article"
                    }
                );


        if (
            error
        ) {

            throw error;
        }
    }


    await chargerArticlesListeCourses();
}


/* ==========================================
   SYNCHRONISER TOUTE LA LISTE
========================================== */

async function synchroniserListeCourses() {

    if (
        !listeCoursesActive
    ) {

        throw new Error(
            "Aucune liste active."
        );
    }


    await chargerPlanningPeriodeCourses();

    calculerPlatsLibresCourses();

    await chargerRecettesPeriodeCourses();

    await chargerArticlesListeCourses();

    await synchroniserArticlesPlanningCourses();


    return {

        repas:
            repasPeriodeCourses,

        recettes:
            recettesPeriodeCourses,

        platsLibres:
            platsLibresCourses,

        articles:
            articlesListeCourses

    };
}


/* ==========================================
   COCHER / DÉCOCHER
========================================== */

async function modifierEtatArticleCourses(
    articleId,
    coche
) {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "liste_courses_articles"
            )
            .update({

                coche:
                    Boolean(
                        coche
                    )

            })
            .eq(
                "id",
                articleId
            )
            .eq(
                "liste_id",
                listeCoursesActive.id
            )
            .select()
            .single();


    if (
        error
    ) {

        throw error;
    }


    const articleLocal =
        articlesListeCourses.find(
            article =>
                String(
                    article.id
                ) ===
                String(
                    articleId
                )
        );


    if (
        articleLocal
    ) {

        articleLocal.coche =
            Boolean(
                coche
            );
    }


    return data;
}


/* ==========================================
   TOUT COCHER / TOUT DÉCOCHER
========================================== */

async function modifierTousArticlesCourses(
    coche
) {

    const {
        error
    } =
        await window.supabaseClient
            .from(
                "liste_courses_articles"
            )
            .update({

                coche:
                    Boolean(
                        coche
                    )

            })
            .eq(
                "liste_id",
                listeCoursesActive.id
            );


    if (
        error
    ) {

        throw error;
    }


    articlesListeCourses.forEach(
        article => {

            article.coche =
                Boolean(
                    coche
                );

        }
    );
}


/* ==========================================
   AJOUT MANUEL
========================================== */

async function ajouterArticleManuelCourses(
    nom,
    quantite,
    unite,
    categorie
) {

    const nomNettoye =
        String(
            nom ||
            ""
        ).trim();


    if (
        !nomNettoye
    ) {

        throw new Error(
            "Le nom de l'article est obligatoire."
        );
    }


    const cleManuelle =
        `manuel__${crypto.randomUUID()}`;


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "liste_courses_articles"
            )
            .insert({

                liste_id:
                    listeCoursesActive.id,

                nom:
                    nomNettoye,

                quantite:
                    quantite === "" ||
                    quantite === null
                        ? null
                        : Number(
                            quantite
                        ),

                unite:
                    String(
                        unite ||
                        ""
                    ).trim() ||
                    null,

                categorie:
                    categoriesCourses[
                        categorie
                    ]
                        ? categorie
                        : "divers",

                coche:
                    false,

                source:
                    "manuel",

                recette_id:
                    null,

                cle_article:
                    cleManuelle

            })
            .select()
            .single();


    if (
        error
    ) {

        throw error;
    }


    articlesListeCourses.push(
        data
    );


    return data;
}


/* ==========================================
   SUPPRIMER ARTICLE MANUEL
========================================== */

async function supprimerArticleManuelCourses(
    articleId
) {

    const {
        error
    } =
        await window.supabaseClient
            .from(
                "liste_courses_articles"
            )
            .delete()
            .eq(
                "id",
                articleId
            )
            .eq(
                "liste_id",
                listeCoursesActive.id
            )
            .eq(
                "source",
                "manuel"
            );


    if (
        error
    ) {

        throw error;
    }


    articlesListeCourses =
        articlesListeCourses.filter(
            article =>
                String(
                    article.id
                ) !==
                String(
                    articleId
                )
        );
}


/* ==========================================
   TERMINER LA LISTE
========================================== */

async function terminerListeCoursesActive() {

    if (
        !listeCoursesActive
    ) {

        throw new Error(
            "Aucune liste active."
        );
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "listes_courses"
            )
            .update({

                statut:
                    "terminee",

                terminee_at:
                    new Date()
                        .toISOString()

            })
            .eq(
                "id",
                listeCoursesActive.id
            )
            .eq(
                "foyer_id",
                foyerCoursesId
            )
            .select()
            .single();


    if (
        error
    ) {

        throw error;
    }


    listeCoursesActive =
        null;


    articlesListeCourses =
        [];


    repasPeriodeCourses =
        [];

    recettesPeriodeCourses =
        [];

    platsLibresCourses =
        [];


    return data;
}


/* ==========================================
   INFORMATIONS / STATISTIQUES
========================================== */

function obtenirStatistiquesCourses() {

    const total =
        articlesListeCourses.length;


    const coches =
        articlesListeCourses.filter(
            article =>
                article.coche
        ).length;


    const elementsPlanning =
        obtenirElementsPlanningCourses();


    const recettesConnues =
        elementsPlanning.filter(
            element =>
                Boolean(
                    element.recette_id
                )
        );


    return {

        totalArticles:
            total,

        articlesCoches:
            coches,

        articlesRestants:
            total - coches,

        nombreRepas:
            repasPeriodeCourses.length,

        nombreRecettes:
            recettesConnues.length,

        nombrePlatsLibres:
            platsLibresCourses.length

    };
}


/* ==========================================
   INITIALISATION DATA
========================================== */

async function initialiserDonneesCourses() {

    const valide =
        await recupererUtilisateurEtFoyerCourses();


    if (
        !valide
    ) {

        return false;
    }


    await obtenirOuCreerListeCoursesActive();


    await synchroniserListeCourses();


    return true;
}
