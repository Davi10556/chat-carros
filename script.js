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

/* ===== FIREBASE (SEUS DADOS) ===== */
const firebaseConfig = {
  apiKey: "AIzaSyC-Hhz0NmqE-knFuaflOwaxQdXdMWgivic",
  authDomain: "chat-carros.firebaseapp.com",
  projectId: "chat-carros",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===== HASHES DAS SENHAS ===== */
const SITE_PASSWORD_HASH =
  "6c1c0a3e9f2db8d8c2b7c4e50cbdcfb4b36f52c31a1f6f1c1a8c5c9c63f59d51";

const ADM_PASSWORD_HASH =
  "9f1f8f2f6d2a1d3a1a2c54b3e07a6dbe6f5c99f9b9a2f3b1a98f1f9f1a1c2e77";

let nome = "";

/* ===== FUNÇÃO DE CRIPTOGRAFIA ===== */
async function hashSenha(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ===== LOGIN ===== */
window.entrar = async () => {
  const nomeInput = document.getElementById("nameInput").value.trim();
  const senhaInput = document.getElementById("passInput").value;

  if (!nomeInput || !senhaInput) {
    alert("Preencha todos os campos");
    return;
  }

  const senhaHash = await hashSenha(senhaInput);

  if (senhaHash !== SITE_PASSWORD_HASH) {
    alert("Senha do site incorreta!");
    return;
  }

  nome = nomeInput;

  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";

  carregarMensagens();
};

/* ===== MENSAGENS ===== */
function carregarMensagens() {
  const q = query(collection(db, "mensagens"), orderBy("time"));

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
  if (!senha) return;

  const senhaHash = await hashSenha(senha);

  if (senhaHash !== ADM_PASSWORD_HASH) {
    alert("Senha ADM incorreta!");
    return;
  }

  const confirmar = confirm("APAGAR TODAS AS MENSAGENS?");
  if (!confirmar) return;

  const snap = await getDocs(collection(db, "mensagens"));

  for (const d of snap.docs) {
    await deleteDoc(doc(db, "mensagens", d.id));
  }

  alert("🔥 Todas as mensagens foram apagadas!");
};
