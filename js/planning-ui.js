/* =================================
   PLANNING UI
   À notre table

   Ce fichier gère :
   - l'affichage des créneaux
   - l'affichage de la semaine
   - le rafraîchissement du planning

   La recherche de recettes et
   les interactions de la popup
   sont gérées dans planning.js.
================================= */


/* =================================
   ÉCHAPPER LE TEXTE
================================= */

function echapperTextePlanningUI(
    valeur
) {

    return String(
        valeur ?? ""
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


/* =================================
   RÉCUPÉRER LES ÉLÉMENTS
   D'UN REPAS
================================= */

function obtenirElementsRepas(
    repas
) {

    if (
        !repas
    ) {

        return [];
    }


    /*
        Nouveau format :

        repas.elements contient
        toutes les recettes et
        tous les plats libres.
    */

    if (
        Array.isArray(
            repas.elements
        ) &&
        repas.elements.length > 0
    ) {

        return [
            ...repas.elements
        ]
            .sort(
                function (
                    elementA,
                    elementB
                ) {

                    const ordreA =
                        Number(
                            elementA.ordre
                        ) || 0;


                    const ordreB =
                        Number(
                            elementB.ordre
                        ) || 0;


                    return (
                        ordreA -
                        ordreB
                    );
                }
            );
    }


    /*
        Compatibilité avec les
        anciens repas.

        Avant la nouvelle table,
        nom et recette_id étaient
        directement stockés dans
        repas_planning.
    */

    if (
        repas.nom
    ) {

        return [

            {

                id:
                    null,

                recette_id:
                    repas.recette_id ||
                    null,

                nom:
                    repas.nom,

                ordre:
                    1,

                ancien_format:
                    true

            }

        ];
    }


    return [];
}


/* =================================
   HTML D'UN PLAT
================================= */

function creerHTMLPlatPlanning(
    element
) {

    const nom =
        echapperTextePlanningUI(
            element.nom ||
            ""
        );


    /*
        Si c'est une vraie recette,
        son nom reste cliquable.
    */

    if (
        element.recette_id
    ) {

        return `

            <a
                href="recette.html?id=${encodeURIComponent(
                    element.recette_id
                )}"
                class="lien-repas-recette element-repas-planning"
            >
                ${nom}
            </a>

        `;
    }


    /*
        Sinon c'est un plat ajouté
        manuellement.
    */

    return `

        <span
            class="nom-repas-libre element-repas-planning"
        >
            ${nom}
        </span>

    `;
}


/* =================================
   CRÉNEAU REPAS
================================= */

function creerCreneauRepas(
    date,
    moment
) {

    const dateISO =
        formaterDateISO(
            date
        );


    const momentRecherche =
        String(
            moment ||
            ""
        )
            .trim()
            .toLowerCase();


    /*
        Un créneau correspond désormais
        à UN repas parent.

        Ce repas parent peut contenir
        plusieurs éléments dans :

        repas.elements
    */

    const repas =
        repasSemaine.find(
            function (
                element
            ) {

                const dateRepas =
                    String(
                        element.date ||
                        ""
                    )
                        .trim();


                const momentRepas =
                    String(
                        element.moment ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                return (
                    dateRepas ===
                        dateISO &&
                    momentRepas ===
                        momentRecherche
                );
            }
        );


    const titreMoment =
        moment === "midi"
            ? "Midi"
            : "Soir";


    let contenu =
        "";


    /* =================================
       REPAS EXISTANT
    ================================= */

    if (repas) {

    const elements =
        Array.isArray(
            repas.elements
        )
            ? repas.elements
            : [];


    const elementPrincipal =
        elements[0] ||
        {
            nom:
                repas.nom,

            recette_id:
                repas.recette_id
        };


   const elementsSecondaires =
    elements
        .slice(
            1
        )
        .filter(
            function (
                element
            ) {

                return (
                    element.mode_approvisionnement !==
                    "acheter"
                );
            }
        );


    /* =========================
       RECETTE / PLAT PRINCIPAL
    ========================= */

    let principalHtml =
        "";


    if (
    elementPrincipal?.recette_id
) {

    principalHtml =
        `
            <span class="nom-repas-principal">
                ${elementPrincipal.nom}
            </span>
        `;

    } else {

        principalHtml =
            `
                <span class="nom-repas-libre nom-repas-principal">
                    ${elementPrincipal?.nom || "Repas"}
                </span>
            `;
    }


    /* =========================
       RECETTES / PLATS LIÉS
    ========================= */

    const secondairesHtml =
        elementsSecondaires.length > 0
            ? `
                <div class="elements-secondaires-repas">

                    ${
                        elementsSecondaires
                            .map(
                                function (
                                    element
                                ) {

                                    return `
                                        <span class="element-secondaire-repas">
                                            + ${element.nom}
                                        </span>
                                    `;
                                }
                            )
                            .join(
                                ""
                            )
                    }

                </div>
            `
            : "";


    /* =========================
       CARTE DU REPAS
    ========================= */

    contenu =
        `
            <div class="repas-planifie">

                <div class="contenu-repas-planifie">

                    ${principalHtml}

                    ${secondairesHtml}

                    <span class="personnes-repas-planifie">
                        ${repas.personnes || 1}
                        ${
                            Number(
                                repas.personnes
                            ) > 1
                                ? "personnes"
                                : "personne"
                        }
                    </span>

                </div>


                <button
                    type="button"
                    class="bouton-editer-repas"
                    data-repas-id="${repas.id}"
                    aria-label="Modifier ce repas"
                    title="Modifier ce repas"
                >
                    ✏️
                </button>

            </div>
        `;

} else {

    contenu =
        `
            <button
                type="button"
                class="bouton-ajouter-repas"
                data-date="${formaterDateISO(
                    date
                )}"
                data-moment="${moment}"
            >
                + Ajouter
            </button>
        `;
}
    /* =================================
       RETOUR DU CRÉNEAU
    ================================= */

    return `

        <div class="creneau-repas">

            <span class="titre-creneau">
                ${titreMoment}
            </span>

            ${contenu}

        </div>

    `;
}


/* =================================
   AFFICHER LA SEMAINE
================================= */

function afficherSemaine() {

    const finSemaine =
        ajouterJours(
            debutSemaine,
            6
        );


    /* =================================
       NUMÉRO DE SEMAINE
    ================================= */

    numeroSemaine.textContent =
        `Semaine ${obtenirNumeroSemaine(
            debutSemaine
        )}`;


    /* =================================
       DATES DE LA SEMAINE
    ================================= */

    titreSemaine.textContent =
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


    /* =================================
       DEBUG
    ================================= */

    console.log(
        "AFFICHAGE SEMAINE :",
        formaterDateISO(
            debutSemaine
        ),
        "→",
        formaterDateISO(
            finSemaine
        )
    );


    console.log(
        "REPAS DISPONIBLES POUR AFFICHAGE :",
        repasSemaine
    );


    /*
        Ce tableau permet maintenant
        de vérifier facilement dans
        la console tous les plats
        contenus dans chaque repas.
    */

    console.table(
        repasSemaine.map(
            function (
                repas
            ) {

                const elements =
                    obtenirElementsRepas(
                        repas
                    );


                return {

                    id:
                        repas.id,

                    date:
                        repas.date,

                    moment:
                        repas.moment,

                    personnes:
                        repas.personnes,

                    nombre_plats:
                        elements.length,

                    plats:
                        elements
                            .map(
                                function (
                                    element
                                ) {

                                    return element.nom;
                                }
                            )
                            .join(
                                " | "
                            )

                };
            }
        )
    );


    /* =================================
       CONSTRUCTION DES 7 JOURS
    ================================= */

    const jours =
        [];


    for (
        let index = 0;
        index < 7;
        index++
    ) {

        const date =
            ajouterJours(
                debutSemaine,
                index
            );


        const nomJour =
            date.toLocaleDateString(
                "fr-FR",
                {

                    weekday:
                        "long"

                }
            );


        jours.push(`

            <article
                class="jour-planning ${
                    estAujourdhui(
                        date
                    )
                        ? "aujourdhui"
                        : ""
                }"
            >

                <div class="entete-jour">

                    <span class="nom-jour">

                        ${capitaliser(
                            nomJour
                        )}

                    </span>


                    <div class="date-jour">

                        ${formaterDateCourte(
                            date
                        )}

                    </div>

                </div>


                ${creerCreneauRepas(
                    date,
                    "midi"
                )}


                ${creerCreneauRepas(
                    date,
                    "soir"
                )}

            </article>

        `);
    }


    /* =================================
       INJECTION HTML
    ================================= */

    grilleSemaine.innerHTML =
        jours.join("");
}


/* =================================
   RAFRAÎCHIR LE PLANNING
================================= */

async function rafraichirPlanning() {

    grilleSemaine.innerHTML = `

        <p>
            Chargement du planning…
        </p>

    `;


    try {

        /*
            On vide explicitement
            l'ancienne semaine avant
            d'interroger Supabase.
        */

        repasSemaine =
            [];


        /*
            Rechargement depuis
            planning-data.js.
        */

        await chargerRepasSemaine();


        console.log(
            "NOMBRE DE REPAS APRÈS RECHARGEMENT :",
            repasSemaine.length
        );


        /*
            Affichage uniquement après
            réception des données.
        */

        afficherSemaine();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur chargement planning :",
            erreur
        );


        grilleSemaine.innerHTML = `

            <p>
                Impossible de charger le planning.
                ${echapperTextePlanningUI(
                    erreur.message ||
                    ""
                )}
            </p>

        `;
    }
}


/* =================================
   FIN PLANNING UI
================================= */
