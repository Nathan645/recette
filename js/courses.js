/* ==========================================
   COURSES.JS
   À notre table

   Ce fichier gère l'interface :
   - période début / fin
   - affichage de la liste
   - progression
   - plats libres
   - ajout manuel
   - coches
   - tout cocher / décocher
   - masquer les cochés
   - terminer les courses
   - report des articles restants

   Les données Supabase sont gérées
   principalement dans courses-data.js.
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


    const date =
        creerDateDepuisISOCourses(
            dateISO
        );


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


    texteErreurCourses.textContent =
        erreur?.message ||
        "Une erreur est survenue.";


    messageErreurCourses.hidden =
        false;
}


function masquerErreurCourses() {

    messageErreurCourses.hidden =
        true;
}


/* ==========================================
   SYNCHRONISER LES LIMITES
   DES DATES
========================================== */

function synchroniserLimitesDatesCourses() {

    const dateDebut =
        champDateDebutCourses.value;


    if (
        !dateDebut
    ) {

        return;
    }


    /*
        Le navigateur empêche
        de sélectionner une date
        antérieure.
    */

    champDateFinCourses.min =
        dateDebut;


    /*
        Si la date de fin actuelle
        devient incohérente,
        on la ramène automatiquement
        à la date de début.
    */

    if (
        !champDateFinCourses.value ||
        champDateFinCourses.value <
            dateDebut
    ) {

        champDateFinCourses.value =
            dateDebut;
    }
}


/* ==========================================
   CHARGER LES DATES
   DE LA LISTE ACTIVE
========================================== */

function afficherPeriodeListeActive() {

    if (
        !listeCoursesActive
    ) {

        return;
    }


    champDateDebutCourses.value =
        listeCoursesActive.date_debut;


    champDateFinCourses.value =
        listeCoursesActive.date_fin;


    synchroniserLimitesDatesCourses();
}


/* ==========================================
   RÉSUMÉ
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
   PLATS LIBRES
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

                        <div
                            class="plat-libre-course"
                        >

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
                Articles non cochés
                avant les cochés.
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
    ).sort(
        function (
            groupeA,
            groupeB
        ) {

            const categorieA =
                categoriesCourses[
                    groupeA[0]
                ];


            const categorieB =
                categoriesCourses[
                    groupeB[0]
                ];


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


    let badge =
        "";


    if (
        article.source ===
        "manuel"
    ) {

        badge = `

            <span class="badge-article-manuel">
                Manuel
            </span>

        `;
    }


    if (
        article.source ===
        "report"
    ) {

        badge = `

            <span class="badge-article-report">
                Reporté
            </span>

        `;
    }


    const boutonSupprimer =
        article.source ===
        "manuel" ||
        article.source ===
        "report"
            ? `

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

            `
            : "";


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

                <span class="nom-article-course">

                    ${echapperHtmlCourses(
                        article.nom
                    )}

                    ${badge}

                </span>


                ${
                    quantite
                        ? `

                            <span class="quantite-article-course">
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

    if (
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
        Cas particulier :
        tous les articles sont cochés
        et l'utilisateur les masque.
    */

    if (
        groupes.length ===
        0
    ) {

        listeCourses.innerHTML = `

            <div class="message-tous-masques">

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


                    const infos =
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

                        <div class="groupe-courses">

                            <div class="entete-groupe-courses">

                                <span class="emoji-groupe-courses">
                                    ${infos.emoji}
                                </span>

                                <span>
                                    ${echapperHtmlCourses(
                                        infos.nom
                                    )}
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


    compteurProgressionCourses.textContent =
        `${coches} / ${total}`;


    let pourcentage =
        0;


    if (
        total > 0
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


    if (
        total === 0
    ) {

        texteProgressionCourses.textContent =
            "Ajoutez des repas ou des articles pour commencer votre liste.";


    } else if (
        coches === 0
    ) {

        texteProgressionCourses.textContent =
            `${total} article${
                total > 1
                    ? "s"
                    : ""
            } à acheter.`;


    } else if (
        coches === total
    ) {

        texteProgressionCourses.textContent =
            "Tout est dans le panier 🎉";


    } else {

        const restants =
            total -
            coches;


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


    boutonToutCocher.disabled =
        total === 0 ||
        coches === total;


    boutonToutDecocher.disabled =
        total === 0 ||
        coches === 0;
}


/* ==========================================
   BOUTON MASQUER
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
   RAFRAÎCHIR TOUT L'AFFICHAGE
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
   ÉTAT DE CHARGEMENT
========================================== */

function definirChargementCourses(
    actif
) {

    chargementCourses =
        actif;


    boutonActualiserCourses.disabled =
        actif;


    if (
        actif
    ) {

        boutonActualiserCourses.textContent =
            "Actualisation…";

    } else {

        boutonActualiserCourses.textContent =
            "Actualiser la liste";
    }
}


/* ==========================================
   ACTUALISER DEPUIS SUPABASE
========================================== */

async function rafraichirCourses() {

    masquerErreurCourses();


    listeCourses.innerHTML = `

        <p class="message-chargement-courses">
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
   CHANGEMENT DATE DÉBUT
========================================== */

champDateDebutCourses.addEventListener(
    "change",
    function () {

        synchroniserLimitesDatesCourses();


        afficherMessagePeriode(
            ""
        );
    }
);


/* ==========================================
   CHANGEMENT DATE FIN
========================================== */

champDateFinCourses.addEventListener(
    "change",
    function () {

        if (
            champDateFinCourses.value <
            champDateDebutCourses.value
        ) {

            champDateFinCourses.value =
                champDateDebutCourses.value;
        }


        afficherMessagePeriode(
            ""
        );
    }
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


        const dateDebut =
            champDateDebutCourses.value;


        const dateFin =
            champDateFinCourses.value;


        try {

            verifierPeriodeCourses(
                dateDebut,
                dateFin
            );


            definirChargementCourses(
                true
            );


            afficherMessagePeriode(
                "Mise à jour de la liste…"
            );


            /*
                On enregistre les dates
                dans la liste active.
            */

            await modifierPeriodeListeCourses(
                dateDebut,
                dateFin
            );


            /*
                Puis on recalcule uniquement
                les articles provenant du planning.

                Les articles manuels restent.
                Les coches existantes restent.
            */

            await synchroniserListeCourses();


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
                "Erreur période :",
                erreur
            );


            afficherMessagePeriode(
                erreur.message ||
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
                Si les cochés sont masqués,
                on reconstruit immédiatement
                la liste pour faire disparaître
                l'article.
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
                "Erreur coche article :",
                erreur
            );


            /*
                Retour à l'état précédent.
            */

            caseArticle.checked =
                !nouvelEtat;


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

        boutonToutCocher.disabled =
            true;


        const texteInitial =
            boutonToutCocher.textContent;


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
   OUVRIR TOUT DÉCOCHER
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
   FERMER TOUT DÉCOCHER
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


            fermerPopupToutDecocher();


            afficherProgressionCourses();

            afficherListeCourses();


        } catch (
            erreur
        ) {

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
   CLIC SUR FOND TOUT DÉCOCHER
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
   MASQUER LES COCHÉS
========================================== */

boutonMasquerCoches.addEventListener(
    "click",
    function () {

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
            500
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


        const quantite =
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


            return;
        }


        /*
            Quantité facultative,
            mais si elle existe elle doit
            être valide.
        */

        if (
            quantite !== "" &&
            (
                !Number.isFinite(
                    Number(
                        quantite
                    )
                ) ||
                Number(
                    quantite
                ) < 0
            )
        ) {

            afficherMessageArticleManuel(
                "La quantité n'est pas valide.",
                "erreur"
            );


            return;
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
                erreur.message ||
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
   SUPPRIMER ARTICLE MANUEL / REPORTÉ
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

            if (
                source ===
                "manuel"
            ) {

                await supprimerArticleManuelCourses(
                    articleId
                );


            } else {

                /*
                    Un article reporté peut aussi
                    être supprimé, mais notre
                    fonction data limite volontairement
                    la suppression aux manuels.

                    On le supprime donc directement,
                    toujours en vérifiant liste_id.
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
        restants >
        0
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
   CLIC FOND POPUP TERMINER
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
   PRÉPARER LES ARTICLES À REPORTER
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
                    choix &&
                    choix.value ===
                    "reporter";
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
                1. Fermer la liste actuelle.
            */

            await terminerListeCoursesActive();


            /*
                2. Créer immédiatement
                une nouvelle liste active.

                Elle utilisera :
                aujourd'hui → prochain dimanche.
            */

            await creerListeCoursesActive();


            /*
                3. Ajouter les éventuels reports.
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
                4. Synchroniser avec le planning.

                Les reports restent car
                synchroniserArticlesPlanningCourses()
                ne supprime que source="planning".
            */

            await synchroniserListeCourses();


            masquerArticlesCoches =
                false;


            fermerPopupTerminerCourses();


            afficherInterfaceCourses();


            afficherMessagePeriode(
                articlesAReporter.length >
                    0
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


    listeCourses.innerHTML = `

        <p class="message-chargement-courses">
            Préparation de votre liste…
        </p>

    `;


    try {

        /*
            courses-data.js :
            - utilisateur
            - foyer
            - liste active
            - planning
            - recettes
            - synchronisation
        */

        const succes =
            await initialiserDonneesCourses();


        if (
            !succes
        ) {

            return;
        }


        afficherInterfaceCourses();


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
