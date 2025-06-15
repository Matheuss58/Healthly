function inicializarCalendario() {
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    const calendarioContainer = document.getElementById('calendario-2025');
    calendarioContainer.innerHTML = '';
    
    // Cria calendário para cada mês de 2025
    for (let mes = 0; mes < 12; mes++) {
        const mesContainer = document.createElement('div');
        mesContainer.className = 'mes';
        
        const mesTitulo = document.createElement('h2');
        mesTitulo.className = 'mes-titulo';
        mesTitulo.textContent = `${meses[mes]} 2025`;
        mesContainer.appendChild(mesTitulo);
        
        const diasSemanaContainer = document.createElement('div');
        diasSemanaContainer.className = 'dias-semana';
        
        // Cabeçalho com dias da semana
        diasSemana.forEach(dia => {
            const diaSemana = document.createElement('div');
            diaSemana.textContent = dia;
            diasSemanaContainer.appendChild(diaSemana);
        });
        
        mesContainer.appendChild(diasSemanaContainer);
        
        const diasMesContainer = document.createElement('div');
        diasMesContainer.className = 'dias-mes';
        
        // Primeiro dia do mês
        const primeiroDia = new Date(2025, mes, 1).getDay();
        
        // Dias no mês
        const diasNoMes = new Date(2025, mes + 1, 0).getDate();
        
        // Dias vazios no início
        for (let i = 0; i < primeiroDia; i++) {
            const diaVazio = document.createElement('div');
            diasMesContainer.appendChild(diaVazio);
        }
        
        // Dias do mês
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const diaElemento = document.createElement('div');
            diaElemento.className = 'dia';
            diaElemento.textContent = dia;
            diaElemento.dataset.dia = dia;
            diaElemento.dataset.mes = mes;
            diaElemento.dataset.ano = 2025;
            
            diaElemento.addEventListener('click', function() {
                abrirModalEvento(this);
            });
            
            // Verifica se há eventos para este dia
            const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
            const temEvento = eventos.some(evento => 
                evento.dia == dia && evento.mes == mes && evento.ano == 2025
            );
            
            if (temEvento) {
                diaElemento.classList.add('evento');
            }
            
            diasMesContainer.appendChild(diaElemento);
        }
        
        mesContainer.appendChild(diasMesContainer);
        calendarioContainer.appendChild(mesContainer);
    }
}

function abrirModalEvento(diaElemento) {
    const modal = document.getElementById('modal-evento');
    const dia = diaElemento.dataset.dia;
    const mes = parseInt(diaElemento.dataset.mes);
    const ano = diaElemento.dataset.ano;
    
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    document.getElementById('modal-titulo').textContent = `${dia} de ${meses[mes]} de ${ano}`;
    document.getElementById('evento-dia').value = dia;
    document.getElementById('evento-mes').value = mes;
    document.getElementById('evento-ano').value = ano;
    
    // Verifica se já existe evento para este dia
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const eventoExistente = eventos.find(evento => 
        evento.dia == dia && evento.mes == mes && evento.ano == ano
    );
    
    if (eventoExistente) {
        document.getElementById('evento-hora').value = eventoExistente.hora;
        document.getElementById('evento-titulo').value = eventoExistente.titulo;
        document.getElementById('evento-descricao').value = eventoExistente.descricao || '';
    } else {
        document.getElementById('evento-hora').value = '';
        document.getElementById('evento-titulo').value = '';
        document.getElementById('evento-descricao').value = '';
    }
    
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-evento').style.display = 'none';
}

function salvarEvento() {
    const dia = document.getElementById('evento-dia').value;
    const mes = document.getElementById('evento-mes').value;
    const ano = document.getElementById('evento-ano').value;
    const hora = document.getElementById('evento-hora').value;
    const titulo = document.getElementById('evento-titulo').value;
    const descricao = document.getElementById('evento-descricao').value;
    
    if (!hora || !titulo) {
        alert('Por favor, preencha pelo menos a hora e o título do evento');
        return;
    }
    
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    
    // Remove evento existente para este dia, se houver
    const indexExistente = eventos.findIndex(evento => 
        evento.dia == dia && evento.mes == mes && evento.ano == ano
    );
    
    if (indexExistente !== -1) {
        eventos.splice(indexExistente, 1);
    }
    
    // Adiciona novo evento
    eventos.push({
        dia, mes, ano, hora, titulo, descricao
    });
    
    localStorage.setItem('eventos', JSON.stringify(eventos));
    fecharModal();
    inicializarCalendario();
}

function removerEvento() {
    const dia = document.getElementById('evento-dia').value;
    const mes = document.getElementById('evento-mes').value;
    const ano = document.getElementById('evento-ano').value;
    
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const novosEventos = eventos.filter(evento => 
        !(evento.dia == dia && evento.mes == mes && evento.ano == ano)
    );
    
    localStorage.setItem('eventos', JSON.stringify(novosEventos));
    fecharModal();
    inicializarCalendario();
}