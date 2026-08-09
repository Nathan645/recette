async function chargerInformationsUtilisateur() {

    try {

        /* =========================
           UTILISATEUR CONNECTÉ
        ========================= */

        const { data: donneesUtilisateur, error: erreurUtilisateur } =
            await window.supabaseClient
                .auth
                .getUser();


        if (erreurUtilisateur) {
            throw erreurUtilisateur;
        }


        const utilisateur =
            donneesUtilisateur.user;


        /*
            Pas connecté :
            retour vers la page compte.
        */

        if (!utilisateur) {

            window.location.href =
                "compte.html";

            return;
        }


        /* =========================
           PROFIL
        ========================= */

        const { data: profil, error: erreurProfil } =
            await window.supabaseClient
                .from("profiles")
                .select("prenom")
                .eq(
                    "id",
                    utilisateur.id
                )
                .maybeSingle();


        if (erreurProfil) {
            throw erreurProfil;
        }


        /* =========================
           APPARTENANCE AU FOYER
        ========================= */

        const { data: membreFoyer, error: erreurMembre } =
            await window.supabaseClient
                .from("membres_foyer")
                .select("foyer_id")
                .eq(
                    "user_id",
                    utilisateur.id
                )
                .limit(1)
                .maybeSingle();


        if (erreurMembre) {
            throw erreurMembre;
        }


        /*
            Compte créé mais pas encore de foyer.
        */

        if (!membreFoyer) {

            window.location.href =
                "foyer.html";

            return;
        }


        /* =========================
           NOM DU FOYER
        ========================= */

        const { data: foyer, error: erreurFoyer } =
            await window.supabaseClient
                .from("foyers")
                .select("nom")
                .eq(
                    "id",
                    membreFoyer.foyer_id
                )
                .maybeSingle();


        if (erreurFoyer) {
            throw erreurFoyer;
        }


        /* =========================
           AFFICHAGE
        ========================= */

        const zoneUtilisateur =
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


        if (
            !zoneUtilisateur ||
            !prenomUtilisateur ||
            !nomFoyerUtilisateur
        ) {
            return;
        }


        prenomUtilisateur.textContent =
            profil?.prenom || "";


        nomFoyerUtilisateur.textContent =
            foyer?.nom || "";


        zoneUtilisateur.hidden =
            false;


    } catch (erreur) {

        console.error(
            "Erreur pendant le chargement du compte :",
            erreur
        );

    }

}


chargerInformationsUtilisateur();
