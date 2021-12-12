//javascript

function validate(e, issubmit) {
    if (issubmit) {
        e.preventDefault();
    }
    let form = this;
    let usernameel = form['username'];
    let username = usernameel.value
  
    let error = ""
    if (!username) {
        error = 'username is required';
    }
    else if (!username.match(/^[a-zA-Z]/)) {
        error = 'first letter must be character';
    } else if (username.length < 3) {
        error = 'username must be at least 3 char';
    }
  
    addError(usernameel, error);
    error = "";
  
    let passwordel = form['passwd'];
    let password = passwordel.value;
    if (!password) {
        error = 'password is required'
    } else if (password.length < 8) {
        error = 'password must be at least 8 char'
    } else if (!password.match(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/)) {
        error = 'password must contain at least one upper case, lower case, number & special char'
    }
  
    addError(passwordel, error);
    error = ""
    let cpasswordel = form['cpasswd'];
    let cpassword = cpasswordel.value;
    if (cpassword !== password) {
        error = 'password must be same';
    }
    addError(cpasswordel, error);
    error = ""
    let emailel = form['email'];
    let email = emailel.value;
  
    if (!email) {
        error = 'email is required';
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        error = 'email is invalid';
    }
    addError(emailel, error);
  }
  var form = document.getElementById('myForm');
  
  
  
  form.addEventListener('submit', validate);
  form.addEventListener('keyup', validate);
  form.addEventListener('change', validate);
  
  function addError(el, message) {
    el.parentElement.querySelector('.error').innerText = message
  }