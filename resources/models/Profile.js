export class Profile {
    constructor({
        awards = [],
        basics,
        blacklist,
        desiredJob,
        educations = [],
        flags = {
            isActive: false,
            hasWorkExperience: true,
            hasSeenBooster: false,
        },
        interests = [],
        languages = [],
        motivation = [],
        origin = '',
        profileText = '',
        projects = [],
        skills = [],
        softSkills = [],
        statement = '',
        trainings = [],
        work = [],
    }) {
        this.awards = awards;
        this.basics = basics;
        this.blacklist = blacklist;
        this.desiredJob = desiredJob;
        this.educations = educations;
        this.flags = flags;
        this.interests = interests;
        this.languages = languages;
        this.motivation = motivation;
        this.origin = origin;
        this.profileText = profileText;
        this.projects = projects;
        this.skills = skills;
        this.softSkills = softSkills;
        this.statement = statement;
        this.trainings = trainings;
        this.work = work;
    }
}

export function createProfile(data = {}) {
    return new Profile(data);
}
