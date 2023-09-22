const auth = token()
let tbody = document.getElementById("the_tbody");

const fetchMahasiswas = () => {
    axios.get('http:localhost:8000/api/mahasiswa', {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            let out = '';
            let z = 1;
            for (let i in response.data.data) {
                out += `<tr>
                <td>${z++}</td>
                <td>${response.data.data[i].nim}</td>
                <td>${response.data.data[i].name}</td>
                <td>${response.data.data[i].jenis_kelamin}</td>
                <td>${response.data.data[i].alamat}</td>
                <td>${response.data.data[i].no_hp}</td>
                <td>${response.data.data[i].jurusan}</td>
                <td>${response.data.data[i].email}</td>
                <td data-id=${response.data.data[i].id}>
                    <a class="btn btn-primary btn-sm mb-1" id="edit_button" role="button">Edit</a>
                    <a class="btn btn-danger btn-sm mb-1" id="delete_button" role="button">Delete</a>
                </td>
            </tr>
                `
            }
            tbody.innerHTML = out;
            $('#the_table').DataTable()
        })
        .catch(error => {
            if (error.response) {
                let failed = `<tr><td colspan="9"><span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span></td></tr>`
                tbody.innerHTML = failed;
                console.error(error)
            } else {
                let failed =`<tr><td colspan="9"><span class="badge bg-danger">${error}</span></td></tr>`
                tbody.innerHTML = failed;
                console.error(error)
            }
        });
};
fetchMahasiswas()

tbody.addEventListener('click', (e) => {
    e.preventDefault();
    let delButtonIsPressed = e.target.id == 'delete_button'
    let editButtonIsPressed = e.target.id == 'edit_button'

    let id = e.target.parentElement.dataset.id

    if (delButtonIsPressed) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMahasiswa(id);
            }
        })

    }else if(editButtonIsPressed){
        sessionStorage.setItem("edit_id", id);
        window.location.href = "edit_mahasiswa.html"
    }
})