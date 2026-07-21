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

// For HTML display
const listDives = (arr) => typeof arr === 'string' ? generatedDives : "<ol>"
    + (arr.map(dive => `<li>${dive.join(', ')}</li>`)).join('')
    + "</ol>";

const divesAsImages = (arr) => typeof arr === 'string' ? '' : (arr.map(dive =>
        `<div>${dive.map(point => `<img src="${imagePaths[point]}" class="diagram" alt="${point}">`).join('')}</div>`
    )).join('');

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
    let dives = [];
    let exits = new Set();
    // Flat set is faster traversal than a nested object of {from: set() // to)} for such a small set
    let transitions = new Set();
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
        newDive.forEach((point, i) => transitions.add(transitionKey(point, newDive[(i + 1) % newDive.length])));
    }

    return dives;
};
