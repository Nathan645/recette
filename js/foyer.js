const ongletCreerFoyer =
    document.getElementById(
        "onglet-creer-foyer"
    );

const ongletRejoindreFoyer =
    document.getElementById(
        "onglet-rejoindre-foyer"
    );

const formulaireCreerFoyer =
    document.getElementById(
        "formulaire-creer-foyer"
    );

const formulaireRejoindreFoyer =
    document.getElementById(
        "formulaire-rejoindre-foyer"
    );

const boutonCreerFoyer =
    document.getElementById(
        "bouton-creer-foyer"
    );

const boutonRejoindreFoyer =
    document.getElementById(
        "bouton-rejoindre-foyer"
    );

const blocCodeFoyer =
    document.getElementById(
        "bloc-code-foyer"
    );

const codeFoyerGenere =
    document.getElementById(
        "code-foyer-genere"
    );

const boutonCopierCode =
    document.getElementById(
        "copier-code-foyer"
    );

const messageFoyer =
    document.getElementById(
        "message-foyer"
    );


let utilisateurConnecte = null;


/* =================================
   OUTILS
================================= */

function afficherMessage(
    texte,
    type = ""
) {

    messageFoyer.textContent =
        texte;

    messageFoyer.classList.remove(
        "erreur",
        "succes"
    );

    if (type) {

        messageFoyer.classList.add(
            type
        );

    }
}


function changerOnglet(
    onglet
) {

    const modeCreation =
        onglet === "creer";


    ongletCreerFoyer.classList.toggle(
        "actif",
        modeCreation
    );

    ongletRejoindreFoyer.classList.toggle(
        "actif",
        !modeCreation
    );


    ongletCreerFoyer.setAttribute(
        "aria-selected",
        modeCreation
            ? "true"
            : "false"
    );

    ongletRejoindreFoyer.setAttribute(
        "aria-selected",
        modeCreation
            ? "false"
            : "true"
    );


    formulaireCreerFoyer.classList.toggle(
        "actif",
        modeCreation
    );

    formulaireRejoindreFoyer.classList.toggle(
        "actif",
        !modeCreation
    );


    blocCodeFoyer.hidden = true;

    afficherMessage("");
}


/* =================================
   UTILISATEUR CONNECTÉ
================================= */

async function recupererUtilisateur() {

    const { data, error } =
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


    return data.user;
}


/* =================================
   VÉRIFIER SI L'UTILISATEUR
   A DÉJÀ UN FOYER
================================= */

async function recupererFoyerUtilisateur() {

    const { data, error } =
        await window.supabaseClient
            .from(
                "membres_foyer"
            )
            .select(
                "foyer_id"
            )
            .eq(
                "user_id",
                utilisateurConnecte.id
            )
            .limit(1)
            .maybeSingle();


    if (error) {
        throw error;
    }


    return data;
}


/* =================================
   CRÉER UN FOYER
================================= */

async function creerFoyer(
    nomFoyer
) {

    const { data, error } =
        await window.supabaseClient
            .from("foyers")
            .insert({
                nom:
                    nomFoyer,

                created_by:
                    utilisateurConnecte.id
            })
            .select(
                "id, nom, code"
            )
            .single();


    if (error) {
        throw error;
    }


    return data;
}


/* =================================
   AJOUTER L'UTILISATEUR AU FOYER
================================= */

async function ajouterMembreAuFoyer(
    foyerId
) {

    const { error } =
        await window.supabaseClient
            .from(
                "membres_foyer"
            )
            .insert({
                foyer_id:
                    foyerId,

                user_id:
                    utilisateurConnecte.id
            });


    if (error) {
        throw error;
    }
}


/* =================================
   RECHERCHER UN FOYER PAR CODE
================================= */
async function rechercherFoyerParCode(
    code
) {

    const { data, error } =
        await window.supabaseClient
            .rpc(
                "trouver_foyer_par_code",
                {
                    code_recherche:
                        code
                }
            );


    if (error) {
        throw error;
    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        return null;

    }


    return data[0];
}


/* =================================
   ONGLETS
================================= */

ongletCreerFoyer.addEventListener(
    "click",
    function () {

        changerOnglet(
            "creer"
        );

    }
);


ongletRejoindreFoyer.addEventListener(
    "click",
    function () {

        changerOnglet(
            "rejoindre"
        );

    }
);


/* =================================
   FORMULAIRE :
   CRÉATION DU FOYER
================================= */
formulaireCreerFoyer.addEventListener(
    "submit",
    async function (evenement) {

        evenement.preventDefault();

        const nomFoyer =
            document.getElementById(
                "nom-foyer"
            )
                .value
                .trim();


        if (!nomFoyer) {

            afficherMessage(
                "Renseigne un nom pour le foyer.",
                "erreur"
            );

            return;
        }


        boutonCreerFoyer.disabled =
            true;

        boutonCreerFoyer.textContent =
            "Création…";

        afficherMessage(
            "Création du foyer…"
        );


        try {

            const foyerExistant =
                await recupererFoyerUtilisateur();


            if (foyerExistant) {

                afficherMessage(
                    "Ton compte appartient déjà à un foyer.",
                    "erreur"
                );

                return;
            }


            /*
                1. Création du foyer
            */

            const foyer =
                await creerFoyer(
                    nomFoyer
                );


            /*
                2. Ajout du créateur
                dans le foyer
            */

            await ajouterMembreAuFoyer(
                foyer.id
            );


            /*
                3. Confirmation
            */

            afficherMessage(
                `Le foyer « ${foyer.nom} » a bien été créé.`,
                "succes"
            );


            /*
                4. Redirection vers
                le carnet de recettes
            */

            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                600
            );


        } catch (erreur) {

            console.error(
                "Erreur pendant la création du foyer :",
                erreur
            );


            afficherMessage(
                erreur.message ||
                "Impossible de créer le foyer.",
                "erreur"
            );


        } finally {

            boutonCreerFoyer.disabled =
                false;

            boutonCreerFoyer.textContent =
                "Créer mon foyer";

        }

    }
);
/* =================================
   FORMULAIRE :
   REJOINDRE UN FOYER
================================= */

formulaireRejoindreFoyer.addEventListener(
    "submit",
    async function (evenement) {

        evenement.preventDefault();


        const champCode =
            document.getElementById(
                "code-foyer"
            );


        const code =
            champCode
                .value
                .trim()
                .toUpperCase();


        if (!code) {

            afficherMessage(
                "Renseigne le code du foyer.",
                "erreur"
            );

            return;
        }


        boutonRejoindreFoyer.disabled =
            true;

        boutonRejoindreFoyer.textContent =
            "Recherche…";

        afficherMessage(
            "Recherche du foyer…"
        );


        try {

            /*
                On vérifie d'abord que
                l'utilisateur n'a pas déjà
                de foyer.
            */

            const foyerExistant =
                await recupererFoyerUtilisateur();


            if (foyerExistant) {

                afficherMessage(
                    "Ton compte appartient déjà à un foyer.",
                    "erreur"
                );

                return;
            }


            /*
                Recherche du foyer grâce
                au code de 6 caractères.
            */

            const foyer =
                await rechercherFoyerParCode(
                    code
                );


            if (!foyer) {

                afficherMessage(
                    "Aucun foyer ne correspond à ce code.",
                    "erreur"
                );

                return;
            }


            /*
                Ajout dans membres_foyer.
            */

            await ajouterMembreAuFoyer(
                foyer.id
            );


            afficherMessage(
                `Tu as rejoint le foyer « ${foyer.nom} ».`,
                "succes"
            );


            /*
                Petite pause visuelle,
                puis accueil.
            */

            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                900
            );


        } catch (erreur) {

            console.error(
                "Erreur pendant l'ajout au foyer :",
                erreur
            );


            afficherMessage(
                erreur.message ||
                "Impossible de rejoindre le foyer.",
                "erreur"
            );


        } finally {

            boutonRejoindreFoyer.disabled =
                false;

            boutonRejoindreFoyer.textContent =
                "Rejoindre le foyer";

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
            codeFoyerGenere
                .textContent
                .trim();


        if (
            !code ||
            code === "------"
        ) {

            return;
        }


        try {

            await navigator.clipboard
                .writeText(
                    code
                );


            boutonCopierCode.textContent =
                "Copié ✓";


            setTimeout(
                function () {

                    boutonCopierCode
                        .textContent =
                            "Copier";

                },
                1500
            );


        } catch (erreur) {

            console.error(
                "Impossible de copier le code :",
                erreur
            );


            afficherMessage(
                `Code du foyer : ${code}`,
                "succes"
            );

        }

    }
);


/* =================================
   DÉMARRAGE
================================= */

async function initialiserPageFoyer() {

    try {

        utilisateurConnecte =
            await recupererUtilisateur();


        if (!utilisateurConnecte) {
            return;
        }


        /*
            Si l'utilisateur appartient
            déjà à un foyer, il n'a plus
            besoin de cette page.
        */

        const foyerUtilisateur =
            await recupererFoyerUtilisateur();


        if (foyerUtilisateur) {

            window.location.href =
                "index.html";

        }


    } catch (erreur) {

        console.error(
            "Erreur d'initialisation du foyer :",
            erreur
        );


        afficherMessage(
            erreur.message ||
            "Impossible de charger votre compte.",
            "erreur"
        );

    }
}


initialiserPageFoyer();
