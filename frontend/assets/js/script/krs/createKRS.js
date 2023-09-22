const auth = token()
let config_login = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + auth,
        'Content-Type': 'application/json'
    }
}

let mhsnya = document.getElementById("mhsnya");
let matkulnya = document.getElementById("matkulnya");

const fetchMahasiswas = () => {
    axios.get('http:localhost:8000/api/mahasiswa', {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            let out = '';
            let z = 1;
            out += `<select class="form-select form-select-sm" id="nim" aria-label=".form-select-sm example">
        <option value="" selected>Choose Student</option>`
            for (let i in response.data.data) {
                out += `<option value="${response.data.data[i].nim}">${response.data.data[i].nim} - ${response.data.data[i].name}</option>`
            }
            out += `</select>`
            mhsnya.innerHTML = out;
        })
        .catch(error => {
            if (error.response) {
                let failed = `<span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                mhsnya.innerHTML = failed;
            } else {
                let failed = `<span class="badge bg-danger">${error}</span>`
                mhsnya.innerHTML = failed;
            }
        });
};
fetchMahasiswas()

const fetchMatkuls = () => {
    axios.get('http:localhost:8000/api/matkul', {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            let out = '';
            let z = 1;
            out += `<select class="form-select form-select-sm" id="id_matkul" aria-label=".form-select-sm example">
            <option value="" selected>Choose Courses</option>`
            for (let i in response.data.data) {
                out += `<option value="${response.data.data[i].id}">${response.data.data[i].id} - ${response.data.data[i].nama_matkul}</option>`
            }
            out += `</select>`
            matkulnya.innerHTML = out;
        })
        .catch(error => {
            if (error.response) {
                let failed = `<span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                matkulnya.innerHTML = failed;
            } else {
                let failed = `<span class="badge bg-danger">${error}</span>`
                matkulnya.innerHTML = failed;
            }
        });
};
fetchMatkuls()


const create_krs = async (user) => {
    await axios.post('http:localhost:8000/api/krs', user, config_login)
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
                window.location.href = "krs.html"
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

let request = (req_nim, req_id_matkul) => {
    let nim = document.getElementById(req_nim).value
    let id_matkul = document.getElementById(req_id_matkul).value

    let krss = { nim, id_matkul }
    return krss;
}

let button = document.getElementById("button_create");
button.addEventListener("click", function () { 
    if ( document.getElementById('nim') == null && document.getElementById('id_matkul') == null) {
        Swal.fire(
            'Oops.',
            `There is no student and course data`,
            'error'
        )
    } else if (document.getElementById('nim') == null) {
        Swal.fire(
            'Oops.',
            `There is no student data`,
            'error'
        )
    } else if (document.getElementById('id_matkul') == null) {
        Swal.fire(
            'Oops.',
            `There is no course data`,
            'error'
        )
    } else {
        let matkul = request("nim", "id_matkul")
        create_krs(matkul)
        let spinner = `<div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
                </div>`
        button.innerHTML = spinner
        button.classList.add("disabled")
    }

})