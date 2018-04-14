import Worker from './network.worker.js';
const colorHelper = require('./colorHelper');
let batchCount = 0;

const appendPrediction = (input, target, predicted, cost) => {
    input = 'rgb(' + input.join(',') + ')';
    target = 'rgb(' + target.join(',') + ')';
    predicted = 'rgb('+ predicted.join(',')+')';

    const predictionHTML = `<tr>
        <td>${batchCount}</td>
        <td class="box" style="background-color: ${input}">${input}</td>
        <td class="box" style="background-color: ${target}">${target}</td>
        <td class="box" style="background-color: ${predicted}">${predicted}</td>
        <td>${cost}</td>
    </tr>`;

    const tbody = document.getElementById('predictionBody');
    tbody.insertAdjacentHTML( 'beforeend', predictionHTML);
};

if (window.Worker) {
    let stopTraining;
    const worker = new Worker();
    const inputColor = [222, 165, 255];

    document.getElementById("start").onclick = function() {
        worker.postMessage([true, inputColor]);
        stopTraining = false;
    };

    document.getElementById("stop").onclick = function() {
        stopTraining = true;
    };

    worker.onmessage = function (e) {
        let inputColor = e.data.input;
        const prediction = e.data.prediction;
        const cost = e.data.cost;
        appendPrediction(inputColor, colorHelper.computeComplementaryColor(inputColor), prediction, cost);

        window.scrollTo(0, window.scrollMaxY);

        if (batchCount < 1000 && !stopTraining) {
            batchCount = batchCount + 25;
            worker.postMessage([false, inputColor]);
        }
    };
}


