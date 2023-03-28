export class Location {
    constructor({
        street = '',
        zip = null,
        town = '',
        state = {},
        country = {},
    }) {
        this.street = street;
        this.zip = zip;
        this.town = town.label || town;
        this.state = state.id;
        this.stateLabel = state.label;
        this.country = country.id;
        this.countryLabel = country.label;
    }
}

export function createLocation(data = {}) {
    return new Location(data);
}
