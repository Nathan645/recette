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


/* =================================
   HEADER
================================= */

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


/* =================================
   PROFIL
================================= */

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


/* =================================
   FOYER
================================= */

const champNomFoyer =
    document.getElementById(
        "nom-foyer-modifiable"
    );

const boutonEnregistrerNomFoyer =
    document.getElementById(
        "enregistrer-nom-foyer"
    );

const messageNomFoyer =
    document.getElementById(
        "message-nom-foyer"
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


/* =================================
   PERSONNES DU FOYER
================================= */

const champPersonnesParDefaut =
    document.getElementById(
        "personnes-par-defaut"
    );

const boutonEnregistrerPersonnes =
    document.getElementById(
        "enregistrer-personnes-foyer"
    );

const messagePersonnesFoyer =
    document.getElementById(
        "message-personnes-foyer"
    );


/* =================================
   MEMBRES
================================= */

const listeMembresFoyer =
    document.getElementById(
        "liste-membres-foyer"
    );


/* =================================
   DÉCONNEXION
================================= */

const boutonDeconnexion =
    document.getElementById(
        "bouton-deconnexion"
    );


/* =================================
   VARIABLES
================================= */

let utilisateurConnecte = null;

let profilUtilisateur = null;

let foyerUtilisateur = null;

let membresFoyer = [];


/* =================================
   OUTILS
================================= */

function afficherErreur(erreur) {

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


function valeurOuTiret(valeur) {

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
        appartenances.length === 0
    ) {

        membresFoyer = [];

        return [];
    }

    const idsUtilisateurs =
        appartenances
            .map(
                function (membre) {

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
            function (appartenance) {

                const profil =
                    profilsDisponibles.find(
                        function (element) {

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

    /* Nom du foyer */

    champNomFoyer.value =
        foyerUtilisateur?.nom ||
        "";


    /* Code du foyer */

    foyerCode.textContent =
        valeurOuTiret(
            foyerUtilisateur?.code
        );


    /* Nombre de membres */

    const nombreMembres =
        membresFoyer.length;

    foyerNombreMembres.textContent =
        nombreMembres === 1
            ? "1 membre"
            : `${nombreMembres} membres`;


    /* Nombre habituel de personnes */

    const personnesParDefaut =
        Number(
            foyerUtilisateur
                ?.personnes_par_defaut
        );

    champPersonnesParDefaut.value =
        Number.isInteger(
            personnesParDefaut
        ) &&
        personnesParDefaut > 0
            ? personnesParDefaut
            : 2;
}


/* =================================
   AFFICHER LES MEMBRES
================================= */

function afficherMembres() {

    if (
        membresFoyer.length === 0
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
                function (membre) {

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
   ENREGISTRER LE NOM DU FOYER
================================= */

boutonEnregistrerNomFoyer
    .addEventListener(
        "click",
        async function () {

            messageNomFoyer.textContent =
                "";

            const nouveauNom =
                champNomFoyer
                    .value
                    .trim();


            if (!nouveauNom) {

                messageNomFoyer.textContent =
                    "Renseigne un nom de foyer.";

                return;
            }


            if (
                !foyerUtilisateur ||
                !foyerUtilisateur.id
            ) {

                messageNomFoyer.textContent =
                    "Impossible de déterminer votre foyer.";

                return;
            }


            boutonEnregistrerNomFoyer.disabled =
                true;

            boutonEnregistrerNomFoyer.textContent =
                "Enregistrement…";


            try {

                const {
                    data,
                    error
                } =
                    await window.supabaseClient
                        .from("foyers")
                        .update({
                            nom:
                                nouveauNom
                        })
                        .eq(
                            "id",
                            foyerUtilisateur.id
                        )
                        .select(
                            "id, nom"
                        )
                        .maybeSingle();


                if (error) {
                    throw error;
                }


                if (!data) {

                    throw new Error(
                        "La modification du foyer n'a pas été autorisée."
                    );
                }


                /* Mise à jour locale */

                foyerUtilisateur.nom =
                    data.nom;

                champNomFoyer.value =
                    data.nom;


                /* Mise à jour du header */

                nomFoyerUtilisateur.textContent =
                    data.nom;


                /* Confirmation */

                messageNomFoyer.textContent =
                    "Nom du foyer enregistré ✓";


                setTimeout(
                    function () {

                        messageNomFoyer.textContent =
                            "";

                    },
                    2200
                );


            } catch (erreur) {

                console.error(
                    "Erreur pendant la modification du nom du foyer :",
                    erreur
                );

                messageNomFoyer.textContent =
                    erreur.message ||
                    "Impossible d'enregistrer le nom du foyer.";

            } finally {

                boutonEnregistrerNomFoyer.disabled =
                    false;

                boutonEnregistrerNomFoyer.textContent =
                    "Enregistrer";
            }
        }
    );


/* =================================
   ENTRÉE = ENREGISTRER NOM
================================= */

champNomFoyer
    .addEventListener(
        "keydown",
        function (evenement) {

            if (
                evenement.key ===
                "Enter"
            ) {

                evenement.preventDefault();

                boutonEnregistrerNomFoyer
                    .click();
            }
        }
    );


/* =================================
   ENREGISTRER LE NOMBRE
   DE PERSONNES DU FOYER
================================= */

boutonEnregistrerPersonnes
    .addEventListener(
        "click",
        async function () {

            messagePersonnesFoyer
                .textContent =
                    "";

            const nombre =
                Number(
                    champPersonnesParDefaut
                        .value
                );


            if (
                !Number.isInteger(
                    nombre
                ) ||
                nombre < 1
            ) {

                messagePersonnesFoyer
                    .textContent =
                        "Renseigne un nombre de personnes valide.";

                return;
            }


            if (
                !foyerUtilisateur ||
                !foyerUtilisateur.id
            ) {

                messagePersonnesFoyer
                    .textContent =
                        "Impossible de déterminer votre foyer.";

                return;
            }


            boutonEnregistrerPersonnes
                .disabled =
                    true;

            boutonEnregistrerPersonnes
                .textContent =
                    "Enregistrement…";


            try {

                const {
                    data,
                    error
                } =
                    await window.supabaseClient
                        .from("foyers")
                        .update({

                            personnes_par_defaut:
                                nombre

                        })
                        .eq(
                            "id",
                            foyerUtilisateur.id
                        )
                        .select(
                            "id, personnes_par_defaut"
                        )
                        .maybeSingle();


                if (error) {
                    throw error;
                }


                if (!data) {

                    throw new Error(
                        "La modification du foyer n'a pas été autorisée."
                    );
                }


                foyerUtilisateur
                    .personnes_par_defaut =
                        data
                            .personnes_par_defaut;


                champPersonnesParDefaut
                    .value =
                        data
                            .personnes_par_defaut;


                messagePersonnesFoyer
                    .textContent =
                        "Nombre de personnes enregistré ✓";


                setTimeout(
                    function () {

                        messagePersonnesFoyer
                            .textContent =
                                "";

                    },
                    2200
                );


            } catch (erreur) {

                console.error(
                    "Erreur pendant la modification du nombre de personnes :",
                    erreur
                );


                messagePersonnesFoyer
                    .textContent =
                        erreur.message ||
                        "Impossible d'enregistrer le nombre de personnes.";


            } finally {

                boutonEnregistrerPersonnes
                    .disabled =
                        false;

                boutonEnregistrerPersonnes
                    .textContent =
                        "Enregistrer";
            }
        }
    );


/* =================================
   ENTRÉE = ENREGISTRER PERSONNES
================================= */

champPersonnesParDefaut
    .addEventListener(
        "keydown",
        function (evenement) {

            if (
                evenement.key ===
                "Enter"
            ) {

                evenement.preventDefault();

                boutonEnregistrerPersonnes
                    .click();
            }
        }
    );


/* =================================
   VALIDATION NOMBRE DE PERSONNES
================================= */

champPersonnesParDefaut
    .addEventListener(
        "change",
        function () {

            const nombre =
                Number(
                    champPersonnesParDefaut
                        .value
                );

            if (
                !Number.isInteger(
                    nombre
                ) ||
                nombre < 1
            ) {

                const valeurActuelle =
                    Number(
                        foyerUtilisateur
                            ?.personnes_par_defaut
                    );

                champPersonnesParDefaut
                    .value =
                        Number.isInteger(
                            valeurActuelle
                        ) &&
                        valeurActuelle > 0
                            ? valeurActuelle
                            : 2;
            }
        }
    );


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


            window.location.replace(
                "compte.html"
            );


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

        /* 1. Utilisateur connecté */

        const utilisateur =
            await recupererUtilisateur();


        if (!utilisateur) {
            return;
        }


        /* 2. Profil */

        await recupererProfil();


        /* 3. Appartenance foyer */

        const appartenance =
            await recupererAppartenanceFoyer();


        if (!appartenance) {
            return;
        }


        /* 4. Informations foyer */

        await recupererFoyer(
            appartenance.foyer_id
        );


        /* 5. Membres */

        await recupererMembresFoyer(
            appartenance.foyer_id
        );


        /* 6. Affichage */

        afficherProfil();

        afficherFoyer();

        afficherMembres();


        /* 7. Fin du chargement */

        chargementCompte.hidden =
            true;

        messageErreurCompte.hidden =
            true;

        contenuMonCompte.hidden =
            false;


    } catch (erreur) {

        afficherErreur(
            erreur
        );
    }
}


/* =================================
   DÉMARRAGE
================================= */

initialiserMonCompte();
