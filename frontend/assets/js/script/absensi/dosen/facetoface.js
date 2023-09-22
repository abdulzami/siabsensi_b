const container_absensi = document.getElementById('absensi_container')

let id_m = [];
id_m.push(sessionStorage.getItem("id_matkul_absen"));
sessionStorage.clear();

let id_mk = id_m[0];

if (id_mk == null) {
    container_absensi.innerHTML = `<span class="badge bg-info">Return to home, and try again.
</span>`
}

const auth = token()
let config_login = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + auth,
        'Content-Type': 'application/json'
    }
}
const present_ff = async (user) => {
    await axios.post('http:localhost:8000/api/dosen-absen', user, config_login)
        .then(response => {
            let button = document.getElementById('button_save');
            button.classList.remove("disabled")
            button.innerHTML = 'Save';
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
                window.location.href = "index.html"
            })
        })
        .catch(error => {
            console.log(error.response);
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

//geolocation
let distance = (lon1, lat1, lon2, lat2) => {
    let R = 6371;
    let dLat = (lat2 - lat1).toRad();
    let dLon = (lon2 - lon1).toRad();
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
}

if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}
let positionOption = { timeout: 999999 };
let gpsFailed = function () {
    container_absensi.innerHTML = `<span class="badge bg-info">Turn on the location to take your current location!</span>`
}

let LatAndLong = [];

const fetchGeo = (pos) => {
    let latitude = pos.coords.latitude
    let longitude = pos.coords.longitude
    LatAndLong.push(latitude)
    LatAndLong.push(longitude)
    let latitudePurpose = -7.1611302
    let longitudePurpose = 112.615223
    let uri = "https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + "&key=a356cf8f71e446fd97390576dbf0f4d7";
    let jarak = distance(pos.coords.longitude, pos.coords.latitude, longitudePurpose, latitudePurpose);
    jarak = jarak.toFixed(3);
    axios.get(uri)
        .then(response => {
            let out = ''
            out += `<div class="card mb-3">
                <div class="card-body">`
            out += `
                <h6>Your Current Location : </h6>
                ${response.data.results[0].formatted}<br><br>

                <h6>Latitude : </h6>
                ${latitude}<br><br>

                <h6>Longitude : </h6>
                ${longitude}<br><br>

                <h6>Distance to campus :</h6>
                ${jarak.toString().replace(".", ",") + " Kilometers"}<br><br>
                `
            if (jarak <= 0.005) {
                out += `<div class="alert alert-success" role="alert">
                    The distance to the campus is met
                    </div>`
            } else {
                out += `<div class="alert alert-info" role="alert">
                    Distance to campus must be 0,005 Kilometers or less for Present Face to Face
                    </div>`
            }
            out += `
                </div>
            </div>`

            if (jarak <= 0.005) {
                out += `<div class="d-grid gap-2">
                    <button type="button" id="button_save" class="btn btn-primary btn-sm">Save</button>
                </div>`
            }

            if (id_mk == null) {
                container_absensi.innerHTML = `<span class="badge bg-info">Return to home, and try again.
            </span>`
            } else {
                container_absensi.innerHTML = out
            }
        })
        .catch(error => console.log(error));
};

function getMyLocation() {
    navigator.geolocation.getCurrentPosition(fetchGeo, gpsFailed, positionOption);
}
getMyLocation();
//endgeolocation

let request = () => {
    let id_matkul = id_mk
    let status = "masuk"
    let mode = 'tatap_muka'
    let latitude = LatAndLong[0]
    let longitude = LatAndLong[1]
    let ffs = { id_matkul, status, mode, latitude, longitude }

    return ffs;
}

container_absensi.addEventListener('click', (e) => {
    e.preventDefault();
    let saveButtonIsPressed = e.target.id == 'button_save'

    if (saveButtonIsPressed) {
        let ff = request()

        console.log(ff);
        present_ff(ff)
        let button = document.getElementById('button_save');
        let spinner = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`
        button.innerHTML = spinner
        button.classList.add("disabled")
    }
})

