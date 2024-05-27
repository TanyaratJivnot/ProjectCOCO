document.getElementById('file-input').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        var img = document.getElementById('image-preview');  // Get the image preview tag
        var defaultImg = document.getElementById('default-image'); // Get the default image tag
        img.src = URL.createObjectURL(this.files[0]); // Set the image preview src to the selected file
        img.onload = function() {
            URL.revokeObjectURL(img.src); // Free memory after loading the image
        }
        img.style.display = 'block'; // Make the image preview visible
        defaultImg.style.display = 'none'; // Hide the default image
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