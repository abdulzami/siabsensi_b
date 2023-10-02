const auth2 = token()

let logout_button = document.getElementById('logout_button')

let config_login2 = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + auth2,
        'Content-Type': 'application/json'
    }
}
const logout = async (user) => {
    await axios.post('https://siabsensi.herokuapp.com/api/logout', user, config_login2)
        .then(response => {
            localStorage.removeItem("data");
            const res = response.data
            let message = res.message
            let alertbody1, alertbody2, alertbody3
            alertbody1 = message[2]
            alertbody2 = message[0]
            alertbody3 = message[1]
            Swal.fire(
                alertbody1,
                alertbody2,
                alertbody3
            ).then(function () {

                window.location.href = "../index.html"
            })
        })
        .catch(error => {
            if (error.response) {
                if (error.response.status == 422) {
                    Swal.fire(
                        error.response.data.message,
                        '',
                        'error'
                    )
                } else if (error.response.status == 406) {
                    Swal.fire(
                        error.response.data.message[0],
                        '',
                        'error'
                    )
                }
            } else {
                Swal.fire(
                    'Request failed.',
                    `${error}`,
                    'error'
                )
            }
        })
}

logout_button.addEventListener('click', () => {
    logout();
    logout_button.parentElement.classList.add('disabled');
})