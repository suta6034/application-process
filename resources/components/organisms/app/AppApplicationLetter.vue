<script setup>
import {
    computed,
} from 'vue';
import {
    formatDate,
} from '../../../utils/filter';
import {
    CATEGORIES,
} from '../../../utils/tracking';
import AppDivider from '../../atoms/app/AppDivider';
import AppIcon from '../../atoms/app/AppIcon';
import AppProfileImage from '../../molecules/app/AppProfileImage';
import FormAttachmentList from '../../molecules/form/FormAttachmentList';
import TextHeadline from '../../atoms/text/TextHeadline';
import {
    splitByLinebreaks,
} from '../../../utils/html';
import {
    useTrackClick,
} from '../../../composables/track-click';

const props = defineProps({
    application: {
        default: () => {},
        type: Object,
    },
});

const { trackClick } = useTrackClick(CATEGORIES.page.applications);

const paragraphs = computed(() => splitByLinebreaks(props.application.message));
const hasBrokenAttachments = computed(() => {
    if (props.application.attachments?.length === 0) {
        return false;
    }
    return props.application.attachments?.filter(file => file.url).length === 0;
});
</script>

<template>
    <div class="c-appApplicationLetter">
        <div
            v-if="application.company?.isChiffre && application.isRejected"
            data-qa="rejected message"
        >
            <div class="c-appApplicationLetter__rejectionMessage">
                <div class="c-appApplicationLetter__header">
                    <div class="c-appApplicationLetter__headerItem">
                        <div class="c-appProfileImage c-appProfileImage--roundSmall">
                            <img
                                src="../../../assets/img/logo-gross.companysquare.gif"
                                class="c-appProfileImage__image c-appProfileImage__round"
                                alt="karriere.at"
                                data-qa="image"
                            >
                        </div>
                        <div class="c-appApplicationLetter__headline">
                            <TextHeadline
                                :level="4"
                                bold
                            >
                                karriere.at Team
                            </TextHeadline>
                            <p class="c-appApplicationLetter__subHeadline">
                                An {{ application.firstname }} {{ application.surname }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="c-appApplicationLetter__message">
                    <p class="c-appApplicationLetter__messageParagraph">
                        Sehr geehrte Bewerber*in,
                    </p>
                    <p class="c-appApplicationLetter__messageParagraph">
                        Vielen Dank für deine Bewerbung und das damit verbundene Interesse
                        an der Position {{ application.jobTitle }}!
                    </p>
                    <p class="c-appApplicationLetter__messageParagraph">
                        Für diese Position eines verdeckten Arbeitgebers sind eine Vielzahl an Bewerbungen eingegangen,
                        die wir an die ausschreibende Kund*in weitergeleitet haben.
                        Diese*r hat zwischenzeitlich eine Vorauswahl getroffen.
                    </p>
                    <p class="c-appApplicationLetter__messageParagraph">
                        Leider müssen wir dir heute im Auftrag des ausschreibenden Unternehmens mitteilen,
                        dass unsere Kund*in bei der Besetzung der vakanten Stelle andere Bewerber*innen in die
                        engere Wahl genommen hat, die den spezifischen Vorstellungen und Anforderungen in ganz
                        besonderem Maße entsprechen.
                        Wir bitten um Verständnis für diese Entscheidung.
                    </p>
                    <p class="c-appApplicationLetter__messageParagraph">
                        Wir bedanken uns, dass du bei deiner Jobsuche auf karriere.at vertraust und
                        wünschen dir weiterhin viel Erfolg bei der Karriereplanung!
                    </p>
                    <p class="c-appApplicationLetter__messageParagraph">
                        Mit freundlichen Grüßen
                    </p>
                    <p class="c-appApplicationLetter__messageParagraph">
                        Dein karriere.at Team
                    </p>
                </div>
            </div>
            <AppDivider class="c-appApplicationLetter__divider"/>
        </div>
        <div class="c-appApplicationLetter__header">
            <div class="c-appApplicationLetter__headerItem">
                <AppProfileImage
                    round-small
                    placeholder-without-effects
                    class="c-appApplicationLetter__profileImage"
                />
                <div class="c-appApplicationLetter__headline">
                    <TextHeadline
                        :level="4"
                        bold
                    >
                        {{ application.firstname }} {{ application.surname }}
                    </TextHeadline>
                    <p class="c-appApplicationLetter__subHeadline">
                        An {{ application.companyName }}
                    </p>
                </div>
            </div>
            <p class="c-appApplicationLetter__date c-appApplicationLetter__hideMobile">
                {{ formatDate({
                    date: application.createDate,
                    format: `d.m.Y${application.isManual ? `` : `, h:i`}`,
                }) }}
            </p>
        </div>
        <div class="c-appApplicationLetter__message">
            <p
                v-for="(paragraph, index) in paragraphs"
                :key="index"
            >
                {{ paragraph }}
                <br v-if="paragraph.length === 0">
            </p>
        </div>
        <div
            v-if="hasBrokenAttachments"
            class="c-appApplicationLetter__attachmentError"
        >
            <AppIcon
                name="circle-exclamationmark"
                size="l"
                class="c-appApplicationLetter__errorIcon"
            />Anhänge können im Moment nicht geladen werden
        </div>
        <FormAttachmentList
            v-else-if="application.attachments &&
                Object.keys(application.attachments).length > 0"
            :files="[...application.attachments]"
            is-downloadable
            class="c-appApplicationLetter__attachmentList"
            data-qa="file list"
            @delete="trackClick('profile-list-document-delete')"
            @preview="trackClick('profile-list-document-show')"
            @download="trackClick('profile-list-document-download')"
        />
    </div>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/typo';
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '../../../assets/scss/settings/breakpoint';

// 1. Giving it more height makes it look like it's aligned with applicant's name. align-items: start would mess it up.
// 2. Optical fix.
.c-appApplicationLetter {
    $root: &;

    width: 100%;

    &__hideMobile {
        display: none;

        @media (min-width: $k-breakpoint--m) {
            display: inline;
        }
    }

    &__profileImage {
        flex-shrink: 0;
    }

    &__header,
    &__headerItem {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    &__headline {
        margin-left: $k-spacing--m;
    }

    &__subHeadline,
    &__date {
        color: $k-color-gray--500;
    }

    &__date {
        height: 3em; // 1
    }

    &__message,
    &__attachmentList,
    &__attachmentError {
        margin-top: $k-spacing--2xl;
    }

    &__attachmentError {
        color: $k-color-gray--500;
    }

    &__errorIcon {
        margin-top: -1px; // 2
        margin-right: $k-spacing--s;
    }

    &__rejectionMessage {
        padding-top: $k-spacing--xl;
        padding-right: $k-spacing--xl;
        padding-bottom: $k-spacing--2xl;
        padding-left: $k-spacing--xl;
        background: $k-color-gray--50;
    }

    &__messageParagraph {
        &:not(:first-child) {
            margin-top: $k-spacing--m;
        }
    }

    &__divider {
        margin-top: $k-spacing--2xl;
        margin-bottom: $k-spacing--2xl;
    }
}
</style>
