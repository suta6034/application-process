// https://github.com/facebook/jest/issues/2098
export default new class {
    store = {};

    setItem = (key, value) => {
        this.store[key] = value;
    };

    getItem = key => this.store[key];

    clear = () => {
        this.store = {};
    };
}();
