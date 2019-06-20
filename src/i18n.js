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
                    "link_feedback": "Feedback",
                    "link_legal": "Legal",
                    "map_currently_closed": "Closed!",
                    "map_currently_open": "Open!",
                    "map_opening_times": "Opening times",
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
                    "link_feedback": "Feedback",
                    "link_legal": "Rechtliches",
                    "map_currently_closed": "Derzeit geschlossen!",
                    "map_currently_open": "Geöffnet!",
                    "map_opening_times": "Öffnungszeiten",
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
