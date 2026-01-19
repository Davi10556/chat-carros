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

// 🔴 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyC-Hhz0NmqE-knFuaflOwaxQdXdMWgivic",
  authDomain: "chat-carros.firebaseapp.com",
  projectId: "chat-carros",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let nome = "";

/* ===== LOGIN ===== */
window.entrar = () => {
  nome = document.getElementById("nameInput").value.trim();
  if (!nome) return;

  localStorage.setItem("nome", nome);

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
    nome: nome,
    texto: texto,
    time: Date.now()
  });

  input.value = "";
};

/* ===== ADM ===== */
window.admin = async () => {
  const senha = prompt("Senha ADM:");

  if (senha !== "10556") {
    alert("Senha incorreta!");
    return;
  }

  const confirmar = confirm("TEM CERTEZA que deseja apagar TODAS as mensagens?");
  if (!confirmar) return;

  const snap = await getDocs(collection(db, "mensagens"));

  for (const d of snap.docs) {
    await deleteDoc(doc(db, "mensagens", d.id));
  }

  alert("🔥 Todas as mensagens foram apagadas!");
};
