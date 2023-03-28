import {
    createNamespacedHelpers,
} from 'vuex';

import {
    apiErrorShouldBeReported,
} from '../../utils/api';
import {
    commitAndShowModal,
} from '../../utils/error';
import {
    HIDE_POPUP,
    SHOW_POPUP,
} from '../../store/mutation-types';
import * as gdpr from '../../services/gdpr';

const { mapMutations: mapPopupMutations } = createNamespacedHelpers('popup');

export default {
    props: {
        immediate: {
            default: false,
            type: Boolean,
        },
        type: {
            required: true,
            type: String,
        },
    },
    data() {
        return {
            generalInfo: null,
            specificInfos: [],
        };
    },
    computed: {
        isComingFromProfileCreate() {
            return Boolean(this.$route.query['first-activation']);
        },
    },
    created() {
        if (this.immediate) this.requireConsent();
    },
    methods: {
        ...mapPopupMutations({
            hidePopup: HIDE_POPUP,
            showPopup: SHOW_POPUP,
        }),
        async hasConsent() {
            try {
                await gdpr.check(this.type);
                return true;
            } catch (error) {
                if (apiErrorShouldBeReported(error)) {
                    throw error;
                }
                return false;
            }
        },
        async fetchInfo() {
            const response = await gdpr.info(this.type);
            this.specificInfos = gdpr.SPECIFIC_INFOS.reduce((prev, info) => {
                const text = response.data.data.attributes[info.key];
                if (text) prev.push({ ...info, text });
                return prev;
            }, []);
            this.generalInfo = response.data.data.attributes.generalInfo;
        },
        async requireConsent() {
            try {
                this.showProgressPopup();
                if (await this.hasConsent()) {
                    this.hidePopup();
                    return true;
                }
                await this.fetchInfo();
                this.hidePopup();
                // Wait for re-rendering after hiding the popup.
                await this.$nextTick();
                this.showModal();
            } catch (error) {
                // If the user comes directly from the process of profile creation,
                // no error will be shown because the user has no clue that we do want to activate it automatically.
                if (!this.isComingFromProfileCreate) {
                    commitAndShowModal(this.$store.commit, error);
                }
            }

            return false;
        },
        showModal() {
            this.showPopup({
                ariaLabel: 'Datenschutz',
                componentName: 'ModalGdpr',
                componentProps: {
                    consentType: this.type,
                    generalInfo: this.generalInfo,
                    specificInfos: this.specificInfos,
                },
                showCloseButton: false,
                type: 'modal',
            });
        },
        showProgressPopup() {
            this.showPopup({
                componentName: 'ProgressPopup',
                type: 'progress',
            });
        },
    },
    render() {
        return this.$scopedSlots.default && this.$scopedSlots.default({
            requireConsent: this.requireConsent,
        });
    },
};
