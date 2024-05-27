const socket = new WebSocket('ws://' + window.location.host);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const predictionList = document.querySelector('.carousel1');

    // Clear existing predictions
    predictionList.innerHTML = '';

    // Add new predictions
    data.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card p-3';
        productCard.id = 'block_item1';
        productCard.innerHTML = `
            <div draggable="false">
                <div class="row">
                    <div class="col">
                        <div class="row">
                            <div class="col">
                                <i class="fa-brands fa-product-hunt" id="icon_P1"></i>
                            </div>
                            <div class="col d-flex justify-content-end">
                                <i class="bi bi-plus-circle-fill" id="icon_add"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col" id="data_T">
                        <span style="color: #1E9168; font-size: 25px; font-weight: 700;">
                            ${product.NameProduct}
                        </span>
                        <p style="color: #777; font-size: 20px; font-weight: 300;">${product.predicted_sales} ชิ้น</p>
                    </div>
                </div>
            </div>
        `;
        predictionList.appendChild(productCard);
    });
};

// Send a message to the server to notify that the client is ready
socket.onopen = function() {
    socket.send('Client ready');
};
