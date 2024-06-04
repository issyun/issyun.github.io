async function loadData() {
    const res = await fetch('./acts-24-06-04.txt');
    const text = await res.text();
    let acts = text.split('\n');
    acts.forEach((line, i) => {
        acts[i] = line.split(' ');
    });
    return acts;
}

function rCheckMatch(acts, i, j, queries, results, l, max_l) {
    if (queries[l].includes(acts[i][j]) && j < acts[i].length - 1) {
        results[l].push(acts[i][j + 1]);
        if (l < max_l) {
            rCheckMatch(acts, i, j + 1, queries, results, l + 1, max_l);
        }
    }
}

function getQuery(l) {
    let query = [];
    if (speakerSelect[l].value == 'any') {
        query.push(`U-${actSelect[l].value}`);
        query.push(`A-${actSelect[l].value}`);
    }
    else {
        query.push(`${speakerSelect[l].value}-${actSelect[l].value}`);
    }
    return query;
}

function counter(arr) {
    let count = {};
    let sum = 0;
    arr.forEach(item => {
        count[item] = (count[item] || 0) + 1;
        sum++;
    });
    return [count, sum];
}

async function analyze() {
    for (let l = 0; l <= 2; l++) {
        resultsDiv[l].innerHTML = '';
    }

    let queries = [];
    let results = [];
    for (let l = 0; l <= max_l; l++) {
        queries.push(getQuery(l));
        results.push([]);
    }

    for (let i = 0; i < acts.length; i++) {
        for (let j = 0; j < acts[i].length; j++) {
            rCheckMatch(acts, i, j, queries, results, 0, max_l);
        }
    }

    let counts = [];
    for (let l = 0; l <= max_l; l++) {
        let [count, sum] = counter(results[l]);
        count = Object.entries(count);
        count.sort((a, b) => b[1] - a[1]);
        count.forEach(item => {
            item.push(item[1] / sum * 100);
        });
        counts.push(count);
    }

    for (let l = 0; l <= max_l; l++) {
        resultsDiv[l].innerHTML = '';
        let firstCol = '';
        if (speakerSelect[0].value != 'any') {
            firstCol += `${speakerSelect[0].value}-`;
        }
        firstCol += `${actSelect[0].value}`;
        document.getElementById('results-first-col').textContent = firstCol;

        counts[l].forEach(item => {
            const div = document.createElement('div');
            div.classList.add('result-item');
            if (l < max_l && queries[l+1].includes(item[0])) {
                div.classList.add('highlight');
            }
            const p1 = document.createElement('p');
            p1.textContent = item[0];
            div.appendChild(p1);

            const p2 = document.createElement('p');
            p2.textContent = `${item[1]} (${item[2].toFixed(2)}%)`;
            div.appendChild(p2);

            resultsDiv[l].appendChild(div);
        });
    }
}

const speakerSelect = [
    document.getElementById('speaker1'),
    document.getElementById('speaker2'),
    document.getElementById('speaker3')
];

const actSelect = [
    document.getElementById('act1'),
    document.getElementById('act2'),
    document.getElementById('act3')
];

const resultsDiv = [
    document.getElementById('results1'),
    document.getElementById('results2'),
    document.getElementById('results3')
];

let max_l = 0;
const act2Toggle = document.getElementById('toggle-act-2');
const act3Toggle = document.getElementById('toggle-act-3');

act2Toggle.addEventListener('click', () => {
    speakerSelect[1].disabled = !act2Toggle.checked;
    actSelect[1].disabled = !act2Toggle.checked;
    if (!act2Toggle.checked && act3Toggle.checked) {
        act3Toggle.checked = false;
        speakerSelect[2].disabled = !act2Toggle.checked;
        actSelect[2].disabled = !act2Toggle.checked;
    }
    max_l = act2Toggle.checked ? 1 : 0;
});

act3Toggle.addEventListener('click', () => {
    speakerSelect[2].disabled = !act3Toggle.checked;
    actSelect[2].disabled = !act3Toggle.checked;
    if (act3Toggle.checked && !act2Toggle.checked) {
        act2Toggle.checked = true;
        speakerSelect[1].disabled = !act2Toggle.checked;
        actSelect[1].disabled = !act2Toggle.checked;
    }
    max_l = act3Toggle.checked ? 2 : 1;
});

document.getElementById('analyze-button').addEventListener('click', analyze);

let acts;
async function init() {
    acts = await loadData();
}

init();