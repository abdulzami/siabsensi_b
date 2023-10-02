const deleteMahasiswa = (id) => {
    axios.delete('https://siabsensi.herokuapp.com/api/mahasiswa/' + id, {
        headers: {
            Authorization: 'Bearer ' + auth
        }
    }).then(response => {
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
            location.reload()
        })
    }).catch(error => {
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
};