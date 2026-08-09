const ongletConnexion =
    document.getElementById(
        "onglet-connexion"
    );

const ongletInscription =
    document.getElementById(
        "onglet-inscription"
    );

const formulaireConnexion =
    document.getElementById(
        "formulaire-connexion"
    );

const formulaireInscription =
    document.getElementById(
        "formulaire-inscription"
    );

const boutonConnexion =
    document.getElementById(
        "bouton-connexion"
    );

const boutonInscription =
    document.getElementById(
        "bouton-inscription"
    );

const messageCompte =
    document.getElementById(
        "message-compte"
    );


/* =================================
   OUTILS
================================= */

function afficherMessage(
    texte,
    type = ""
) {
    messageCompte.textContent =
        texte;

    messageCompte.classList.remove(
        "erreur",
        "succes"
    );

    if (type) {
        messageCompte.classList.add(
            type
        );
    }
}


function changerOnglet(onglet) {

    afficherMessage("");


    const modeConnexion =
        onglet === "connexion";


    ongletConnexion.classList.toggle(
        "actif",
        modeConnexion
    );

    ongletInscription.classList.toggle(
        "actif",
        !modeConnexion
    );


    ongletConnexion.setAttribute(
        "aria-selected",
        modeConnexion
            ? "true"
            : "false"
    );

    ongletInscription.setAttribute(
        "aria-selected",
        modeConnexion
            ? "false"
            : "true"
    );


    formulaireConnexion.classList.toggle(
        "actif",
        modeConnexion
    );

    formulaireInscription.classList.toggle(
        "actif",
        !modeConnexion
    );
}


/* =================================
   ONGLETS
================================= */

ongletConnexion.addEventListener(
    "click",
    function () {
        changerOnglet(
            "connexion"
        );
    }
);


ongletInscription.addEventListener(
    "click",
    function () {
        changerOnglet(
            "inscription"
        );
    }
);


/* =================================
   INSCRIPTION
================================= */

formulaireInscription.addEventListener(
    "submit",
    async function (evenement) {

        evenement.preventDefault();


        const prenom =
            document.getElementById(
                "prenom"
            )
                .value
                .trim();

        const nom =
            document.getElementById(
                "nom"
            )
                .value
                .trim();

        const email =
            document.getElementById(
                "email-inscription"
            )
                .value
                .trim();

        const motDePasse =
            document.getElementById(
                "mot-de-passe-inscription"
            ).value;

        const confirmationMotDePasse =
            document.getElementById(
                "confirmation-mot-de-passe"
            ).value;


        if (
            motDePasse !==
            confirmationMotDePasse
        ) {

            afficherMessage(
                "Les mots de passe ne correspondent pas.",
                "erreur"
            );

            return;
        }


        boutonInscription.disabled =
            true;

        boutonInscription.textContent =
            "Création du compte…";

        afficherMessage(
            "Création de votre compte…"
        );


        try {

            const { data, error } =
                await window.supabaseClient
                    .auth
                    .signUp({
                        email: email,

                        password:
                            motDePasse,

                        options: {
                            data: {
                                prenom:
                                    prenom,

                                nom:
                                    nom
                            }
                        }
                    });


            if (error) {
                throw error;
            }


            /*
                Si la confirmation d'e-mail
                est activée dans Supabase,
                data.session sera null.
            */

            if (!data.session) {

                afficherMessage(
                    "Votre compte a été créé. Vérifiez votre boîte mail pour confirmer votre adresse, puis revenez vous connecter.",
                    "succes"
                );


                formulaireInscription
                    .reset();


                changerOnglet(
                    "connexion"
                );


                return;
            }


            /*
                Si la confirmation d'e-mail
                est désactivée, l'utilisateur
                est déjà connecté.
            */

            window.location.href =
                "foyer.html";


        } catch (erreur) {

            console.error(
                "Erreur d'inscription :",
                erreur
            );


            afficherMessage(
                obtenirMessageErreur(
                    erreur
                ),
                "erreur"
            );


        } finally {

            boutonInscription.disabled =
                false;

            boutonInscription.textContent =
                "Créer mon compte";

        }

    }
);


/* =================================
   CONNEXION
================================= */

formulaireConnexion.addEventListener(
    "submit",
    async function (evenement) {

        evenement.preventDefault();


        const email =
            document.getElementById(
                "email-connexion"
            )
                .value
                .trim();

        const motDePasse =
            document.getElementById(
                "mot-de-passe-connexion"
            ).value;


        boutonConnexion.disabled =
            true;

        boutonConnexion.textContent =
            "Connexion…";

        afficherMessage(
            "Connexion en cours…"
        );


        try {

            const { data, error } =
                await window.supabaseClient
                    .auth
                    .signInWithPassword({
                        email: email,

                        password:
                            motDePasse
                    });


            if (error) {
                throw error;
            }


            if (
                !data.user ||
                !data.session
            ) {

                throw new Error(
                    "Impossible de démarrer la session."
                );
            }


            /*
                Pour le moment :
                après connexion, on envoie
                l'utilisateur vers foyer.html.

                Plus tard, on vérifiera s'il
                appartient déjà à un foyer :
                - oui -> index.html
                - non -> foyer.html
            */

            window.location.href =
                "foyer.html";


        } catch (erreur) {

            console.error(
                "Erreur de connexion :",
                erreur
            );


            afficherMessage(
                obtenirMessageErreur(
                    erreur
                ),
                "erreur"
            );


        } finally {

            boutonConnexion.disabled =
                false;

            boutonConnexion.textContent =
                "Se connecter";

        }

    }
);


/* =================================
   MESSAGES D'ERREUR
================================= */

function obtenirMessageErreur(
    erreur
) {

    const message =
        erreur &&
        erreur.message
            ? erreur.message
            : "";


    const messageMinuscule =
        message.toLowerCase();


    if (
        messageMinuscule.includes(
            "invalid login credentials"
        )
    ) {

        return (
            "Adresse e-mail ou mot de passe incorrect."
        );

    }


    if (
        messageMinuscule.includes(
            "email not confirmed"
        )
    ) {

        return (
            "Votre adresse e-mail n'a pas encore été confirmée."
        );

    }


    if (
        messageMinuscule.includes(
            "user already registered"
        )
    ) {

        return (
            "Un compte existe déjà avec cette adresse e-mail."
        );

    }


    if (
        messageMinuscule.includes(
            "password"
        ) &&
        messageMinuscule.includes(
            "characters"
        )
    ) {

        return (
            "Le mot de passe n'est pas assez long."
        );

    }


    return (
        message ||
        "Une erreur est survenue."
    );
}


/* =================================
   UTILISATEUR DÉJÀ CONNECTÉ
================================= */

async function verifierSessionExistante() {

    try {

        const { data, error } =
            await window.supabaseClient
                .auth
                .getSession();


        if (error) {
            throw error;
        }


        if (
            data.session &&
            data.session.user
        ) {

            /*
                Pour l'instant on envoie
                sur foyer.html.

                Une fois les foyers créés,
                cette fonction vérifiera
                automatiquement où envoyer
                l'utilisateur.
            */

            window.location.href =
                "foyer.html";

        }


    } catch (erreur) {

        console.error(
            "Erreur de vérification de session :",
            erreur
        );

    }
}


/* =================================
   DÉMARRAGE
================================= */

verifierSessionExistante();
