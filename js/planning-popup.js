/* =================================
   MODES POP-UP
================================= */

function afficherModeRecette() {
    boutonChoisirRecette.classList.add("actif");
    boutonChoisirLibre.classList.remove("actif");
    blocRecettePlanning.hidden = false;
    blocRepasLibre.hidden = true;
}

function afficherModeLibre() {
    boutonChoisirLibre.classList.add("actif");
    boutonChoisirRecette.classList.remove("actif");
    blocRecettePlanning.hidden = true;
    blocRepasLibre.hidden = false;

    setTimeout(function () {
        champRepasLibre.focus();
    }, 50);
}

/* =================================
   OUVRIR / FERMER
================================= */

function ouvrirPopup(dateISO, moment, repas = null) {
    dateSelectionnee = dateISO;
    momentSelectionne = moment;
    repasEnModification = repas;

   const champPersonnes =
    document.getElementById("personnes-repas");

champPersonnes.value =
    nombrePersonnesParDefaut;
    const date = new Date(`${dateISO}T12:00:00`);
    const momentTexte = moment === "midi" ? "Midi" : "Soir";

    datePopupRepas.textContent =
        `${capitaliser(formaterDateLongue(date))} • ${momentTexte}`;

    champRechercheRecette.value = "";
    champRepasLibre.value = "";
    messagePlanning.textContent = "";

    boutonSupprimerRepas.hidden = !repasEnModification;

    if (repasEnModification) {
        if (repasEnModification.recette_id) {
            afficherModeRecette();
            champRechercheRecette.value = repasEnModification.nom;
            afficherResultatsRecettes(repasEnModification.nom);
        } else {
            afficherModeLibre();
            champRepasLibre.value = repasEnModification.nom;
        }
    } else {
        afficherModeRecette();
        afficherResultatsRecettes("");
    }

    popupRepas.hidden = false;
    document.body.style.overflow = "hidden";
}

function fermerPopup() {
    popupRepas.hidden = true;
    document.body.style.overflow = "";
    dateSelectionnee = null;
    momentSelectionne = null;
    repasEnModification = null;
    boutonSupprimerRepas.hidden = true;
    messagePlanning.textContent = "";
}
