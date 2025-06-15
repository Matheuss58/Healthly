// Variáveis globais
let alarmes = JSON.parse(localStorage.getItem('alarmes')) || [];

// Funções globais que precisam ser acessadas pelo HTML
window.abrirModalAlarme = abrirModalAlarme;
window.fecharModalAlarme = fecharModalAlarme;
window.excluirAlarme = excluirAlarme;
window.editarAlarme = editarAlarme;

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    carregarAlarmes();
    configurarEventos();
    solicitarPermissaoNotificacao();
    setInterval(verificarAlarmes, 1000);
});

function configurarEventos() {
    // Botão novo alarme - use uma classe em vez de ID para evitar conflitos
    document.querySelector('.btn-novo-alarme').addEventListener('click', abrirModalAlarme);
    
    // Formulário de alarme
    document.getElementById('form-alarme').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarAlarme();
    });
}

function abrirModalAlarme() {
    try {
        document.getElementById('form-alarme').reset();
        document.getElementById('alarme-index').value = '';
        document.getElementById('alarme-titulo').textContent = 'Novo Alarme';
        document.getElementById('modal-alarme').style.display = 'flex';
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        alert('Ocorreu um erro ao abrir o modal de alarme');
    }
}
function fecharModalAlarme() {
    document.getElementById('modal-alarme').style.display = 'none';
}

function carregarAlarmes() {
    alarmes = JSON.parse(localStorage.getItem('alarmes')) || [];
    exibirAlarmes();
}

function exibirAlarmes() {
    const lista = document.getElementById('lista-alarmes');
    lista.innerHTML = '';

    if (alarmes.length === 0) {
        lista.innerHTML = '<div class="sem-alarmes">Nenhum alarme cadastrado</div>';
        return;
    }

    // Ordenar alarmes por horário
    alarmes.sort((a, b) => a.horario.localeCompare(b.horario));

    alarmes.forEach(alarme => {
        const div = document.createElement('div');
        div.className = 'alarme-item';
        div.innerHTML = `
            <div class="alarme-info">
                <span class="alarme-hora">${formatarHora(alarme.horario)}</span>
                <span class="alarme-descricao">${alarme.titulo}</span>
            </div>
            <div class="alarme-acoes">
                <button onclick="editarAlarme(${alarme.id})">✏️</button>
                <button onclick="excluirAlarme(${alarme.id})">🗑️</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

function formatarHora(hora) {
    const [h, m] = hora.split(':');
    return `${h}:${m}`;
}

function salvarAlarme() {
    const id = document.getElementById('alarme-index').value || Date.now();
    const horario = document.getElementById('alarme-hora').value;
    const descricao = document.getElementById('alarme-descricao').value || 'Alarme';
    const som = document.getElementById('alarme-som').value;

    const novoAlarme = {
        id: parseInt(id),
        horario,
        titulo: descricao,
        som: som,
        disparado: false
    };

    // Se for edição, remove o antigo
    if (document.getElementById('alarme-index').value) {
        alarmes = alarmes.filter(a => a.id !== novoAlarme.id);
    }

    alarmes.push(novoAlarme);
    localStorage.setItem('alarmes', JSON.stringify(alarmes));
    
    fecharModalAlarme();
    carregarAlarmes();
}

function editarAlarme(id) {
    const alarme = alarmes.find(a => a.id === id);
    if (!alarme) return;

    document.getElementById('alarme-index').value = alarme.id;
    document.getElementById('alarme-hora').value = alarme.horario;
    document.getElementById('alarme-descricao').value = alarme.titulo;
    document.getElementById('alarme-som').value = alarme.som;

    document.getElementById('alarme-titulo').textContent = 'Editar Alarme';
    abrirModalAlarme();
}

function excluirAlarme(id) {
    if (confirm('Tem certeza que deseja excluir este alarme?')) {
        alarmes = alarmes.filter(a => a.id !== id);
        localStorage.setItem('alarmes', JSON.stringify(alarmes));
        carregarAlarmes();
    }
}

function verificarAlarmes() {
    const agora = new Date();
    const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + 
                     agora.getMinutes().toString().padStart(2, '0');

    alarmes.forEach(alarme => {
        if (!alarme.disparado && alarme.horario === horaAtual) {
            dispararAlarme(alarme);
            alarme.disparado = true;
            localStorage.setItem('alarmes', JSON.stringify(alarmes));
        }
    });
}

function dispararAlarme(alarme) {
    // Tocar o som do alarme
    const audio = new Audio(`assets/sounds/${alarme.som}`);
    audio.loop = true;
    audio.play();

    // Mostrar notificação
    if (Notification.permission === 'granted') {
        new Notification(`🔔 ${alarme.titulo}`, {
            body: 'Seu alarme está tocando!',
            icon: 'assets/img/icones/alarm.png'
        });
    }

    // Mostrar alerta visual
    const modal = document.createElement('div');
    modal.className = 'modal-alarme-disparado';
    modal.innerHTML = `
        <div class="modal-conteudo">
            <h2>⏰ LETS GO BORA!</h2>
            <p>${alarme.titulo} - ${formatarHora(alarme.horario)}</p>
            <button id="desativar-alarme">OK</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('desativar-alarme').addEventListener('click', () => {
        document.body.removeChild(modal);
        audio.pause();
    });
}

function solicitarPermissaoNotificacao() {
    if ("Notification" in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}