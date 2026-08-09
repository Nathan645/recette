/* =================================
   ÉLÉMENTS HTML
================================= */

const grilleSemaine = document.getElementById("grille-semaine");
const boutonSemainePrecedente = document.getElementById("semaine-precedente");
const boutonSemaineSuivante = document.getElementById("semaine-suivante");
const boutonAujourdhui = document.getElementById("aller-aujourdhui");
const numeroSemaine = document.getElementById("numero-semaine");
const titreSemaine = document.getElementById("titre-semaine");

const popupRepas = document.getElementById("popup-repas");
const boutonFermerPopup = document.getElementById("fermer-popup-repas");
const datePopupRepas = document.getElementById("date-popup-repas");
const boutonChoisirRecette = document.getElementById("choisir-recette");
const boutonChoisirLibre = document.getElementById("choisir-libre");
const blocRecettePlanning = document.getElementById("bloc-recette-planning");
const blocRepasLibre = document.getElementById("bloc-repas-libre");
const champRechercheRecette = document.getElementById("recherche-recette-planning");
const resultatsRecettes = document.getElementById("resultats-recettes-planning");
const champRepasLibre = document.getElementById("nom-repas-libre");
const boutonValiderRepasLibre = document.getElementById("valider-repas-libre");
const boutonSupprimerRepas = document.getElementById("supprimer-repas-planning");
const messagePlanning = document.getElementById("message-planning");

/* =================================
   ÉTAT DU PLANNING
================================= */

let utilisateurConnecte = null;
let foyerId = null;
let debutSemaine = obtenirDebutSemaine(new Date());
let repasSemaine = [];
let recettes = [];
let dateSelectionnee = null;
let momentSelectionne = null;
let repasEnModification = null;
let nombrePersonnesParDefaut = 2;

/* =================================
   OUTILS DATES
================================= */

function obtenirDebutSemaine(date) {
    const resultat = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const jour = resultat.getDay();
    const decalage = jour === 0 ? -6 : 1 - jour;
    resultat.setDate(resultat.getDate() + decalage);
    resultat.setHours(0, 0, 0, 0);
    return resultat;
}

function ajouterJours(date, nombre) {
    const resultat = new Date(date);
    resultat.setDate(resultat.getDate() + nombre);
    return resultat;
}

function formaterDateISO(date) {
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, "0");
    const jour = String(date.getDate()).padStart(2, "0");
    return `${annee}-${mois}-${jour}`;
}

function formaterDateCourte(date) {
    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short"
    });
}

function formaterDateLongue(date) {
    return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

function capitaliser(texte) {
    if (!texte) return "";
    return texte.charAt(0).toUpperCase() + texte.slice(1);
}

function obtenirNumeroSemaine(date) {
    const copie = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const jour = copie.getUTCDay() || 7;
    copie.setUTCDate(copie.getUTCDate() + 4 - jour);
    const premierJanvier = new Date(Date.UTC(copie.getUTCFullYear(), 0, 1));
    return Math.ceil((((copie - premierJanvier) / 86400000) + 1) / 7);
}

function estAujourdhui(date) {
    const maintenant = new Date();
    return (
        date.getFullYear() === maintenant.getFullYear() &&
        date.getMonth() === maintenant.getMonth() &&
        date.getDate() === maintenant.getDate()
    );
}
