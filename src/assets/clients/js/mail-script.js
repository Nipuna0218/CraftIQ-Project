// -------   Mail Send ajax

$(document).ready(function () {
  var form = $("#myForm"); // contact form
  var submit = $(".submit-btn"); // submit button
  var alert = $(".alert-msg"); // alert div for show alert message

  // form submit event
  form.on("submit", function (e) {
    e.preventDefault(); // prevent default form submit

    $.ajax({
      url: "mail.php", // form action url
      type: "POST", // form submit method get/post
      dataType: "json", // request type html/json/xml
      data: form.serialize(), // serialize form data
      beforeSend: function () {
        alert.fadeOut();
        submit.html("Sending...."); // change submit button text
      },
      success: function (res) {
        alert.text(res.message).fadeIn(); // safely render as text
        form.trigger("reset");
        submit.hide(); // hide button if needed
      },
      error: function (e) {
        console.log(e);
      },
    });
  });
});
