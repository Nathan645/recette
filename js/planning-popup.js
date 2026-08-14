/* =================================
   PLANNING POPUP
   VERSION MULTI-PLATS
================================= */


/* =================================
   OUVRIR LA POPUP
================================= */

function ouvrirPopup(
    dateISO,
    moment,
    repas = null
) {

    /* =========================
       ÉTAT DU CRÉNEAU
    ========================= */

    dateSelectionnee =
        dateISO;


    momentSelectionne =
        moment;


    repasEnModification =
        repas;


    /* =========================
       DATE
    ========================= */

    const date =
        new Date(
            `${dateISO}T12:00:00`
        );


    const titresMoments = {

    "petit-dejeuner":
        "Petit-déjeuner",

    "midi":
        "Midi",

    "gouter":
        "Goûter",

    "soir":
        "Soir"

};


const momentTexte =
    titresMoments[
        moment
    ] ||
    moment;


    if (
        datePopupRepas
    ) {

        datePopupRepas.textContent =
            `${capitaliser(
                formaterDateLongue(
                    date
                )
            )} • ${momentTexte}`;

    }


    /* =========================
       TITRE
    ========================= */

    if (
        typeof titrePopupRepas !==
            "undefined" &&
        titrePopupRepas
    ) {

        titrePopupRepas.textContent =
            repas
                ? "Modifier le repas"
                : "Composer le repas";

    }


    /* =========================
       NOMBRE DE PERSONNES
    ========================= */

    if (
        champPersonnesRepas
    ) {

        const nombreRepas =
            repas
                ? Number(
                    repas.personnes
                )
                : 0;


        champPersonnesRepas.value =
            Number.isInteger(
                nombreRepas
            ) &&
            nombreRepas > 0
                ? nombreRepas
                : (
                    nombrePersonnesParDefaut ||
                    2
                );

    }


    /* =========================
       ÉLÉMENTS DU REPAS
    ========================= */

    elementsRepasEnCours =
        [];


    /*
        Nouveau format :

        repas.elements contient
        toutes les recettes et
        tous les plats libres.
    */

    if (
        repas &&
        Array.isArray(
            repas.elements
        ) &&
        repas.elements.length > 0
    ) {

        elementsRepasEnCours =
    repas.elements.map(
        function (
            element
        ) {

            return {

                id:
                    element.id ||
                    null,

                type:
                    element.recette_id
                        ? "recette"
                        : "libre",

                recette_id:
                    element.recette_id ||
                    null,

                nom:
                    element.nom ||
                    "",

                mode_approvisionnement:
                    element.mode_approvisionnement ||
                    "faire"

            };
        }
    );


    /*
        Compatibilité avec les
        anciens repas.

        Si aucun tableau elements
        n'existe encore, on récupère
        nom + recette_id du parent.
    */

    } else if (
        repas &&
        repas.nom
    ) {

        elementsRepasEnCours = [

    {

        id:
            null,

        type:
            repas.recette_id
                ? "recette"
                : "libre",

        recette_id:
            repas.recette_id ||
            null,

        nom:
            repas.nom,

        mode_approvisionnement:
            "faire"

    }

];

    }


    /* =========================
       RECHERCHE RECETTE
    ========================= */

    if (
        champRechercheRecette
    ) {

        champRechercheRecette.value =
            "";

    }


    /* =========================
       PLAT LIBRE
    ========================= */

    if (
        champNomRepasLibre
    ) {

        champNomRepasLibre.value =
            "";

    }


    /* =========================
       MESSAGE
    ========================= */

    if (
        messagePlanning
    ) {

        messagePlanning.textContent =
            "";

        messagePlanning.classList.remove(
            "erreur",
            "succes"
        );

    }


    /* =========================
       BOUTON SUPPRESSION
    ========================= */

    if (
        boutonSupprimerRepas
    ) {

        boutonSupprimerRepas.hidden =
            !repas;

    }


    /* =========================
       BOUTON VALIDATION
    ========================= */

    if (
        typeof boutonValiderRepas !==
            "undefined" &&
        boutonValiderRepas
    ) {

        boutonValiderRepas.disabled =
            false;


        boutonValiderRepas.textContent =
            repas
                ? "Enregistrer le repas"
                : "Terminer le repas";

    }


    /* =========================
       AFFICHER LES PLATS
    ========================= */

    if (
        typeof afficherElementsRepasEnCours ===
        "function"
    ) {

        afficherElementsRepasEnCours();

    }


    /* =========================
       AFFICHER LES RECETTES
    ========================= */

    if (
        typeof afficherResultatsRecettes ===
        "function"
    ) {

        afficherResultatsRecettes(
            ""
        );

    }


    /* =========================
       OUVERTURE
    ========================= */

    if (
        popupRepas
    ) {

        popupRepas.hidden =
            false;

    }


    document.body.style.overflow =
        "hidden";


    /* =========================
       FOCUS
    ========================= */

    if (
        champRechercheRecette
    ) {

        setTimeout(
            function () {

                champRechercheRecette.focus();

            },
            50
        );

    }

}


/* =================================
   FERMER LA POPUP
================================= */

function fermerPopup() {

    /* =========================
       FERMER
    ========================= */

    if (
        popupRepas
    ) {

        popupRepas.hidden =
            true;

    }


    document.body.style.overflow =
        "";


    /* =========================
       RÉINITIALISER ÉTAT
    ========================= */

    dateSelectionnee =
        null;


    momentSelectionne =
        null;


    repasEnModification =
        null;


    elementsRepasEnCours =
        [];


    /* =========================
       RECHERCHE
    ========================= */

    if (
        champRechercheRecette
    ) {

        champRechercheRecette.value =
            "";

    }


    /* =========================
       PLAT LIBRE
    ========================= */

    if (
        champNomRepasLibre
    ) {

        champNomRepasLibre.value =
            "";

    }


    /* =========================
       MESSAGE
    ========================= */

    if (
        messagePlanning
    ) {

        messagePlanning.textContent =
            "";

        messagePlanning.classList.remove(
            "erreur",
            "succes"
        );

    }


    /* =========================
       SUPPRESSION
    ========================= */

    if (
        boutonSupprimerRepas
    ) {

        boutonSupprimerRepas.hidden =
            true;

        boutonSupprimerRepas.disabled =
            false;

        boutonSupprimerRepas.textContent =
            "Vider ce créneau";

    }


    /* =========================
       VALIDATION
    ========================= */

    if (
        typeof boutonValiderRepas !==
            "undefined" &&
        boutonValiderRepas
    ) {

        boutonValiderRepas.disabled =
            false;

        boutonValiderRepas.textContent =
            "Terminer le repas";

    }


    /* =========================
       LISTE DES PLATS
    ========================= */

    if (
        typeof listeElementsRepas !==
            "undefined" &&
        listeElementsRepas
    ) {

        listeElementsRepas.innerHTML = `

            <p class="message-elements-vide">
                Aucun plat ajouté pour le moment.
            </p>

        `;

    }


    /* =========================
       RÉSULTATS RECETTES
    ========================= */

    if (
        typeof resultatsRecettesPlanning !==
            "undefined" &&
        resultatsRecettesPlanning
    ) {

        resultatsRecettesPlanning.innerHTML =
            "";

    }

}


/* =================================
   OUVRIR AVEC DATE JS OU DATE ISO
================================= */

function ouvrirPopupMultiRepas(
    date,
    moment
) {

    /*
        planning-ui.js transmet
        généralement un objet Date.

        Mais on accepte également
        directement "YYYY-MM-DD".
    */

    const dateISO =
        date instanceof Date
            ? formaterDateISO(
                date
            )
            : String(
                date
            );


    /* =========================
       CHERCHER LE REPAS
    ========================= */

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
                        String(
                            moment
                        )
                            .trim()
                            .toLowerCase()
                );

            }
        ) ||
        null;


    /* =========================
       OUVRIR
    ========================= */

    ouvrirPopup(
        dateISO,
        moment,
        repas
    );

}


/* =================================
   OUVRIR À PARTIR D'UN REPAS
================================= */

function ouvrirPopupDepuisRepas(
    repas
) {

    if (
        !repas
    ) {

        return;

    }


    ouvrirPopup(
        repas.date,
        repas.moment,
        repas
    );

}


/* =================================
   COMPATIBILITÉ ANCIEN CODE
================================= */

/*
    Certains fichiers du planning
    peuvent encore appeler directement :

        ouvrirPopup(...)
        fermerPopup()

    On conserve donc ces fonctions.

    Le nouveau système peut quant à lui
    appeler :

        ouvrirPopupMultiRepas(...)
*/


window.ouvrirPopup =
    ouvrirPopup;


window.fermerPopup =
    fermerPopup;


window.ouvrirPopupMultiRepas =
    ouvrirPopupMultiRepas;


window.ouvrirPopupDepuisRepas =
    ouvrirPopupDepuisRepas;


/* =================================
   FIN PLANNING POPUP
================================= */
