import React, {useState} from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import exampleImage from './hero2.png';

import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    PinterestShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
    TumblrShareButton,

    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    PinterestIcon,
    WhatsappIcon,
    RedditIcon,
    TumblrIcon,
    EmailIcon,
} from 'react-share';

const Social = () => {
    const {t} = useTranslation();
    const shareUrl = 'https://wohin-mit.de';
    const title = t('social_share_subject');

    return (
        <div>
            <div className="social-network">
                <FacebookShareButton
                    url={shareUrl}
                    quote={title}
                    className="social-network-share-button">
                    <FacebookIcon
                        size={32}
                        round/>
                </FacebookShareButton>
            </div>

            <div className="social-network">
                <TwitterShareButton
                    url={shareUrl}
                    title={title}
                    className="social-network-share-button">
                    <TwitterIcon
                        size={32}
                        round/>
                </TwitterShareButton>
            </div>

            <div className="social-network">
                <WhatsappShareButton
                    url={shareUrl}
                    title={title}
                    separator=":: "
                    className="social-network-share-button">
                    <WhatsappIcon size={32} round/>
                </WhatsappShareButton>
            </div>

            <div className="social-network">
                <LinkedinShareButton
                    url={shareUrl}
                    windowWidth={750}
                    windowHeight={600}
                    className="social-network-share-button">
                    <LinkedinIcon
                        size={32}
                        round/>
                </LinkedinShareButton>
            </div>

            <div className="social-network">
                <PinterestShareButton
                    url={String(window.location)}
                    media={`${String(window.location)}/${exampleImage}`}
                    windowWidth={1000}
                    windowHeight={730}
                    className="social-network-share-button">
                    <PinterestIcon size={32} round/>
                </PinterestShareButton>
            </div>

            <div className="social-network">
                <RedditShareButton
                    url={shareUrl}
                    title={title}
                    windowWidth={660}
                    windowHeight={460}
                    className="social-network-share-button">
                    <RedditIcon
                        size={32}
                        round/>
                </RedditShareButton>

            </div>

            <div className="social-network">
                <TumblrShareButton
                    url={shareUrl}
                    title={title}
                    windowWidth={660}
                    windowHeight={460}
                    className="social-network-share-button">
                    <TumblrIcon
                        size={32}
                        round/>
                </TumblrShareButton>
            </div>

            <div className="social-network">
                <EmailShareButton
                    url={shareUrl}
                    subject={title}
                    body="body"
                    className="social-network-share-button">
                    <EmailIcon
                        size={32}
                        round/>
                </EmailShareButton>
            </div>
        </div>
    );
};

export default Social;
