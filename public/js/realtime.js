const eventSource = new EventSource('/events');

eventSource.onmessage = function(event) {
    const message = JSON.parse(event.data);
    if (message.type === 'prediction') {
        updatePredictions(message.data);
    }
};

function updatePredictions(predictions) {
    const predictionList = document.getElementById('predictionList');
    predictionList.innerHTML = '';
    predictions.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card p-3';
        card.id = 'block_item1';
        card.innerHTML = `
            <div draggable="false">
                <div class="row">
                    <div class="col">
                        <div class="row">
                            <div class="col">
                                <i class="fa-brands fa-product-hunt" id="icon_P1"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col" id="data_T">
                        <span style="color: #1E9168; font-size: 25px; font-weight: 700;">
                            ${product.NameProduct}
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-end" id="data_b">
                        <span style="color: #777; font-size: 25px; font-weight: 700;">
                            ${product.predicted_sales} ชิ้น
                        </span>
                    </div>
                </div>
            </div>
        `;
        predictionList.appendChild(card);
    });
}
