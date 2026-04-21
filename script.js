function validarArquivo() {
    console.log("Ei");
    var foto = document.getElementById('foto');
    var caminhoArquivo = foto.value;
    var extensoesPermitidas = /(.jpg|.jpeg|.png|.gif)$/i;
    if (!extensoesPermitidas.exec(caminhoArquivo)) {
        foto.classList.add("is-invalid");
        var erro = document.getElementById('mensagem-foto');
        erro.innerHTML = 'Por favor envie um arquivo que tenha as extensões.jpeg/.jpg/.png/.gif .';
        foto.value = '';
        document.getElementById('preview').style.display = 'none';

        return false;
    } else {
        if (foto.files && foto.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('preview').src = e.target.result;
                document.getElementById('preview').style.display = 'block';
            };
            foto.classList.remove('is-invalid');
            reader.readAsDataURL(foto.files[0]);
        }
    }
}