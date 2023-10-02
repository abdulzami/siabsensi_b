let config_login = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
}
const login = async (user) => {
    await axios.post('http://localhost:8000/api/login', user, config_login)
        .then(response => {
            const res = response.data
            let message = res.message
            let errors = res.errors

            let token = res.token
            let user = res.user
            let locals = { token, user }

            let alertbody1, alertbody2, alertbody3

            if (errors) {
                alertbody1 = 'Oops...'
                alertbody2 = errors
                alertbody3 = 'success'
            } else {
                alertbody1 = message[2]
                alertbody2 = message[0]
                alertbody3 = message[1]
            }

            create_locals(JSON.stringify(locals))

            Swal.fire(
                alertbody1,
                alertbody2,
                alertbody3
            ).then(function () {
                button.classList.remove("disabled")
                button.innerHTML = 'Login';
                if (user) {
                    if (user.level == "Admin") {
                        window.location.href = "admin/index.html"
                    } else if (user.level == "Dosen") {
                        window.location.href = "dosen/index.html"
                    } else if (user.level == "Mahasiswa") {
                        window.location.href = "mahasiswa/index.html"
                    } else {
                        window.location.href = "no.html"
                    }
                }
            })
        })
        .catch(error => {
            button.classList.remove("disabled")
            button.innerHTML = 'Login';
            if (error.response) {
                if (error.response.status == 422) {
                    Swal.fire(
                        'Oops...',
                        error.response.data.message,
                        'error'
                    )
                } else {
                    Swal.fire(
                        'Oops...',
                        error.response.data.message[0],
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
let request = (req_email, req_password) => {
    let email = document.getElementById(req_email).value;
    let password = document.getElementById(req_password).value;
    let user = { email, password };
    return user;
}
let button = document.getElementById("button");
button.addEventListener("click", function () {
    let user = request("email", "password")
    login(user)
    let spinner = `<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>`
    button.innerHTML = spinner
    button.classList.add("disabled")
})
