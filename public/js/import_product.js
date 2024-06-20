
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/productMappings');
        const productMappings = await response.json();

        const productRowsContainer = document.getElementById('product-rows');
        let index = 1;

        for (const productName in productMappings) {
            const row = document.createElement('div');
            row.className = 'row g-2 mt-5 mb-3';

            const productCol = document.createElement('div');
            productCol.className = 'col-6';
            const productInput = document.createElement('input');
            productInput.type = 'text';
            productInput.className = 'form-control';
            productInput.name = `productName${index}`;
            productInput.value = productName;
            productInput.readOnly = true;
            productCol.appendChild(productInput);

            const countCol = document.createElement('div');
            countCol.className = 'col-6';
            const countInput = document.createElement('input');
            countInput.type = 'text';
            countInput.className = 'form-control';
            countInput.name = `Count_sell${index}`;
            countInput.required = true;
            countCol.appendChild(countInput);

            row.appendChild(productCol);
            row.appendChild(countCol);

            productRowsContainer.appendChild(row);

            index++;
        }
    } catch (error) {
        console.error('Error fetching product mappings:', error);
    }
});

/* alert */
function togglePopup(){
    document.getElementById("popup-1").classList.toggle("active");
}

$(document).ready(function() {
    $('#btn_update').click(function(e) {
        e.preventDefault(); // Prevent the default button click action

        // Perform your validation here
        var isValid = true; // Start assuming the form is valid
        $('#add-employee-form input[required]').each(function() {
            if ($(this).val() === '') {
                isValid = false;
                $(this).next('#error').text('This field is required').show(); // Show error message
            } else {
                $(this).next('#error').hide(); // Hide error message
            }
        });

        if (isValid) {
            $('#add-employee-form').submit();
        }
    });
});