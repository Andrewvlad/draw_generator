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
    '16-way': [
    ],
    '4-way-vfs': [
        {key: 'intermediate', label: 'Intermediate', randoms: ['A', 'B', 'E', 'J', 'L'], blocks: [1, 2, 3, 7, 8, 12, 13, 14, 21, 22]},
        {key: 'advanced', label: 'Advanced', randoms: ['A', 'B', 'C', 'E', 'J', 'K', 'L', 'Q'], blocks: [1, 2, 3, 4, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 20, 21, 22]},
        {key: 'open', label: 'Open'},
    ],
    '2-way-mfs': [
        {key: 'intermediate', label: 'Intermediate', randoms: ['D', 'G', 'H', 'J', 'K', 'L', 'M', 'Q'], blocks: [5, 6, 7, 8, 10, 17, 20, 22]},
        {key: 'advanced', label: 'Advanced', randoms: ['B', 'C', 'D', 'E', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'Q'], blocks: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20, 21, 22]},
        {key: 'open', label: 'Open'},
    ],
};

const IMAGE_SETS = {
    '4-way': ['Rhythm', 'USPA', 'Axis', 'FAI'],
    '8-way': ['Rhythm', 'USPA', 'Axis', 'FAI'],
    '16-way': ['USPA', 'Axis'],
    '4-way-vfs': ['USPA', 'Axis'],
    '2-way-mfs': ['USPA', 'Axis'],
};

// Only 8-way has a separate indoor pool
const INDOOR_IMAGES = {
    Rhythm: {13: 'Rhythm/13_indoor.webp', 17: 'Rhythm/17_indoor.webp', 20: 'Rhythm/20_indoor.webp'},
    USPA: {13: 'FAI/13_indoor.webp', 17: 'FAI/17_indoor.webp', 20: 'FAI/20_indoor.webp'},
    Axis: {13: 'Axis/13_indoor.webp', 17: 'Axis/17_indoor.webp', 20: 'Axis/20_indoor.webp'},
    FAI: {13: 'FAI/13_indoor.webp', 17: 'FAI/17_indoor.webp', 20: 'FAI/20_indoor.webp'},
};
