
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