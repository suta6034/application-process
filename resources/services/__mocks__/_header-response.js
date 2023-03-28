export const html = `<header class="mf-header k-c-navbar " data-qa="header">
    <div class="mf-header__content">
        <div class="mf-header__sideNavigation">
                <div class="mf-notification">
                    <button class="mf-header__sideNavigationTrigger" title="Navigation" data-qa="hamburger menu trigger">
                        <svg fill="currentColor" class="mf-header__sideNavigationIcon" viewBox="0 0 16 18">
                            <path d="M15.3,9.16H0.7c-0.36,0-0.65-0.29-0.65-0.65S0.34,7.86,0.7,7.86h14.6c0.36,0,0.65,0.29,0.65,0.65 S15.66,9.16,15.3,9.16z"/>
                            <path d="M15.3,14.16H0.7c-0.36,0-0.65-0.29-0.65-0.65s0.29-0.65,0.65-0.65h14.6c0.36,0,0.65,0.29,0.65,0.65 S15.66,14.16,15.3,14.16z"/>
                            <path d="M15.3,4.16H0.7c-0.36,0-0.65-0.29-0.65-0.65S0.34,2.86,0.7,2.86h14.6c0.36,0,0.65,0.29,0.65,0.65 S15.66,4.16,15.3,4.16z"/>
                        </svg>
                    </button>
                </div>
        </div>
        <div class="mf-header__logo">
            <a href="/" title="Startseite" class="mf-header__logoLink">
                        <svg fill="currentColor" class="mf-header__logoIcon k-c-logo" viewBox="0 0 880 170">
                    <path class="k-c-logo__dot" d="M719 122.1c-10.3 0-18.7 8.4-18.7 18.7 0 10.3 8.4 18.7 18.7 18.7 10.3 0 18.7-8.4 18.7-18.7-.1-10.4-8.4-18.7-18.7-18.7"/>
                    <path d="M866.7 145.5c-2.4.3-4.7.4-6.8.4-5.9 0-9.9-1.3-12.2-3.8-2.3-2.7-3.4-7.2-3.4-13.6V71.7h27.4V59.9h-27.4V31.3l-13 8.2v91c0 2 .1 3.7.2 5 .1 1.3.3 2.4.4 3.2.1.8.3 1.7.6 2.6 1.5 5.1 4.3 9 8.6 11.8 4.4 2.7 9.9 4 16.6 4 5.5 0 10.9-.7 16.4-2v-11.2c-2.4.6-4.9 1.2-7.4 1.6M805.9 145.3c-2.5.7-5.4 1.1-8.6 1.4-3.1.3-6.1.4-9.2.4-10.3 0-17.7-1.3-22.2-4-4.4-2.7-6.6-7.1-6.6-13.4 0-8.4 3.7-14.5 11-18.2 7.5-3.7 19.3-5.6 35.6-5.6v39.4zm-20-87.8c-10.8 0-21.4 2.8-31.8 8.4v12.8c4.5-3.1 9.4-5.5 14.6-7.2 5.3-1.7 10.7-2.6 16-2.6 4.5 0 8.5.8 12 2.4 3.5 1.5 5.9 3.5 7.2 6.2.7 1.5 1.1 3.2 1.4 5.2.4 1.9.6 4.7.6 8.4v4.6c-4.8 0-9.1.1-12.8.4-3.6.1-7.2.5-10.8 1-11.3 1.6-20.2 5.3-26.6 11.2-6.4 5.9-9.6 13.2-9.6 22 0 18.5 14.1 27.8 42.2 27.8 8.7 0 18.9-1.1 30.6-3.4V87.1c0-10.7-2.9-18.3-8.8-23-5.4-4.4-13.5-6.6-24.2-6.6M290 59.3c-1.6-.3-2.9-.5-4-.6-1.1-.1-2.1-.2-3.2-.2-15.5 0-25.2 7.7-29.2 23.2V59.9h-32.4v95.8H255v-40.4c0-8.7 1.8-15.3 5.4-19.8 3.7-4.5 9.1-6.8 16-6.8 4.8 0 9.3 1.1 13.6 3.2V59.3zM364 58.5c-15.5 0-25.2 7.7-29.2 23.2V59.9h-32.4v95.8h33.8v-40.4c0-8.7 1.8-15.3 5.4-19.8 3.7-4.5 9.1-6.8 16-6.8 4.8 0 9.3 1.1 13.6 3.2V59.3c-1.6-.3-2.9-.5-4-.6-1.1-.1-2.2-.2-3.2-.2M162.1 136.8c-9 0-14.2-5.9-14.2-11.5 0-6.9 6.6-13.9 23.1-13.9h4.2v24.4c-4.6.8-8.5 1-13.1 1m40.6-62.5c-6.1-10.9-18.3-16.4-36.4-16.4-7.2 0-14.5.8-22 2.4-7.5 1.5-14.1 3.5-20 6.2v22.2c5.9-2.5 11.7-4.4 17.6-5.6 6-1.3 11.8-2 17.4-2 5.6 0 9.6.8 12 2.4 2.5 1.6 3.8 4.2 3.8 7.8v3h-4.4c-8.1 0-15.5.9-22 2.6-6.5 1.6-12.1 3.9-16.8 7-4.7 2.9-8.3 6.6-10.8 11-2.5 4.3-3.8 9-3.8 14.2 0 9.9 3.9 17.1 11.6 21.8 7.9 4.5 18.7 6.8 32.4 6.8 8.5 0 16.7-.4 24.4-1.2 7.7-.7 14.8-1.7 21.2-3.2V99.5c0-6.7-.3-11.8-1-15.4-.5-3.7-1.6-7-3.2-9.8"/>
                    <path d="M51.8 112.1l25.8 43.6h40.8l-17.6-23.6c-3.2-4.4-5.7-7.8-7.6-10.2-1.9-2.5-3.5-4.6-4.8-6.2-1.3-1.6-2.7-3-4-4.2-1.2-1.3-2.9-2.9-5-4.8 1.7-1.3 3.2-2.6 4.4-3.8 1.3-1.3 2.7-2.9 4.2-4.8s3.1-4.1 5-6.8c2-2.8 4.4-6.4 7.2-10.8l13.4-20.6h-39l-22.8 42.4V14.5H18v141.2h33.8v-43.6z"/>
                    <path d="M383.5 59.9h33.8v95.8h-33.8z"/>
                    <path d="M400.3 48.1c10.3 0 18.7-8.4 18.7-18.7 0-10.3-8.4-18.7-18.7-18.7-10.3 0-18.7 8.4-18.7 18.7.1 10.3 8.4 18.7 18.7 18.7M596.2 58.5c-15.5 0-25.2 7.7-29.2 23.2V59.9h-32.4v95.8h33.8v-40.4c0-8.7 1.8-15.3 5.4-19.8 3.7-4.5 9.1-6.8 16-6.8 4.8 0 9.3 1.1 13.6 3.2V59.3c-1.6-.3-2.9-.5-4-.6-1.1-.1-2.1-.2-3.2-.2M673 101.1h-28.8c-.4-8.5 3.5-20 14.2-20 16.1 0 15 16.4 14.6 20m29.1 8.8c.3-2 .4-4.6.4-7.8 0-6.5-1.1-12.5-3.4-17.8-2.1-5.5-5.2-10.1-9.2-14-3.9-4-8.6-7.1-14.2-9.2-5.5-2.1-11.5-3.2-18.2-3.2-6.8 0-13.1 1.2-19 3.6-5.7 2.4-10.7 5.8-14.8 10.2-4.1 4.3-7.4 9.4-9.8 15.4-2.3 5.9-3.4 12.3-3.4 19.4 0 8 1.6 15.5 4.8 22.6 3.2 6.9 7.7 12.7 13.4 17.4 5.1 4 10.5 6.9 16.4 8.6 6 1.7 13.3 2.6 21.8 2.6 9.2 0 18.3-1.2 27.3-3.5-2.2-4-3.4-8.6-3.4-13.4 0-3.2.5-6.3 1.5-9.1-6.6 1.5-13.4 2.3-20.3 2.3-8 0-14.3-1.3-19-4-4.5-2.8-7.1-6.7-7.8-11.8h55c1-3.6 1.6-6.3 1.9-8.3M492.6 101.1h-28.8c-.4-8.5 3.5-20 14.2-20 16.1 0 15 16.4 14.6 20m16.9-30.8c-3.9-4-8.6-7.1-14.2-9.2-5.5-2.1-11.5-3.2-18.2-3.2-6.8 0-13.1 1.2-19 3.6-5.7 2.4-10.7 5.8-14.8 10.2-4.1 4.3-7.4 9.4-9.8 15.4-2.3 5.9-3.4 12.3-3.4 19.4 0 8 1.6 15.5 4.8 22.6 3.2 6.9 7.7 12.7 13.4 17.4 5.1 4 10.5 6.9 16.4 8.6 6 1.7 13.3 2.6 21.8 2.6 10.5 0 20.9-1.5 31.2-4.6v-23c-8.4 2.5-17.1 3.8-26 3.8-8 0-14.3-1.3-19-4-4.5-2.8-7.1-6.7-7.8-11.8h55c.9-3.5 1.5-6.2 1.8-8.2.3-2 .4-4.6.4-7.8 0-6.5-1.1-12.5-3.4-17.8-2.1-5.5-5.2-10.1-9.2-14"/>
                </svg>
            </a>
        </div>
        <nav class="mf-header__navigation">
            <ul class="mf-header__navigationList">
                <li class="mf-header__navigationItem">
                    <a href="/jobs" title="Jobs" class="mf-header__navigationLink k-c-link k-c-link--neutral">Jobs</a>
                </li>
                <li class="mf-header__navigationItem">
                    <a href="/firmen" title="Firmen" class="mf-header__navigationLink k-c-link k-c-link--neutral">Firmen</a>
                </li>
                    <li class="mf-header__navigationItem">
                        <a href="/profil/lebenslauf" title="Lebenslauf" class="mf-header__navigationLink k-c-link k-c-link--neutral">Lebenslauf</a>
                    </li>
                <li class="mf-header__navigationItem">
                    <a href="/center" title="Tipps" class="mf-header__navigationLink k-c-link k-c-link--neutral">Tipps</a>
                </li>
                <li class="mf-header__navigationItem
                    ">
                    <a href="/hr" title="Für Arbeitgeber" class="mf-header__navigationLink k-c-link k-c-link--neutral">Für Arbeitgeber</a>
                </li>
            </ul>
        </nav>
        <div class="mf-header__bentoBox">
                <button
                 class="mf-header__loginButton

                         k-c-button k-c-button--s
                        k-c-button--outlineWhite

                        "
                        title="Anmelden" data-qa="login button" data-mf-analytics="login">Anmelden
                </button>

                <button class="mf-header__bentoBoxTrigger
                        mf-header__bentoBoxTrigger--guest

                        "
                        title="Benutzer" data-qa="bento menu trigger" data-mf-analytics="bentobox-trigger">
                    <span class="mf-header__bentoBoxTriggerTitle">
                        Anmelden
                    </span>
                    <span class="mf-notification" data-qa="bento menu trigger notification">
                        <svg fill="currentColor" class="mf-header__bentoBoxIcon" viewBox="0 0 14 18">
                            <path d="M2.5,6.15c-0.89,0-1.62-0.72-1.62-1.62S1.61,2.92,2.5,2.92s1.62,0.72,1.62,1.62S3.4,6.15,2.5,6.15z M2.5,10.64c-0.89,0-1.62-0.72-1.62-1.62c0-0.89,0.72-1.62,1.62-1.62s1.62,0.72,1.62,1.62C4.12,9.92,3.4,10.64,2.5,10.64z M2.5,15.12c-0.89,0-1.62-0.72-1.62-1.62c0-0.89,0.72-1.62,1.62-1.62s1.62,0.72,1.62,1.62C4.12,14.4,3.4,15.12,2.5,15.12z M6.99,6.15c-0.89,0-1.62-0.72-1.62-1.62S6.1,2.92,6.99,2.92S8.6,3.65,8.6,4.54S7.88,6.15,6.99,6.15z M6.99,10.64 c-0.89,0-1.62-0.72-1.62-1.62c0-0.89,0.72-1.62,1.62-1.62S8.6,8.13,8.6,9.02C8.6,9.92,7.88,10.64,6.99,10.64z M6.99,15.12 c-0.89,0-1.62-0.72-1.62-1.62c0-0.89,0.72-1.62,1.62-1.62s1.62,0.72,1.62,1.62C8.6,14.4,7.88,15.12,6.99,15.12z M11.47,6.15 c-0.89,0-1.62-0.72-1.62-1.62s0.72-1.62,1.62-1.62c0.89,0,1.62,0.72,1.62,1.62C13.09,5.43,12.37,6.15,11.47,6.15z M11.47,10.64 c-0.89,0-1.62-0.72-1.62-1.62c0-0.89,0.72-1.62,1.62-1.62c0.89,0,1.62,0.72,1.62,1.62C13.09,9.92,12.37,10.64,11.47,10.64z M11.47,15.12c-0.89,0-1.62-0.72-1.62-1.62c0-0.89,0.72-1.62,1.62-1.62c0.89,0,1.62,0.72,1.62,1.62 C13.09,14.4,12.37,15.12,11.47,15.12z"/>
                        </svg>
                    </span>
                </button>
            <div class="mf-bentoBox k-state--close" data-qa="bento menu">
                    <div class="mf-bentoBox__guest">
                        <div class="mf-bentoBox__guestContent">
                <button
                    class="mf-bentoBox__loginButton k-c-button k-c-button--full" title="Anmelden"
                            data-qa="login button" data-mf-analytics="login">
                        Anmelden
                </button>

                    <div class="mf-bentoBox__guestLinkContainer">
                        Neu hier?
                        <span
                            class="mf-bentoBox__guestLink k-c-link" title="Registrieren" data-mf-analytics="register">Kostenlos registrieren
                        </span>
                    </div>
            </div>
        </div>
                <div class="k-c-divider k-c-divider--fine k-c-divider--full"></div>
                <nav class="mf-bentoBox__userNavigation">
                    <ul class="mf-bentoBox__navigationList">
            <li class="mf-bentoBox__navigationItem">
                <a href="/profil/lebenslauf" title="Lebenslauf" class="mf-bentoBox__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                    data-mf-analytics="nav-profile-guest">
                    <div class="mf-notification">
                        <svg class="k-c-link__icon" fill="currentColor" viewBox="0 0 14 18">
                    <path d="M10.09,12.72H3.91c-0.28,0-0.5,0.22-0.5,0.5s0.22,0.5,0.5,0.5h6.18c0.28,0,0.5-0.22,0.5-0.5 S10.37,12.72,10.09,12.72z"/>
                    <path d="M4.42,11.54c0.28,0,0.5-0.22,0.5-0.5c0-0.3,0.25-0.71,0.71-0.71h2.72c0.49,0,0.71,0.42,0.71,0.71 c0,0.28,0.22,0.5,0.5,0.5s0.5-0.22,0.5-0.5c0-0.82-0.66-1.71-1.71-1.71H5.64c-1.03,0-1.71,0.89-1.71,1.71 C3.92,11.32,4.15,11.54,4.42,11.54z"/>
                    <path d="M7,9.03c1.04,0,1.89-0.85,1.89-1.89S8.04,5.25,7,5.25S5.11,6.1,5.11,7.14S5.96,9.03,7,9.03z M7,6.25 c0.49,0,0.89,0.4,0.89,0.89S7.49,8.03,7,8.03s-0.89-0.4-0.89-0.89S6.51,6.25,7,6.25z"/>
                    <path d="M13.12,1.58h-1.74v-0.7c0-0.13-0.05-0.26-0.15-0.35S11,0.38,10.87,0.38h0l-2.32,0c-0.28,0-0.5,0.22-0.5,0.5 v0.69H0.88c-0.28,0-0.5,0.22-0.5,0.5v14.75c0,0.28,0.22,0.5,0.5,0.5h12.23c0.28,0,0.5-0.22,0.5-0.5V2.08 C13.62,1.8,13.39,1.58,13.12,1.58z M12.62,16.32H1.38V2.58h7.16c0.28,0,0.5-0.22,0.5-0.5v-0.7l1.32,0l0,2.45 c0,0.04,0,0.44-0.15,0.44c-0.13,0-0.2-0.16-0.2-0.46l0-0.38l-1,0.01l0,0.37c0,1.08,0.65,1.46,1.2,1.46c0.53,0,1.15-0.38,1.15-1.44 l0-1.25h1.25V16.32z"/>
                </svg>
            </div>
                    Lebenslauf
                </a>
            </li>
            <li class="mf-bentoBox__navigationItem">
                <a href="/profil/bewerbungen"
                    title="Bewerbungen" class="mf-bentoBox__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                    data-mf-analytics="nav-applications-guest">
                    <div class="mf-notification">
                            <svg class="mf-bentoBox__navigationIcon k-c-link__icon" viewBox="0 0 18 18">
                        <path fill="currentColor" d="M6.89,15.4c-0.04,0-0.08,0-0.12-0.01c-0.01,0-0.02,0-0.03,0c-0.06-0.01-0.12-0.03-0.18-0.06
                    \tC6.37,15.24,6.13,15.05,6,14.6l-1.16-3.65l-2.96-1C1.13,9.72,1,9.29,0.99,9.06C0.98,8.82,1.08,8.38,1.84,8.08
                    \tC2.3,7.9,13.31,3.38,14.25,3.02c0.58-0.21,1.13-0.42,1.52-0.08c0.37,0.32,0.25,0.87,0.2,1.14c-0.04,0.17-0.4,2.28-0.58,3.3
                    \tc-0.07,0.43-0.13,0.74-0.13,0.77c-0.05,0.27-0.32,0.45-0.58,0.4c-0.27-0.05-0.45-0.31-0.4-0.58l0.13-0.75
                    \tc0.34-1.95,0.55-3.19,0.58-3.34C15,3.85,15,3.84,15,3.82c-0.1,0.03-0.24,0.08-0.4,0.14C13.68,4.31,2.47,8.9,2.21,9.01l3.07,1.04
                    \tl6.76-4.44c0.39-0.25,1.11-0.69,1.48-0.19c0.38,0.5-0.28,1.1-0.52,1.33l-5.28,4.98l-0.28,2.13l1.35-1.26
                    \tc0.18-0.17,0.45-0.18,0.64-0.03l0.46,0.35c0.22,0.17,0.26,0.48,0.1,0.7c-0.17,0.22-0.48,0.26-0.7,0.1l-0.12-0.09l-1.52,1.42
                    \tC7.36,15.33,7.09,15.4,6.89,15.4z M5.86,10.87l0.68,2.13l0.17-1.3c0.02-0.24,0.15-0.53,0.34-0.7l3.16-2.98L5.86,10.87z"/>
                        <path id="lock" fill="#619F00" d="M16.16,12.26h-0.38V10.8c0-1.13-0.92-2.04-2.04-2.04S11.7,9.68,11.7,10.8v1.46h-0.39
                    \tc-0.46,0-0.84,0.38-0.84,0.84v3.06c0,0.46,0.38,0.84,0.84,0.84h4.85c0.46,0,0.84-0.38,0.84-0.84V13.1
                    \tC17,12.63,16.62,12.26,16.16,12.26z M12.69,10.79c0-0.57,0.47-1.04,1.04-1.04s1.04,0.47,1.04,1.04v1.46h-2.08V10.79z"/>
                    </svg>
            </div>
                Bewerbungen</a>
            </li>
            <li class="mf-bentoBox__navigationItem">
                <a href="/profil/nachrichten"
                    title="Nachrichten" class="mf-bentoBox__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                    data-mf-analytics="nav-messages-guest">
                    <div class="mf-notification">
                            <svg class="mf-bentoBox__navigationIcon k-c-link__icon" viewBox="0 0 18 18">
                        <path fill="currentColor" d="M9.59,14.05H2.81c-0.79,0-1.43-0.64-1.43-1.43V5.18c0-0.79,0.64-1.43,1.43-1.43h12.38
                    \tc0.79,0,1.43,0.64,1.43,1.43v3.91c0,0.28-0.22,0.5-0.5,0.5s-0.5-0.22-0.5-0.5V5.38l-6.3,5.15c-0.18,0.15-0.45,0.15-0.63,0l-1.7-1.39
                    \tl-3.92,3.91h6.52c0.28,0,0.5,0.22,0.5,0.5S9.87,14.05,9.59,14.05z M2.38,5.38v6.95L6.21,8.5L2.38,5.38z M3.19,4.75L9,9.49l5.81-4.74
                    \tH3.19z"/>
                        <path id="lock" fill="#619F00" d="M16.16,12.26h-0.38V10.8c0-1.13-0.92-2.04-2.04-2.04S11.7,9.68,11.7,10.8v1.46h-0.39
                    \tc-0.46,0-0.84,0.38-0.84,0.84v3.06c0,0.46,0.38,0.84,0.84,0.84h4.85c0.46,0,0.84-0.38,0.84-0.84V13.1
                    \tC17,12.63,16.62,12.26,16.16,12.26z M12.69,10.79c0-0.57,0.47-1.04,1.04-1.04s1.04,0.47,1.04,1.04v1.46h-2.08V10.79z"/>
                    </svg>
            </div>
                Nachrichten</a>
            </li>
            <li class="mf-bentoBox__navigationItem">
                <a href="/jobalarm" title="Job-Alarm" class="mf-bentoBox__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                    data-mf-analytics="nav-jobalarm-guest">
                    <div class="mf-notification">
                        <svg class="k-c-link__icon" fill="currentColor" viewBox="0 0 16 18">
                    <path d="M15.15,13.48c-0.75,0-1.37-0.61-1.37-1.37V8.69c0-2.31-1.4-4.41-3.51-5.32c-0.29-1-1.22-1.72-2.27-1.72 c-1.07,0-1.99,0.71-2.27,1.72C3.59,4.3,2.22,6.36,2.22,8.69v3.43c0,0.75-0.61,1.37-1.37,1.37c-0.28,0-0.5,0.22-0.5,0.5 s0.22,0.5,0.5,0.5H5.7c0.23,1.06,1.18,1.87,2.31,1.87s2.08-0.8,2.31-1.87h4.83c0.28,0,0.5-0.22,0.5-0.5S15.43,13.48,15.15,13.48z M8.01,15.35c-0.58,0-1.07-0.36-1.27-0.87h2.54C9.07,14.99,8.58,15.35,8.01,15.35z M2.78,13.48c0.27-0.39,0.44-0.86,0.44-1.37V8.69 c0-2,1.23-3.77,3.13-4.49c0.17-0.06,0.29-0.21,0.32-0.39c0.1-0.67,0.67-1.16,1.34-1.16c0.66,0,1.24,0.5,1.34,1.16 C9.38,3.99,9.5,4.14,9.67,4.2c1.86,0.7,3.12,2.5,3.12,4.49v3.43c0,0.51,0.16,0.98,0.43,1.37H2.78z"/>
                </svg>
            </div>
                    Job-Alarm
                </a>
            </li>
            <li class="mf-bentoBox__navigationItem">
                <a href="/watchlist" title="Meine Jobs" class="mf-bentoBox__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                    data-mf-analytics="nav-watchlist-guest">
                    <div class="mf-notification">
                        <svg class="k-c-link__icon" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M4.3,16.28c-0.17,0-0.34-0.05-0.49-0.16c-0.29-0.21-0.4-0.56-0.29-0.9l1.72-5.12L1.29,6.73 C1.03,6.51,0.94,6.16,1.04,5.84C1.15,5.53,1.46,5.3,1.8,5.3h4.75l1.68-4.47C8.37,0.51,8.66,0.32,9,0.32c0.01,0,0.02,0,0.02,0 c0.34,0.01,0.63,0.21,0.74,0.51l1.68,4.46h4.75c0.34,0,0.64,0.21,0.76,0.53c0.12,0.35,0.01,0.71-0.27,0.92l-3.93,3.37l1.71,5.11 c0.1,0.3,0.02,0.62-0.22,0.86c-0.33,0.28-0.78,0.18-0.98,0.07l-0.05-0.03l-4.22-3.08l-4.22,3.08C4.63,16.22,4.46,16.28,4.3,16.28z M4.18,15.31C4.18,15.31,4.18,15.31,4.18,15.31L4.18,15.31z M2.34,6.3l4.06,3.46l-1.74,5.2l4.34-3.17l4.33,3.16L11.59,9.8 l4.07-3.49h-4.91L9,1.65L7.25,6.3H2.34z M16.06,5.97C16.05,5.97,16.05,5.97,16.06,5.97L16.06,5.97z M8.82,1.18 C8.83,1.18,8.83,1.19,8.82,1.18L8.82,1.18z"/>
                </svg>
            </div>
                    Merkliste
                </a>
            </li>
            <li class="mf-bentoBox__navigationItem">
                <a href="/companyalarm"
                    title="Firmen-Alarm" class="mf-bentoBox__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                    data-mf-analytics="nav-companyfollow-guest">
                    <div class="mf-notification">
                            <svg class="mf-bentoBox__navigationIcon k-c-link__icon" viewBox="0 0 18 18">
                        <path fill="currentColor" d="M8.98,15.27c-0.09,0-0.18-0.02-0.26-0.07c-0.28-0.17-6.78-4.16-6.76-9.08
                    \tC1.96,3.36,3.8,2,5.51,1.9C6.79,1.83,8.24,2.47,9,3.98c0.8-1.56,2.31-2.2,3.63-2.11c1.63,0.11,3.39,1.38,3.39,3.92
                    \tc0,0.8-0.2,1.65-0.59,2.53c-0.11,0.25-0.41,0.37-0.66,0.25c-0.25-0.11-0.37-0.41-0.25-0.66c0.33-0.75,0.5-1.47,0.5-2.13
                    \tc0-1.9-1.23-2.84-2.46-2.92C11.23,2.77,9.77,3.65,9.48,5.8c-0.03,0.25-0.2,0.45-0.5,0.43c-0.25,0-0.46-0.19-0.49-0.44
                    \tC8.25,3.69,6.85,2.82,5.57,2.9C4.27,2.97,2.96,4,2.96,6.12c-0.01,3.82,4.78,7.24,6,8.04c0.09-0.07,0.19-0.15,0.31-0.24
                    \tc0.22-0.17,0.53-0.13,0.7,0.09c0.17,0.22,0.13,0.53-0.09,0.7c-0.38,0.3-0.62,0.47-0.62,0.47C9.19,15.24,9.08,15.27,8.98,15.27z"/>
                        <path id="lock" fill="#619F00" d="M16.16,12.26h-0.38v-1.46c0-1.13-0.92-2.04-2.04-2.04c-1.12,0-2.04,0.92-2.04,2.04v1.46h-0.39
                    \tc-0.46,0-0.84,0.38-0.84,0.84v3.06c0,0.46,0.38,0.84,0.84,0.84h4.85c0.46,0,0.84-0.38,0.84-0.84V13.1
                    \tC17,12.63,16.62,12.26,16.16,12.26z M12.69,10.79c0-0.57,0.47-1.04,1.04-1.04s1.04,0.47,1.04,1.04v1.46h-2.08V10.79z"/>
                    </svg>
            </div>
                Firmen-Alarm</a>
            </li>
        </ul>
    </nav>
            </div>
        </div>
    </div>
</header>
<div class="mf-sideNavigation k-state--close" data-qa="hamburger menu">
    <div class="mf-sideNavigation__drawer">
        <div class="mf-sideNavigation__bar">
            <button class="mf-sideNavigation__close" title="Schließen">
                <svg fill="currentColor" class="mf-sideNavigation__closeIcon" viewBox="0 0 13.3 18">
                    <path d="M7.57,8.8l4.54-4.54c0.25-0.25,0.25-0.67,0-0.92s-0.67-0.25-0.92,0L6.65,7.88L2.11,3.34c-0.25-0.25-0.67-0.25-0.92,0 s-0.25,0.67,0,0.92L5.73,8.8l-4.54,4.54c-0.25,0.25-0.25,0.67,0,0.92c0.13,0.13,0.29,0.19,0.46,0.19s0.33-0.06,0.46-0.19l4.54-4.54 l4.54,4.54c0.13,0.13,0.29,0.19,0.46,0.19s0.33-0.06,0.46-0.19c0.25-0.25,0.25-0.67,0-0.92L7.57,8.8z"/>
                </svg>
            </button>
        </div>
        <div class="mf-sideNavigation__content">
                <div class="mf-sideNavigation__guest">
                    <div class="mf-sideNavigation__guestContent">
                        <button
                            class="mf-sideNavigation__loginButton k-c-button k-c-button--full" title="Anmelden"
                                    data-qa="login button" data-mf-analytics="login">
                                Anmelden
                        </button>

                            <div class="mf-sideNavigation__guestLinkContainer">
                                Neu hier?
                                <span
                                    class="mf-sideNavigation__guestLink k-c-link" title="Registrieren" data-mf-analytics="register">Kostenlos registrieren
                                </span>
                            </div>
                    </div>
                </div>
            <div class="k-c-divider k-c-divider--fine k-c-divider--full"></div>
            <nav class="mf-sideNavigation__navigation">
                <ul class="mf-sideNavigation__navigationList">
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/jobs" title="Jobs" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral">Jobs</a>
                    </li>
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/firmen" title="Firmen" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral">Firmen</a>
                    </li>
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/center" title="Tipps" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral">Tipps</a>
                    </li>
                    <li class="mf-sideNavigation__navigationItem
                        ">
                        <a href="/hr" title="Für Arbeitgeber" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral">Für Arbeitgeber</a>
                    </li>
                </ul>
            </nav>
            <div class="k-c-divider k-c-divider--fine k-c-divider--full"></div>
            <nav class="mf-sideNavigation__userNavigation">
                <ul class="mf-sideNavigation__navigationList">
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/profil/lebenslauf" title="Lebenslauf" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                            data-mf-analytics="nav-profile-guest">
                            <div class="mf-notification">
                                <svg class="k-c-link__icon" fill="currentColor" viewBox="0 0 14 18">
                    <path d="M10.09,12.72H3.91c-0.28,0-0.5,0.22-0.5,0.5s0.22,0.5,0.5,0.5h6.18c0.28,0,0.5-0.22,0.5-0.5 S10.37,12.72,10.09,12.72z"/>
                    <path d="M4.42,11.54c0.28,0,0.5-0.22,0.5-0.5c0-0.3,0.25-0.71,0.71-0.71h2.72c0.49,0,0.71,0.42,0.71,0.71 c0,0.28,0.22,0.5,0.5,0.5s0.5-0.22,0.5-0.5c0-0.82-0.66-1.71-1.71-1.71H5.64c-1.03,0-1.71,0.89-1.71,1.71 C3.92,11.32,4.15,11.54,4.42,11.54z"/>
                    <path d="M7,9.03c1.04,0,1.89-0.85,1.89-1.89S8.04,5.25,7,5.25S5.11,6.1,5.11,7.14S5.96,9.03,7,9.03z M7,6.25 c0.49,0,0.89,0.4,0.89,0.89S7.49,8.03,7,8.03s-0.89-0.4-0.89-0.89S6.51,6.25,7,6.25z"/>
                    <path d="M13.12,1.58h-1.74v-0.7c0-0.13-0.05-0.26-0.15-0.35S11,0.38,10.87,0.38h0l-2.32,0c-0.28,0-0.5,0.22-0.5,0.5 v0.69H0.88c-0.28,0-0.5,0.22-0.5,0.5v14.75c0,0.28,0.22,0.5,0.5,0.5h12.23c0.28,0,0.5-0.22,0.5-0.5V2.08 C13.62,1.8,13.39,1.58,13.12,1.58z M12.62,16.32H1.38V2.58h7.16c0.28,0,0.5-0.22,0.5-0.5v-0.7l1.32,0l0,2.45 c0,0.04,0,0.44-0.15,0.44c-0.13,0-0.2-0.16-0.2-0.46l0-0.38l-1,0.01l0,0.37c0,1.08,0.65,1.46,1.2,1.46c0.53,0,1.15-0.38,1.15-1.44 l0-1.25h1.25V16.32z"/>
                </svg>
            </div>
                            Lebenslauf
                        </a>
                    </li>
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/profil/bewerbungen"
                            title="Bewerbungen" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                            data-mf-analytics="nav-applications-guest">
                            <div class="mf-notification">
                                    <svg class="mf-sideNavigation__navigationIcon k-c-link__icon" viewBox="0 0 18 18">
                        <path fill="currentColor" d="M6.89,15.4c-0.04,0-0.08,0-0.12-0.01c-0.01,0-0.02,0-0.03,0c-0.06-0.01-0.12-0.03-0.18-0.06
                    \tC6.37,15.24,6.13,15.05,6,14.6l-1.16-3.65l-2.96-1C1.13,9.72,1,9.29,0.99,9.06C0.98,8.82,1.08,8.38,1.84,8.08
                    \tC2.3,7.9,13.31,3.38,14.25,3.02c0.58-0.21,1.13-0.42,1.52-0.08c0.37,0.32,0.25,0.87,0.2,1.14c-0.04,0.17-0.4,2.28-0.58,3.3
                    \tc-0.07,0.43-0.13,0.74-0.13,0.77c-0.05,0.27-0.32,0.45-0.58,0.4c-0.27-0.05-0.45-0.31-0.4-0.58l0.13-0.75
                    \tc0.34-1.95,0.55-3.19,0.58-3.34C15,3.85,15,3.84,15,3.82c-0.1,0.03-0.24,0.08-0.4,0.14C13.68,4.31,2.47,8.9,2.21,9.01l3.07,1.04
                    \tl6.76-4.44c0.39-0.25,1.11-0.69,1.48-0.19c0.38,0.5-0.28,1.1-0.52,1.33l-5.28,4.98l-0.28,2.13l1.35-1.26
                    \tc0.18-0.17,0.45-0.18,0.64-0.03l0.46,0.35c0.22,0.17,0.26,0.48,0.1,0.7c-0.17,0.22-0.48,0.26-0.7,0.1l-0.12-0.09l-1.52,1.42
                    \tC7.36,15.33,7.09,15.4,6.89,15.4z M5.86,10.87l0.68,2.13l0.17-1.3c0.02-0.24,0.15-0.53,0.34-0.7l3.16-2.98L5.86,10.87z"/>
                        <path id="lock" fill="#619F00" d="M16.16,12.26h-0.38V10.8c0-1.13-0.92-2.04-2.04-2.04S11.7,9.68,11.7,10.8v1.46h-0.39
                    \tc-0.46,0-0.84,0.38-0.84,0.84v3.06c0,0.46,0.38,0.84,0.84,0.84h4.85c0.46,0,0.84-0.38,0.84-0.84V13.1
                    \tC17,12.63,16.62,12.26,16.16,12.26z M12.69,10.79c0-0.57,0.47-1.04,1.04-1.04s1.04,0.47,1.04,1.04v1.46h-2.08V10.79z"/>
                    </svg>
            </div>
                        Bewerbungen</a>
                    </li>
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/profil/nachrichten"
                            title="Nachrichten" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                            data-mf-analytics="nav-messages-guest">
                            <div class="mf-notification">
                                    <svg class="mf-sideNavigation__navigationIcon k-c-link__icon" viewBox="0 0 18 18">
                        <path fill="currentColor" d="M9.59,14.05H2.81c-0.79,0-1.43-0.64-1.43-1.43V5.18c0-0.79,0.64-1.43,1.43-1.43h12.38
                    \tc0.79,0,1.43,0.64,1.43,1.43v3.91c0,0.28-0.22,0.5-0.5,0.5s-0.5-0.22-0.5-0.5V5.38l-6.3,5.15c-0.18,0.15-0.45,0.15-0.63,0l-1.7-1.39
                    \tl-3.92,3.91h6.52c0.28,0,0.5,0.22,0.5,0.5S9.87,14.05,9.59,14.05z M2.38,5.38v6.95L6.21,8.5L2.38,5.38z M3.19,4.75L9,9.49l5.81-4.74
                    \tH3.19z"/>
                        <path id="lock" fill="#619F00" d="M16.16,12.26h-0.38V10.8c0-1.13-0.92-2.04-2.04-2.04S11.7,9.68,11.7,10.8v1.46h-0.39
                    \tc-0.46,0-0.84,0.38-0.84,0.84v3.06c0,0.46,0.38,0.84,0.84,0.84h4.85c0.46,0,0.84-0.38,0.84-0.84V13.1
                    \tC17,12.63,16.62,12.26,16.16,12.26z M12.69,10.79c0-0.57,0.47-1.04,1.04-1.04s1.04,0.47,1.04,1.04v1.46h-2.08V10.79z"/>
                    </svg>
            </div>
                        Nachrichten</a>
                    </li>
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/jobalarm" title="Job-Alarm" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                            data-mf-analytics="nav-jobalarm-guest">
                            <div class="mf-notification">
                                <svg class="k-c-link__icon" fill="currentColor" viewBox="0 0 16 18">
                    <path d="M15.15,13.48c-0.75,0-1.37-0.61-1.37-1.37V8.69c0-2.31-1.4-4.41-3.51-5.32c-0.29-1-1.22-1.72-2.27-1.72 c-1.07,0-1.99,0.71-2.27,1.72C3.59,4.3,2.22,6.36,2.22,8.69v3.43c0,0.75-0.61,1.37-1.37,1.37c-0.28,0-0.5,0.22-0.5,0.5 s0.22,0.5,0.5,0.5H5.7c0.23,1.06,1.18,1.87,2.31,1.87s2.08-0.8,2.31-1.87h4.83c0.28,0,0.5-0.22,0.5-0.5S15.43,13.48,15.15,13.48z M8.01,15.35c-0.58,0-1.07-0.36-1.27-0.87h2.54C9.07,14.99,8.58,15.35,8.01,15.35z M2.78,13.48c0.27-0.39,0.44-0.86,0.44-1.37V8.69 c0-2,1.23-3.77,3.13-4.49c0.17-0.06,0.29-0.21,0.32-0.39c0.1-0.67,0.67-1.16,1.34-1.16c0.66,0,1.24,0.5,1.34,1.16 C9.38,3.99,9.5,4.14,9.67,4.2c1.86,0.7,3.12,2.5,3.12,4.49v3.43c0,0.51,0.16,0.98,0.43,1.37H2.78z"/>
                </svg>
            </div>
                            Job-Alarm
                        </a>
                    </li>
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/watchlist" title="Meine Jobs" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                            data-mf-analytics="nav-watchlist-guest">
                            <div class="mf-notification">
                                <svg class="k-c-link__icon" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M4.3,16.28c-0.17,0-0.34-0.05-0.49-0.16c-0.29-0.21-0.4-0.56-0.29-0.9l1.72-5.12L1.29,6.73 C1.03,6.51,0.94,6.16,1.04,5.84C1.15,5.53,1.46,5.3,1.8,5.3h4.75l1.68-4.47C8.37,0.51,8.66,0.32,9,0.32c0.01,0,0.02,0,0.02,0 c0.34,0.01,0.63,0.21,0.74,0.51l1.68,4.46h4.75c0.34,0,0.64,0.21,0.76,0.53c0.12,0.35,0.01,0.71-0.27,0.92l-3.93,3.37l1.71,5.11 c0.1,0.3,0.02,0.62-0.22,0.86c-0.33,0.28-0.78,0.18-0.98,0.07l-0.05-0.03l-4.22-3.08l-4.22,3.08C4.63,16.22,4.46,16.28,4.3,16.28z M4.18,15.31C4.18,15.31,4.18,15.31,4.18,15.31L4.18,15.31z M2.34,6.3l4.06,3.46l-1.74,5.2l4.34-3.17l4.33,3.16L11.59,9.8 l4.07-3.49h-4.91L9,1.65L7.25,6.3H2.34z M16.06,5.97C16.05,5.97,16.05,5.97,16.06,5.97L16.06,5.97z M8.82,1.18 C8.83,1.18,8.83,1.19,8.82,1.18L8.82,1.18z"/>
                </svg>
            </div>
                            Merkliste
                        </a>
                    </li>
                    <li class="mf-sideNavigation__navigationItem">
                        <a href="/companyalarm"
                            title="Firmen-Alarm" class="mf-sideNavigation__navigationLink k-c-link k-c-link--neutral k-c-link--icon"
                            data-mf-analytics="nav-companyfollow-guest">
                            <div class="mf-notification">
                                    <svg class="mf-sideNavigation__navigationIcon k-c-link__icon" viewBox="0 0 18 18">
                        <path fill="currentColor" d="M8.98,15.27c-0.09,0-0.18-0.02-0.26-0.07c-0.28-0.17-6.78-4.16-6.76-9.08
                    \tC1.96,3.36,3.8,2,5.51,1.9C6.79,1.83,8.24,2.47,9,3.98c0.8-1.56,2.31-2.2,3.63-2.11c1.63,0.11,3.39,1.38,3.39,3.92
                    \tc0,0.8-0.2,1.65-0.59,2.53c-0.11,0.25-0.41,0.37-0.66,0.25c-0.25-0.11-0.37-0.41-0.25-0.66c0.33-0.75,0.5-1.47,0.5-2.13
                    \tc0-1.9-1.23-2.84-2.46-2.92C11.23,2.77,9.77,3.65,9.48,5.8c-0.03,0.25-0.2,0.45-0.5,0.43c-0.25,0-0.46-0.19-0.49-0.44
                    \tC8.25,3.69,6.85,2.82,5.57,2.9C4.27,2.97,2.96,4,2.96,6.12c-0.01,3.82,4.78,7.24,6,8.04c0.09-0.07,0.19-0.15,0.31-0.24
                    \tc0.22-0.17,0.53-0.13,0.7,0.09c0.17,0.22,0.13,0.53-0.09,0.7c-0.38,0.3-0.62,0.47-0.62,0.47C9.19,15.24,9.08,15.27,8.98,15.27z"/>
                        <path id="lock" fill="#619F00" d="M16.16,12.26h-0.38v-1.46c0-1.13-0.92-2.04-2.04-2.04c-1.12,0-2.04,0.92-2.04,2.04v1.46h-0.39
                    \tc-0.46,0-0.84,0.38-0.84,0.84v3.06c0,0.46,0.38,0.84,0.84,0.84h4.85c0.46,0,0.84-0.38,0.84-0.84V13.1
                    \tC17,12.63,16.62,12.26,16.16,12.26z M12.69,10.79c0-0.57,0.47-1.04,1.04-1.04s1.04,0.47,1.04,1.04v1.46h-2.08V10.79z"/>
                    </svg>
            </div>
                        Firmen-Alarm</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</div>

<script class="mf-header__vm" type="application/json">{"navigationTargetUrl":"","loginButton":{"targetUrl":""},"registerLink":{"targetUrl":""},"headerAppearance":{"transparent":false,"white":false,"minimal":false},"activeMenuItem":{"jobs":false,"companies":false,"cv":false,"center":false,"hr":false},"application":false,"user":{"firstName":"","lastName":"","email":"","profileImageUrl":""},"sendEventOnNavigationItemClick":false,"status":{"loggedIn":false,"loading":false},"notifications":{"cv":false,"applications":false,"messages":false,"alarm":false,"jobs":false,"companies":false},"tracking":{"ga":["default"],"gtm":false},"baseUrl":"http:\\/\\/127.0.0.1:6111"}</script>

    <script src="http://127.0.0.1:6111/assets/index.js" defer></script>`;

export const scripts = [{ src: 'http://127.0.0.1:6111/dev/assets/index.js' }];
