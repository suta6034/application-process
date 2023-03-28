export const TERM_OF_NOTICE_OPTIONS = [
    {
        id: 0,
        label: 'Keine Angabe',
        value: 0,
    },
    {
        id: 1,
        label: 'Ab sofort',
        value: 1,
    },
    {
        id: 2,
        label: 'In 1 Monat',
        value: 2,
    },
    {
        id: 3,
        label: 'In 2 Monaten',
        value: 3,
    },
    {
        id: 4,
        label: 'In 3 Monaten',
        value: 4,
    },
    {
        id: 5,
        label: 'In 4 Monaten',
        value: 5,
    },
    {
        id: 6,
        label: 'In 5 Monaten',
        value: 6,
    },
    {
        id: 7,
        label: 'In 6 Monaten',
        value: 7,
    },
    {
        id: 8,
        label: '> 6 Monate',
        value: 8,
    },
];

const UP_TO_FIVE_DAYS = [
    {
        id: 0,
        label: '0 Tage',
        value: 0,
    },
    {
        id: 1,
        label: '1 Tag',
        value: 1,
    },
    {
        id: 2,
        label: '2 Tage',
        value: 2,
    },
    {
        id: 3,
        label: '3 Tage',
        value: 3,
    },
    {
        id: 4,
        label: '4 Tage',
        value: 4,
    },
    {
        id: 5,
        label: '5 Tage',
        value: 5,
    },
];

export const WORKFROMHOME_OPTIONS = [...UP_TO_FIVE_DAYS];
export const TRAVEL_READINESS_OPTIONS = [...UP_TO_FIVE_DAYS];

export class DesiredJob {
    constructor({
        locations = [],
        travelReadiness = {},
        workFromHome = {},
        migrate = 0,
        termOfNotice = 0,
        salary = 0,
        objectives = [],
        employment = [],
        jobFields = [],
        branches = [],
    }) {
        this.locations = locations;
        this.travelReadiness = travelReadiness.value;
        this.workFromHome = workFromHome.value;
        this.migrate = migrate;
        this.termOfNotice = termOfNotice.value || 0;
        this.salary = salary;
        this.objectives = objectives;
        this.employment = employment;
        this.jobFields = jobFields;
        this.branches = branches;
    }
}

export function createDesiredJob(data = {}) {
    return new DesiredJob(data);
}
