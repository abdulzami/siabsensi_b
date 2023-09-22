let krs_data_edit = (data) => {
    return `
    <p class="h3 mb-4">Edit Study Plan Card Data</p>
    <div class="border border-1 p-2">
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">The Student</label>
        <div id="mhsnya">
            <span class="badge bg-primary">Getting data from server ...</span>
        </div>
    </div>
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">The Courses</label>
        <div id="matkulnya">
            <span class="badge bg-primary">Getting data from server ...</span>
        </div>
    </div>
    <div class="d-grid gap-2">
        <button type="button" id="button_update" class="btn btn-primary btn-sm">Update</button>
    </div>
</div>`
}
const auth = token()
let id_edit = []
let container = document.getElementById('edit_container')
id_edit.push(sessionStorage.getItem("edit_id"))
sessionStorage.clear()
let id = id_edit[0]

const fetchMahasiswas = (nime,select_mhs) => {
    axios.get('http:localhost:8000/api/mahasiswa', {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            let out = '';
            let z = 1;
            out += `<select class="form-select form-select-sm" id="nim" aria-label=".form-select-sm example">
            <option selected>Choose Student</option>`
            for (let i in response.data.data) {
                out += `<option value="${response.data.data[i].nim}">${response.data.data[i].nim} - ${response.data.data[i].name}</option>`
            }
            out += `</select>`
            select_mhs.innerHTML = out;
            $("#nim").val(nime);
        })
        .catch(error => {

            if (error.response) {
                let failed = `<span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                select_mhs.innerHTML = failed;
                console.error(error)
            } else {
                let failed = `<span class="badge bg-danger">${error}</span>`
                select_mhs.innerHTML = failed;
                console.error(error)
            }

        });
};

const fetchMatkuls = (id_matkule,select_matkul) => {
    axios.get('http:localhost:8000/api/matkul', {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            let out = '';
            let z = 1;
            out += `<select class="form-select form-select-sm" id="id_mk" aria-label=".form-select-sm example">
            <option selected>Choose Matkul</option>`
            for (let i in response.data.data) {
                out += `<option value="${response.data.data[i].id}">${response.data.data[i].id} - ${response.data.data[i].nama_matkul}</option>`
            }
            out += `</select>`
            select_matkul.innerHTML = out;
            $("#id_mk").val(id_matkule);
        })
        .catch(error => {

            if (error.response) {
                let failed = `<span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                select_matkul.innerHTML = failed;
                console.error(error)
            } else {
                let failed = `<span class="badge bg-danger">${error}</span>`
                select_matkul.innerHTML = failed;
                console.error(error)
            }

        });
};

const fetchKRSEdit = () => {
    axios.get('http:localhost:8000/api/krs/' + id, {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            container.innerHTML = krs_data_edit(response.data.data)
            let mhsnya = document.getElementById("mhsnya");
            let matkulnya = document.getElementById("matkulnya");
            fetchMahasiswas(response.data.data.nim,mhsnya);
            fetchMatkuls(response.data.data.id_matkul,matkulnya);
        })
        .catch(error => {
            if (error.response) {
                let failed = `<p class="h3 mb-4">Edit Courses Data</p>
                <span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                container.innerHTML = failed;
                console.error(error)

                if (error.response.status == 500) {
                    let failed = `<p class="h3 mb-4">Edit Study Plan Card Data</p><span class="badge bg-info">
                    Nothing can edit.</span>`
                    container.innerHTML = failed;
                }
            } else {
                let failed = `<p class="h3 mb-4">Edit Study Plan Card Data</p>
                <span class="badge bg-danger">${error}</span>
            </tr>`
                container.innerHTML = failed;
                console.error(error)
            }

        });
};
fetchKRSEdit()
// container.innerHTML = dosen_data_edit("gg")


