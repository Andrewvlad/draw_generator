const randoms = [
    'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H',
    'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q',
];

const blocks = Array.from({length: 22}, (_, i) => i + 1);

// Pop a random value from the array
const randomItem = (arr) => arr.splice(Math.floor(Math.random() * arr.length), 1);

// For HTML display
const listDives = (arr) => "<ol>"
    + (arr.map((dive) => `<li>${dive.join(', ')}</li>`)).join('')
    + "</ol>";

const main = ({
    numDives = 10,
    minPoints = 3,
    uniqueExits = false,
    useRandoms = true,
    useBlocks = true,
}) => {
    let dives = [];
    let exits = new Set();
    let pool = [];

    while (dives.length < numDives) {
        let curPoints = 0;
        let newDive = [];

        while (curPoints < minPoints) {
            // Restart if it is impossible to use a unique exit
            if (uniqueExits && !newDive.length && pool.length && exits.isSupersetOf(new Set(pool))) {
                dives = [];
                pool = [];
                newDive = [];
                curPoints = 0;
                exits = new Set();
            }

            // Fill empty pool
            if (!pool.length) {
                pool = [
                    ...useRandoms ? randoms : [],
                    ...useBlocks ? blocks : [],
                ];
                if (uniqueExits && pool.length < numDives) return "Number of dives exceeds the amount of unique exits";
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

            // Add exit
            if (!newDive.length) exits.add(randomPoint);

            newDive.push(randomPoint);
            curPoints = curPoints + (Number.isInteger(randomPoint) ? 2 : 1); // 1 point for randoms, 2 for blocks
        }

        dives.push(newDive);
    }

    return listDives(dives);
};
