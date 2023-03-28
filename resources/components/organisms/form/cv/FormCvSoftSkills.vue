<script setup>
import {
    inject,
} from 'vue';
import AppButton from '../../../atoms/app/AppButton';
import AppButtonGroup from '../../../molecules/app/AppButtonGroup';
import LayoutForm from '../../../layouts/LayoutForm';
import AppPill from '../../../atoms/app/AppPill';
import * as mutationTypes from '../../../../store/mutation-types';
import {
    useState,
} from '../../../../composables/vuex-helpers';
import {
    cvEditFormEvents, useCvEditForm,
} from '../../../../composables/cv-edit-form';

const store = inject('store');
const props = defineProps({
    items: {
        type: Array,
    },
});
const emit = defineEmits([...cvEditFormEvents]);

const {
    rows: softSkills,
} = useState('profile/softSkill');

const initSoftSkills = [...softSkills.value];

const {
    save,
    dirty,
    markAsDirty,
    cancel,
} = useCvEditForm(props, emit);

function idInStore(id) {
    const ids = softSkills.value.reduce((acc, cur) => {
        acc.push(parseInt(cur.personalityTraitId, 10));
        return acc;
    }, []);
    return ids.includes(parseInt(id, 10));
}

function toggleItem(item) {
    const findExistingSoftSkill = initSoftSkills
        .find(softSkill => parseInt(softSkill.personalityTraitId, 10) === parseInt(item.id, 10));

    const existingSoftSkillId = findExistingSoftSkill ? findExistingSoftSkill.id : null;

    store.commit(`profile/softSkill/${mutationTypes.UPDATE}`, {
        personalityTraitId: item.id,
        softSkillId: existingSoftSkillId,
    });
    markAsDirty();
}
</script>

<template>
    <LayoutForm
        ref="root"
        :inline="true"
        :full-page="false"
        class="c-formCvSoftSkills"
        @dirty="markAsDirty"
    >
        <div class="c-formCvSoftSkills__pillList">
            <AppPill
                v-for="item in items"
                :key="parseInt(item.id, 10)"
                :label="item.label"
                :outline="!idInStore(item.id)"
                class="c-formCvSoftSkills__pill"
                @click.native="toggleItem(item)"
            />
        </div>

        <template #actions>
            <AppButtonGroup variant="right">
                <AppButton
                    :disabled="!dirty"
                    data-qa="save button"
                    @click="save"
                >
                    Änderungen speichern
                </AppButton>
                <template #secondary>
                    <AppButton
                        data-qa="back link"
                        outline
                        @click="cancel"
                    >
                        Abbrechen
                    </AppButton>
                </template>
            </AppButtonGroup>
        </template>
    </LayoutForm>
</template>

<style lang="scss">
@import '~@karriereat/global-styles/scss/tools/layout';
@import '../../../../assets/scss/settings/spacing';
@import '../../../../assets/scss/settings/breakpoint';

.c-formCvSoftSkills {
    &__pillList {
        display: flex;
        column-gap: $k-spacing--xs;
        row-gap: $k-spacing--s;
        flex-wrap: wrap;
    }
}
</style>
