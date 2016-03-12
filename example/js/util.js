import $ from "jquery";

// serializes a form into an object and coerces values into numbers
export const serializeForm = function(selector) {
    const map = {};

    $(selector).serializeArray().forEach(function(input) {
        map[input.name] = Number(input.value);
    });

    return map;
};
