import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: {
                    "app_title": "Where with it?",
                    "lang_modal_title": "Lang",
                    "legal_modal_title": "Legal",
                    "legal_tab_about": "About",
                    "legal_tab_terms": "Terms",
                    "legal_tab_privacy": "Privacy",
                    "legal_general_1": "The owner of this site doesn't take any legal responsibility for the authenticity or validity of its contents.",
                    "legal_general_2": "Please contact me if something is wrong. I'll investigate ASAP!",
                    "link_feedback": "Feedback",
                    "link_legal": "Legal",
                    "link_lang": "Language",
                    "map_open_always": "Always open",
                    "map_open_unknown": "Unknown opening times",
                    "map_currently_closed": "Closed!",
                    "map_currently_open": "Open!",
                    "map_opening_times": "Opening times",
                    "map_your_location": "Your location!",
                    "results_header_containers": "Container",
                    "results_header_pickup": "Pickup companies",
                    "results_header_public_containers": "Public collection places",
                    "search_box_placeholder": "Enter item name",
                    "suggestion_not_found": "Item missing?",
                    "weekday_monday": "Monday",
                    "weekday_tuesday": "Tuesday",
                    "weekday_wednesday": "Wednesday",
                    "weekday_thursday": "Thursday",
                    "weekday_friday": "Friday",
                    "weekday_saturday": "Saturday",
                    "weekday_sunday": "Sunday",
                }
            },
            de: {
                translations: {
                    "app_title": "Wohin damit?",
                    "lang_modal_title": "Sprache",
                    "legal_modal_title": "Rechtliches",
                    "legal_tab_about": "Impressum",
                    "legal_tab_terms": "AGB",
                    "legal_tab_privacy": "Datenschutz",
                    "legal_general_1": "Der Betreiber dieser Seite übernimmt keine rechtliche Verantwortung für die Richtigkeit oder Gültigkeit der angegebenen Daten!",
                    "legal_general_2": "Bitte setze Dich in Verbindung wenn etwas falsch ist. Es wird umgehend überprüft.",
                    "link_feedback": "Feedback",
                    "link_legal": "Rechtliches",
                    "link_lang": "Sprache",
                    "map_open_always": "Immer geöffnet!",
                    "map_open_unknown": "Öffnungszeiten unbekannt",
                    "map_currently_closed": "Derzeit geschlossen!",
                    "map_currently_open": "Geöffnet!",
                    "map_opening_times": "Öffnungszeiten",
                    "map_your_location": "Dein Standort!",
                    "results_header_containers": "Tonne",
                    "results_header_pickup": "Abolung",
                    "results_header_public_containers": "Öffentliche Ablagestellen",
                    "search_box_placeholder": "Gib den Namen des Gegenstandes ein",
                    "suggestion_not_found": "Fehlt etwas?",
                    "weekday_monday": "Montag",
                    "weekday_tuesday": "Dienstag",
                    "weekday_wednesday": "Mittwoch",
                    "weekday_thursday": "Donnerstag",
                    "weekday_friday": "Freitag",
                    "weekday_saturday": "Samstag",
                    "weekday_sunday": "Sonntag",
                }
            }
        },
        fallbackLng: 'en',
        debug: true,

        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',
        load: 'languageOnly',

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false, // not needed for react!!
            formatSeparator: ','
        },

        react: {
            wait: true
        }
    });

export default i18n;
