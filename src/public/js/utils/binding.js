const objectBinding = new WeakMap();

// Allows element to update itself each time object's property updated
function addObjectBinding(object, propertyName, onchange) {
    let _value = object[propertyName];
    let binding = objectBinding.get(object);

    if (binding == null) {
       binding = {}
       objectBinding.set(object, binding);
    }

    Object.defineProperty(object, propertyName, {
        get() {
            return _value;
        },
        set(value) {
            _value = value;
            for (const bindingAction of binding[propertyName])
                bindingAction(value);
        }
    });

    if (binding[propertyName] == null)
        binding[propertyName] = [];

    binding[propertyName].push(onchange);
}