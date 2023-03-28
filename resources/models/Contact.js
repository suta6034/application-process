export class Contact {
    constructor({ email, mobile, web }) {
        this.email = email;
        this.mobile = mobile;
        this.web = web;
    }
}

export function createContact(data = {}) {
    return new Contact(data);
}
