const container_absensi = document.getElementById('absensi_container')

let id_m = [];
id_m.push(sessionStorage.getItem("id_matkul_absen"));
sessionStorage.clear();

let id_mk = id_m[0];

if(id_mk == null) {
    container_absensi.innerHTML = `<span class="badge bg-info">Return to home, and try again.
</span>`
}

const auth = token()
let config_login = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + auth,
        'Content-Type': 'application/json'
    }
}
const present_daring = async (user) => {
    await axios.post('https://siabsensi.herokuapp.com/api/dosen-absen', user, config_login)
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
                window.location.href = "index.html"
            })
        })
        .catch(error => {
            console.log(error.response);
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
let request = () => {
    let id_matkul = id_mk
    let status = "masuk"
    let mode = 'daring'
    let darings = { id_matkul, status, mode}

    return darings;
}

let button = document.getElementById("button_save");

if(button){
    button.addEventListener("click", function () {
        let daring = request()

        console.log(daring);
        present_daring(daring)
        let spinner = `<div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>`
        button.innerHTML = spinner
        button.classList.add("disabled")
    
    })
}

