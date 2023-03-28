<script setup>
import {
    ref,
} from 'vue';
import AppIcon from '../../atoms/app/AppIcon';

defineProps({
    variant: {
        type: String,
        default: 'full',
    },
    transparent: {
        type: Boolean,
        default: false,
    },
});

const activeHeader = ref(null);

function toggleActiveHeader(index) {
    activeHeader.value = activeHeader.value === index ? null : index;
}
</script>

<template>
    <div
        :class="{
            [`c-appFooter--${variant}`]: variant,
            [`c-appFooter--transparent`]: transparent
        }"
        class="c-appFooter"
    >
        <div class="c-appFooter__wrap">
            <div
                v-if="variant === 'full'"
                class="c-appFooter__row"
            >
                <div
                    :class="{ 'is-open': activeHeader === 0 }"
                    class="c-appFooter__container"
                    data-qa="container"
                >
                    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                    <h3
                        class="c-appFooter__group-header"
                        data-qa="group header"
                        @click="toggleActiveHeader(0)"
                    >
                        Über karriere.at
                        <div class="c-appFooter__group-header-icon">
                            <AppIcon
                                name="arrow-down"
                                size="s"
                            />
                        </div>
                    </h3>
                    <ul class="c-appFooter__list c-appFooter__list--no-border">
                        <li class="c-appFooter__item">
                            <a
                                title="Über karriere.at"
                                class="c-appFooter__link"
                                href="/ueber-uns"
                            >
                                Über uns
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Jobs bei karriere.at"
                                class="c-appFooter__link"
                                href="/ueber-uns/jobs-bei-karriere-at"
                            >
                                Jobs bei karriere.at
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Presse"
                                class="c-appFooter__link"
                                href="/presse"
                            >
                                Presse
                            </a>
                        </li>
                    </ul>
                    <ul class="c-appFooter__list">
                        <li class="c-appFooter__item">
                            <a
                                title="Mobile App"
                                class="c-appFooter__link"
                                href="/mobileapp"
                            >
                                Mobile App
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Blog & Tipps"
                                class="c-appFooter__link"
                                href="https://www.karriere.at/blog/"
                            >
                                Blog &amp; Tipps
                            </a>
                        </li>
                    </ul>
                </div>

                <div
                    :class="{ 'is-open': activeHeader === 1 }"
                    class="c-appFooter__container"
                >
                    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                    <h3
                        class="c-appFooter__group-header"
                        @click="toggleActiveHeader(1)"
                    >
                        Für Arbeitgeber
                        <div class="c-appFooter__group-header-icon">
                            <AppIcon
                                name="arrow-down"
                                size="s"
                            />
                        </div>
                    </h3>
                    <ul class="c-appFooter__list">
                        <li class="c-appFooter__item">
                            <a
                                title="Produkte &amp; Preise"
                                class="c-appFooter__link"
                                href="https://www.karriere.at/hr/"
                            >
                                Produkte &amp; Preise
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Mediadaten"
                                class="c-appFooter__link"
                                href="https://www.karriere.at/hr/warum-karriereat"
                            >
                                Mediadaten
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Inserat schalten"
                                class="c-appFooter__link"
                                href="https://www.karriere.at/hr/stelleninserate"
                            >
                                Inserat schalten
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Talentsuche"
                                class="c-appFooter__link"
                                href="https://www.karriere.at/hr/talent-cloud"
                            >
                                Talentsuche
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Employer Branding"
                                class="c-appFooter__link"
                                href="https://www.karriere.at/hr/branding-solution"
                            >
                                Employer Branding
                            </a>
                        </li>
                    </ul>
                </div>

                <div
                    :class="{ 'is-open': activeHeader === 2 }"
                    class="c-appFooter__container"
                >
                    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                    <h3
                        class="c-appFooter__group-header"
                        @click="toggleActiveHeader(2)"
                    >
                        Partner und Portale
                        <div class="c-appFooter__group-header-icon">
                            <AppIcon
                                name="arrow-down"
                                size="s"
                            />
                        </div>
                    </h3>
                    <ul class="c-appFooter__list">
                        <li class="c-appFooter__item">
                            <a
                                title="itstellen.at"
                                class="c-appFooter__link"
                                href="https://www.itstellen.at/"
                                rel="noopener"
                            >
                                itstellen.at
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="techtalents.at"
                                class="c-appFooter__link"
                                href="https://www.techtalents.at/"
                                rel="noopener"
                            >
                                techtalents.at
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="financejobs.at"
                                class="c-appFooter__link"
                                href="https://www.financejobs.at/"
                                rel="noopener"
                            >
                                financejobs.at
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="salescareer.at"
                                class="c-appFooter__link"
                                href="https://www.salescareer.at/"
                                rel="noopener"
                            >
                                salescareer.at
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="jobs.at"
                                class="c-appFooter__link"
                                href="https://www.jobs.at/"
                                rel="noopener"
                            >
                                jobs.at
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="hokify"
                                class="c-appFooter__link"
                                href="https://hokify.at/"
                                rel="noopener"
                            >
                                hokify
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="eRecruiter"
                                class="c-appFooter__link"
                                href="https://www.erecruiter.net/"
                                rel="noopener"
                            >
                                eRecruiter
                            </a>
                        </li>
                    </ul>
                </div>

                <div
                    :class="{ 'is-open': activeHeader === 3 }"
                    class="c-appFooter__container"
                >
                    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
                    <h3
                        class="c-appFooter__group-header"
                        @click="toggleActiveHeader(3)"
                    >
                        Mein Profil
                        <div class="c-appFooter__group-header-icon">
                            <AppIcon
                                name="arrow-down"
                                size="s"
                            />
                        </div>
                    </h3>
                    <ul class="c-appFooter__list">
                        <li class="c-appFooter__item">
                            <a
                                title="Lebenslauf"
                                class="c-appFooter__link"
                                href="/profil/lebenslauf"
                            >
                                Lebenslauf
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Job-Alarm"
                                class="c-appFooter__link"
                                href="/jobalarm"
                            >
                                Job-Alarm
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Merkliste"
                                class="c-appFooter__link"
                                href="/watchlist"
                            >
                                Merkliste
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Firmen-Alarm"
                                class="c-appFooter__link"
                                href="/companyalarm"
                            >
                                Firmen-Alarm
                            </a>
                        </li>
                        <li class="c-appFooter__item">
                            <a
                                title="Job-Empfehlungen"
                                class="c-appFooter__link"
                                href="/matching"
                            >
                                Job-Empfehlungen
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                v-if="variant === 'full'"
                class="c-appFooter__social-media-container"
            >
                <ul class="c-appFooter__social-list">
                    <li class="c-appFooter__social-item">
                        <a
                            title="Facebook"
                            aria-label="zum Facebook Profil von karriere.at"
                            class="
                                c-appFooter__social-icon
                                c-appFooter__social-link
                                c-appFooter__social-link--facebook
                            "
                            href="https://www.facebook.com/karriere.at"
                            target="_blank"
                            rel="noopener"
                        >
                            <AppIcon
                                name="social-media-facebook"
                                size="xl"
                            />
                        </a>
                    </li>
                    <li class="c-appFooter__social-item">
                        <a
                            title="Instagram"
                            aria-label="zum Instagram Profil von karriere.at"
                            class="
                                c-appFooter__social-icon
                                c-appFooter__social-link
                                c-appFooter__social-link--instagram
                            "
                            href="https://www.instagram.com/karriere.at/"
                            target="_blank"
                            rel="noopener"
                        >
                            <AppIcon
                                name="social-media-instagram"
                                size="xl"
                            />
                        </a>
                    </li>
                    <li class="c-appFooter__social-item">
                        <a
                            title="Twitter"
                            aria-label="zum Twitter Profil von karriere.at"
                            class="
                                c-appFooter__social-icon
                                c-appFooter__social-link
                                c-appFooter__social-link--twitter
                            "
                            href="https://twitter.com/karriere_at"
                            target="_blank"
                            rel="noopener"
                        >
                            <AppIcon
                                name="social-media-twitter"
                                size="xl"
                            />
                        </a>
                    </li>
                    <li class="c-appFooter__social-item">
                        <a
                            title="YouTube"
                            aria-label="zum YouTube Kanal von karriere.at"
                            class="
                                c-appFooter__social-icon
                                c-appFooter__social-link
                                c-appFooter__social-link--youtube
                            "
                            href="https://www.youtube.com/user/karriereatchannel"
                            target="_blank"
                            rel="noopener"
                        >
                            <AppIcon
                                name="social-media-youtube"
                                size="xl"
                            />
                        </a>
                    </li>
                    <li class="c-appFooter__social-item">
                        <a
                            title="Pinterest"
                            aria-label="zum Pinterest Board von karriere.at"
                            class="
                                c-appFooter__social-icon
                                c-appFooter__social-link
                                c-appFooter__social-link--pinterest
                            "
                            href="https://www.pinterest.at/karriereat/"
                            target="_blank"
                            rel="noopener"
                        >
                            <AppIcon
                                name="social-media-pinterest"
                                size="xl"
                            />
                        </a>
                    </li>
                </ul>
            </div>

            <div class="c-appFooter__subline">
                <ul class="c-appFooter__subline-link-list">
                    <li class="c-appFooter__subline-item">
                        <a
                            title="Häufige Fragen"
                            class="c-appFooter__link"
                            href="/lp/faqs"
                        >
                            Häufige Fragen
                        </a>
                    </li>
                    <li class="c-appFooter__subline-item">
                        <a
                            title="Impressum &amp; Kontakt"
                            class="c-appFooter__link"
                            href="/impressum"
                        >
                            Impressum &amp; Kontakt
                        </a>
                    </li>
                    <li class="c-appFooter__subline-item">
                        <a
                            title="AGB"
                            class="c-appFooter__link"
                            href="/agb"
                        >
                            AGB
                        </a>
                    </li>
                </ul>
                <ul class="c-appFooter__subline-par">
                    <li class="c-appFooter__subline-item">
                        <a
                            title="Datenschutz"
                            class="c-appFooter__link"
                            href="/datenschutzerklaerung"
                        >
                            Datenschutz
                        </a>
                    </li>
                    <li class="c-appFooter__subline-item">
                        &copy; {{ (new Date()).getFullYear() }}
                        <a
                            title="karriere.at"
                            class="c-appFooter__link"
                            href="/"
                        >
                            karriere.at
                        </a>
                        GmbH
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use 'sass:math';

@import '~@karriereat/global-styles/scss/tools/typo';
@import '~@karriereat/global-styles/scss/components/link/mixins';
@import '../../../assets/scss/settings/breakpoint';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/font-size';
@import '../../../assets/scss/tools/wrap';

// TODO: Refactoring needed, nesting and descending
// specificity should not be necessary.
// stylelint-disable max-nesting-depth, no-descending-specificity
.c-appFooter {
    $root: &;

    background: $k-color-gray--50;

    @media (min-width: $k-breakpoint--m) {
        padding-top: $k-spacing--xl;
        padding-bottom: $k-spacing--xl;
    }

    @media print {
        display: none;
    }

    &--full {
        @media (min-width: $k-breakpoint--m) {
            padding-top: $k-spacing--3xl;
            padding-bottom: $k-spacing--2xl;
        }
    }

    &--minimal {
        #{$root}__subline {
            text-align: center;
        }

        #{$root}__subline-item {
            &:last-child {
                margin-right: 0;
            }
        }

        #{$root}__subline-link-list,
        #{$root}__subline-par {
            display: block;
        }

        #{$root}__subline-par {
            margin-top: $k-spacing--s;
        }
    }

    &--transparent {
        background: transparent;
    }

    &--center {
        text-align: center;
    }

    &__wrap {
        @media (min-width: $k-breakpoint--m) {
            @include wrap;
        }
    }

    &__item {
        padding: $k-spacing--xs $k-spacing--l;

        @media (min-width: $k-breakpoint--m) {
            margin-bottom: $k-spacing--s;
            padding: 0;
        }
    }

    &__row {
        display: flex;
        flex-wrap: wrap;
    }

    &__container {
        width: 100%;

        @media (min-width: $k-breakpoint--m) {
            width: 25%;
        }

        &.is-open {
            .c-appFooter__list {
                display: block;
                padding-bottom: $k-spacing--l;
                border-bottom: 1px solid $k-color-gray--200;

                &--no-border {
                    padding-bottom: 0;
                    border-bottom: 0;
                }

                @media (min-width: $k-breakpoint--m) {
                    padding-bottom: 0;
                    border-bottom: 0;
                }
            }

            .c-appFooter__group-header-icon {
                transform: rotate(180deg);
            }

            .c-appFooter__group-header {
                border-bottom: 0;
                border-bottom-color: $k-color-gray--200;
            }
        }
    }

    &__group-header {
        position: relative;
        padding: $k-spacing--m $k-spacing--l;
        border-bottom: 1px solid $k-color-gray--200;
        cursor: pointer;

        @media (min-width: $k-breakpoint--m) {
            margin-bottom: $k-spacing--m;
            padding: 0;
            border-bottom: 0;
            cursor: default;
        }
    }

    &__group-header-icon {
        position: absolute;
        top: 50%;
        right: $k-spacing--xl;
        margin-top: - math.div($k-spacing--xl, 2);

        @media (min-width: $k-breakpoint--m) {
            display: none;
        }
    }

    &__list {
        display: none;
        list-style-type: none;

        @media (min-width: $k-breakpoint--m) {
            display: block;
            margin-bottom: $k-spacing--l;
        }
    }

    &__link {
        @include k-c-link($k-color-gray--600, $k-c-link-color, $k-color-gray--600);
    }

    &__social-media-item {
        display: inline-block;
        margin-right: $k-spacing--m;
    }

    &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        margin: 0 auto;
        width: 42px;
        height: 42px;
        border-radius: 42px;
        background: $k-color-white;
    }

    &__subline {
        padding-top: $k-spacing--xl;
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            padding-top: 0;
            text-align: left;
        }
    }

    &__subline-par {
        padding-bottom: $k-spacing--2xl;
        color: $k-color-gray--500;

        @media (min-width: $k-breakpoint--m) {
            display: inline-block;
            margin-right: $k-spacing--m;
            padding-bottom: 0;
            width: auto;
        }
    }

    &__subline-link-list {
        margin-bottom: $k-spacing--s;

        @media (min-width: $k-breakpoint--m) {
            display: inline-block;
            margin-bottom: 0;
        }
    }

    &__subline-item {
        display: inline-block;
        margin-right: $k-spacing--m;

        @media (min-width: $k-breakpoint--m) {
            margin-right: $k-spacing--l;
        }
    }

    &__social-media-container {
        margin-bottom: -$k-spacing--s;
        padding-top: $k-spacing--2xl;
        padding-bottom: 0;
        text-align: center;

        @media (min-width: $k-breakpoint--m) {
            margin-bottom: $k-spacing--l;
            text-align: left;
        }
    }

    &__social-list {
        display: inline-block;
    }

    &__social-item {
        display: inline-block;
        margin-right: $k-spacing--m;
    }

    &__social-link {
        @include k-c-link($k-color-gray--500, $k-c-link-color-hover, $k-color-gray--500);

        &--facebook {
            &:hover {
                color: $k-color-social-facebook;
            }
        }

        &--instagram {
            &:hover {
                color: $k-color-social-instagram;
            }
        }

        &--youtube {
            &:hover {
                color: $k-color-social-youtube;
            }
        }

        &--twitter {
            &:hover {
                color: $k-color-social-twitter;
            }
        }

        &--pinterest {
            &:hover {
                color: $k-color-social-pinterest;
            }
        }
    }
}
// stylelint-enable
</style>
