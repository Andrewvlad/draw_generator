const randoms = [
    'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H',
    'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q',
];

const blocks = Array.from({length: 22}, (_, i) => i + 1);

// Pop a random value from the array
const randomItem = (arr) => arr.splice(Math.floor(Math.random() * arr.length), 1);

const pointValue = (point) => Number.isInteger(point) ? 2 : 1;

const transitionKey = (from, to) => `${from}>${to}`;

// The last formation loops back to the start, so a dive's transitions wrap (using remainder to loop)
const diveTransitions = (dive) => dive.map((point, i) => transitionKey(point, dive[(i + 1) % dive.length]));

/** HTML display **/
const listDives = (dives, slots = 5) => {
    if (typeof dives === 'string') return dives; // Exit early if it's an error string

    // Real text so manual copying picks up trailing comma and single space (hidden if neighbor empty)
    const SEPARATOR = '<span class="sep">,<span class="pad"> </span></span>';

    // Create empty slots for user to fill-in
    const paddedDive = (dive) => Array.from({length: slots}, (_, i) => dive[i] ?? '');

    const slotHTML = (point) => `<span class="slot"><span class="cell">${point}</span>${SEPARATOR}</span>`;
    const rowHTML = (dive) => `<li>${paddedDive(dive).map(slotHTML).join('')}</li>`;

    return `<ol>${dives.map(rowHTML).join('')}</ol>`;
};

const divesAsImages = (dives) => {
    if (typeof dives === 'string') return ''; // Exit early if it's an error string

    // Filters out invalid images
    const imageHTML = (point, src = imagePaths[point]) => src && `<img src="${src}" alt="${point}">`;
    const imageRowHTML = (dive) => `<div>${dive.map(point => imageHTML(point)).join('')}</div>`;

    return dives.map(imageRowHTML).join('');
};

// Plain text for the clipboard, without hidden commas
const divesAsText = (dives) => {
    if (typeof dives === 'string') return dives; // Exit early if it's an error string

    return dives.map(dive => dive.join(", ")).join("\n");
};

// Rule violations per cell and per dive, for the edit mode highlighting
// Invalidation can only occur due to edit, so technically can be scoped to per-cell edit, instead of against the
//  whole dive each edit. However, it's an unnecessary optimization and headache to manage while still adding features
const validateDraw = (dives, {
    minPoints = 3,
    uniqueExits = false,
    uniqueTransitions = false,
    useRandoms = true,
    useBlocks = true,
}) => {
    const exits = new Map();
    const transitions = new Map();

    const tally = (counts, key) => counts.set(key, (counts.get(key) ?? 0) + 1);
    const inPool = (point) => (useRandoms && randoms.includes(point)) || (useBlocks && blocks.includes(point));

    // Tally up each dive's exit and transitions
    // Done up front instead of during the invalidation check, so it doesn't have to backtrack for matching invalidation
    dives.forEach(dive => {
        if (uniqueExits && dive.length) tally(exits, dive[0]);
        if (uniqueTransitions && dive.length > 1) diveTransitions(dive).forEach(key => tally(transitions, key));
    });

    // Invalidate cells (and their matching pair if appropriate)
    return dives.map(dive => { // For each dive:
        let curPoints = 0;

        const cells = dive.map((point, i) => { // For each point:
            const invalid = !inPool(point) // If outside of dive pool
                || dive.indexOf(point) !== dive.lastIndexOf(point) // If it occurs multiple times in the same dive
                || curPoints >= minPoints // Cell exceeds point cap
                || (uniqueExits && !i && exits.get(point) > 1) // Check exits (only if first point in the dive)
                // Check transitions
                || (uniqueTransitions && dive.length > 1 && transitions.get(transitionKey(dive.at(i - 1), point)) > 1);

            // Count total points (to prevent too few points)
            curPoints += pointValue(point); // Cannot increment first, since generation stops after satisfying min point

            return invalid;
        });

        return {
            cells, // Mark invalid cells
            invalid: curPoints < minPoints || cells.some(Boolean), // Mark invalid rows (also too few points)
        };
    });
};

const main = ({
    numDives = 10,
    minPoints = 3,
    uniqueExits = false,
    uniqueTransitions = false,
    useRandoms = true,
    useBlocks = true,
}) => {
    // Fewest formations a dive can use to reach minPoints (used for uniqueTransitions error)
    const minFormations = useBlocks ? Math.ceil(minPoints / 2) : minPoints;
    const MAX_RESTARTS = 100000;
    let dives = [];
    let exits = new Set();
    // Flat set is faster traversal than a nested object of {from: set() // to)} for such a small set
    let transitions = new Set();
    let restarts = 0;
    let pool = [];

    while (dives.length < numDives) {
        let curPoints = 0;
        let newDive = [];

        // A point completes the dive if it reaches minPoints, looping a wrap transition back to the exit
        const endsDive = (point) => curPoints + pointValue(point) >= minPoints;
        const transitionUsed = (point) => transitions.has(transitionKey(newDive.at(-1), point))
            || (endsDive(point) && transitions.has(transitionKey(point, newDive[0])));

        while (curPoints < minPoints) {
            // Restart if a unique exit or transition can no longer be placed
            const exitDeadlock = uniqueExits && !newDive.length && pool.length && pool.every(point => exits.has(point));
            const transitionDeadlock = uniqueTransitions && newDive.length && pool.length
                && pool.every(point => newDive.includes(point) || transitionUsed(point));
            if (exitDeadlock || transitionDeadlock) {
                if (restarts++ >= MAX_RESTARTS) return `Could not generate a random draw within ${MAX_RESTARTS} attempts that matches the uniqueness constraint(s)`;
                dives = [];
                pool = [];
                newDive = [];
                curPoints = 0;
                exits = new Set();
                transitions = new Set();
            }

            // Fill empty pool
            if (!pool.length) {
                pool = [
                    ...useRandoms ? randoms : [],
                    ...useBlocks ? blocks : [],
                ];
                if (uniqueExits && pool.length < numDives) return "Number of dives exceeds the amount of unique exits";
                if (uniqueTransitions && numDives * minFormations > pool.length * (pool.length - 1))
                    return "Number of dives exceeds the amount of unique transitions";
            }

            const [randomPoint] = randomItem(pool);

            // If exit has already been used
            if (uniqueExits && !newDive.length && exits.has(randomPoint)) {
                pool.push(randomPoint); // Return point back to the pool
                continue;
            }

            // If point has already been used in this dive
            if (newDive.includes(randomPoint)) {
                pool.push(randomPoint); // Return point back to the pool
                continue;
            }

            // If the transition into this point (or its wrap back to the exit) has already been used
            if (uniqueTransitions && newDive.length && transitionUsed(randomPoint)) {
                pool.push(randomPoint); // Return point back to the pool
                continue;
            }

            newDive.push(randomPoint);
            curPoints += pointValue(randomPoint);
        }

        // Add dive
        dives.push(newDive);

        // Add exit
        exits.add(newDive[0]);

        // Add transitions
        diveTransitions(newDive).forEach(transition => transitions.add(transition));
    }

    return dives;
};
