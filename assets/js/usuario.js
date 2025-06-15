// usuario.js
// Este arquivo pode ser simples já que a função principal está no script.js
document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', salvarCadastro);
    }
});

const CHAVE_USUARIO = 'usuarioHealthly';

function getUsuario() {
  const data = localStorage.getItem(CHAVE_USUARIO);
  return data ? JSON.parse(data) : null;
}

function salvarUsuario(usuario) {
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

function criarUsuario(nome, email, metas) {
  const usuario = {
    nome,
    email,
    metas,
    rotina: [],
    calendario: {},
    alarmes: []
  };
  salvarUsuario(usuario);
}

function atualizarCampoUsuario(campo, valor) {
  const usuario = getUsuario();
  if (!usuario) return;

  usuario[campo] = valor;
  salvarUsuario(usuario);
}

function adicionarNaLista(campo, item) {
  const usuario = getUsuario();
  if (!usuario || !Array.isArray(usuario[campo])) return;

  usuario[campo].push(item);
  salvarUsuario(usuario);
}

function atualizarCalendario(data, evento) {
  const usuario = getUsuario();
  if (!usuario) return;

  usuario.calendario[data] = evento;
  salvarUsuario(usuario);
}
