if (!window.APP_CONFIG) {
    throw new Error(
        "La configuration Supabase est introuvable."
    );
}

if (
    !window.APP_CONFIG.supabaseUrl ||
    !window.APP_CONFIG.supabaseKey
) {
    throw new Error(
        "L’URL ou la clé Supabase n’a pas été renseignée."
    );
}

if (!window.supabase) {
    throw new Error(
        "La bibliothèque Supabase n’a pas été chargée."
    );
}

window.supabaseClient =
    window.supabase.createClient(
        window.APP_CONFIG.supabaseUrl,
        window.APP_CONFIG.supabaseKey
    );
