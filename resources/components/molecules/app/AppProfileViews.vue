<script setup>
import {
    computed,
} from 'vue';
import {
    useState,
} from '../../../composables/vuex-helpers';
import AppCupcake from '../../atoms/app/AppCupcake';
import AppIcon from '../../atoms/app/AppIcon';
import AppLink from '../../atoms/app/AppLink';
import SkeletonBox from '../../atoms/skeleton/SkeletonBox';

const props = defineProps({
    total: {
        type: Number,
    },
    isLoading: {
        type: Boolean,
    },
    profileViews: {
        type: Array,
    },
});

const {
    active: profileActive,
} = useState('profile');

const hasProfileViews = computed(() => !!props.profileViews?.length);
</script>

<template>
    <AppCupcake class="c-appProfileViews">
        <template #cherry>
            <ul
                v-if="isLoading"
                class="k-c-pearls"
            >
                <li
                    v-for="n in 4"
                    :key="n"
                    class="k-c-pearls__pearl"
                >
                    <SkeletonBox
                        width="2.875em"
                        height="2.875em"
                        data-qa="skeleton box"
                    />
                </li>
            </ul>
            <router-link
                v-else-if="hasProfileViews"
                :to="{ name: 'page-views' }"
            >
                <ul class="k-c-pearls">
                    <li
                        v-for="profileView in profileViews"
                        :key="profileView.id"
                        :class="{ 'c-appProfileViews__placeholder': !profileView.company.logoSquare }"
                        class="k-c-pearls__pearl"
                        data-qa="company"
                    >
                        <img
                            v-if="profileView.company.logoSquare"
                            :src="profileView.company.logoSquare"
                            :alt="profileView.company.name"
                            data-qa="company logo"
                        >
                        <AppIcon
                            v-else
                            name="company"
                            size="xl"
                            data-qa="company fallback logo"
                        />
                    </li>
                    <li
                        v-if="total > 3"
                        class="c-appProfileViews__additionalViews k-c-pearls__pearl k-c-pearls__pearl--shine"
                        data-qa="additional profile views counter"
                    >
                        <span class="c-appProfileViews__additionalViewsCount">
                            +{{ total - 3 }}
                        </span>
                    </li>
                </ul>
            </router-link>
            <ul
                v-else
                data-qa="empty state"
                class="k-c-pearls"
            >
                <li
                    v-for="n in 3"
                    :key="n"
                    class="c-appProfileViews__placeholder k-c-pearls__pearl k-c-pearls__pearl--shine"
                >
                    <AppIcon
                        name="company"
                        size="xl"
                    />
                </li>
                <li
                    class="c-appProfileViews__additionalViews k-c-pearls__pearl k-c-pearls__pearl--shine"
                    data-qa="additional profile views counter"
                >
                    <span class="c-appProfileViews__additionalViewsCount">
                        +0
                    </span>
                </li>
            </ul>
        </template>
        <p
            v-if="profileActive && hasProfileViews"
            data-qa="active has profile views text"
        >
            Dein Lebenslauf weckt Interesse!
            <AppLink
                :to="{ name: 'page-cv' }"
                data-qa="edit cv link"
            >
                Aktualisiere deinen Lebenslauf
            </AppLink>
            regelmäßig, um von mehr Firmen gefunden zu werden.
        </p>
        <p
            v-else-if="hasProfileViews"
            data-qa="inactive has profile views text"
        >
            Möchtest du wieder von Firmen gefunden werden? Lebenslauf
            <AppLink
                :to="{ name: 'page-visibility-form' }"
                data-qa="change visibility link"
                data-gtm-element="DB: Profile Views"
                data-gtm-element-detail="Activate Profile"
            >
                sichtbar schalten.
            </AppLink>
        </p>
        <p
            v-else-if="profileActive"
            data-qa="active has no profile views text"
        >
            <AppLink
                :to="{ name: 'page-cv' }"
                secondary
                data-qa="edit cv link"
                data-gtm-element="DB: Profile Views"
                data-gtm-element-detail="Update Profile"
            >
                Aktualisiere deinen Lebenslauf
            </AppLink>
            regelmäßig, um von mehr Firmen gefunden zu werden.
        </p>
        <p
            v-else
            data-qa="inactive has no profile views text"
        >
            Möchtest du von Firmen gefunden werden? Lebenslauf
            <AppLink
                :to="{ name: 'page-visibility-form' }"
                data-qa="change visibility link"
            >
                sichtbar schalten.
            </AppLink>
        </p>
    </AppCupcake>
</template>

<style lang="scss">
@import '../../../assets/scss/settings/color';
@import '../../../assets/scss/settings/spacing';
@import '~@karriereat/global-styles/scss/tools/typo';

.c-appProfileViews {
    &__additionalViews,
    &__placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__placeholder {
        background-color: $k-color-gray--100;
        color: $k-color-gray--300;
    }

    &__additionalViews {
        background-color: $k-color-gray--100;
        color: $k-color-gray--600;
    }

    &__addtitionalViewsCount {
        @include k-typo-s;
    }
}
</style>
