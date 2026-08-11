/* =================================
   ÉLÉMENTS HTML
================================= */

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

const boutonMotDePasseOublie =
    document.getElementById(
        "mot-de-passe-oublie"
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


function changerOnglet(
    onglet
) {

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
    async function (
        evenement
    ) {

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

            const {
                data,
                error
            } =
                await window.supabaseClient
                    .auth
                    .signUp({

                        email:
                            email,

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


            if (!data.session) {

                formulaireInscription
                    .reset();


                changerOnglet(
                    "connexion"
                );


                afficherMessage(
                    "Votre compte a été créé. Vérifiez votre boîte mail pour confirmer votre adresse, puis revenez vous connecter.",
                    "succes"
                );


                return;

            }


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
    async function (
        evenement
    ) {

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

            const {
                data,
                error
            } =
                await window.supabaseClient
                    .auth
                    .signInWithPassword({

                        email:
                            email,

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
   MOT DE PASSE OUBLIÉ
================================= */

if (boutonMotDePasseOublie) {

    boutonMotDePasseOublie.addEventListener(
        "click",
        async function () {

            const champEmail =
                document.getElementById(
                    "email-connexion"
                );


            const email =
                champEmail
                    .value
                    .trim();


            /* =========================
               E-MAIL VIDE
            ========================= */

            if (!email) {

                afficherMessage(
                    "Renseignez votre adresse e-mail avant de demander un nouveau mot de passe.",
                    "erreur"
                );


                champEmail.focus();


                return;

            }


            /* =========================
               E-MAIL INVALIDE
            ========================= */

            if (
                !champEmail.checkValidity()
            ) {

                afficherMessage(
                    "Renseignez une adresse e-mail valide.",
                    "erreur"
                );


                champEmail.focus();


                return;

            }


            /* =========================
               CHARGEMENT
            ========================= */

            boutonMotDePasseOublie.disabled =
                true;


            boutonMotDePasseOublie.textContent =
                "Envoi en cours…";


            afficherMessage(
                "Envoi du lien de réinitialisation…"
            );


            try {

                /*
                    Exemple :

                    https://monsite.fr/compte.html

                    devient :

                    https://monsite.fr/
                    nouveau-mot-de-passe.html
                */

                const urlRedirection =
                    new URL(
                        "./nouveau-mot-de-passe.html",
                        window.location.href
                    ).href;


                console.log(
                    "Redirection mot de passe :",
                    urlRedirection
                );


                const {
                    error
                } =
                    await window.supabaseClient
                        .auth
                        .resetPasswordForEmail(
                            email,
                            {
                                redirectTo:
                                    urlRedirection
                            }
                        );


                if (error) {
                    throw error;
                }


                afficherMessage(
                    "Un e-mail de réinitialisation vient de vous être envoyé. Vérifiez également vos courriers indésirables.",
                    "succes"
                );


            } catch (erreur) {

                console.error(
                    "Erreur mot de passe oublié :",
                    erreur
                );


                afficherMessage(
                    obtenirMessageErreur(
                        erreur
                    ),
                    "erreur"
                );


            } finally {

                boutonMotDePasseOublie.disabled =
                    false;


                boutonMotDePasseOublie.textContent =
                    "Mot de passe oublié ?";

            }

        }
    );

}


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


    if (
        messageMinuscule.includes(
            "email rate limit"
        )
    ) {

        return (
            "Trop de demandes ont été effectuées. Réessayez dans quelques minutes."
        );

    }


    if (
        messageMinuscule.includes(
            "rate limit"
        )
    ) {

        return (
            "Trop de tentatives ont été effectuées. Réessayez dans quelques minutes."
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

        const {
            data,
            error
        } =
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
