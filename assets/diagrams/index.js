// Populated using FSCards by the sync-fscards GitHub Action
const CLASSES = {
    '4-way': [
        {key: 'rookie', label: 'Rookie', blocks: []},
        {key: 'beginner', label: 'Beginner', blocks: [1, 2, 4, 6, 7, 9, 13, 21]},
        {key: 'intermediate', label: 'Intermediate', blocks: [1, 2, 4, 6, 7, 8, 9, 11, 13, 14, 15, 18, 19, 20, 21, 22]},
        {key: 'open', label: 'Adv. / Open'},
        {key: 'cism', label: 'CISM', randoms: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], blocks: [1, 2, 14, 16, 17, 18, 19, 22]},
    ],
    '8-way': [
        {key: 'intermediate', label: 'Intermediate', blocks: [1, 3, 4, 5, 6, 7, 8, 10, 13, 14, 16, 17, 18, 19, 21]},
        {key: 'open', label: 'Adv. / Open'},
    ],
};

const IMAGE_SETS = {
    '4-way': ['Rhythm', 'USPA', 'Axis', 'FAI'],
    '8-way': ['Rhythm', 'USPA', 'Axis', 'FAI'],
};

// Only 8-way has a separate indoor pool
const INDOOR_IMAGES = {
    Rhythm: {13: 'Rhythm/13_indoor.webp', 17: 'Rhythm/17_indoor.webp', 20: 'Rhythm/20_indoor.webp'},
    USPA: {13: 'FAI/13_indoor.webp', 17: 'FAI/17_indoor.webp', 20: 'FAI/20_indoor.webp'},
    Axis: {13: 'Axis/13_indoor.webp', 17: 'Axis/17_indoor.webp', 20: 'Axis/20_indoor.webp'},
    FAI: {13: 'FAI/13_indoor.webp', 17: 'FAI/17_indoor.webp', 20: 'FAI/20_indoor.webp'},
};
