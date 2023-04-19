class Dummy {
    constructor(name, id) {
        this.id = id;
        this.name = name;
    }

    id;
    name;

    static validateName(dummy) {
        if (typeof dummy.name !== 'string') {
            throw new Error(`dummy name must be a string! Invalid value: ${dummy.name}`);
        }
    }

    static validateId(dummy) {
        if (typeof dummy.id !== 'number') {
            throw new Error(`dummy id must be a number! Invalid value: ${dummy.id}`)
        }
    }
}

export default Dummy;