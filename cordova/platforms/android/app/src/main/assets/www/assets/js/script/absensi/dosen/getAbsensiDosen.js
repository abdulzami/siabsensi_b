let element = (nama_matkul, akhir) => {
    return `
<div class="card mb-3">
    <div class="card-header" id="headernya">
        Course 1
    </div>
    <div class="card-body" id="bodynya">
        <h5 class="card-title">Pemrograman Terstruktur</h5>
        <p class="card-text ">
            <span class="h3 badge bg-light text-dark"> Time : 10:00:00 - 12:00:00</span><br>
            Select the attendance method :
            <button type="button" class="btn btn-outline-primary btn-sm mb-2">Present Face to
                Face</button>
            <button type="button" class="btn btn-outline-secondary btn-sm mb-2">Present
                Daring</button>
            <button type="button" class="btn btn-outline-warning btn-sm">Permission</button>
            <button type="button" class="btn btn-outline-danger btn-sm">Permission Sick</button>
        </p>
    </div>
    <div class="card-footer text-muted" id="footernya">
        <span class="badge bg-info">You have already attendence.</span>
    </div>
</div>
`
}


const nip_dosen = nip()
const auth = token()

let time = () => {
    let date = new Date();
    let str = date.toString();
    let strS = str.split(" ");
    let time = strS[4];
    let oke = time.substr(0, 5);
    return oke;
}

let container = document.getElementById('matkul_container')

const fetchAbsensiDosen = (user) => {
    axios.post('https://siabsensi.herokuapp.com/api/absensi-dosen', user, {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    })
        .then(response => {
            let out = '';
            let z = 1;
            for (let i in response.data.data) {
                out += `<div class="card mb-3">
                <div class="card-header" id="headernya">
                    Course ${z++}
                </div>`

                out += `<div class="card-body" id="bodynya">
                <h5 class="card-title">${response.data.data[i].nama_matkul}</h5>
                <p class="card-text " data-id=${response.data.data[i].id}>
                    <span class="h3 badge bg-light text-dark border border-secondary"> Time : ${response.data.data[i].mulai_jam} - ${response.data.data[i].akhir_jam}</span>
                    <span class="h3 badge bg-light text-dark border border-secondary"> Remaining Number of meetings : ${response.data.data[i].jumlah_pertemuan}</span><br>
                    `

                if (response.data.data[i].id_masuk == null && time() >= response.data.data[i].mulai_jam && time() <= response.data.data[i].akhir_jam && response.data.data[i].jumlah_pertemuan > 0) {
                    out += `Select the attendance method : <br>
                <button type="button" id='present_ff_btn' class="btn btn-outline-primary btn-sm mb-2">Present Face to
                    Face</button>
                <button type="button" id='present_daring_btn' class="btn btn-outline-secondary btn-sm mb-2">Present
                    Daring</button>
                <button type="button" id='absent_permis' class="btn btn-outline-warning btn-sm mb-2">Absent Permission</button>
                <button type="button" id='absent_sick' class="btn btn-outline-danger btn-sm mb-2">Absent Sick</button>`
                }

                out += `</p>
                </div>
                <div class="card-footer text-muted" id="footernya">`

                if (response.data.data[i].jumlah_pertemuan == 0) {
                    out += `This course is end.`
                } else {
                    if (response.data.data[i].id_masuk != null) {
                        out += `You have already attended this course.`
                    } else if (response.data.data[i].id_masuk == null) {
                        if (time() >= response.data.data[i].mulai_jam && time() <= response.data.data[i].akhir_jam) {
                            out += `Please do attendence for this course.`
                        } else if (time() < response.data.data[i].mulai_jam) {
                            out += `It's not time for attendance yet.`
                        } else if (time() > response.data.data[i].akhir_jam) {
                            out += `You didn't do attendance for this course today. Time's up for attendance.`
                        }
                        else {
                            out += `This course is end.`
                        }
                    }
                }
                out += `</div></div>`
            }
            container.innerHTML = out
        })
        .catch(error => {
            if (error.response) {
                let failed = `
                <span class="badge bg-${error.response.data.message[1]}">${error.response.data.message[0]}</span>`
                container.innerHTML = failed;
                if (error.response.status == 500) {
                    let failed = `<span class="badge bg-info">
                    Nothing show.</span>`
                    container.innerHTML = failed;
                }
            } else {
                let failed = `
                <span class="badge bg-danger">${error}</span>
            </tr>`
                container.innerHTML = failed;
            }
        });
};

let request = req_nip => {
    let nip = req_nip;
    let reques = { nip };
    return reques;
}

fetchAbsensiDosen(request(nip_dosen));

container.addEventListener('click', (e) => {
    e.preventDefault();
    let presentFFButtonIsPressed = e.target.id == 'present_ff_btn'
    let presentDaringButtonIsPressed = e.target.id == 'present_daring_btn'
    let absentPermisButtonIsPressed = e.target.id == 'absent_permis'
    let absentSickButtonIsPressed = e.target.id == 'absent_sick'

    let id = e.target.parentElement.dataset.id
    if (presentFFButtonIsPressed) {
        sessionStorage.setItem("id_matkul_absen", id);
        window.location.href = "present_facetoface.html"
    } else if (presentDaringButtonIsPressed) {
        sessionStorage.setItem("id_matkul_absen", id);
        window.location.href = "present_daring.html"
    } else if (absentPermisButtonIsPressed) {
        sessionStorage.setItem("id_matkul_absen", id);
        window.location.href = "absent_permission.html"
    } else if (absentSickButtonIsPressed) {
        sessionStorage.setItem("id_matkul_absen", id);
        window.location.href = "absent_sick.html"
    }
})