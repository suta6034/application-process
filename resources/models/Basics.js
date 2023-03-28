export class ProfileBasics {
    constructor({
        salutation,
        title,
        firstname,
        surname,
        suffix,
        nationality,
        birthdate,
        location,
        contact,
    }) {
        this.salutation = salutation?.id || '';
        this.title = title;
        this.firstname = firstname;
        this.surname = surname;
        this.suffix = suffix;
        this.nationality = nationality;
        this.birthdate = birthdate;
        this.location = location;
        this.contact = contact;
    }
}

export function createProfileBasics(data = {}) {
    return new ProfileBasics(data);
}
