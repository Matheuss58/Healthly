// Funções comuns a todas as páginas
document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre páginas
    const links = document.querySelectorAll('[data-page]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = this.getAttribute('data-page');
        });
    });
    
    // Inicializações específicas por página
    const bodyClass = document.body.className;
    
    if (bodyClass.includes('rotina')) {
        // Inicializações da página de rotina
        inicializarRotina();
    } else if (bodyClass.includes('calendario')) {
        // Inicializações do calendário
        inicializarCalendario();
    } else if (bodyClass.includes('alarmes')) {
        // Inicializações dos alarmes
        inicializarAlarmes();
    }
});

// Função para salvar cadastro (usada em cadastro.html)
function salvarCadastro(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const metas = document.getElementById('metas').value;

    const usuario = {
        nome: nome,
        email: email,
        metas: metas,
        rotina: [],
        calendario: {},
        alarmes: []
    };
    
    localStorage.setItem('usuarioHealthly', JSON.stringify(usuario));
    alert('Cadastro salvo com sucesso!');
    window.location.href = 'home.html'; // ou rotina.html
}