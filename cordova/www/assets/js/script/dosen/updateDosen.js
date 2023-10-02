const updateDosen = (id, user) => {
    axios.put('http://localhost:8000/api/dosen/' + id, user, {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    }).then(response => {
        let button = document.getElementById('button_update');
        button.innerHTML = 'Update'
        button.classList.remove("disabled")
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
    }).catch(error => {
        let button = document.getElementById('button_update');
        button.innerHTML = 'Update'
        button.classList.remove("disabled")
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

container.addEventListener('click', (e) => {
    e.preventDefault();
    let updtButtonIsPressed = e.target.id == 'button_update';

    if (updtButtonIsPressed) {
        let request = (req_name, req_gender, req_address, req_no_hp, req_majors) => {
            let name = document.getElementById(req_name).value
            let jenis_kelamin = document.getElementById(req_gender).value
            let alamat = document.getElementById(req_address).value
            let no_hp = document.getElementById(req_no_hp).value
            let jurusan = document.getElementById(req_majors).value;

            let dosens = { name, jenis_kelamin, alamat, no_hp, jurusan }

            return dosens;
        }

        let dosen_edited = request("name", "gender", "address", "no_hp", "majors")

        updateDosen(id, dosen_edited);

        let button = document.getElementById('button_update');
        let spinner = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`
        button.innerHTML = spinner
        button.classList.add("disabled")
    }
})