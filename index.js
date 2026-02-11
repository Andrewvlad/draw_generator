const randoms = [
    'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H',
    'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q',
];

const blocks = Array.from({length: 22}, (_, i) => i + 1);

// Pop a random value from the array
const randomItem = (arr) => arr.splice(Math.floor(Math.random() * arr.length), 1);

const main = (
    dives = 10,
    minPoints = 3,
) => {
    const ret = [];

    let pool = [...randoms, ...blocks];

    while (ret.length < dives) {
        ret.unshift([]); // Add empty dive-flow to start
        let curPoints = 0;

        while (curPoints < minPoints) {
            if (!pool.length) { // Regenerate empty pool
                pool = [...randoms, ...blocks];
            }

            const [randomPoint] = randomItem(pool);

            if (!ret[0].includes(randomPoint)) { // Check if point already used within this dive
                ret[0].push(randomPoint); // Add point to latest dive-flow
                curPoints = curPoints + (Number.isInteger(randomPoint) ? 2 : 1); // 1 point for randoms, 2 for blocks
            } else {
                pool.push(randomPoint); // Add point back to the pool
            }
        }
    }

    return ret;
};
