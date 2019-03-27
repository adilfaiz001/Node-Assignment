function generateSignupQueryURL(query) {
    return (
        `email=${query.email}&` +
        `password=${encodeURI(query.password)}`
    );
}

function validateInputs(email, password) {
    var email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    if(email!=="" && password!=="" ){
        return true
    }
}