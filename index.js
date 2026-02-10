const randoms = [
    'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H',
    'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q',
];

const blocks = Array.from({length: 22}, (_, i) => i + 1);

const main = (
    dives = 10,
    minPoints = 3,
) => {
    const ret = [[]];

    let pool = [...randoms, ...blocks];
    let curPoints = 0;

    while (true) {
        const randomPoint = pool[Math.floor(Math.random() * pool.length)];

        curPoints = curPoints + (Number.isInteger(randomPoint) ? 2 : 1); // 1 point for randoms, 2 for blocks
        ret[0].push(randomPoint); // Add to latest dive-flow

        if (curPoints >= minPoints) {
            if (ret.length >= dives) return ret;

            curPoints = 0; // Reset points
            ret.unshift([]); // Add empty dive-flow to start
        }

    }
};

console.log(main());
