async function loadData() {
    const res = await fetch('./acts-24-11-14.txt');
    const text = await res.text();
    let acts = text.split('\n');
    acts.forEach((line, i) => {
        acts[i] = line.split(' ');
    });
    const actsIsolated = acts.map(line => {
        lineIsolated = line.map(word => {
            return word.split('-')[1];
        });
        return lineIsolated;
    });
    topLevelCount = counter(acts.flat());
    topLevelIsolatedCount = counter(actsIsolated.flat());
    return [acts, topLevelCount, topLevelIsolatedCount];
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
    if (speakerSelects[l].value == 'any') {
        query.push(`U-${actSelects[l].value}`);
        query.push(`A-${actSelects[l].value}`);
    }
    else {
        query.push(`${speakerSelects[l].value}-${actSelects[l].value}`);
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
    count = Object.entries(count);
    count.sort((a, b) => b[1] - a[1]);
    count.forEach(item => {
        item.push(item[1] / sum * 100);
    });
    return count;
}

function getResultItem(l, act, count, percentage, highlight) {
    const div = document.createElement('div');
    div.classList.add('result-item');
    if (highlight) {
        div.classList.add('highlight');
    }
    const p1 = document.createElement('p');
    p1.dataset.layer = l;
    p1.textContent = act;
    div.appendChild(p1);

    const p2 = document.createElement('p');
    p2.textContent = `${count} (${percentage.toFixed(2)}%)`;
    div.appendChild(p2);

    return [div, p1];
}

function analyze() {
    resultsDivs.forEach(div => {
        div.innerHTML = '';
    });

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
        counts.push(counter(results[l]));
    }

    let tc, tcSelected;
    if (speakerSelects[0].value == 'any') {
        tc = topLevelIsolatedCount;
        tcSelected = tc.filter(item => queries[0].includes(`U-${item[0]}`));
    }
    else {
        tc = topLevelCount;
        tcSelected = tc.filter(item => queries[0].includes(item[0]));
    }

    tcSelected.forEach(item => {
        let [div, p1] = getResultItem(0, item[0], item[1], item[2], true);
        if (speakerSelects[0].value == 'any') {
            p1.addEventListener('click', (e) => {
                actSelects[0].value = e.target.textContent;
                analyze();
            });
        } else {
            p1.addEventListener('click', (e) => {
                speakerSelects[0].value = e.target.textContent.split('-')[0];
                actSelects[0].value = e.target.textContent.split('-')[1];
                analyze();
            });
        }
        resultsDivs[resultsDivs.length - 1].appendChild(div);
    });

    tc.forEach(item => {
        if (!tcSelected.includes(item)) {
            let [div, p1] = getResultItem(0, item[0], item[1], item[2], false);
            if (speakerSelects[0].value == 'any') {
                p1.addEventListener('click', (e) => {
                    actSelects[0].value = e.target.textContent;
                    analyze();
                });
            } else {
                p1.addEventListener('click', (e) => {
                    speakerSelects[0].value = e.target.textContent.split('-')[0];
                    actSelects[0].value = e.target.textContent.split('-')[1];
                    analyze();
                });
            }
            resultsDivs[resultsDivs.length - 1].appendChild(div);
        }
    });

    for (let l = 0; l <= max_l; l++) {
        counts[l].forEach(item => {
            let highlight = l < max_l && queries[l+1].includes(item[0]);
            let [div, p1] = getResultItem(l, item[0], item[1], item[2], highlight);
            if (l < 2) {
                p1.addEventListener('click', (e) => {
                    targetLayer = parseInt(e.target.dataset.layer);
                    if (targetLayer >= max_l) {
                        actToggles[targetLayer].checked = true;
                        speakerSelects[targetLayer + 1].disabled = false;
                        actSelects[targetLayer + 1].disabled = false;
                        max_l = targetLayer + 1;
                    }
                    let [speaker, act] = e.target.textContent.split('-');
                    speakerSelects[targetLayer + 1].value = speaker;
                    actSelects[targetLayer + 1].value = act;
                    analyze();
                });
            }

            resultsDivs[l].appendChild(div);
        });
    }
}

const speakerSelects = [
    document.getElementById('speaker1'),
    document.getElementById('speaker2'),
    document.getElementById('speaker3')
];

speakerSelects.forEach(select => {
    select.addEventListener('change', () => {
        analyze();
    });
});

const actSelects = [
    document.getElementById('act1'),
    document.getElementById('act2'),
    document.getElementById('act3')
];

actSelects.forEach(select => {
    select.addEventListener('change', () => {
        analyze();
    });
});

const resultsDivs = [
    document.getElementById('results1'),
    document.getElementById('results2'),
    document.getElementById('results3'),
    document.getElementById('results-first-col')
];

let max_l = 0;
const actToggles = [
    document.getElementById('toggle-act-2'),
    document.getElementById('toggle-act-3')
];

actToggles[0].addEventListener('click', () => {
    speakerSelects[1].disabled = !actToggles[0].checked;
    actSelects[1].disabled = !actToggles[0].checked;
    if (!actToggles[0].checked && actToggles[1].checked) {
        actToggles[1].checked = false;
        speakerSelects[2].disabled = !actToggles[0].checked;
        actSelects[2].disabled = !actToggles[0].checked;
    }
    max_l = actToggles[0].checked ? 1 : 0;
});

actToggles[1].addEventListener('click', () => {
    speakerSelects[2].disabled = !actToggles[1].checked;
    actSelects[2].disabled = !actToggles[1].checked;
    if (actToggles[1].checked && !actToggles[0].checked) {
        actToggles[0].checked = true;
        speakerSelects[1].disabled = !actToggles[0].checked;
        actSelects[1].disabled = !actToggles[0].checked;
    }
    max_l = actToggles[1].checked ? 2 : 1;
});

document.getElementById('reset-button').addEventListener('click', () => {
    speakerSelects[0].value = 'any';
    actSelects[0].value = '';
    for (let i = 0; i <= 3; i++) {
        resultsDivs[i].innerHTML = '';
        if (i > 0 && i <= 2) {
            speakerSelects[i].disabled = true;
            speakerSelects[i].value = 'any';
            actSelects[i].disabled = true;
            actSelects[i].value = 'apologize';
            actToggles[i - 1].checked = false;
        }
        max_l = 0;
    }
});

let acts, topLevelCount, topLevelIsolatedCount;
async function init() {
    [acts, topLevelCount, topLevelIsolatedCount] = await loadData();
}

init();