/* =================================
   PLANNING CORE
   À notre table

   Ce fichier contient uniquement :
   - l'état général du planning
   - les outils de dates

   Les éléments HTML sont déclarés
   dans planning.js.
================================= */


/* =================================
   ÉTAT DU PLANNING
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


let recettes =
    [];


let dateSelectionnee =
    null;


let momentSelectionne =
    null;


let repasEnModification =
    null;


let nombrePersonnesParDefaut =
    2;


/* =================================
   OUTILS DATES
================================= */

function obtenirDebutSemaine(
    date
) {

    const resultat =
        new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );


    const jour =
        resultat.getDay();


    const decalage =
        jour === 0
            ? -6
            : 1 - jour;


    resultat.setDate(
        resultat.getDate() +
        decalage
    );


    resultat.setHours(
        0,
        0,
        0,
        0
    );


    return resultat;
}


/* =================================
   AJOUTER DES JOURS
================================= */

function ajouterJours(
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


/* =================================
   DATE ISO
   YYYY-MM-DD
================================= */

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


    return (
        `${annee}-${mois}-${jour}`
    );
}


/* =================================
   CRÉER UNE DATE DEPUIS ISO
================================= */

function creerDateDepuisISO(
    dateISO
) {

    if (!dateISO) {

        return new Date();

    }


    const morceaux =
        String(
            dateISO
        )
            .split("-");


    if (
        morceaux.length !== 3
    ) {

        return new Date(
            dateISO
        );

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


/* =================================
   DATE COURTE
================================= */

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


/* =================================
   DATE LONGUE
================================= */

function formaterDateLongue(
    date
) {

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


/* =================================
   CAPITALISER
================================= */

function capitaliser(
    texte
) {

    if (!texte) {

        return "";

    }


    return (
        texte
            .charAt(0)
            .toUpperCase() +
        texte.slice(1)
    );
}


/* =================================
   NUMÉRO DE SEMAINE ISO
================================= */

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
        copie.getUTCDay() ||
        7;


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
                (
                    copie -
                    premierJanvier
                ) /
                86400000
            ) +
            1
        ) /
        7
    );
}


/* =================================
   EST AUJOURD'HUI
================================= */

function estAujourdhui(
    date
) {

    const maintenant =
        new Date();


    return (

        date.getFullYear() ===
            maintenant.getFullYear() &&

        date.getMonth() ===
            maintenant.getMonth() &&

        date.getDate() ===
            maintenant.getDate()

    );
}


/* =================================
   FIN PLANNING CORE
================================= */
