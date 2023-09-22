if (level() != "no_level") {
    if (level() == "Admin") {
        window.location = "admin/index.html";
    } else if (level() == "Dosen") {
        window.location = "dosen/index.html";
    } else if (level() == "Mahasiswa") {
        window.location = "mahasiswa/index.html";
    }
}