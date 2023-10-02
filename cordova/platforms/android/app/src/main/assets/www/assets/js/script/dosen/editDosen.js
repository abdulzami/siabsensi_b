let dosen_data_edit = (data) => {
    return `
    <p class="h3 mb-4">Edit Lecturer Data</p>
    <div class="border border-1 p-2">
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Name</label>
        <input type="text" class="form-control form-control-sm" value="${data.name}" id="name" placeholder="Name">
    </div>
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Gender</label>
        <select class="form-select form-select-sm" id="gender" aria-label=".form-select-sm example">
            <option selected>Choose Gender</option>
            <option value="L" id="L" >Man</option>
            <option value="P" id="P" >Woman</option>
        </select>
    </div>
    <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">Address</label>
        <textarea class="form-control form-control-sm"  id="address" placeholder="Address" rows="3">${data.alamat}</textarea>
    </div>
    <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Handphone Numbers</label>
        <input type="text" class="form-control form-control-sm" value="${data.no_hp}" id="no_hp" placeholder="Handphone Numbers">
    </div>
    <div class="mb-3">
        <label for="exampleFormControlInput2" class="form-label">Majors</label>
        <input type="text" class="form-control form-control-sm" value="${data.jurusan}" form-control-sm" id="majors" placeholder="Majors">
    </div>
    <div class="d-grid gap-2">
        <button type="button" id="button_update" class="btn btn-primary btn-sm">Update</button>
    </div>
</div>`
}
const auth = token()
let id_edit = []
let container = document.getElementById('edit_container')
id_edit.push(sessionStorage.getItem("edit_id"));
sessionStorage.clear();

let id = id_edit[0]

const fetchDosenEdit = () => {
    axios.get('https://siabsensi.herokuapp.com/api/dosen/' + id, {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            container.innerHTML = dosen_data_edit(response.data.data)
            document.getElementById(response.data.data.jenis_kelamin).selected = "true";
        })
        .catch(error => {
            console.log(error.response)
            if (error.response) {
                let failed = `<p class="h3 mb-4">Edit Lecturer Data</p>
                <span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                container.innerHTML = failed;
                console.error(error)

                if (error.response.status == 500) {
                    let failed = `<p class="h3 mb-4">Edit Lecturer Data</p><span class="badge bg-info">
                    Nothing can edit.</span>`
                    container.innerHTML = failed;
                }
            } else {
                let failed = `<p class="h3 mb-4">Edit Lecturer Data</p>
                <span class="badge bg-danger">${error}</span>
            </tr>`
                container.innerHTML = failed;
                console.error(error)
            }

        });
};
fetchDosenEdit()
// container.innerHTML = dosen_data_edit("gg")


