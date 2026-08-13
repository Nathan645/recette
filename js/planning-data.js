/* =================================
   UTILISATEUR ET FOYER
================================= */

async function recupererUtilisateurEtFoyer() {

    const {
        data: donneesUtilisateur,
        error: erreurUtilisateur
    } =
        await window.supabaseClient
            .auth
            .getUser();


    if (erreurUtilisateur) {
        throw erreurUtilisateur;
    }


    utilisateurConnecte =
        donneesUtilisateur.user;


    if (!utilisateurConnecte) {

        window.location.href =
            "compte.html";

        return false;
    }


    const {
        data: membre,
        error: erreurMembre
    } =
        await window.supabaseClient
            .from("membres_foyer")
            .select("foyer_id")
            .eq(
                "user_id",
                utilisateurConnecte.id
            )
            .limit(1)
            .maybeSingle();


    if (erreurMembre) {
        throw erreurMembre;
    }


    if (!membre) {

        window.location.href =
            "foyer.html";

        return false;
    }


    foyerId =
        membre.foyer_id;


    return true;
}


/* =================================
   NOMBRE DE PERSONNES PAR DÉFAUT
================================= */

async function chargerNombrePersonnesParDefaut() {

    if (!foyerId) {

        nombrePersonnesParDefaut =
            2;

        return;
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("foyers")
            .select(
                "personnes_par_defaut"
            )
            .eq(
                "id",
                foyerId
            )
            .single();


    if (error) {

        console.error(
            "Erreur chargement nombre de personnes par défaut :",
            error
        );


        nombrePersonnesParDefaut =
            2;

        return;
    }


    const nombre =
        Number(
            data?.personnes_par_defaut
        );


    nombrePersonnesParDefaut =
        Number.isInteger(nombre) &&
        nombre > 0
            ? nombre
            : 2;
}


/* =================================
   RECETTES
================================= */

async function chargerRecettes() {

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("recettes")
            .select(
                "id, nom"
            )
            .order(
                "nom",
                {
                    ascending:
                        true
                }
            );


    if (error) {
        throw error;
    }


    recettes =
        Array.isArray(data)
            ? data
            : [];
}


/* =================================
   REPAS DE LA SEMAINE
================================= */

async function chargerRepasSemaine() {

    const finSemaine =
        ajouterJours(
            debutSemaine,
            6
        );


    const dateDebut =
        formaterDateISO(
            debutSemaine
        );


    const dateFin =
        formaterDateISO(
            finSemaine
        );


    console.log(
        "CHARGEMENT PLANNING :",
        dateDebut,
        "→",
        dateFin
    );


    /* =========================
       1. CHARGER LES REPAS
    ========================= */

    const {
        data: repas,
        error: erreurRepas
    } =
        await window.supabaseClient
            .from("repas_planning")
            .select(`
                id,
                foyer_id,
                date,
                moment,
                nom,
                recette_id,
                personnes,
                created_by
            `)
            .eq(
                "foyer_id",
                foyerId
            )
            .gte(
                "date",
                dateDebut
            )
            .lte(
                "date",
                dateFin
            )
            .order(
                "date",
                {
                    ascending:
                        true
                }
            );


    if (erreurRepas) {

        console.error(
            "ERREUR CHARGEMENT PLANNING :",
            erreurRepas
        );

        throw erreurRepas;
    }


    const repasCharges =
        Array.isArray(repas)
            ? repas
            : [];


    /* =========================
       AUCUN REPAS
    ========================= */

    if (
        repasCharges.length === 0
    ) {

        repasSemaine = [];

        console.log(
            "AUCUN REPAS CETTE SEMAINE"
        );

        return;
    }


    /* =========================
       2. IDS DES REPAS
    ========================= */

    const idsRepas =
        repasCharges.map(
            function (repas) {

                return repas.id;

            }
        );


    /* =========================
       3. CHARGER LES ÉLÉMENTS
    ========================= */

    const {
        data: elements,
        error: erreurElements
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
           .select(`
    id,
    repas_planning_id,
    recette_id,
    nom,
    ordre,
    mode_approvisionnement,
    created_at
`)
            .in(
                "repas_planning_id",
                idsRepas
            )
            .order(
                "ordre",
                {
                    ascending:
                        true
                }
            );


    if (erreurElements) {

        console.error(
            "ERREUR CHARGEMENT ÉLÉMENTS REPAS :",
            erreurElements
        );

        throw erreurElements;
    }


    const elementsCharges =
        Array.isArray(elements)
            ? elements
            : [];


    /* =========================
       4. ATTACHER LES ÉLÉMENTS
       À CHAQUE REPAS
    ========================= */

    repasSemaine =
        repasCharges.map(
            function (repas) {

                const elementsRepas =
                    elementsCharges.filter(
                        function (element) {

                            return (
                                String(
                                    element.repas_planning_id
                                ) ===
                                String(
                                    repas.id
                                )
                            );

                        }
                    );


                /*
                    COMPATIBILITÉ ANCIEN FORMAT

                    Si aucun élément n'existe
                    encore dans la nouvelle table,
                    on transforme l'ancien
                    nom / recette_id en élément
                    virtuel.
                */

                if (
                    elementsRepas.length === 0 &&
                    repas.nom
                ) {

                    elementsRepas.push({

                        id:
                            null,

                        repas_planning_id:
                            repas.id,

                        recette_id:
                            repas.recette_id ||
                            null,

                        nom:
                            repas.nom,

                        ordre:
                            1,

                        ancien_format:
                            true

                    });

                }


                return {

                    ...repas,

                    elements:
                        elementsRepas

                };

            }
        );


    /* =========================
       LOGS TEMPORAIRES
    ========================= */

    console.log(
        "REPAS SEMAINE CHARGÉS :",
        repasSemaine
    );


    console.table(
        repasSemaine.map(
            function (repas) {

                return {

                    id:
                        repas.id,

                    date:
                        repas.date,

                    moment:
                        repas.moment,

                    personnes:
                        repas.personnes,

                    nombre_elements:
                        repas.elements.length,

                    elements:
                        repas.elements
                            .map(
                                function (element) {

                                    return element.nom;

                                }
                            )
                            .join(" | ")

                };

            }
        )
    );
}


/* =================================
   RECHERCHE LOCALE
================================= */

function trouverRepas(
    date,
    moment
) {

    const dateISO =
        formaterDateISO(
            date
        );


    return repasSemaine.find(
        function (repas) {

            return (
                repas.date ===
                    dateISO &&
                repas.moment ===
                    moment
            );

        }
    );
}


function trouverRepasParId(
    repasId
) {

    return repasSemaine.find(
        function (repas) {

            return (
                String(
                    repas.id
                ) ===
                String(
                    repasId
                )
            );

        }
    );
}

/* =================================
   AJOUTER UN REPAS
================================= */

async function enregistrerRepas(
    nom,
    recetteId = null,
    personnes = null
) {

    if (
        !dateSelectionnee ||
        !momentSelectionne
    ) {

        throw new Error(
            "Le créneau du repas n'est pas défini."
        );
    }


    const nombrePersonnes =
        Number(
            personnes
        );


    if (
        !Number.isInteger(
            nombrePersonnes
        ) ||
        nombrePersonnes < 1
    ) {

        throw new Error(
            "Le nombre de personnes est invalide."
        );
    }


    /* =========================
       1. CRÉER LE REPAS PARENT
    ========================= */

    const {
        data: repasCree,
        error: erreurRepas
    } =
        await window.supabaseClient
            .from("repas_planning")
            .insert({

                foyer_id:
                    foyerId,

                date:
                    dateSelectionnee,

                moment:
                    momentSelectionne,

                /*
                    On garde encore ces champs
                    pour ne pas casser l'ancien
                    fonctionnement.
                */

                nom:
                    nom,

                recette_id:
                    recetteId,

                personnes:
                    nombrePersonnes,

                created_by:
                    utilisateurConnecte.id

            })
            .select(
                "id"
            )
            .single();


    if (erreurRepas) {
        throw erreurRepas;
    }


    /* =========================
       2. CRÉER LE PREMIER ÉLÉMENT
    ========================= */

    const {
        error: erreurElement
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
            .insert({

                repas_planning_id:
                    repasCree.id,

                recette_id:
                    recetteId,

                nom:
                    nom,

                ordre:
                    1

            });


    if (erreurElement) {

        /*
            Sécurité :
            si le premier élément échoue,
            on supprime le repas parent
            pour éviter un repas vide.
        */

        await window.supabaseClient
            .from("repas_planning")
            .delete()
            .eq(
                "id",
                repasCree.id
            )
            .eq(
                "foyer_id",
                foyerId
            );


        throw erreurElement;
    }


    return repasCree;
}


/* =================================
   AJOUTER UN ÉLÉMENT À UN REPAS
================================= */

async function ajouterElementRepas(
    repasId,
    nom,
    recetteId = null
) {

    if (!repasId) {

        throw new Error(
            "Le repas n'est pas défini."
        );
    }


    const nomNettoye =
        String(
            nom || ""
        )
            .trim();


    if (!nomNettoye) {

        throw new Error(
            "Le nom du plat est obligatoire."
        );
    }


    /* =========================
       TROUVER LE PROCHAIN ORDRE
    ========================= */

    const {
        data: elementsExistants,
        error: erreurLecture
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
            .select(
                "ordre"
            )
            .eq(
                "repas_planning_id",
                repasId
            )
            .order(
                "ordre",
                {
                    ascending:
                        false
                }
            )
            .limit(1);


    if (erreurLecture) {
        throw erreurLecture;
    }


    let prochainOrdre =
        1;


    if (
        Array.isArray(
            elementsExistants
        ) &&
        elementsExistants.length > 0
    ) {

        const dernierOrdre =
            Number(
                elementsExistants[0]
                    .ordre
            );


        prochainOrdre =
            Number.isInteger(
                dernierOrdre
            )
                ? dernierOrdre + 1
                : 1;
    }


    /* =========================
       AJOUTER L'ÉLÉMENT
    ========================= */

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
            .insert({

                repas_planning_id:
                    repasId,

                recette_id:
                    recetteId,

                nom:
                    nomNettoye,

                ordre:
                    prochainOrdre

            })
            .select(`
    id,
    repas_planning_id,
    recette_id,
    nom,
    ordre,
    mode_approvisionnement,
    created_at
`)
            .single();


    if (error) {
        throw error;
    }


    return data;
}


/* =================================
   AJOUTER UNE RECETTE
   AU REPAS
================================= */

async function ajouterRecetteAuRepas(
    repasId,
    recetteId
) {

    if (!recetteId) {

        throw new Error(
            "Aucune recette sélectionnée."
        );
    }


    const recette =
        recettes.find(
            function (element) {

                return (
                    String(
                        element.id
                    ) ===
                    String(
                        recetteId
                    )
                );

            }
        );


    if (!recette) {

        throw new Error(
            "Impossible de trouver cette recette."
        );
    }


    return ajouterElementRepas(
        repasId,
        recette.nom,
        recette.id
    );
}


/* =================================
   AJOUTER UN PLAT MANUEL
   AU REPAS
================================= */

async function ajouterPlatManuelAuRepas(
    repasId,
    nom
) {

    const nomNettoye =
        String(
            nom || ""
        )
            .trim();


    if (!nomNettoye) {

        throw new Error(
            "Renseigne le nom du plat."
        );
    }


    return ajouterElementRepas(
        repasId,
        nomNettoye,
        null
    );
}


/* =================================
   SUPPRIMER UN ÉLÉMENT
   D'UN REPAS
================================= */

async function supprimerElementRepas(
    elementId
) {

    if (!elementId) {

        throw new Error(
            "L'élément à supprimer n'est pas défini."
        );
    }


    const {
        error
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
            .delete()
            .eq(
                "id",
                elementId
            );


    if (error) {
        throw error;
    }
}


/* =================================
   MODIFIER LE NOMBRE DE PERSONNES
================================= */

async function modifierNombrePersonnesRepas(
    repasId,
    personnes
) {

    if (!repasId) {

        throw new Error(
            "Le repas n'est pas défini."
        );
    }


    const nombrePersonnes =
        Number(
            personnes
        );


    if (
        !Number.isInteger(
            nombrePersonnes
        ) ||
        nombrePersonnes < 1
    ) {

        throw new Error(
            "Le nombre de personnes est invalide."
        );
    }


    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("repas_planning")
            .update({

                personnes:
                    nombrePersonnes

            })
            .eq(
                "id",
                repasId
            )
            .eq(
                "foyer_id",
                foyerId
            )
            .select(
                "id, personnes"
            )
            .single();


    if (error) {
        throw error;
    }


    return data;
}

/* =================================
   MODIFIER UN REPAS
================================= */

async function modifierRepas(
    nom,
    recetteId = null,
    personnes = null
) {

    if (
        !repasEnModification
    ) {

        throw new Error(
            "Aucun repas à modifier."
        );
    }


    const nombrePersonnes =
        Number(
            personnes
        );


    if (
        !Number.isInteger(
            nombrePersonnes
        ) ||
        nombrePersonnes < 1
    ) {

        throw new Error(
            "Le nombre de personnes est invalide."
        );
    }


    /* =========================
       MODIFIER LE REPAS PARENT
    ========================= */

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from("repas_planning")
            .update({

                /*
                    On conserve ces deux champs
                    pour la compatibilité avec
                    l'ancien fonctionnement.
                */

                nom:
                    nom,

                recette_id:
                    recetteId,

                personnes:
                    nombrePersonnes

            })
            .eq(
                "id",
                repasEnModification.id
            )
            .eq(
                "foyer_id",
                foyerId
            )
            .select(
                "id"
            )
            .single();


    if (error) {
        throw error;
    }


    /* =========================
       PREMIER ÉLÉMENT
    ========================= */

    const premierElement =
        Array.isArray(
            repasEnModification.elements
        )
            ? repasEnModification
                .elements[0]
            : null;


    /*
        CAS 1 :
        Ancien repas sans élément réel.

        On crée le premier élément
        dans la nouvelle table.
    */

    if (
        !premierElement ||
        premierElement.ancien_format ||
        !premierElement.id
    ) {

        const {
            error: erreurElement
        } =
            await window.supabaseClient
                .from(
                    "repas_planning_elements"
                )
                .insert({

                    repas_planning_id:
                        repasEnModification.id,

                    recette_id:
                        recetteId,

                    nom:
                        nom,

                    ordre:
                        1

                });


        if (erreurElement) {
            throw erreurElement;
        }


        return data;
    }


    /*
        CAS 2 :
        Le repas possède déjà un
        premier élément réel.

        On le met à jour.
    */

    const {
        error: erreurElement
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
            .update({

                recette_id:
                    recetteId,

                nom:
                    nom

            })
            .eq(
                "id",
                premierElement.id
            );


    if (erreurElement) {
        throw erreurElement;
    }


    return data;
}


/* =================================
   SUPPRIMER UN REPAS
================================= */

async function supprimerRepas() {

    if (
        !repasEnModification
    ) {

        throw new Error(
            "Aucun repas à supprimer."
        );
    }


    const {
        error
    } =
        await window.supabaseClient
            .from("repas_planning")
            .delete()
            .eq(
                "id",
                repasEnModification.id
            )
            .eq(
                "foyer_id",
                foyerId
            );


    if (error) {
        throw error;
    }


    /*
        Les éléments associés dans :

        repas_planning_elements

        seront automatiquement supprimés
        grâce à la clé étrangère :

        ON DELETE CASCADE
    */
}


/* =================================
   SUPPRIMER TOUS LES ÉLÉMENTS
   D'UN REPAS
================================= */

async function supprimerTousElementsRepas(
    repasId
) {

    if (!repasId) {

        throw new Error(
            "Le repas n'est pas défini."
        );
    }


    const {
        error
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
            .delete()
            .eq(
                "repas_planning_id",
                repasId
            );


    if (error) {
        throw error;
    }
}


/* =================================
   REMPLACER LES ÉLÉMENTS
   D'UN REPAS
================================= */

async function remplacerElementsRepas(
    repasId,
    elements
) {

    if (!repasId) {

        throw new Error(
            "Le repas n'est pas défini."
        );
    }


    const listeElements =
        Array.isArray(elements)
            ? elements
            : [];


    if (
        listeElements.length === 0
    ) {

        throw new Error(
            "Le repas doit contenir au moins un plat."
        );
    }


    /* =========================
       1. SUPPRIMER LES ANCIENS
    ========================= */

    await supprimerTousElementsRepas(
        repasId
    );


    /* =========================
       2. PRÉPARER LES NOUVEAUX
    ========================= */

    const lignes =
        listeElements.map(
            function (
                element,
                index
            ) {

                return {

                    repas_planning_id:
                        repasId,

                    recette_id:
                        element.recette_id ||
                        null,

                    nom:
                        String(
                            element.nom ||
                            ""
                        )
                            .trim(),

                    ordre:
                        index + 1

                };

            }
        )
        .filter(
            function (element) {

                return (
                    element.nom !==
                    ""
                );

            }
        );


    if (
        lignes.length === 0
    ) {

        throw new Error(
            "Le repas doit contenir au moins un plat."
        );
    }


    /* =========================
       3. INSÉRER LES NOUVEAUX
    ========================= */

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "repas_planning_elements"
            )
            .insert(
                lignes
            )
            .select(`
                id,
                repas_planning_id,
                recette_id,
                nom,
                ordre,
                created_at
            `);


    if (error) {
        throw error;
    }


    return (
        Array.isArray(data)
            ? data
            : []
    );
}


/* =================================
   CRÉER UN REPAS COMPLET
   AVEC PLUSIEURS ÉLÉMENTS
================================= */

async function enregistrerRepasComplet(
    elements,
    personnes
) {

    if (
        !dateSelectionnee ||
        !momentSelectionne
    ) {

        throw new Error(
            "Le créneau du repas n'est pas défini."
        );
    }


    const listeElements =
        Array.isArray(elements)
            ? elements
            : [];


    if (
        listeElements.length === 0
    ) {

        throw new Error(
            "Ajoute au moins un plat au repas."
        );
    }


    const nombrePersonnes =
        Number(
            personnes
        );


    if (
        !Number.isInteger(
            nombrePersonnes
        ) ||
        nombrePersonnes < 1
    ) {

        throw new Error(
            "Le nombre de personnes est invalide."
        );
    }


    const premierElement =
        listeElements[0];


    /* =========================
       1. CRÉER LE REPAS PARENT
    ========================= */

    const {
        data: repasCree,
        error: erreurRepas
    } =
        await window.supabaseClient
            .from(
                "repas_planning"
            )
            .insert({

                foyer_id:
                    foyerId,

                date:
                    dateSelectionnee,

                moment:
                    momentSelectionne,

                /*
                    Compatibilité ancienne interface :
                    on garde le premier plat
                    également dans le parent.
                */

                nom:
                    premierElement.nom,

                recette_id:
                    premierElement.recette_id ||
                    null,

                personnes:
                    nombrePersonnes,

                created_by:
                    utilisateurConnecte.id

            })
            .select(
                "id"
            )
            .single();


    if (erreurRepas) {
        throw erreurRepas;
    }


    /* =========================
       2. INSÉRER LES ÉLÉMENTS
    ========================= */

    try {

        const elementsCrees =
            await remplacerElementsRepas(
                repasCree.id,
                listeElements
            );


        return {

            ...repasCree,

            elements:
                elementsCrees

        };


    } catch (erreur) {

        /*
            Sécurité :
            si l'ajout des plats échoue,
            on supprime également
            le repas parent.
        */

        await window.supabaseClient
            .from(
                "repas_planning"
            )
            .delete()
            .eq(
                "id",
                repasCree.id
            )
            .eq(
                "foyer_id",
                foyerId
            );


        throw erreur;
    }
}


/* =================================
   MODIFIER UN REPAS COMPLET
================================= */

async function modifierRepasComplet(
    repasId,
    elements,
    personnes
) {

    if (!repasId) {

        throw new Error(
            "Le repas n'est pas défini."
        );
    }


    const listeElements =
        Array.isArray(elements)
            ? elements
            : [];


    if (
        listeElements.length === 0
    ) {

        throw new Error(
            "Ajoute au moins un plat au repas."
        );
    }


    const nombrePersonnes =
        Number(
            personnes
        );


    if (
        !Number.isInteger(
            nombrePersonnes
        ) ||
        nombrePersonnes < 1
    ) {

        throw new Error(
            "Le nombre de personnes est invalide."
        );
    }


    const premierElement =
        listeElements[0];


    /* =========================
       1. MODIFIER LE PARENT
    ========================= */

    const {
        data,
        error
    } =
        await window.supabaseClient
            .from(
                "repas_planning"
            )
            .update({

                nom:
                    premierElement.nom,

                recette_id:
                    premierElement.recette_id ||
                    null,

                personnes:
                    nombrePersonnes

            })
            .eq(
                "id",
                repasId
            )
            .eq(
                "foyer_id",
                foyerId
            )
            .select(
                "id, personnes"
            )
            .single();


    if (error) {
        throw error;
    }


    /* =========================
       2. REMPLACER LES PLATS
    ========================= */

    const elementsMisAJour =
        await remplacerElementsRepas(
            repasId,
            listeElements
        );


    return {

        ...data,

        elements:
            elementsMisAJour

    };
}


/* =================================
   FIN PLANNING DATA
================================= */
