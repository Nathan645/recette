/* ==========================================
   COURSES.JS
   À notre table

   Gestion de l'interface :
   - période début / fin
   - affichage de la liste
   - progression
   - plats libres
   - ajout manuel
   - coches
   - tout cocher / décocher
   - masquer les cochés
   - terminer les courses

   Les données Supabase sont gérées
   dans courses-data.js.
========================================== */


/* ==========================================
   ÉLÉMENTS HTML
========================================== */


/* =========================
   PÉRIODE
========================= */

const champDateDebutCourses =
    document.getElementById(
        "date-debut-courses"
    );

const champDateFinCourses =
    document.getElementById(
        "date-fin-courses"
    );

const boutonActualiserCourses =
    document.getElementById(
        "actualiser-courses"
    );

const messagePeriodeCourses =
    document.getElementById(
        "message-periode-courses"
    );


/* =========================
   RÉSUMÉ
========================= */

const nombreRepasCourses =
    document.getElementById(
        "nombre-repas-courses"
    );

const nombreRecettesCourses =
    document.getElementById(
        "nombre-recettes-courses"
    );

const nombrePlatsLibresCourses =
    document.getElementById(
        "nombre-plats-libres-courses"
    );

const nombreArticlesCourses =
    document.getElementById(
        "nombre-articles-courses"
    );


/* =========================
   PLATS LIBRES
========================= */

const alertePlatsLibres =
    document.getElementById(
        "alerte-plats-libres"
    );

const texteAlertePlatsLibres =
    document.getElementById(
        "texte-alerte-plats-libres"
    );

const listePlatsLibresCourses =
    document.getElementById(
        "liste-plats-libres-courses"
    );

const boutonAllerAjoutManuel =
    document.getElementById(
        "aller-ajout-manuel"
    );


/* =========================
   PROGRESSION
========================= */

const compteurProgressionCourses =
    document.getElementById(
        "compteur-progression-courses"
    );

const remplissageProgressionCourses =
    document.getElementById(
        "remplissage-progression-courses"
    );

const texteProgressionCourses =
    document.getElementById(
        "texte-progression-courses"
    );

const boutonToutCocher =
    document.getElementById(
        "tout-cocher-courses"
    );

const boutonToutDecocher =
    document.getElementById(
        "tout-decocher-courses"
    );

const boutonMasquerCoches =
    document.getElementById(
        "masquer-coches-courses"
    );


/* =========================
   LISTE
========================= */

const carteListeCourses =
    document.getElementById(
        "carte-liste-courses"
    );

const listeCourses =
    document.getElementById(
        "liste-courses"
    );

const messageVideCourses =
    document.getElementById(
        "message-vide-courses"
    );


/* =========================
   AJOUT MANUEL
========================= */

const sectionAjoutManuel =
    document.getElementById(
        "ajout-manuel-courses"
    );

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

const champUniteArticleManuel =
    document.getElementById(
        "unite-article-manuel"
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


/* =========================
   TERMINER
========================= */

const carteTerminerCourses =
    document.getElementById(
        "carte-terminer-courses"
    );

const boutonTerminerCourses =
    document.getElementById(
        "terminer-courses"
    );


/* =========================
   ERREUR
========================= */

const messageErreurCourses =
    document.getElementById(
        "message-erreur-courses"
    );

const texteErreurCourses =
    document.getElementById(
        "texte-erreur-courses"
    );


/* =========================
   POPUP TOUT DÉCOCHER
========================= */

const popupToutDecocher =
    document.getElementById(
        "popup-tout-decocher"
    );

const boutonAnnulerToutDecocher =
    document.getElementById(
        "annuler-tout-decocher"
    );

const boutonConfirmerToutDecocher =
    document.getElementById(
        "confirmer-tout-decocher"
    );


/* =========================
   POPUP TERMINER
========================= */

const popupTerminerCourses =
    document.getElementById(
        "popup-terminer-courses"
    );

const boutonFermerPopupTerminer =
    document.getElementById(
        "fermer-popup-terminer-courses"
    );

const boutonAnnulerTerminer =
    document.getElementById(
        "annuler-terminer-courses"
    );

const boutonConfirmerTerminer =
    document.getElementById(
        "confirmer-terminer-courses"
    );

const textePopupTerminerCourses =
    document.getElementById(
        "texte-popup-terminer-courses"
    );

const blocArticlesRestants =
    document.getElementById(
        "bloc-articles-restants"
    );

const titreArticlesRestants =
    document.getElementById(
        "titre-articles-restants"
    );


/* ==========================================
   ÉTAT DE L'INTERFACE
========================================== */

let masquerArticlesCoches =
    false;

let chargementCourses =
    false;


/* ==========================================
   OUTILS DATES
========================================== */

/*
    On évite new Date("2026-08-12")
    pour ne pas dépendre de l'interprétation UTC.

    On reconstruit la date localement.
*/

function creerDateDepuisISOInterfaceCourses(
    dateISO
) {

    if (
        !dateISO
    ) {

        return null;
    }


    const morceaux =
        String(
            dateISO
        ).split("-");


    if (
        morceaux.length !== 3
    ) {

        return null;
    }


    const annee =
        Number(
            morceaux[0]
        );

    const mois =
        Number(
            morceaux[1]
        );

    const jour =
        Number(
            morceaux[2]
        );


    if (
        !Number.isInteger(
            annee
        ) ||
        !Number.isInteger(
            mois
        ) ||
        !Number.isInteger(
            jour
        )
    ) {

        return null;
    }


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


function formaterDateISOInterfaceCourses(
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


function obtenirAujourdhuiInterfaceCourses() {

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


/*
    Retourne le prochain dimanche.

    Si la date est déjà un dimanche,
    on prend le dimanche suivant.
*/

function obtenirProchainDimancheInterfaceCourses(
    dateDepart
) {

    const date =
        new Date(
            dateDepart
        );


    const jour =
        date.getDay();


    const joursAJouter =
        jour === 0
            ? 7
            : 7 - jour;


    date.setDate(
        date.getDate() +
        joursAJouter
    );


    return date;
}


/* ==========================================
   DATES PAR DÉFAUT
========================================== */

function initialiserDatesInterfaceCourses() {

    if (
        !champDateDebutCourses ||
        !champDateFinCourses
    ) {

        return;
    }


    const aujourdHui =
        obtenirAujourdhuiInterfaceCourses();


    const prochainDimanche =
        obtenirProchainDimancheInterfaceCourses(
            aujourdHui
        );


    if (
        !champDateDebutCourses.value
    ) {

        champDateDebutCourses.value =
            formaterDateISOInterfaceCourses(
                aujourdHui
            );
    }


    if (
        !champDateFinCourses.value
    ) {

        champDateFinCourses.value =
            formaterDateISOInterfaceCourses(
                prochainDimanche
            );
    }


    champDateFinCourses.min =
        champDateDebutCourses.value;
}


/* ==========================================
   VALIDATION DE LA PÉRIODE
========================================== */

function validerPeriodeInterfaceCourses() {

    if (
        !champDateDebutCourses ||
        !champDateFinCourses
    ) {

        return false;
    }


    const dateDebutISO =
        champDateDebutCourses.value;


    const dateFinISO =
        champDateFinCourses.value;


    if (
        !dateDebutISO ||
        !dateFinISO
    ) {

        afficherMessagePeriode(
            "Choisissez une date de début et une date de fin.",
            "erreur"
        );


        return false;
    }


    const dateDebut =
        creerDateDepuisISOInterfaceCourses(
            dateDebutISO
        );


    const dateFin =
        creerDateDepuisISOInterfaceCourses(
            dateFinISO
        );


    if (
        !dateDebut ||
        !dateFin
    ) {

        afficherMessagePeriode(
            "La période sélectionnée est invalide.",
            "erreur"
        );


        return false;
    }


    /*
        Sécurité absolue :
        date de fin >= date de début.
    */

    if (
        dateFin <
        dateDebut
    ) {

        champDateFinCourses.value =
            dateDebutISO;


        champDateFinCourses.min =
            dateDebutISO;


        afficherMessagePeriode(
            "La date de fin ne peut pas être avant la date de début.",
            "erreur"
        );


        return false;
    }


    champDateFinCourses.min =
        dateDebutISO;


    afficherMessagePeriode(
        ""
    );


    return true;
}


/* ==========================================
   CHANGEMENT DATE DE DÉBUT
========================================== */

function gererChangementDateDebutCourses() {

    if (
        !champDateDebutCourses ||
        !champDateFinCourses
    ) {

        return;
    }


    const nouvelleDateDebut =
        champDateDebutCourses.value;


    if (
        !nouvelleDateDebut
    ) {

        return;
    }


    /*
        Safari / navigateur :
        impossible de sélectionner
        une date antérieure dans "Au".
    */

    champDateFinCourses.min =
        nouvelleDateDebut;


    /*
        Si la date de fin actuelle
        devient antérieure,
        on calcule automatiquement
        le prochain dimanche.

        Exemple :
        12 août → 16 août

        début déplacé au 18 août

        devient :
        18 août → 23 août
    */

    if (
        !champDateFinCourses.value ||
        champDateFinCourses.value <
            nouvelleDateDebut
    ) {

        const dateDebut =
            creerDateDepuisISOInterfaceCourses(
                nouvelleDateDebut
            );


        if (
            dateDebut
        ) {

            const prochainDimanche =
                obtenirProchainDimancheInterfaceCourses(
                    dateDebut
                );


            champDateFinCourses.value =
                formaterDateISOInterfaceCourses(
                    prochainDimanche
                );

        } else {

            champDateFinCourses.value =
                nouvelleDateDebut;
        }
    }


    validerPeriodeInterfaceCourses();
}


/* ==========================================
   CHANGEMENT DATE DE FIN
========================================== */

function gererChangementDateFinCourses() {

    if (
        !champDateDebutCourses ||
        !champDateFinCourses
    ) {

        return;
    }


    if (
        champDateFinCourses.value &&
        champDateDebutCourses.value &&
        champDateFinCourses.value <
            champDateDebutCourses.value
    ) {

        champDateFinCourses.value =
            champDateDebutCourses.value;


        afficherMessagePeriode(
            "La date de fin ne peut pas être avant la date de début.",
            "erreur"
        );


        return;
    }


    validerPeriodeInterfaceCourses();
}


/* ==========================================
   OUTILS TEXTE
========================================== */

function echapperHtmlCourses(
    valeur
) {

    return String(
        valeur ??
        ""
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


/* ==========================================
   FORMATTER QUANTITÉ
========================================== */

function formaterNombreCourses(
    valeur
) {

    if (
        valeur === null ||
        valeur === undefined ||
        valeur === ""
    ) {

        return "";
    }


    const nombre =
        Number(
            valeur
        );


    if (
        !Number.isFinite(
            nombre
        )
    ) {

        return String(
            valeur
        );
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


/* ==========================================
   QUANTITÉ ARTICLE
========================================== */

function construireQuantiteAfficheeCourses(
    article
) {

    const quantite =
        formaterNombreCourses(
            article.quantite
        );


    const unite =
        String(
            article.unite ||
            ""
        ).trim();


    if (
        quantite &&
        unite
    ) {

        return `${quantite} ${unite}`;
    }


    if (
        quantite
    ) {

        return quantite;
    }


    if (
        unite
    ) {

        return unite;
    }


    return "";
}


/* ==========================================
   DATE LISIBLE
========================================== */

function formaterDateLisibleCourses(
    dateISO
) {

    if (
        !dateISO
    ) {

        return "";
    }


    /*
        Cette fonction vient de courses-data.js.
    */

    const date =
        creerDateDepuisISOCourses(
            dateISO
        );


    if (
        !date
    ) {

        return "";
    }


    return date.toLocaleDateString(
        "fr-FR",
        {
            weekday:
                "long",

            day:
                "numeric",

            month:
                "long"
        }
    );
}


/* ==========================================
   MOMENT LISIBLE
========================================== */

function obtenirMomentLisibleCourses(
    moment
) {

    return moment ===
        "midi"
            ? "midi"
            : "soir";
}


/* ==========================================
   MESSAGES
========================================== */

function afficherMessagePeriode(
    texte,
    type = ""
) {

    if (
        !messagePeriodeCourses
    ) {

        return;
    }


    messagePeriodeCourses.textContent =
        texte;


    messagePeriodeCourses.classList.remove(
        "erreur",
        "succes"
    );


    if (
        type
    ) {

        messagePeriodeCourses.classList.add(
            type
        );
    }
}


function afficherMessageArticleManuel(
    texte,
    type = ""
) {

    if (
        !messageArticleManuel
    ) {

        return;
    }


    messageArticleManuel.textContent =
        texte;


    messageArticleManuel.classList.remove(
        "erreur",
        "succes"
    );


    if (
        type
    ) {

        messageArticleManuel.classList.add(
            type
        );
    }
}


/* ==========================================
   ERREUR GÉNÉRALE
========================================== */

function afficherErreurCourses(
    erreur
) {

    console.error(
        "Erreur Courses :",
        erreur
    );


    if (
        texteErreurCourses
    ) {

        texteErreurCourses.textContent =
            erreur?.message ||
            "Une erreur est survenue.";
    }


    if (
        messageErreurCourses
    ) {

        messageErreurCourses.hidden =
            false;
    }
}


function masquerErreurCourses() {

    if (
        messageErreurCourses
    ) {

        messageErreurCourses.hidden =
            true;
    }


    if (
        texteErreurCourses
    ) {

        texteErreurCourses.textContent =
            "";
    }
}

/* ==========================================
   INITIALISER LES DATES DEPUIS
   LA LISTE ACTIVE
========================================== */

function afficherPeriodeListeActive() {

    if (
        !listeCoursesActive
    ) {

        initialiserDatesCourses();

        return;
    }


    champDateDebutCourses.value =
        listeCoursesActive.date_debut ||
        "";


    champDateFinCourses.value =
        listeCoursesActive.date_fin ||
        "";


    /*
        Sécurité visuelle :
        la fin ne peut jamais être
        antérieure au début.
    */

    if (
        champDateDebutCourses.value
    ) {

        champDateFinCourses.min =
            champDateDebutCourses.value;
    }


    if (
        champDateDebutCourses.value &&
        (
            !champDateFinCourses.value ||
            champDateFinCourses.value <
                champDateDebutCourses.value
        )
    ) {

        champDateFinCourses.value =
            champDateDebutCourses.value;
    }
}


/* ==========================================
   RÉSUMÉ DE LA LISTE
========================================== */

function afficherResumeCourses() {

    const statistiques =
        obtenirStatistiquesCourses();


    nombreRepasCourses.textContent =
        statistiques.nombreRepas;


    nombreRecettesCourses.textContent =
        statistiques.nombreRecettes;


    nombrePlatsLibresCourses.textContent =
        statistiques.nombrePlatsLibres;


    nombreArticlesCourses.textContent =
        statistiques.totalArticles;
}


/* ==========================================
   AFFICHER LES PLATS LIBRES
========================================== */

function afficherPlatsLibresCourses() {

    if (
        !Array.isArray(
            platsLibresCourses
        ) ||
        platsLibresCourses.length ===
            0
    ) {

        alertePlatsLibres.hidden =
            true;


        listePlatsLibresCourses.innerHTML =
            "";


        return;
    }


    alertePlatsLibres.hidden =
        false;


    const nombre =
        platsLibresCourses.length;


    texteAlertePlatsLibres.textContent =
        nombre === 1
            ? "1 plat prévu dans votre planning n'est pas une recette enregistrée. Pensez à ajouter ses ingrédients manuellement."
            : `${nombre} plats prévus dans votre planning ne sont pas des recettes enregistrées. Pensez à ajouter leurs ingrédients manuellement.`;


    listePlatsLibresCourses.innerHTML =
        platsLibresCourses
            .map(
                function (
                    plat
                ) {

                    const date =
                        formaterDateLisibleCourses(
                            plat.date
                        );


                    const moment =
                        obtenirMomentLisibleCourses(
                            plat.moment
                        );


                    return `

                        <div class="plat-libre-course">

                            <strong>
                                ${echapperHtmlCourses(
                                    plat.nom ||
                                    "Plat libre"
                                )}
                            </strong>


                            <span>

                                ${echapperHtmlCourses(
                                    date
                                )}

                                •

                                ${echapperHtmlCourses(
                                    moment
                                )}

                            </span>

                        </div>

                    `;
                }
            )
            .join("");
}


/* ==========================================
   TRIER LES ARTICLES
========================================== */

function obtenirArticlesTriesCourses() {

    const copie =
        [
            ...articlesListeCourses
        ];


    copie.sort(
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


            /*
                1. Catégorie.
            */

            if (
                categorieA.ordre !==
                categorieB.ordre
            ) {

                return (
                    categorieA.ordre -
                    categorieB.ordre
                );
            }


            /*
                2. Les articles restant
                à acheter apparaissent avant
                les articles cochés.
            */

            if (
                Boolean(
                    articleA.coche
                ) !==
                Boolean(
                    articleB.coche
                )
            ) {

                return articleA.coche
                    ? 1
                    : -1;
            }


            /*
                3. Ordre alphabétique.
            */

            return String(
                articleA.nom ||
                ""
            ).localeCompare(
                String(
                    articleB.nom ||
                    ""
                ),
                "fr"
            );
        }
    );


    return copie;
}


/* ==========================================
   GROUPER PAR CATÉGORIE
========================================== */

function grouperArticlesCourses() {

    const groupes =
        new Map();


    const articles =
        obtenirArticlesTriesCourses();


    articles.forEach(
        function (
            article
        ) {

            /*
                Quand "Masquer les cochés"
                est actif, ils ne sont simplement
                pas envoyés à l'affichage.
            */

            if (
                masquerArticlesCoches &&
                article.coche
            ) {

                return;
            }


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

                const categorieA =
                    categoriesCourses[
                        groupeA[0]
                    ] ||
                    categoriesCourses.divers;


                const categorieB =
                    categoriesCourses[
                        groupeB[0]
                    ] ||
                    categoriesCourses.divers;


                return (
                    categorieA.ordre -
                    categorieB.ordre
                );
            }
        );
}


/* ==========================================
   HTML D'UN ARTICLE
========================================== */

function creerHtmlArticleCourses(
    article,
    index
) {

    const quantite =
        construireQuantiteAfficheeCourses(
            article
        );


    /* =========================
       BADGE
    ========================= */

    let badge =
        "";


    if (
        article.source ===
        "manuel"
    ) {

        badge = `

            <span
                class="badge-article-manuel"
            >
                Manuel
            </span>

        `;
    }


    if (
        article.source ===
        "report"
    ) {

        badge = `

            <span
                class="badge-article-report"
            >
                Reporté
            </span>

        `;
    }


    /* =========================
       SUPPRESSION

       Les ingrédients venant
       automatiquement du planning
       ne sont pas supprimables ici.

       On les retire en modifiant
       le planning ou la période.
    ========================= */

    let boutonSupprimer =
        "";


    if (
        article.source ===
            "manuel" ||
        article.source ===
            "report"
    ) {

        boutonSupprimer = `

            <button
                type="button"
                class="bouton-supprimer-article-manuel"
                data-supprimer-article-id="${article.id}"
                data-source-article="${article.source}"
                aria-label="Supprimer ${echapperHtmlCourses(
                    article.nom
                )}"
                title="Supprimer cet article"
            >
                ×
            </button>

        `;
    }


    return `

        <div
            class="article-course ${
                article.coche
                    ? "coche"
                    : ""
            }"
            data-article-id="${article.id}"
        >

            <input
                type="checkbox"
                class="case-article-course"
                id="article-course-${index}"
                data-article-id="${article.id}"
                ${
                    article.coche
                        ? "checked"
                        : ""
                }
            >


            <label
                for="article-course-${index}"
                class="contenu-article-course"
            >

                <span
                    class="nom-article-course"
                >

                    ${echapperHtmlCourses(
                        article.nom
                    )}

                    ${badge}

                </span>


                ${
                    quantite
                        ? `

                            <span
                                class="quantite-article-course"
                            >
                                ${echapperHtmlCourses(
                                    quantite
                                )}
                            </span>

                        `
                        : ""
                }

            </label>


            ${boutonSupprimer}

        </div>

    `;
}


/* ==========================================
   AFFICHER LA LISTE
========================================== */

function afficherListeCourses() {

    /*
        Aucune donnée du tout.
    */

    if (
        !Array.isArray(
            articlesListeCourses
        ) ||
        articlesListeCourses.length ===
            0
    ) {

        listeCourses.innerHTML =
            "";


        carteListeCourses.hidden =
            true;


        messageVideCourses.hidden =
            false;


        return;
    }


    carteListeCourses.hidden =
        false;


    messageVideCourses.hidden =
        true;


    const groupes =
        grouperArticlesCourses();


    /*
        Il existe des articles,
        mais tous sont cochés et masqués.
    */

    if (
        groupes.length ===
        0
    ) {

        listeCourses.innerHTML = `

            <div
                class="message-tous-masques"
            >

                <span>
                    ✓
                </span>

                <strong>
                    Tous les articles cochés sont masqués.
                </strong>

                <button
                    type="button"
                    id="afficher-coches-depuis-liste"
                >
                    Les afficher
                </button>

            </div>

        `;


        const boutonAfficher =
            document.getElementById(
                "afficher-coches-depuis-liste"
            );


        if (
            boutonAfficher
        ) {

            boutonAfficher.addEventListener(
                "click",
                function () {

                    masquerArticlesCoches =
                        false;


                    mettreAJourBoutonMasquer();


                    afficherListeCourses();
                }
            );
        }


        return;
    }


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
                                        creerHtmlArticleCourses(
                                            article,
                                            indexGlobal
                                        );


                                    indexGlobal++;


                                    return html;
                                }
                            )
                            .join("");


                    return `

                        <div
                            class="groupe-courses"
                        >

                            <div
                                class="entete-groupe-courses"
                            >

                                <span
                                    class="emoji-groupe-courses"
                                >
                                    ${informations.emoji}
                                </span>


                                <span>
                                    ${echapperHtmlCourses(
                                        informations.nom
                                    )}
                                </span>

                            </div>


                            <div
                                class="liste-groupe-courses"
                            >

                                ${lignes}

                            </div>

                        </div>

                    `;
                }
            )
            .join("");
}


/* ==========================================
   PROGRESSION
========================================== */

function afficherProgressionCourses() {

    const statistiques =
        obtenirStatistiquesCourses();


    const total =
        statistiques.totalArticles;


    const coches =
        statistiques.articlesCoches;


    const restants =
        statistiques.articlesRestants;


    compteurProgressionCourses.textContent =
        `${coches} / ${total}`;


    let pourcentage =
        0;


    if (
        total >
        0
    ) {

        pourcentage =
            Math.round(
                (
                    coches /
                    total
                ) *
                100
            );
    }


    remplissageProgressionCourses.style.width =
        `${pourcentage}%`;


    /*
        Texte sous la barre.
    */

    if (
        total ===
        0
    ) {

        texteProgressionCourses.textContent =
            "Ajoutez des repas ou des articles pour commencer votre liste.";

    } else if (
        coches ===
        0
    ) {

        texteProgressionCourses.textContent =
            `${total} article${
                total > 1
                    ? "s"
                    : ""
            } à acheter.`;

    } else if (
        coches ===
        total
    ) {

        texteProgressionCourses.textContent =
            "Tout est dans le panier 🎉";

    } else {

        texteProgressionCourses.textContent =
            `${restants} article${
                restants > 1
                    ? "s"
                    : ""
            } restant${
                restants > 1
                    ? "s"
                    : ""
            } à acheter.`;
    }


    /*
        Activation / désactivation
        intelligente des boutons.
    */

    boutonToutCocher.disabled =
        total === 0 ||
        coches === total;


    boutonToutDecocher.disabled =
        total === 0 ||
        coches === 0;


    boutonMasquerCoches.disabled =
        total === 0 ||
        coches === 0;
}


/* ==========================================
   BOUTON MASQUER LES COCHÉS
========================================== */

function mettreAJourBoutonMasquer() {

    boutonMasquerCoches.setAttribute(
        "aria-pressed",
        masquerArticlesCoches
            ? "true"
            : "false"
    );


    boutonMasquerCoches.textContent =
        masquerArticlesCoches
            ? "Afficher les cochés"
            : "Masquer les cochés";
}


/* ==========================================
   AFFICHER TOUTE L'INTERFACE
========================================== */

function afficherInterfaceCourses() {

    afficherPeriodeListeActive();

    afficherResumeCourses();

    afficherPlatsLibresCourses();

    afficherProgressionCourses();

    afficherListeCourses();

    mettreAJourBoutonMasquer();
}


/* ==========================================
   MODE CHARGEMENT
========================================== */

function definirChargementCourses(
    actif
) {

    chargementCourses =
        Boolean(
            actif
        );


    boutonActualiserCourses.disabled =
        chargementCourses;


    if (
        chargementCourses
    ) {

        boutonActualiserCourses.textContent =
            "Actualisation…";

    } else {

        boutonActualiserCourses.textContent =
            "Actualiser la liste";
    }
}


/* ==========================================
   RECHARGER LES DONNÉES
========================================== */

async function rafraichirCourses() {

    masquerErreurCourses();


    listeCourses.innerHTML = `

        <p
            class="message-chargement-courses"
        >
            Mise à jour de la liste…
        </p>

    `;


    try {

        await synchroniserListeCourses();


        afficherInterfaceCourses();


    } catch (
        erreur
    ) {

        afficherErreurCourses(
            erreur
        );
    }
}

/* ==========================================
   ÉVÉNEMENTS DATES
========================================== */


/*
    On écoute à la fois "input"
    et "change".

    C'est volontaire :
    Safari peut être un peu particulier
    avec les champs type="date".
*/

champDateDebutCourses.addEventListener(
    "input",
    gererChangementDateDebutCourses
);


champDateDebutCourses.addEventListener(
    "change",
    gererChangementDateDebutCourses
);


champDateFinCourses.addEventListener(
    "input",
    gererChangementDateFinCourses
);


champDateFinCourses.addEventListener(
    "change",
    gererChangementDateFinCourses
);


/* ==========================================
   ACTUALISER LA PÉRIODE
========================================== */

boutonActualiserCourses.addEventListener(
    "click",
    async function () {

        if (
            chargementCourses
        ) {

            return;
        }


        /*
            Validation locale avant
            d'envoyer quoi que ce soit
            à Supabase.
        */

        const periodeValide =
            validerPeriodeInterfaceCourses();


        if (
            !periodeValide
        ) {

            return;
        }


        const dateDebut =
            champDateDebutCourses.value;


        const dateFin =
            champDateFinCourses.value;


        definirChargementCourses(
            true
        );


        afficherMessagePeriode(
            "Mise à jour de la liste…"
        );


        try {

            /*
                Enregistrer les nouvelles dates
                sur la liste active.
            */

            await modifierPeriodeListeCourses(
                dateDebut,
                dateFin
            );


            /*
                Recalcul des ingrédients
                correspondant au planning.

                Important :
                - les articles manuels restent ;
                - les coches existantes restent ;
                - les ingrédients qui ne sont
                  plus nécessaires sont supprimés.
            */

            await synchroniserListeCourses();


            /*
                On affiche tout avec
                les nouvelles données.
            */

            afficherInterfaceCourses();


            afficherMessagePeriode(
                "Liste actualisée ✓",
                "succes"
            );


            setTimeout(
                function () {

                    afficherMessagePeriode(
                        ""
                    );

                },
                1800
            );


        } catch (
            erreur
        ) {

            console.error(
                "Erreur changement période :",
                erreur
            );


            afficherMessagePeriode(
                erreur?.message ||
                "Impossible de modifier la période.",
                "erreur"
            );


        } finally {

            definirChargementCourses(
                false
            );
        }
    }
);


/* ==========================================
   COCHER / DÉCOCHER UN ARTICLE
========================================== */

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


        const articleId =
            caseArticle.dataset.articleId;


        if (
            !articleId
        ) {

            return;
        }


        const nouvelEtat =
            caseArticle.checked;


        caseArticle.disabled =
            true;


        try {

            await modifierEtatArticleCourses(
                articleId,
                nouvelEtat
            );


            const ligne =
                caseArticle.closest(
                    ".article-course"
                );


            if (
                ligne
            ) {

                ligne.classList.toggle(
                    "coche",
                    nouvelEtat
                );
            }


            afficherResumeCourses();

            afficherProgressionCourses();


            /*
                Si on masque les cochés,
                un article nouvellement coché
                doit disparaître immédiatement.
            */

            if (
                masquerArticlesCoches
            ) {

                afficherListeCourses();
            }


        } catch (
            erreur
        ) {

            console.error(
                "Erreur mise à jour article :",
                erreur
            );


            /*
                Retour visuel à l'ancien état
                si Supabase échoue.
            */

            caseArticle.checked =
                !nouvelEtat;


            afficherErreurCourses(
                erreur
            );


        } finally {

            caseArticle.disabled =
                false;
        }
    }
);


/* ==========================================
   TOUT COCHER
========================================== */

boutonToutCocher.addEventListener(
    "click",
    async function () {

        const statistiques =
            obtenirStatistiquesCourses();


        if (
            statistiques.totalArticles ===
                0 ||
            statistiques.articlesCoches ===
                statistiques.totalArticles
        ) {

            return;
        }


        const texteInitial =
            boutonToutCocher.textContent;


        boutonToutCocher.disabled =
            true;


        boutonToutCocher.textContent =
            "Cochage…";


        try {

            await modifierTousArticlesCourses(
                true
            );


            afficherProgressionCourses();

            afficherListeCourses();


        } catch (
            erreur
        ) {

            console.error(
                "Erreur tout cocher :",
                erreur
            );


            afficherErreurCourses(
                erreur
            );


        } finally {

            boutonToutCocher.textContent =
                texteInitial;


            afficherProgressionCourses();
        }
    }
);


/* ==========================================
   OUVRIR POPUP TOUT DÉCOCHER
========================================== */

boutonToutDecocher.addEventListener(
    "click",
    function () {

        const statistiques =
            obtenirStatistiquesCourses();


        if (
            statistiques.articlesCoches ===
            0
        ) {

            return;
        }


        popupToutDecocher.hidden =
            false;


        document.body.style.overflow =
            "hidden";
    }
);


/* ==========================================
   FERMER POPUP TOUT DÉCOCHER
========================================== */

function fermerPopupToutDecocher() {

    popupToutDecocher.hidden =
        true;


    document.body.style.overflow =
        "";
}


boutonAnnulerToutDecocher.addEventListener(
    "click",
    fermerPopupToutDecocher
);


/* ==========================================
   CONFIRMER TOUT DÉCOCHER
========================================== */

boutonConfirmerToutDecocher.addEventListener(
    "click",
    async function () {

        boutonConfirmerToutDecocher.disabled =
            true;


        boutonConfirmerToutDecocher.textContent =
            "Décochage…";


        try {

            await modifierTousArticlesCourses(
                false
            );


            /*
                On réaffiche aussi
                les articles qui étaient masqués.
            */

            masquerArticlesCoches =
                false;


            fermerPopupToutDecocher();


            mettreAJourBoutonMasquer();

            afficherProgressionCourses();

            afficherListeCourses();


        } catch (
            erreur
        ) {

            console.error(
                "Erreur tout décocher :",
                erreur
            );


            afficherErreurCourses(
                erreur
            );


        } finally {

            boutonConfirmerToutDecocher.disabled =
                false;


            boutonConfirmerToutDecocher.textContent =
                "Tout décocher";
        }
    }
);


/* ==========================================
   CLIC SUR LE FOND
   POPUP TOUT DÉCOCHER
========================================== */

popupToutDecocher.addEventListener(
    "click",
    function (
        evenement
    ) {

        if (
            evenement.target ===
            popupToutDecocher
        ) {

            fermerPopupToutDecocher();
        }
    }
);


/* ==========================================
   MASQUER / AFFICHER LES COCHÉS
========================================== */

boutonMasquerCoches.addEventListener(
    "click",
    function () {

        const statistiques =
            obtenirStatistiquesCourses();


        if (
            statistiques.articlesCoches ===
            0
        ) {

            return;
        }


        masquerArticlesCoches =
            !masquerArticlesCoches;


        mettreAJourBoutonMasquer();


        afficherListeCourses();
    }
);


/* ==========================================
   ALLER À L'AJOUT MANUEL
========================================== */

boutonAllerAjoutManuel.addEventListener(
    "click",
    function () {

        sectionAjoutManuel.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "center"
            }
        );


        setTimeout(
            function () {

                champNomArticleManuel.focus();

            },
            450
        );
    }
);


/* ==========================================
   AJOUT MANUEL
========================================== */

formulaireArticleManuel.addEventListener(
    "submit",
    async function (
        evenement
    ) {

        evenement.preventDefault();


        afficherMessageArticleManuel(
            ""
        );


        const nom =
            champNomArticleManuel
                .value
                .trim();


        const quantiteTexte =
            champQuantiteArticleManuel
                .value
                .trim();


        const unite =
            champUniteArticleManuel
                .value
                .trim();


        const categorie =
            champCategorieArticleManuel
                .value ||
            "divers";


        if (
            !nom
        ) {

            afficherMessageArticleManuel(
                "Renseignez le nom de l'article.",
                "erreur"
            );


            champNomArticleManuel.focus();


            return;
        }


        /*
            Quantité facultative.

            Si elle est renseignée,
            elle doit être numérique et >= 0.
        */

        let quantite =
            "";


        if (
            quantiteTexte !==
            ""
        ) {

            quantite =
                Number(
                    quantiteTexte
                );


            if (
                !Number.isFinite(
                    quantite
                ) ||
                quantite < 0
            ) {

                afficherMessageArticleManuel(
                    "La quantité n'est pas valide.",
                    "erreur"
                );


                champQuantiteArticleManuel.focus();


                return;
            }
        }


        boutonAjouterArticleManuel.disabled =
            true;


        boutonAjouterArticleManuel.textContent =
            "Ajout…";


        try {

            await ajouterArticleManuelCourses(
                nom,
                quantite,
                unite,
                categorie
            );


            /*
                Réinitialisation propre.
            */

            formulaireArticleManuel.reset();


            champCategorieArticleManuel.value =
                "divers";


            afficherResumeCourses();

            afficherProgressionCourses();

            afficherListeCourses();


            afficherMessageArticleManuel(
                "Article ajouté ✓",
                "succes"
            );


            setTimeout(
                function () {

                    afficherMessageArticleManuel(
                        ""
                    );

                },
                1800
            );


        } catch (
            erreur
        ) {

            console.error(
                "Erreur ajout manuel :",
                erreur
            );


            afficherMessageArticleManuel(
                erreur?.message ||
                "Impossible d'ajouter cet article.",
                "erreur"
            );


        } finally {

            boutonAjouterArticleManuel.disabled =
                false;


            boutonAjouterArticleManuel.textContent =
                "+ Ajouter";
        }
    }
);


/* ==========================================
   SUPPRIMER UN ARTICLE
   MANUEL OU REPORTÉ
========================================== */

listeCourses.addEventListener(
    "click",
    async function (
        evenement
    ) {

        const bouton =
            evenement.target.closest(
                "[data-supprimer-article-id]"
            );


        if (
            !bouton
        ) {

            return;
        }


        const articleId =
            bouton.dataset.supprimerArticleId;


        const source =
            bouton.dataset.sourceArticle;


        if (
            !articleId
        ) {

            return;
        }


        bouton.disabled =
            true;


        try {

            /*
                Article ajouté manuellement.
            */

            if (
                source ===
                "manuel"
            ) {

                await supprimerArticleManuelCourses(
                    articleId
                );


            } else if (
                source ===
                "report"
            ) {

                /*
                    Les reports sont également
                    supprimables.

                    Ils ne viennent plus du planning,
                    donc on peut les enlever directement.
                */

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
                            "report"
                        );


                if (
                    error
                ) {

                    throw error;
                }


                articlesListeCourses =
                    articlesListeCourses.filter(
                        function (
                            article
                        ) {

                            return (
                                String(
                                    article.id
                                ) !==
                                String(
                                    articleId
                                )
                            );
                        }
                    );


            } else {

                /*
                    Sécurité :
                    un article issu automatiquement
                    du planning n'est pas supprimable
                    ici.
                */

                return;
            }


            afficherResumeCourses();

            afficherProgressionCourses();

            afficherListeCourses();


        } catch (
            erreur
        ) {

            console.error(
                "Erreur suppression article :",
                erreur
            );


            afficherErreurCourses(
                erreur
            );


            bouton.disabled =
                false;
        }
    }
);

/* ==========================================
   OUVRIR POPUP TERMINER
========================================== */

function ouvrirPopupTerminerCourses() {

    const statistiques =
        obtenirStatistiquesCourses();


    const restants =
        statistiques.articlesRestants;


    if (
        restants > 0
    ) {

        blocArticlesRestants.hidden =
            false;


        titreArticlesRestants.textContent =
            `${restants} article${
                restants > 1
                    ? "s ne sont"
                    : " n'est"
            } pas encore coché${
                restants > 1
                    ? "s"
                    : ""
            }.`;


        textePopupTerminerCourses.textContent =
            "Vous pouvez terminer cette liste et choisir ce qu'il faut faire des articles encore manquants.";

    } else {

        blocArticlesRestants.hidden =
            true;


        textePopupTerminerCourses.textContent =
            "Tous les articles sont cochés. Cette liste peut maintenant être terminée.";
    }


    popupTerminerCourses.hidden =
        false;


    document.body.style.overflow =
        "hidden";
}


/* ==========================================
   FERMER POPUP TERMINER
========================================== */

function fermerPopupTerminerCourses() {

    popupTerminerCourses.hidden =
        true;


    document.body.style.overflow =
        "";


    boutonConfirmerTerminer.disabled =
        false;


    boutonConfirmerTerminer.textContent =
        "Terminer la liste";
}


boutonTerminerCourses.addEventListener(
    "click",
    ouvrirPopupTerminerCourses
);


boutonFermerPopupTerminer.addEventListener(
    "click",
    fermerPopupTerminerCourses
);


boutonAnnulerTerminer.addEventListener(
    "click",
    fermerPopupTerminerCourses
);


/* ==========================================
   CLIC SUR FOND POPUP TERMINER
========================================== */

popupTerminerCourses.addEventListener(
    "click",
    function (
        evenement
    ) {

        if (
            evenement.target ===
            popupTerminerCourses
        ) {

            fermerPopupTerminerCourses();
        }
    }
);


/* ==========================================
   ARTICLES À REPORTER
========================================== */

function obtenirArticlesAReporter() {

    return articlesListeCourses
        .filter(
            function (
                article
            ) {

                return (
                    !article.coche
                );
            }
        )
        .map(
            function (
                article
            ) {

                return {

                    nom:
                        article.nom,

                    quantite:
                        article.quantite,

                    unite:
                        article.unite,

                    categorie:
                        article.categorie

                };
            }
        );
}


/* ==========================================
   CRÉER LES ARTICLES REPORTÉS
========================================== */

async function creerArticlesReportesCourses(
    articles
) {

    if (
        !Array.isArray(
            articles
        ) ||
        articles.length ===
            0
    ) {

        return;
    }


    const lignes =
        articles.map(
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
                        categoriesCourses[
                            article.categorie
                        ]
                            ? article.categorie
                            : "divers",

                    coche:
                        false,

                    source:
                        "report",

                    recette_id:
                        null,

                    cle_article:
                        `report__${crypto.randomUUID()}`

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
            .insert(
                lignes
            );


    if (
        error
    ) {

        throw error;
    }
}


/* ==========================================
   TERMINER LA LISTE
========================================== */

boutonConfirmerTerminer.addEventListener(
    "click",
    async function () {

        boutonConfirmerTerminer.disabled =
            true;


        boutonConfirmerTerminer.textContent =
            "Finalisation…";


        try {

            const statistiques =
                obtenirStatistiquesCourses();


            let reporter =
                false;


            if (
                statistiques.articlesRestants >
                0
            ) {

                const choix =
                    document.querySelector(
                        'input[name="action-articles-restants"]:checked'
                    );


                reporter =
                    Boolean(
                        choix &&
                        choix.value ===
                            "reporter"
                    );
            }


            /*
                On mémorise les articles
                AVANT de clôturer la liste.
            */

            const articlesAReporter =
                reporter
                    ? obtenirArticlesAReporter()
                    : [];


            /*
                1. Terminer la liste actuelle.
            */

            await terminerListeCoursesActive();


            /*
                2. Créer une nouvelle liste active.

                courses-data.js utilise :
                aujourd'hui -> prochain dimanche.
            */

            await creerListeCoursesActive();


            /*
                3. Reporter éventuellement
                les articles non achetés.
            */

            if (
                articlesAReporter.length >
                0
            ) {

                await creerArticlesReportesCourses(
                    articlesAReporter
                );
            }


            /*
                4. Synchroniser la nouvelle
                liste avec le planning.
            */

            await synchroniserListeCourses();


            masquerArticlesCoches =
                false;


            fermerPopupTerminerCourses();


            afficherInterfaceCourses();


            afficherMessagePeriode(
                articlesAReporter.length > 0
                    ? `Nouvelle liste créée. ${articlesAReporter.length} article${
                        articlesAReporter.length > 1
                            ? "s ont"
                            : " a"
                    } été reporté${
                        articlesAReporter.length > 1
                            ? "s"
                            : ""
                    }.`
                    : "Nouvelle liste créée ✓",
                "succes"
            );


            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );


        } catch (
            erreur
        ) {

            console.error(
                "Erreur fin des courses :",
                erreur
            );


            boutonConfirmerTerminer.disabled =
                false;


            boutonConfirmerTerminer.textContent =
                "Terminer la liste";


            afficherErreurCourses(
                erreur
            );
        }
    }
);


/* ==========================================
   TOUCHE ÉCHAP
========================================== */

document.addEventListener(
    "keydown",
    function (
        evenement
    ) {

        if (
            evenement.key !==
            "Escape"
        ) {

            return;
        }


        if (
            popupToutDecocher &&
            !popupToutDecocher.hidden
        ) {

            fermerPopupToutDecocher();


            return;
        }


        if (
            popupTerminerCourses &&
            !popupTerminerCourses.hidden
        ) {

            fermerPopupTerminerCourses();
        }
    }
);


/* ==========================================
   INITIALISATION
========================================== */

async function initialiserCourses() {

    masquerErreurCourses();


    /*
        Valeurs locales immédiatement
        disponibles, même avant Supabase.
    */

    initialiserDatesInterfaceCourses();


    /*
        Sécurité immédiate sur les dates.
    */

    champDateFinCourses.min =
        champDateDebutCourses.value;


    listeCourses.innerHTML = `

        <p
            class="message-chargement-courses"
        >
            Préparation de votre liste…
        </p>

    `;


    try {

        /*
            courses-data.js gère :
            - utilisateur
            - foyer
            - liste active
            - planning
            - recettes
            - articles Supabase
            - synchronisation
        */

        const succes =
            await initialiserDonneesCourses();


        if (
            !succes
        ) {

            return;
        }


        /*
            La liste active Supabase
            devient la référence pour les dates.
        */

        afficherInterfaceCourses();


        /*
            Et on garantit une nouvelle fois
            la contrainte date fin >= date début.
        */

        if (
            champDateDebutCourses.value
        ) {

            champDateFinCourses.min =
                champDateDebutCourses.value;
        }


        if (
            champDateDebutCourses.value &&
            champDateFinCourses.value &&
            champDateFinCourses.value <
                champDateDebutCourses.value
        ) {

            champDateFinCourses.value =
                champDateDebutCourses.value;
        }


        console.log(
            "Courses initialisées :",
            {

                liste:
                    listeCoursesActive,

                repas:
                    repasPeriodeCourses,

                platsLibres:
                    platsLibresCourses,

                articles:
                    articlesListeCourses

            }
        );


    } catch (
        erreur
    ) {

        afficherErreurCourses(
            erreur
        );


        carteListeCourses.hidden =
            true;
    }
}


/* ==========================================
   DÉMARRAGE
========================================== */

initialiserCourses();
