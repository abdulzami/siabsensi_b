const auth = token()
let config_login = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + auth,
        'Content-Type': 'application/json'
    }
}

let dosennya = document.getElementById("dosennya");
const fetchDosens = () => {
    axios.get('http:localhost:8000/api/dosen', {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            let out = '';
            let z = 1;
            out += `<select class="form-select form-select-sm" id="nip" aria-label=".form-select-sm example">
            <option selected>Choose Lecturer</option>`
            for (let i in response.data.data) {
                out += `<option value="${response.data.data[i].nip}">${response.data.data[i].nip} - ${response.data.data[i].name}</option>`
            }
            out += `</select>`
            dosennya.innerHTML = out;
        })
        .catch(error => {
            if (error.response) {
                let failed = dosennya.innerHTML = `
                <span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                dosennya.innerHTML = failed;
                console.error(error)
            } else {
                let failed = dosennya.innerHTML = `
                <span class="badge bg-danger">${error}</span>`
                dosennya.innerHTML = failed;
                console.error(error)
            }

        });
};
fetchDosens()


const create_matkul = async (user) => {
    await axios.post('http:localhost:8000/api/matkul', user, config_login)
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
                window.location.href = "matkul.html"
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

let button = document.getElementById("button_create");
button.addEventListener("click", function () {
    if (document.getElementById('nip') == null) {
        Swal.fire(
            'Oops.',
            `There is no lecturer data`,
            'error'
        )
    } else {
        let matkul = request("nama_matkul", "majors", "day", "mulai_jam", "akhir_jam", "jmlh_meet", "nip")
        if (matkul.mulai_jam >= matkul.akhir_jam) {
            Swal.fire(
                'Oops.',
                `"End at" value must be more than "Start at" value`,
                'error'
            )
        }
        else {
            create_matkul(matkul)
            let spinner = `<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>`
            button.innerHTML = spinner
            button.classList.add("disabled")
        }

    }
})