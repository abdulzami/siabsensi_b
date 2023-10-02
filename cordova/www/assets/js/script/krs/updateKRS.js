const updateKRS = (id, data) => {
    axios.put('http://localhost:8000/api/krs/' + id, data, {
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
            window.location.href = "krs.html"
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
        let request = (req_nim, req_id_matkul) => {
            let nim = document.getElementById(req_nim).value
            let id_matkul = document.getElementById(req_id_matkul).value

            let krss = { nim, id_matkul }
            return krss;
        }

        let krs_edited = request("nim", "id_mk")

        updateKRS(id, krs_edited);

        let button = document.getElementById('button_update');
        let spinner = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`
        button.innerHTML = spinner
        button.classList.add("disabled")
    }
})