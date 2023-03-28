import {
    ref,
    computed,
} from 'vue';
import {
    useResourceEndpointGetListReactive,
} from './resource-endpoint';

import * as softSkillsService from '../services/soft-skills';
import {
    useState,
} from './vuex-helpers';

const softSkillGroupsDescriptionName = [
    { id: 1, label: 'Persönliche Kompetenz' },
    { id: 2, label: 'Soziale Kompetenz' },
    { id: 3, label: 'Führungskompetenz' },
    { id: 4, label: 'Methodische Kompetenz' },
    { id: 5, label: 'Werte' },
];

export function useSoftSkills() {
    const params = ref(undefined);
    const {
        data,
    } = useResourceEndpointGetListReactive({
        endpoint: softSkillsService.getList,
        params,
        type: softSkillsService.TYPE,
        requestKey: `GET|${softSkillsService.baseUrl}`,
    });

    // All existing groups
    const softSkillGroups = computed(() => data.value || []);
    const { rows: activeSoftSkills } = useState('profile/softSkill');

    const activeSoftSkillsInGroup = ({ items }) => {
        const ids = (activeSoftSkills.value ?? []).reduce((acc, cur) => {
            acc.push(parseInt(cur.personalityTraitId, 10));
            return acc;
        }, []);

        return items.filter(item => ids.includes(parseInt(item.id, 10)));
    };

    const getSoftSkillGroupDescriptionName = softSkillGroupId => softSkillGroupsDescriptionName
        .find(item => item.id === parseInt(softSkillGroupId, 10)).label ?? '';

    const hasActiveSoftSkillsInGroup = group => activeSoftSkillsInGroup(group).length > 0;

    const emptySoftSkillGroupsCount = computed(() => softSkillGroups.value.length
            - softSkillGroups.value.filter(group => hasActiveSoftSkillsInGroup(group)).length);

    const hasEmptySoftSkillGroups = computed(() => emptySoftSkillGroupsCount.value > 0);

    return {
        softSkillGroups,
        activeSoftSkills,
        activeSoftSkillsInGroup,
        getSoftSkillGroupDescriptionName,
        emptySoftSkillGroupsCount,
        hasActiveSoftSkillsInGroup,
        hasEmptySoftSkillGroups,
    };
}
