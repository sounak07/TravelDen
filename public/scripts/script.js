/* global $ */

var $password = $("#password");
var $confirmPassword = $("#confirm");
$("#enter").hide();
$("#conf").hide();

function isPasswordValid() {
  return $password.val().length > 7;
}

function arePasswordsMatching() {
  return $password.val() === $confirmPassword.val();
}

function canSubmit() {
  return isPasswordValid() && arePasswordsMatching() ;
}

function passwordEvent(){
  if(isPasswordValid()){
    $("#enter").hide();
    $password.parent().removeClass('has-warning');
  } else {
    $password.parent().addClass('has-warning');
    $("#enter").show();
  }
}

function confirmPasswordEvent() {
  if(arePasswordsMatching()) {
    $("#conf").hide();
    $confirmPassword.parent().removeClass('has-warning');
  } else if($password.val().length < 8) {
    $("#conf").hide();
    $confirmPassword.parent().removeClass('has-warning');
  } else {
      $("#conf").show();
      $confirmPassword.parent().addClass('has-warning');
  }
}

function enableSubmitEvent() {
  $("#submit").prop("disabled", !canSubmit());
}

$password.focus(passwordEvent).keyup(passwordEvent).keyup(confirmPasswordEvent).keyup(enableSubmitEvent);

$confirmPassword.focus(confirmPasswordEvent).keyup(confirmPasswordEvent).keyup(enableSubmitEvent);

enableSubmitEvent();



