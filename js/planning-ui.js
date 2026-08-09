/* =================================
   CRÉNEAU REPAS
================================= */

function creerCreneauRepas(
    date,
    moment
) {

    const repas =
        trouverRepas(
            date,
            moment
        );

    const titreMoment =
        moment === "midi"
            ? "Midi"
            : "Soir";

    let contenu = "";


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


    } else {

        contenu = `

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


    numeroSemaine.textContent =
        `Semaine ${obtenirNumeroSemaine(
            debutSemaine
        )}`;


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

        await chargerRepasSemaine();


        afficherSemaine();


    } catch (erreur) {

        console.error(
            "Erreur chargement planning :",
            erreur
        );


        grilleSemaine.innerHTML = `
            <p>
                Impossible de charger le planning.
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
