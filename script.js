import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== CONFIG FIREBASE (SEUS DADOS) ===== */
const firebaseConfig = {
  apiKey: "AIzaSyC-Hhz0NmqE-knFuaflOwaxQdXdMWgivic",
  authDomain: "chat-carros.firebaseapp.com",
  projectId: "chat-carros",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===== SENHAS ===== */
const SITE_PASSWORD = "sitecarros10";
const ADM_PASSWORD = "10556";

let nome = "";

/* ===== LOGIN ===== */
window.entrar = () => {
  const nomeInput = document.getElementById("nameInput").value.trim();
  const senhaInput = document.getElementById("passInput").value;

  if (!nomeInput) {
    alert("Digite seu nome");
    return;
  }

  if (senhaInput !== SITE_PASSWORD) {
    alert("Senha do site incorreta!");
    return;
  }

  nome = nomeInput;

  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";

  carregarMensagens();
};

/* ===== CARREGAR MENSAGENS ===== */
function carregarMensagens() {
  const q = query(
    collection(db, "mensagens"),
    orderBy("time")
  );

  onSnapshot(q, (snapshot) => {
    const box = document.getElementById("messages");
    box.innerHTML = "";

    snapshot.forEach((docu) => {
      const m = docu.data();
      box.innerHTML += `
        <div class="msg">
          <b>${m.nome}</b>: ${m.texto}
        </div>
      `;
    });

    box.scrollTop = box.scrollHeight;
  });
}

/* ===== ENVIAR ===== */
window.enviar = async () => {
  const input = document.getElementById("msgInput");
  const texto = input.value.trim();
  if (!texto) return;

  await addDoc(collection(db, "mensagens"), {
    nome,
    texto,
    time: Date.now()
  });

  input.value = "";
};

/* ===== ADM ===== */
window.admin = async () => {
  const senha = prompt("Senha ADM:");

  if (senha !== ADM_PASSWORD) {
    alert("Senha ADM incorreta!");
    return;
  }

  const confirmar = confirm("Apagar TODAS as mensagens?");
  if (!confirmar) return;

  const snap = await getDocs(collection(db, "mensagens"));

  for (const d of snap.docs) {
    await deleteDoc(doc(db, "mensagens", d.id));
  }

  alert("🔥 Todas as mensagens foram apagadas!");
};
