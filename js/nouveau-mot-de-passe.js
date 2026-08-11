const formulaire =
    document.getElementById(
        "formulaire-nouveau-mot-de-passe"
    );


const champMotDePasse =
    document.getElementById(
        "nouveau-mot-de-passe"
    );


const champConfirmation =
    document.getElementById(
        "confirmation-nouveau-mot-de-passe"
    );


const boutonEnregistrer =
    document.getElementById(
        "bouton-nouveau-mot-de-passe"
    );


const messageCompte =
    document.getElementById(
        "message-compte"
    );


/* =================================
   ÉTAT
================================= */

let lienRecuperationValide =
    false;


/* =================================
   MESSAGE
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


    if (
        type
    ) {

        messageCompte.classList.add(
            type
        );

    }

}


/* =================================
   BLOQUER / DÉBLOQUER FORMULAIRE
================================= */

function definirFormulaireActif(
    actif
) {

    champMotDePasse.disabled =
        !actif;


    champConfirmation.disabled =
        !actif;


    boutonEnregistrer.disabled =
        !actif;

}


/* =================================
   VÉRIFIER LE LIEN
================================= */

async function verifierLienRecuperation() {

    /*
        On bloque le formulaire
        tant qu'on ne sait pas si
        le lien reçu par e-mail
        est valable.
    */

    definirFormulaireActif(
        false
    );


    afficherMessage(
        "Vérification du lien de réinitialisation…"
    );


    try {

        /*
            Lorsque l'utilisateur arrive
            depuis le mail Supabase,
            Supabase doit créer une session.

            On vérifie donc la session
            disponible dans le navigateur.
        */

        const {
            data,
            error
        } =
            await window.supabaseClient
                .auth
                .getSession();


        if (
            error
        ) {

            throw error;

        }


        if (
            data.session &&
            data.session.user
        ) {

            lienRecuperationValide =
                true;


            definirFormulaireActif(
                true
            );


            afficherMessage(
                "Choisissez votre nouveau mot de passe."
            );


            champMotDePasse.focus();


            return;
        }


        /*
            Aucune session trouvée.

            On laisse également quelques
            instants à Supabase pour traiter
            le lien de récupération.
        */

        afficherMessage(
            "Activation du lien de réinitialisation…"
        );


    } catch (
        erreur
    ) {

        console.error(
            "Erreur vérification récupération :",
            erreur
        );


        afficherMessage(
            "Ce lien de réinitialisation semble invalide ou expiré.",
            "erreur"
        );

    }

}


/* =================================
   ÉCOUTER LES ÉVÉNEMENTS SUPABASE
================================= */

window.supabaseClient
    .auth
    .onAuthStateChange(
        function (
            evenement,
            session
        ) {

            /*
                Supabase déclenche normalement
                PASSWORD_RECOVERY après l'ouverture
                du lien reçu par e-mail.
            */

            if (
                evenement ===
                "PASSWORD_RECOVERY"
            ) {

                lienRecuperationValide =
                    true;


                definirFormulaireActif(
                    true
                );


                afficherMessage(
                    "Vous pouvez maintenant choisir votre nouveau mot de passe.",
                    "succes"
                );


                champMotDePasse.focus();


                return;
            }


            /*
                Sécurité supplémentaire :
                si une session apparaît,
                on autorise également
                le formulaire.
            */

            if (
                session &&
                session.user &&
                !lienRecuperationValide
            ) {

                lienRecuperationValide =
                    true;


                definirFormulaireActif(
                    true
                );

            }

        }
    );


/* =================================
   ENREGISTRER LE NOUVEAU
   MOT DE PASSE
================================= */

formulaire.addEventListener(
    "submit",
    async function (
        evenement
    ) {

        evenement.preventDefault();


        afficherMessage("");


        /* =========================
           LIEN VALIDE
        ========================= */

        if (
            !lienRecuperationValide
        ) {

            afficherMessage(
                "Le lien de réinitialisation n'est pas valide ou a expiré. Demandez un nouveau lien depuis la page de connexion.",
                "erreur"
            );


            return;
        }


        /* =========================
           VALEURS
        ========================= */

        const motDePasse =
            champMotDePasse.value;


        const confirmation =
            champConfirmation.value;


        /* =========================
           CHAMPS VIDES
        ========================= */

        if (
            !motDePasse ||
            !confirmation
        ) {

            afficherMessage(
                "Renseignez et confirmez votre nouveau mot de passe.",
                "erreur"
            );


            return;
        }


        /* =========================
           LONGUEUR
        ========================= */

        if (
            motDePasse.length <
            6
        ) {

            afficherMessage(
                "Le mot de passe doit contenir au moins 6 caractères.",
                "erreur"
            );


            champMotDePasse.focus();


            return;
        }


        /* =========================
           CONFIRMATION
        ========================= */

        if (
            motDePasse !==
            confirmation
        ) {

            afficherMessage(
                "Les deux mots de passe ne correspondent pas.",
                "erreur"
            );


            champConfirmation.focus();


            return;
        }


        /* =========================
           ENREGISTREMENT
        ========================= */

        boutonEnregistrer.disabled =
            true;


        boutonEnregistrer.textContent =
            "Enregistrement…";


        afficherMessage(
            "Modification du mot de passe…"
        );


        try {

            const {
                data,
                error
            } =
                await window.supabaseClient
                    .auth
                    .updateUser({

                        password:
                            motDePasse

                    });


            if (
                error
            ) {

                throw error;

            }


            if (
                !data.user
            ) {

                throw new Error(
                    "Impossible de confirmer la modification du mot de passe."
                );

            }


            afficherMessage(
                "Votre mot de passe a bien été modifié ✓",
                "succes"
            );


            formulaire.reset();


            /*
                On laisse le message
                visible un petit moment
                avant de retourner
                dans l'application.
            */

            setTimeout(
                function () {

                    window.location.replace(
                        "index.html"
                    );

                },
                1500
            );


        } catch (
            erreur
        ) {

            console.error(
                "Erreur modification mot de passe :",
                erreur
            );


            afficherMessage(
                obtenirMessageErreur(
                    erreur
                ),
                "erreur"
            );


            boutonEnregistrer.disabled =
                false;


            boutonEnregistrer.textContent =
                "Enregistrer le nouveau mot de passe";

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
            "same password"
        )
    ) {

        return (
            "Choisissez un mot de passe différent de votre mot de passe actuel."
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
            "session"
        ) ||
        messageMinuscule.includes(
            "jwt"
        )
    ) {

        return (
            "Votre lien de réinitialisation a expiré. Demandez un nouveau lien depuis la page de connexion."
        );

    }


    return (
        message ||
        "Impossible de modifier le mot de passe."
    );

}


/* =================================
   DÉMARRAGE
================================= */

verifierLienRecuperation();
