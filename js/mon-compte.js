/* =================================
   ÉLÉMENTS HTML
================================= */

const chargementCompte =
    document.getElementById(
        "chargement-compte"
    );

const contenuMonCompte =
    document.getElementById(
        "contenu-mon-compte"
    );

const messageErreurCompte =
    document.getElementById(
        "message-erreur-compte"
    );

const texteErreurCompte =
    document.getElementById(
        "texte-erreur-compte"
    );


/* HEADER */

const infosUtilisateur =
    document.getElementById(
        "infos-utilisateur"
    );

const prenomUtilisateur =
    document.getElementById(
        "prenom-utilisateur"
    );

const nomFoyerUtilisateur =
    document.getElementById(
        "nom-foyer-utilisateur"
    );


/* PROFIL */

const comptePrenom =
    document.getElementById(
        "compte-prenom"
    );

const compteNom =
    document.getElementById(
        "compte-nom"
    );

const compteEmail =
    document.getElementById(
        "compte-email"
    );



/* FOYER */

const foyerNom =
    document.getElementById(
        "foyer-nom"
    );


const foyerNombreMembres =
    document.getElementById(
        "foyer-nombre-membres"
    );

const foyerCode =
    document.getElementById(
        "foyer-code"
    );

const boutonCopierCode =
    document.getElementById(
        "copier-code-foyer"
    );

const messageCopieCode =
    document.getElementById(
        "message-copie-code"
    );


/* MEMBRES */

const listeMembresFoyer =
    document.getElementById(
        "liste-membres-foyer"
    );


/* DÉCONNEXION */

const boutonDeconnexion =
    document.getElementById(
        "bouton-deconnexion"
    );


/* =================================
   VARIABLES
================================= */

let utilisateurConnecte =
    null;

let profilUtilisateur =
    null;

let foyerUtilisateur =
    null;

let membresFoyer =
    [];


/* =================================
   OUTILS
================================= */

function afficherErreur(
    erreur
) {

    console.error(
        "Erreur Mon compte :",
        erreur
    );


    chargementCompte.hidden =
        true;

    contenuMonCompte.hidden =
        true;

    messageErreurCompte.hidden =
        false;


    texteErreurCompte.textContent =
        erreur.message ||
        "Une erreur est survenue.";
}


function valeurOuTiret(
    valeur
) {

    if (
        valeur === null ||
        valeur === undefined ||
        String(valeur).trim() === ""
    ) {

        return "—";
    }


    return valeur;
}


function obtenirInitiales(
    prenom,
    nom
) {

    const premiereLettrePrenom =
        prenom
            ? prenom
                .trim()
                .charAt(0)
                .toUpperCase()
            : "";


    const premiereLettreNom =
        nom
            ? nom
                .trim()
                .charAt(0)
                .toUpperCase()
            : "";


    return (
        premiereLettrePrenom +
        premiereLettreNom
    ) || "👤";
}


/* =================================
   UTILISATEUR CONNECTÉ
================================= */

async function recupererUtilisateur() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .auth
            .getUser();


    if (error) {
        throw error;
    }


    if (!data.user) {

        window.location.href =
            "compte.html";

        return null;
    }


    utilisateurConnecte =
        data.user;


    return utilisateurConnecte;
}


/* =================================
   PROFIL
================================= */

async function recupererProfil() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("profiles")
            .select("*")
            .eq(
                "id",
                utilisateurConnecte.id
            )
            .maybeSingle();


    if (error) {
        throw error;
    }


    profilUtilisateur =
        data;


    return data;
}


/* =================================
   APPARTENANCE AU FOYER
================================= */

async function recupererAppartenanceFoyer() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("membres_foyer")
            .select("*")
            .eq(
                "user_id",
                utilisateurConnecte.id
            )
            .limit(1)
            .maybeSingle();


    if (error) {
        throw error;
    }


    if (!data) {

        window.location.href =
            "foyer.html";

        return null;
    }


    return data;
}


/* =================================
   INFORMATIONS DU FOYER
================================= */

async function recupererFoyer(
    foyerId
) {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("foyers")
            .select("*")
            .eq(
                "id",
                foyerId
            )
            .single();


    if (error) {
        throw error;
    }


    foyerUtilisateur =
        data;


    return data;
}


/* =================================
   MEMBRES DU FOYER
================================= */

async function recupererMembresFoyer(
    foyerId
) {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("membres_foyer")
            .select("*")
            .eq(
                "foyer_id",
                foyerId
            );


    if (error) {
        throw error;
    }


    const appartenances =
        Array.isArray(data)
            ? data
            : [];


    if (
        appartenances.length ===
        0
    ) {

        membresFoyer =
            [];

        return [];
    }


    const idsUtilisateurs =
        appartenances
            .map(
                function (
                    membre
                ) {

                    return membre.user_id;
                }
            )
            .filter(Boolean);


    const {
        data: profils,
        error: erreurProfils
    } =
        await window.supabaseClient
            .from("profiles")
            .select("*")
            .in(
                "id",
                idsUtilisateurs
            );


    if (erreurProfils) {
        throw erreurProfils;
    }


    const profilsDisponibles =
        Array.isArray(profils)
            ? profils
            : [];


    membresFoyer =
        appartenances.map(
            function (
                appartenance
            ) {

                const profil =
                    profilsDisponibles.find(
                        function (
                            element
                        ) {

                            return (
                                element.id ===
                                appartenance.user_id
                            );
                        }
                    );


                return {

                    ...appartenance,

                    profil:
                        profil || null

                };
            }
        );


    return membresFoyer;
}


/* =================================
   RÔLES
================================= */

function obtenirRoleFoyer(
    userId
) {

    if (
        foyerUtilisateur &&
        foyerUtilisateur.created_by ===
            userId
    ) {

        return "Propriétaire";
    }


    return "Membre";
}


/* =================================
   AFFICHER LE PROFIL
================================= */

function afficherProfil() {

    const prenom =
        profilUtilisateur?.prenom ||
        "";

    const nom =
        profilUtilisateur?.nom ||
        "";


    comptePrenom.textContent =
        valeurOuTiret(
            prenom
        );


    compteNom.textContent =
        valeurOuTiret(
            nom
        );


    compteEmail.textContent =
        valeurOuTiret(
            utilisateurConnecte.email
        );


    /* HEADER */

    prenomUtilisateur.textContent =
        prenom ||
        utilisateurConnecte.email ||
        "";


    nomFoyerUtilisateur.textContent =
        foyerUtilisateur?.nom ||
        "";


    infosUtilisateur.hidden =
        false;
}


/* =================================
   AFFICHER LE FOYER
================================= */

function afficherFoyer() {

    foyerNom.textContent =
        valeurOuTiret(
            foyerUtilisateur.nom
        );


    foyerCode.textContent =
        valeurOuTiret(
            foyerUtilisateur.code
        );


    const nombreMembres =
        membresFoyer.length;


    foyerNombreMembres.textContent =
        nombreMembres === 1
            ? "1 membre"
            : `${nombreMembres} membres`;
}


/* =================================
   AFFICHER LES MEMBRES
================================= */

function afficherMembres() {

    if (
        membresFoyer.length ===
        0
    ) {

        listeMembresFoyer.innerHTML = `
            <p>
                Aucun membre dans ce foyer.
            </p>
        `;

        return;
    }


    const membresTries =
        [...membresFoyer]
            .sort(
                function (
                    membreA,
                    membreB
                ) {

                    /*
                        Le propriétaire
                        apparaît en premier.
                    */

                    if (
                        membreA.user_id ===
                        foyerUtilisateur.created_by
                    ) {

                        return -1;
                    }


                    if (
                        membreB.user_id ===
                        foyerUtilisateur.created_by
                    ) {

                        return 1;
                    }


                    const prenomA =
                        membreA.profil?.prenom ||
                        "";

                    const prenomB =
                        membreB.profil?.prenom ||
                        "";


                    return prenomA.localeCompare(
                        prenomB,
                        "fr"
                    );
                }
            );


    listeMembresFoyer.innerHTML =
        membresTries
            .map(
                function (
                    membre
                ) {

                    const prenom =
                        membre.profil?.prenom ||
                        "";

                    const nom =
                        membre.profil?.nom ||
                        "";


                    const nomComplet =
                        `${prenom} ${nom}`
                            .trim() ||
                        "Membre";


                    const role =
                        obtenirRoleFoyer(
                            membre.user_id
                        );


                    const estMoi =
                        membre.user_id ===
                        utilisateurConnecte.id;


                    const initiales =
                        obtenirInitiales(
                            prenom,
                            nom
                        );


                    return `

                        <div class="membre-foyer">

                            <div class="avatar-membre">
                                ${initiales}
                            </div>


                            <div class="infos-membre">

                                <strong>
                                    ${nomComplet}
                                    ${
                                        estMoi
                                            ? `
                                                <span class="badge-moi">
                                                    Vous
                                                </span>
                                            `
                                            : ""
                                    }
                                </strong>

                                <span>
                                    ${role}
                                </span>

                            </div>

                        </div>

                    `;
                }
            )
            .join("");
}


/* =================================
   COPIER LE CODE DU FOYER
================================= */

boutonCopierCode.addEventListener(
    "click",
    async function () {

        const code =
            foyerUtilisateur?.code;


        if (!code) {
            return;
        }


        try {

            await navigator.clipboard
                .writeText(
                    code
                );


            boutonCopierCode.textContent =
                "Copié ✓";


            messageCopieCode.textContent =
                "Le code du foyer a été copié.";


            setTimeout(
                function () {

                    boutonCopierCode.textContent =
                        "Copier le code";

                    messageCopieCode.textContent =
                        "";

                },
                1800
            );


        } catch (erreur) {

            console.error(
                "Impossible de copier le code :",
                erreur
            );


            messageCopieCode.textContent =
                `Code du foyer : ${code}`;
        }
    }
);


/* =================================
   DÉCONNEXION
================================= */

boutonDeconnexion.addEventListener(
    "click",
    async function () {

        boutonDeconnexion.disabled =
            true;


        boutonDeconnexion.textContent =
            "Déconnexion…";


        try {

            const {
                error
            } =
                await window.supabaseClient
                    .auth
                    .signOut();


            if (error) {
                throw error;
            }


            window.location.href =
                "compte.html";


        } catch (erreur) {

            console.error(
                "Erreur de déconnexion :",
                erreur
            );


            boutonDeconnexion.disabled =
                false;


            boutonDeconnexion.textContent =
                "Se déconnecter";


            window.alert(
                "Impossible de vous déconnecter."
            );
        }
    }
);


/* =================================
   INITIALISATION
================================= */

async function initialiserMonCompte() {

    try {

        const utilisateur =
            await recupererUtilisateur();


        if (!utilisateur) {
            return;
        }


        /*
            Profil utilisateur
        */

        await recupererProfil();


        /*
            Foyer de l'utilisateur
        */

        const appartenance =
            await recupererAppartenanceFoyer();


        if (!appartenance) {
            return;
        }


        /*
            Informations du foyer
        */

        await recupererFoyer(
            appartenance.foyer_id
        );


        /*
            Tous les membres
        */

        await recupererMembresFoyer(
            appartenance.foyer_id
        );


        /*
            Affichage
        */

        afficherProfil();

        afficherFoyer();

        afficherMembres();


        chargementCompte.hidden =
            true;


        contenuMonCompte.hidden =
            false;


    } catch (erreur) {

        afficherErreur(
            erreur
        );
    }
}


initialiserMonCompte();
