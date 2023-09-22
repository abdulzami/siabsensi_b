const updateMatkul = (id, data) => {
    axios.put('http:localhost:8000/api/matkul/' + id, data, {
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
            window.location.href = "matkul.html"
        })
    }).catch(error => {
        console.log(error.response)
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
    let updtButtonIsPressed = e.target.id == 'button_update';

    if (updtButtonIsPressed) {
        let request = (req_name_mk, req_majors, req_day, req_start, req_end, req_number_meet, req_nip) => {
            let nama_matkul = document.getElementById(req_name_mk).value
            let jurusan = document.getElementById(req_majors).value
            let hari = document.getElementById(req_day).value
            let mulai_jam = document.getElementById(req_start).value
            let akhir_jam = document.getElementById(req_end).value
            let jumlah_pertemuan = document.getElementById(req_number_meet).value;
            let nip = document.getElementById(req_nip).value;
            let matkuls = { nama_matkul, jurusan, hari, mulai_jam, akhir_jam, jumlah_pertemuan, nip }
            return matkuls;
        }

        let matkul_edited = request("nama_matkul", "majors", "day", "mulai_jam", "akhir_jam", "jmlh_meet", "nip")
        if (matkul_edited.mulai_jam >= matkul_edited.akhir_jam) {
            Swal.fire(
                'Oops.',
                `"End at" value must be more than "Start at" value`,
                'error'
            )
        }
        else {
            updateMatkul(id, matkul_edited);

            let button = document.getElementById('button_update');
            let spinner = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`
            button.innerHTML = spinner
            button.classList.add("disabled")
        }

    }
})