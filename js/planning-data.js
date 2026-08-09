/* =================================
   UTILISATEUR ET FOYER
================================= */

async function recupererUtilisateurEtFoyer() {
    const { data: donneesUtilisateur, error: erreurUtilisateur } =
        await window.supabaseClient.auth.getUser();

    if (erreurUtilisateur) throw erreurUtilisateur;

    utilisateurConnecte = donneesUtilisateur.user;

    if (!utilisateurConnecte) {
        window.location.href = "compte.html";
        return false;
    }

    const { data: membre, error: erreurMembre } =
        await window.supabaseClient
            .from("membres_foyer")
            .select("foyer_id")
            .eq("user_id", utilisateurConnecte.id)
            .limit(1)
            .maybeSingle();

    if (erreurMembre) throw erreurMembre;

    if (!membre) {
        window.location.href = "foyer.html";
        return false;
    }

    foyerId = membre.foyer_id;
    return true;
}

/* =================================
   RECETTES
================================= */

async function chargerRecettes() {
    const { data, error } =
        await window.supabaseClient
            .from("recettes")
            .select("id, nom")
            .order("nom", { ascending: true });

    if (error) throw error;
    recettes = Array.isArray(data) ? data : [];
}

/* =================================
   REPAS DE LA SEMAINE
================================= */

async function chargerRepasSemaine() {
    const finSemaine = ajouterJours(debutSemaine, 6);
    const dateDebut = formaterDateISO(debutSemaine);
    const dateFin = formaterDateISO(finSemaine);

    const { data, error } =
        await window.supabaseClient
            .from("repas_planning")
            .select(`
                id,
                foyer_id,
                date,
                moment,
                nom,
                recette_id,
                created_by
            `)
            .eq("foyer_id", foyerId)
            .gte("date", dateDebut)
            .lte("date", dateFin);

    if (error) throw error;
    repasSemaine = Array.isArray(data) ? data : [];
}

/* =================================
   RECHERCHE LOCALE
================================= */

function trouverRepas(date, moment) {
    const dateISO = formaterDateISO(date);
    return repasSemaine.find(function (repas) {
        return repas.date === dateISO && repas.moment === moment;
    });
}

function trouverRepasParId(repasId) {
    return repasSemaine.find(function (repas) {
        return String(repas.id) === String(repasId);
    });
}

/* =================================
   AJOUTER / MODIFIER / SUPPRIMER
================================= */

async function enregistrerRepas(nom, recetteId = null) {
    if (!dateSelectionnee || !momentSelectionne) {
        throw new Error("Le créneau du repas n'est pas défini.");
    }

    const { data, error } =
        await window.supabaseClient
            .from("repas_planning")
            .insert({
                foyer_id: foyerId,
                date: dateSelectionnee,
                moment: momentSelectionne,
                nom: nom,
                recette_id: recetteId,
                created_by: utilisateurConnecte.id
            })
            .select("id")
            .single();

    if (error) throw error;
    return data;
}

async function modifierRepas(nom, recetteId = null) {
    if (!repasEnModification) {
        throw new Error("Aucun repas à modifier.");
    }

    const { data, error } =
        await window.supabaseClient
            .from("repas_planning")
            .update({
                nom: nom,
                recette_id: recetteId
            })
            .eq("id", repasEnModification.id)
            .eq("foyer_id", foyerId)
            .select("id")
            .single();

    if (error) throw error;
    return data;
}

async function supprimerRepas() {
    if (!repasEnModification) {
        throw new Error("Aucun repas à supprimer.");
    }

    const { error } =
        await window.supabaseClient
            .from("repas_planning")
            .delete()
            .eq("id", repasEnModification.id)
            .eq("foyer_id", foyerId);

    if (error) throw error;
}

async function chargerNombrePersonnesParDefaut() {

    if (!foyerActuel?.id) {
        nombrePersonnesParDefaut = 2;
        return;
    }

    const { data, error } = await supabaseClient
        .from("foyers")
        .select("personnes_par_defaut")
        .eq("id", foyerActuel.id)
        .single();

    if (error) {
        console.error(
            "Erreur chargement nombre de personnes :",
            error
        );

        nombrePersonnesParDefaut = 2;
        return;
    }

    nombrePersonnesParDefaut =
        data?.personnes_par_defaut || 2;
}
