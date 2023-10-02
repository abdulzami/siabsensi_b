const auth = token()
let config_login = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + auth,
        'Content-Type': 'application/json'
    }
}
const create_dosen = async (user) => {
    await axios.post('http://localhost:8000/api/dosen', user, config_login)
        .then(response => {
            button.classList.remove("disabled")
            button.innerHTML = 'Create';
            const res = response.data
            let message = res.message
            let alertbody1, alertbody2, alertbody3
            alertbody1 = 'Good job.'
            alertbody2 = message[0]
            alertbody3 = message[1]
            Swal.fire(
                alertbody1,
                alertbody2,
                alertbody3
            ).then(function () {
                window.location.href = "dosen.html"
            })
        })
        .catch(error => {
            button.classList.remove("disabled")
            button.innerHTML = 'Create';
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


let request = (req_nip, req_name, req_gender, req_address, req_no_hp, req_majors, req_email, req_pass) => {
    let nip = document.getElementById(req_nip).value
    let name = document.getElementById(req_name).value
    let jenis_kelamin = document.getElementById(req_gender).value
    let alamat = document.getElementById(req_address).value
    let no_hp = document.getElementById(req_no_hp).value
    let jurusan = document.getElementById(req_majors).value;
    let email = document.getElementById(req_email).value;
    let password = document.getElementById(req_pass).value;

    let dosens = { nip, name, jenis_kelamin, alamat, no_hp, jurusan, email, password }

    return dosens;
}

let button = document.getElementById("button_create");
button.addEventListener("click", function () {
    let dosen = request("nip", "name", "gender", "address", "no_hp", "majors", "email", "pass")
    create_dosen(dosen)
    let spinner = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`
    button.innerHTML = spinner
    button.classList.add("disabled")

})