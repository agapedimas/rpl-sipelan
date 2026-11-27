class Model {
    #rawObject;

    /**
     * Convert plain object into model instance.
     * @template T
     * @param {Object} object
     * @returns {T}
     */
    static objectToModel(object) {
        if (object == null || typeof object !== "object")
            throw new TypeError("Object must be a valid object.");

        const constructor = this.toString();
        const parameters = constructor
            .match(/constructor\s*\(([^)]*)\)/)
            ?.[1]
            ?.split(",")
            .map(parameter => parameter.trim());

        if (parameters == null)
            throw new TypeError("Cannot identify constructor parameters of " + this.name + ".");

        const argumentsList = parameters.map(parameter => object[parameter]);
        const model = new this(...argumentsList);
        model.#rawObject = object;

        return model;
    }

    /**
     * Convert model instance into plain object
     * @returns { Object }
     */
    modelToObject() {
        const prototype = Object.getPrototypeOf(this);
        const properties = Object.getOwnPropertyDescriptors(prototype);
        return Object.fromEntries(
            Object.entries(properties)
                .filter(([key, descriptor]) => typeof descriptor.get === "function")
                .map(([key, descriptor]) => [key, descriptor.get.call(this)])
        );
    }

    toJSON() {
        return this.modelToObject();
    }
}
module.exports = Model;