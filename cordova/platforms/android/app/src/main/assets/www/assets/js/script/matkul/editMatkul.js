let dosen_data_edit = (data) => {
    return `
    <p class="h3 mb-4">Edit Course Data</p>
    <div class="border border-1 p-2">
            <div class="mb-3">
                <label class="form-label">Course Name</label>
                <input type="text" class="form-control form-control-sm" value="${data.nama_matkul}" id="nama_matkul" placeholder="Course Name">
            </div>
            <div class="mb-3">
                <label class="form-label">Majors</label>
                <input type="text" class="form-control form-control-sm" value="${data.jurusan}" id="majors" placeholder="Majors">
            </div>
            <div class="mb-3">
                <label class="form-label">Day</label>
                <select class="form-select form-select-sm" id="day" aria-label=".form-select-sm example">
                    <option selected>Choose Day</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Starts at (Hours)</label>
                <input type="time" class="form-control form-control-sm" value="${data.mulai_jam}" id="mulai_jam">
            </div>
            <div class="mb-3">
                <label class="form-label">End at (Hours)</label>
                <input type="time" class="form-control form-control-sm" value="${data.akhir_jam}" id="akhir_jam">
            </div>
            <div class="mb-3">
                <label class="form-label">Number of Meetings</label>
                <input type="number" class="form-control form-control-sm" value="${data.jumlah_pertemuan}" id="jmlh_meet"
                    placeholder="Number of Meetings">
            </div>
            <div class="mb-3">
                <label class="form-label">The lecturer</label>
                <div id="dosennya">
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

const fetchDosens = (nipe, dosen_select) => {
    axios.get('https://siabsensi.herokuapp.com/api/dosen', {
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
            dosen_select.innerHTML = out;
            $("#nip").val(nipe);
        })
        .catch(error => {

            if (error.response) {
                let failed = `<span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                dosen_select.innerHTML = failed;
                console.error(error)
            } else {
                let failed = `<span class="badge bg-danger">${error}</span>`
                dosen_select.innerHTML = failed;
                console.error(error)
            }

        });
};

const fetchDosenEdit = () => {
    axios.get('https://siabsensi.herokuapp.com/api/matkul/' + id, {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            container.innerHTML = dosen_data_edit(response.data.data)
            let dosennya = document.getElementById("dosennya");
            fetchDosens(response.data.data.nip, dosennya);
            $("#day").val(response.data.data.hari);
        })
        .catch(error => {
            console.log(error.response)
            if (error.response) {
                let failed = `<p class="h3 mb-4">Edit Course Data</p>
                <span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                container.innerHTML = failed;
                console.error(error)

                if (error.response.status == 500) {
                    let failed = `<p class="h3 mb-4">Edit Course Data</p><span class="badge bg-info">
                    Nothing can edit.</span>`
                    container.innerHTML = failed;
                }
            } else {
                let failed = `<p class="h3 mb-4">Edit Course Data</p>
                <span class="badge bg-danger">${error}</span>
            </tr>`
                container.innerHTML = failed;
                console.error(error)
            }

        });
};
fetchDosenEdit()
// container.innerHTML = dosen_data_edit("gg")


