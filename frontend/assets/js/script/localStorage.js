let create_locals = data => {
    localStorage.setItem("data", data)
}

let token = () => {
    let local_storage = JSON.parse(localStorage.getItem("data"))

    if (local_storage) {
        if (local_storage.token) {
            let the_token = local_storage.token
            return the_token
        }
    }

    return "no_token"

}

let level = () => {
    let local_storage = JSON.parse(localStorage.getItem("data"))

    if (local_storage) {
        if (local_storage.user) {
            let the_level = local_storage.user.level
            return the_level
        }
    }

    return "no_level"

}

let nip = () => {
    let local_storage = JSON.parse(localStorage.getItem("data"))

    if (local_storage) {
        if (local_storage.user) {
            let the_nip = local_storage.user.nip
            return the_nip
        }
    }

    return "no_nip"

}