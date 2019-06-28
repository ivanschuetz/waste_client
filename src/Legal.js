import React, {useState} from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';

const Legal = () => {
    const {t} = useTranslation();

    const privacyPolicyLink = () => {
        const lang = i18n.language;
        switch (lang) {
            case "en":
                return "https://www.iubenda.com/privacy-policy/33176315";
            case "de":
                return "https://www.iubenda.com/privacy-policy/77955732";
            default:
                console.log("Invalid lang: " + lang);
                return "#";
        }
    };

    const [selectedTab, setSeletedTab] = useState("about");
    return (
        <div>
            <div>
                <span onClick={() => setSeletedTab("about")}
                      className={tabNameClassName(selectedTab, "about")}>{t('legal_tab_about')}</span> |&nbsp;
                <span onClick={() => setSeletedTab("terms")}
                      className={tabNameClassName(selectedTab, "terms")}>{t('legal_tab_terms')}</span> |&nbsp;
                <a href={privacyPolicyLink()} target="_blank"
                   className="privacy-policy-link"
                   rel="noopener noreferrer"
                   title={t('legal_tab_privacy')}>{t('legal_tab_privacy')}</a>
                {/*<span onClick={() => setSeletedTab("privacy")}*/}
                {/*      className={tabNameClassName(selectedTab, "privacy")}>{t('legal_tab_privacy')}</span>*/}
            </div>
            {tabContent(selectedTab)}
        </div>
    );
};

const tabNameClassName = (tab, selectedTab) => tab === selectedTab ? "legal-section-tab-selected" : "legal-section-tab";

const tabContent = (selectedTab) => {
    switch (selectedTab) {
        case "about":
            return <AboutTab/>;
        case "terms":
            return <TermsTab/>;
        case "privacy":
            return <PrivacyTab/>;
        default:
            throw console.log("Not supported tab: " + selectedTab + ". Ignoring.")
    }
};

const AboutTab = () => {
    return <div>
        <p>Ivan Schütz</p>
        <p>Birkenstraße 15</p>
        <p>10559 Berlin</p>
        <p>Deutschland</p>
    </div>
};

const TermsTab = () => {
    const {t} = useTranslation();
    return <div>
        <br/>
        {t('legal_general_1')} <br/><br/>
        {t('legal_general_2_part_1')}
        <a className="feedback-link" href="mailto:contact@woentsorgen.de" target="_blank" rel="noopener noreferrer">
            {t('legal_general_2_contact_link_text')}
        </a>
        {t('legal_general_2_part_2')}
    </div>
};

const PrivacyTab = () => {
    return <div>
        <br/>
        <a href="https://www.iubenda.com/privacy-policy/58762046" className="iubenda-white no-brand iubenda-embed"
           title="Privacy Policy ">Privacy Policy</a>
    </div>
};

export default Legal;
