<script setup>

const props = defineProps({
    settings: {
        type: Object,
        required: true,
    },
    currentSettings: {
        type: Object,
    },
    isThumbnail: {
        type: Boolean,
    },
});

const getPreviewImage = () => {
    if (props.currentSettings && props.currentSettings.template === props.settings.key) {
        /* eslint-disable max-len */
        /* eslint-disable import/no-dynamic-require, global-require */ /* istanbul ignore next: Hard to test – tested in acceptance tests. */
        return require(`../../../assets/img/cv-templates/${props.currentSettings.template}/${props.currentSettings.color}-${props.currentSettings.font}.png`);
    }

    if (props.isThumbnail) {
        /* eslint-disable import/no-dynamic-require, global-require */ /* istanbul ignore next: Hard to test – tested in acceptance tests. */
        return require(`../../../assets/img/cv-templates/thumbnails/${props.settings.key}.png`);
    }

    const color = props.settings.colors.find(x => x.default).id;
    const font = props.settings.fonts.find(x => x.default).id;
    /* eslint-disable max-len, import/no-dynamic-require, global-require */
    return require(`../../../assets/img/cv-templates/${props.settings.key}/${color}-${font}.png`);
};
</script>

<template>
    <img
        v-if="settings"
        alt="Lebenslauf"
        :src="getPreviewImage()"
    >
</template>
