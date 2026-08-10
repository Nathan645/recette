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


    /*
        Recherche robuste du repas.

        On normalise la date et le moment
        pour éviter qu'un repas présent
        en base ne soit pas affiché à cause
        d'une différence de format.
    */

    const repas =
        repasSemaine.find(
            function (
                element
            ) {

                const dateRepas =
                    String(
                        element.date || ""
                    )
                        .trim();


                const momentRepas =
                    String(
                        element.moment || ""
                    )
                        .trim()
                        .toLowerCase();


                const momentRecherche =
                    String(
                        moment || ""
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

        const nombrePersonnes =
            Number(
                repas.personnes
            ) > 0
                ? Number(
                    repas.personnes
                )
                : (
                    nombrePersonnesParDefaut ||
                    2
                );


        const textePersonnes =
            `${nombrePersonnes} personne${
                nombrePersonnes > 1
                    ? "s"
                    : ""
            }`;


        /* =================================
           REPAS AVEC RECETTE
        ================================= */

        if (
            repas.recette_id
        ) {

            contenu = `

                <div class="repas-planifie">

                    <div class="infos-repas-planifie">

                        <a
                            href="recette.html?id=${encodeURIComponent(
                                repas.recette_id
                            )}"
                            class="lien-repas-recette"
                        >
                            ${repas.nom}
                        </a>

                        <span class="personnes-repas-planifie">
                            👥 ${textePersonnes}
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


        /* =================================
           REPAS LIBRE
        ================================= */

        } else {

            contenu = `

                <div class="repas-planifie">

                    <div class="infos-repas-planifie">

                        <span class="nom-repas-libre">
                            ${repas.nom}
                        </span>

                        <span class="personnes-repas-planifie">
                            👥 ${textePersonnes}
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
        }


    /* =================================
       CRÉNEAU VIDE
    ================================= */

    } else {

        contenu = `

            <button
                type="button"
                class="bouton-ajouter-repas"
                data-date="${dateISO}"
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
       DEBUG TEMPORAIRE
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


    console.table(
        repasSemaine.map(
            function (
                repas
            ) {

                return {

                    id:
                        repas.id,

                    date:
                        repas.date,

                    moment:
                        repas.moment,

                    nom:
                        repas.nom,

                    recette_id:
                        repas.recette_id,

                    personnes:
                        repas.personnes

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
                    estAujourdhui(date)
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
            Chargement de la semaine
            correspondant au nouveau
            debutSemaine.
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


    } catch (erreur) {

        console.error(
            "Erreur chargement planning :",
            erreur
        );


        grilleSemaine.innerHTML = `

            <p>
                Impossible de charger le planning.
                ${erreur.message || ""}
            </p>

        `;
    }
}


/* =================================
   RECHERCHE RECETTES
================================= */

function afficherResultatsRecettes(
    recherche
) {

    const texte =
        recherche
            .trim()
            .toLowerCase();


    const recettesFiltrees =
        recettes
            .filter(
                function (
                    recette
                ) {

                    return recette.nom
                        .toLowerCase()
                        .includes(
                            texte
                        );
                }
            )
            .slice(
                0,
                12
            );


    /* =================================
       AUCUN RÉSULTAT
    ================================= */

    if (
        recettesFiltrees.length ===
        0
    ) {

        resultatsRecettes.innerHTML = `

            <p>
                Aucune recette trouvée.
            </p>

        `;


        return;
    }


    /* =================================
       AFFICHAGE DES RECETTES
    ================================= */

    resultatsRecettes.innerHTML =
        recettesFiltrees
            .map(
                function (
                    recette
                ) {

                    return `

                        <button
                            type="button"
                            class="resultat-recette-planning"
                            data-recette-id="${recette.id}"
                        >

                            ${recette.nom}

                        </button>

                    `;
                }
            )
            .join("");
}
