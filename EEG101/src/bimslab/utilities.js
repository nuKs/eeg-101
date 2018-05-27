const executeAtTimeOfDay = (hour, minute, callback) => {
    // Find out when to send the callback.
    let now = new Date();
    let millisLeft = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        0,
        0
    ) - now;
    if (millisLeft < 0) {
        // We're past 9PM, set 9PM for tommorow
        millisLeft += 86400000;
    }

    // Trigger callback every days.
    setTimeout(() => {
        // Trigger callback.
        callback();

        // Trigger the function recursively once executed for the next day.
        // Make sure we don't retrigger the method directly (shouldn't be 
        // required, here for safety).
        setTimeout(function() {
            executeAtTimeOfDay(hour, minute, callback);
        }, 2 * 60 * 60 * 1000); // arbitrarily set the trigger back two hours later

    }, millisLeft);
};

export { executeAtTimeOfDay };