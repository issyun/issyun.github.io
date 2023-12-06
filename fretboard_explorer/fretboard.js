let tuning = [5, 10, 3, 8, 12, 5];
let isSharp = true;
let showDegree = false;
let displayRoot = 'undefined';
let displayChord = 'undefined';
let tuningMode = 1;

const fretValues = [
    [],
    [],
    [],
    [],
    [],
    []
];

const fretNotes = [
    [],
    [],
    [],
    [],
    [],
    []
]

let selectedFrets = [
    [],
    [],
    [],
    [],
    [],
    []
];

let chordValue = [];
let chordDegrees = [];
let chordTones = [];
const displayNotes = [];

const toggleSharp = document.querySelector('#toggle-sharp');
const toggleFlat = document.querySelector('#toggle-flat');
const toggleNote = document.querySelector('#toggle-note');
const toggleDegree = document.querySelector('#toggle-degree');
const rootSelect = document.querySelector('#root-select');
const chordSelect = document.querySelector('#chordtype-select');

const popupBG = document.querySelector('.popup-bg');
const toggleStandard = document.querySelector('#toggle-tuning-standard');
const toggleDrop = document.querySelector('#toggle-tuning-drop');
const toggleCustom = document.querySelector('#toggle-tuning-custom');
const tuningSelects = [];
for (let i = 0; i < 6; i++) {
    tuningSelects[i] = document.querySelector(`#string${i+1}-select`);
}

rootSelect.addEventListener('change', calculateChord);
chordSelect.addEventListener('change', calculateChord);
document.querySelector('#button-clear').addEventListener('click', () => {
    displayRoot = 'undefined';
    rootSelect.value = 'undefined';
    displayChord = 'undefined';
    chordSelect.value = 'undefined';
    clearSelection();
});

updateFrets(isSharp);

function updateFrets(isSharp) {
    for (let string = 0; string < 6; string++) {
        for (fret = 0; fret < 23; fret++) {
            fretValues[string][fret] = ((tuning[string] + fret) > 12) ?
                (tuning[string] + fret) % 12 : tuning[string] + fret;
            if (fretValues[string][fret] === 0) { fretValues[string][fret] = 12; };
            document.querySelector(`#fret${string + 1}-${fret}`).textContent = noteName(fretValues[string][fret], isSharp);
        }
    }
}

function calculateChord() {
    if (rootSelect.value != 'undefined' && chordSelect.value != 'undefined') {
        displayRoot = Number(rootSelect.value);
        displayChord = chordSelect.value;
        switch (displayChord) {
            case 'single':
                chordValue = [0];
                chordDegrees = ['1'];
                break;
            case 'maj':
                chordValue = [0, 4, 7];
                chordDegrees = ['1', '3', '5'];
                break;
            case 'min':
                chordValue = [0, 3, 7];
                chordDegrees = ['1', '♭3', '5'];
                break;
            case 'dim':
                chordValue = [0, 3, 6];
                chordDegrees = ['1', '♭3', '♭5'];
                break;
            case 'aug':
                chordValue = [0, 4, 8];
                chordDegrees = ['1', '3', '♯5'];
                break;
            case 'maj7':
                chordValue = [0, 4, 7, 11];
                chordDegrees = ['1', '3', '5', '7'];
                break;
            case 'min7':
                chordValue = [0, 3, 7, 10];
                chordDegrees = ['1', '♭3', '5', '♭7'];
                break;
            case '7':
                chordValue = [0, 4, 7, 10];
                chordDegrees = ['1', '3', '5', '♭7'];
                break;
            case 'm7b5':
                chordValue = [0, 3, 6, 10];
                chordDegrees = ['1', '♭3', '♭5', '♭7'];
                break;
            case 'dim7':
                chordValue = [0, 3, 6, 9];
                chordDegrees = ['1', '♭3', '♭5', '♭♭7'];
                break;
            case 'aug7':
                chordValue = [0, 4, 8, 10];
                chordDegrees = ['1', '3', '♯5', '♭7'];
                break;
            case 'sus2':
                chordValue = [0, 2, 7];
                chordDegrees = ['1', '2', '5'];
                break;
            case 'sus4':
                chordValue = [0, 5, 7];
                chordDegrees = ['1', '4', '5'];
                break;
            case '5':
                chordValue = [0, 7];
                chordDegrees = ['1', '5'];
        }

        chordTones = [];
        for (let i = 0; i < chordValue.length; i++) {
            chordTones[i] = displayRoot + chordValue[i] > 12 ?
                (displayRoot + chordValue[i]) % 12 : displayRoot + chordValue[i];
        }

        clearSelection();
        displaySelection();
    }
}

function displaySelection() {
    for (let string = 0; string < 6; string++) {
        for (let fret = 0; fret < 22; fret++) {
            if (chordTones.includes(fretValues[string][fret])) {
                selectedFrets[string].push(fret);
                let fretElement = document.querySelector(`#fret${string + 1}-${fret}`);
                if (fretValues[string][fret] === chordTones[0]) {
                    fretElement.className = 'fretboard-note fretboard-note-root displayed';
                } else {
                    fretElement.className = 'fretboard-note displayed';
                }
                if (showDegree) {
                    fretElement.textContent = chordDegrees[chordTones.indexOf(fretValues[string][fret])];
                } else {
                    fretElement.textContent = noteName(fretValues[string][fret], isSharp);
                }
            }
        }
    }
}

function clearSelection() {
    for (let string = 0; string < 6; string++) {
        for (let fret of selectedFrets[string]) {
            let fretElement = document.querySelector(`#fret${string+1}-${fret}`);
            fretElement.className = 'fretboard-note';
            fretElement.textContent = noteName(fretValues[string][fret], isSharp);
        }
    }
    selectedFrets = [
        [],
        [],
        [],
        [],
        [],
        []
    ]
}

function noteName(int, isSharp) {
    switch (int) {
        case 1:
            return 'C';
        case 2:
            return (isSharp ? 'C♯' : 'D♭');
        case 3:
            return 'D';
        case 4:
            return (isSharp ? 'D♯' : 'E♭');
        case 5:
            return 'E';
        case 6:
            return 'F';
        case 7:
            return (isSharp ? 'F♯' : 'G♭');
        case 8:
            return 'G';
        case 9:
            return (isSharp ? 'G♯' : 'A♭');
        case 10:
            return 'A';
        case 11:
            return (isSharp ? 'A♯' : 'G♭');
        case 12:
            return 'B';
    }
}

function noteToNum(note) {
    switch (note) {
        case 'C':
            return 1;
        case 'C♯':
            return 2;
        case 'D♭':
            return 2;
        case 'D':
            return 3;
        case 'D♯':
            return 4;
        case 'E♭':
            return 4;
        case 'E':
            return 5;
        case 'F':
            return 6;
        case 'F♯':
            return 7;
        case 'G♭':
            return 7;
        case 'G':
            return 8;
        case 'G♯':
            return 9;
        case 'A♭':
            return 9;
        case 'A':
            return 10;
        case 'A♯':
            return 11;
        case 'B♭':
            return 11;
        case 'B':
            return 12;
    }
}

toggleSharp.addEventListener('click', () => {
    if (!isSharp) {
        isSharp = true;
        toggleSharp.className = 'toggle-button toggle-button-selected';
        toggleFlat.className = 'toggle-button';
        updateFrets(isSharp);
        displaySelection();
    }
});

toggleFlat.addEventListener('click', () => {
    if (isSharp) {
        isSharp = false;
        toggleFlat.className = 'toggle-button toggle-button-selected';
        toggleSharp.className = 'toggle-button';
        updateFrets(isSharp);
        displaySelection();
    }
});

toggleNote.addEventListener('click', () => {
    if (showDegree) {
        showDegree = false;
        toggleNote.className = 'toggle-button toggle-button-selected';
        toggleDegree.className = 'toggle-button';
        displaySelection();
    }
});

toggleDegree.addEventListener('click', () => {
    if (!showDegree) {
        showDegree = true;
        toggleDegree.className = 'toggle-button toggle-button-selected';
        toggleNote.className = 'toggle-button';
        displaySelection();
    }
});

// --- tuning toggles ---

document.querySelector('#fretboard-tuning').addEventListener('click', () => {
    popupBG.style.display = 'block';
});

toggleStandard.addEventListener('click', () => {
    if (tuningMode !== 1) {
        if (tuningMode === 3) {
            for (let select of tuningSelects) { select.disabled = true; }
        }
        tuningMode = 1;
        toggleStandard.className = 'toggle-button toggle-button-selected';
        toggleDrop.className = 'toggle-button';
        toggleCustom.className = 'toggle-button';
    }
});

toggleDrop.addEventListener('click', () => {
    if (tuningMode !== 2) {
        if (tuningMode === 3) {
            for (let select of tuningSelects) { select.disabled = true; }
        }
        tuningMode = 2;
        toggleDrop.className = 'toggle-button toggle-button-selected';
        toggleStandard.className = 'toggle-button';
        toggleCustom.className = 'toggle-button';
    }
});

toggleCustom.addEventListener('click', () => {
    if (tuningMode !== 3) {
        for (let select of tuningSelects) { select.disabled = false; }
        tuningMode = 3;
        toggleCustom.className = 'toggle-button toggle-button-selected';
        toggleStandard.className = 'toggle-button';
        toggleDrop.className = 'toggle-button';
    }
});

document.querySelector('#popup-ok').addEventListener('click', () => {
    switch (tuningMode) {
        case 1:
            tuning = [5, 10, 3, 8, 12, 5];
            break;
        case 2:
            tuning = [3, 10, 3, 8, 12, 5];
            break;
        case 3:
            for (let i = 0; i < 6; i++) { tuning[i] = tuningSelects[i].value; }
            break;
    }
    updateFrets();
    clearSelection();
    displaySelection();
    popupBG.style.display = 'none';
})

document.querySelector('#popup-cancel').addEventListener('click', () => {
    popupBG.style.display = 'none';
});