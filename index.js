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

const isFilled = (point) => point !== '';

const divePoints = (dive) => dive.filter(isFilled).reduce((sum, point) => sum + pointValue(point), 0);

const transitionKey = (from, to) => `${from}>${to}`;

// The last formation loops back to the start, so a dive's transitions wrap (using remainder to loop)
const diveTransitions = (dive) => dive.map((point, i) => transitionKey(point, dive[(i + 1) % dive.length]));

/** HTML display **/
const listDives = (dives, slots = 5, locked) => {
    if (typeof dives === 'string') return dives; // Exit early if it's an error string

    // Real text so manual copying picks up trailing comma and single space (hidden if neighbor empty)
    const SEPARATOR = '<span class="sep">,<span class="pad"> </span></span>';

    // Create empty slots for user to fill-in
    const paddedDive = (dive) => Array.from({length: slots}, (_, i) => dive[i] ?? '');

    const slotHTML = (point, isLocked) => `<span class="slot"><span class="cell${isLocked ? ' locked' : ''}">${point}</span>${SEPARATOR}</span>`;
    const rowHTML = (dive, i) => `<li>${paddedDive(dive).map((point, j) => slotHTML(point, locked && isFilled(locked[i][j]))).join('')}</li>`;

    return `<ol>${dives.map(rowHTML).join('')}</ol>`;
};

const divesAsImages = (dives) => {
    if (typeof dives === 'string') return ''; // Exit early if it's an error string

    const imageHTML = (point) => `<img src="${imagePaths[point]}" alt="${point}">`;
    const imageRowHTML = (points) => `<div data-draw="${points.join(' - ')}">${points.map(imageHTML).join('')}</div>`;

    // Filters out invalid formations
    return dives.map(dive => imageRowHTML(dive.filter(point => imagePaths[point]))).join('');
};

// Plain text for the clipboard, without hidden commas
const divesAsText = (dives) => {
    if (typeof dives === 'string') return dives; // Exit early if it's an error string

    return dives.map(dive => dive.join(", ")).join("\n");
};

// Rule violations per cell and per dive, for the edit mode highlighting and tooltips
// Invalidation can only occur due to edit, so technically can be scoped to per-cell edit, instead of against the
//  whole dive each edit. However, it's an unnecessary optimization and headache to manage while still adding features
const validateDraw = (dives, {
    minPoints = 3,
    uniqueExits = false,
    uniqueTransitions = false,
    useRandoms = true,
    useBlocks = true,
    classRandoms = randoms,
    classBlocks = blocks,
    classLabel, // Needed for the validation tooltip
}) => {
    const exits = new Map();
    const transitions = new Map();

    const tally = (counts, key) => counts.set(key, (counts.get(key) ?? 0) + 1);

    // Tally up each dive's exit and transitions
    // Done up front instead of during the invalidation check, so it doesn't have to backtrack for matching invalidation
    dives.forEach(dive => {
        if (uniqueExits && dive.length) tally(exits, dive[0]);
        if (uniqueTransitions && dive.length > 1) diveTransitions(dive).forEach(key => tally(transitions, key));
    });

    // Invalidate cells (and their matching pair if appropriate)
    return dives.map(dive => { // For each dive (row):
        let curPoints = 0;

        const cells = dive.map((point, i) => { // For each point (cell):
            const brokenRule = (curPoints >= minPoints && 'Dive already has too many points') // Point cap first, as resolving it may also solve the other rules
                || (!randoms.includes(point) && !blocks.includes(point) && 'Invalid formation') // Not in any pool
                || (!classRandoms.includes(point) && !classBlocks.includes(point) && `Not in the ${classLabel} pool`) // If outside of dive pool
                || (!useRandoms && randoms.includes(point) && 'Randoms are excluded')
                || (!useBlocks && blocks.includes(point) && 'Blocks are excluded')
                || (dive.indexOf(point) !== dive.lastIndexOf(point) && 'Repeated in this dive') // If formation occurs multiple times in the same dive
                || (uniqueExits && !i && exits.get(point) > 1 && 'Repeated exit') // Check exits
                || (uniqueTransitions && dive.length > 1 && transitions.get(transitionKey(dive.at(i - 1), point)) > 1 && 'Repeated transition'); // Check transitions

            // Count total points (to prevent too few points)
            curPoints += pointValue(point); // Cannot increment first, since generation stops after satisfying min point

            return brokenRule;
        });

        return {
            cells, // Mark invalid cells
            invalid: curPoints < minPoints || cells.some(Boolean), // Mark row as invalid
            shortRow: curPoints < minPoints && `Too few points (${curPoints})`, // If row needs a tooltip
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
    classRandoms = randoms,
    classBlocks = blocks,
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
                    ...useRandoms ? classRandoms : [],
                    ...useBlocks ? classBlocks : [],
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

// Fill the free slots around the locked slots
// TODO: Review AI-generated fillAroundLocks()
const fillAroundLocks = ({
    numDives = 10,
    minPoints = 3,
    uniqueExits = false,
    uniqueTransitions = false,
    useRandoms = true,
    useBlocks = true,
    classRandoms = randoms,
    classBlocks = blocks,
    locked,
}) => {
    // Fewest formations a dive can use to reach minPoints (used for uniqueTransitions error)
    const minFormations = useBlocks ? Math.ceil(minPoints / 2) : minPoints;
    const MAX_ATTEMPTS = 100; // Before succumbing to a rule break
    const fullPool = [
        ...useRandoms ? classRandoms : [],
        ...useBlocks ? classBlocks : [],
    ];

    if (uniqueExits && fullPool.length < numDives) return 'Number of dives exceeds the amount of unique exits';
    if (uniqueTransitions && numDives * minFormations > fullPool.length * (fullPool.length - 1))
        return 'Number of dives exceeds the amount of unique transitions';

    // Transitions already decided: touching neighbors, or the whole loop once the dive is complete
    const settledTransitions = (dive, complete) => complete
        ? diveTransitions(dive.filter(isFilled))
        : dive.slice(1).flatMap((point, i) => isFilled(dive[i]) && isFilled(point) ? [transitionKey(dive[i], point)] : []);

    const lockedPoints = locked.flat();

    // What the locks decide counts as used from the start, so earlier dives avoid it too
    const lockedExits = [];
    const lockedTransitions = [];
    locked.forEach(dive => {
        const complete = divePoints(dive) >= minPoints;
        if (complete || isFilled(dive[0])) lockedExits.push(dive.find(isFilled));
        lockedTransitions.push(...settledTransitions(dive, complete));
    });

    // One pass over the draw, which gives up at a dead end unless a slot may break a rule instead
    const fillOnce = (allowBrokenRule) => {
        const dives = [];
        const exits = new Set(lockedExits);
        const transitions = new Set(lockedTransitions);
        let pool = fullPool.filter(point => !lockedPoints.includes(point)); // Locked values count as already dealt

        for (const lockedDive of locked) {
            const dive = [...lockedDive];
            let curPoints = divePoints(dive); // Locked points count first

            // Free slots fill left to right only while the dive is short, so the rest stay empty
            for (let slot = 0; slot < dive.length && curPoints < minPoints; slot++) {
                if (isFilled(dive[slot])) continue;

                // Fill empty pool
                if (!pool.length) pool = [...fullPool];

                // Points before the last locked cell stay under minPoints, so that cell stays within the point cap
                const lastLockedSlot = dive.findLastIndex(isFilled);
                const pointLimit = lastLockedSlot > slot ? minPoints - divePoints(dive.slice(0, lastLockedSlot)) : Infinity;

                const settled = settledTransitions(dive, false);
                const newTransitions = (point) => settledTransitions(dive.with(slot, point), curPoints + pointValue(point) >= minPoints)
                    .filter(transition => !settled.includes(transition));

                const fits = (point) => !dive.includes(point) // If point has already been used in this dive
                    && pointValue(point) < pointLimit // If it would push the last locked cell over the point cap
                    && !(uniqueExits && !slot && exits.has(point)) // If exit has already been used
                    && !(uniqueTransitions && newTransitions(point).some(transition => transitions.has(transition))); // If a transition it decides has already been used

                // Deal one that fits, else repeat a dealt one that fits
                let choices = pool.filter(fits);
                if (!choices.length) choices = fullPool.filter(fits);
                if (!choices.length) {
                    if (!allowBrokenRule) return; // Dead end
                    choices = fullPool.filter(point => !dive.includes(point));
                }

                const [randomPoint] = randomItem(choices);
                pool = pool.filter(point => point !== randomPoint);
                dive[slot] = randomPoint;
                curPoints += pointValue(randomPoint);
            }

            const formations = dive.filter(isFilled);

            // Add exit
            exits.add(formations[0]);

            // Add transitions
            diveTransitions(formations).forEach(transition => transitions.add(transition));

            dives.push(dive);
        }

        return dives;
    };

    // Retry until MAX_ATTEMPTS before accepting rule breaks
    for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
        const dives = fillOnce(false);
        if (dives) return dives;
    }
    return fillOnce(true);
};
