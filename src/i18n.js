import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: {
                    "app_title": "Where with?",
                    "email_missing_item_subject": "Missing item: ",
                    "email_missing_item_body": "Describe item if needed",
                    "lang_modal_title": "Language",
                    "legal_modal_title": "Legal",
                    "legal_tab_about": "About",
                    "legal_tab_terms": "Terms",
                    "legal_tab_privacy": "Privacy",
                    "legal_general_1": "The owner of this site doesn't take any legal responsibility for the authenticity or validity of its contents.",
                    "legal_general_2_contact_link_text": "contact",
                    "legal_general_2_part_1": "Please ",
                    "legal_general_2_part_2": " me if something is wrong. We'll investigate ASAP!",
                    "link_feedback": "Contact",
                    "link_legal": "Legal",
                    "link_lang": "Language",
                    "link_social": "Social",
                    "map_open_always": "Always open",
                    "map_open_unknown": "Unknown opening times",
                    "map_currently_closed": "Closed!",
                    "map_currently_open": "Open!",
                    "map_opening_times": "Opening times",
                    "map_your_location": "Your location!",
                    "results_header_categories_plural": "Categories",
                    "results_header_categories_singular": "Category",
                    "results_header_containers": "Container",
                    "results_header_pickup": "Pickup companies (depends on quantity)",
                    "results_header_public_containers": "Public collection places",
                    "search_box_placeholder": "Enter item name",
                    "search_empty_result_request_item": "Request item",
                    "social_modal_title": "Social",
                    "search_no_results": "No results for",
                    "social_share_subject": "Find how to dispose waste and things you don't need in Berlin http://woentsorgen.de",
                    "social_share_with_twitter": "Share on Twitter",
                    "social_follow_on_twitter": "Follow on Twitter",
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
                    "app_title": "Wohin mit?",
                    "email_missing_item_subject": "Item fehlt: ",
                    "email_missing_item_body": "Beschreibung, falls nötig",
                    "lang_modal_title": "Sprache",
                    "legal_modal_title": "Rechtliches",
                    "legal_tab_about": "Impressum",
                    "legal_tab_terms": "AGB",
                    "legal_tab_privacy": "Datenschutz",
                    "legal_general_1": "Der Betreiber dieser Seite übernimmt keine rechtliche Verantwortung für die Richtigkeit oder Gültigkeit der angegebenen Daten!",
                    "legal_general_2_contact_link_text": "Verbindung",
                    "legal_general_2_part_1": "Bitte setze Dich in ",
                    "legal_general_2_part_2": " wenn etwas falsch ist. Wir werden es umgehend überprüfen!",
                    "link_feedback": "Kontakt",
                    "link_legal": "Rechtliches",
                    "link_lang": "Sprache",
                    "link_social": "Soziales",
                    "map_open_always": "Immer geöffnet!",
                    "map_open_unknown": "Öffnungszeiten unbekannt",
                    "map_currently_closed": "Derzeit geschlossen!",
                    "map_currently_open": "Geöffnet!",
                    "map_opening_times": "Öffnungszeiten",
                    "map_your_location": "Dein Standort!",
                    "results_header_categories_plural": "Kategorien",
                    "results_header_categories_singular": "Kategorie",
                    "results_header_containers": "Tonne",
                    "results_header_pickup": "Abholung (von Menge abhängig)",
                    "results_header_public_containers": "Öffentliche Ablagestellen",
                    "search_box_placeholder": "Gib den Namen des Gegenstandes ein",
                    "search_empty_result_request_item": "Item anfragen",
                    "social_modal_title": "Soziales",
                    "search_no_results": "Keine Ergebnisse für",
                    "social_share_subject": "Finde wie du deine Sachen in Berlin loswirst, mit http://woentsorgen.de",
                    "social_share_with_twitter": "Teile mit Twitter",
                    "social_follow_on_twitter": "Folge auf Twitter",
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
