import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, addDoc,
  query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔴 COLE AQUI SEU firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyC-Hhz0NmqE-knFuaflOwaxQdXdMWgivic",
  authDomain: "chat-carros.firebaseapp.com",
  projectId: "chat-carros",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let nome = "";

window.entrar = () => {
  nome = document.getElementById("nameInput").value.trim();
  if (!nome) return;

  localStorage.setItem("nome", nome);

  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";

  carregarMensagens();
};

function carregarMensagens() {
  const q = query(
    collection(db, "mensagens"),
    orderBy("time")
  );

  onSnapshot(q, (snapshot) => {
    const box = document.getElementById("messages");
    box.innerHTML = "";

    snapshot.forEach(doc => {
      const m = doc.data();
      box.innerHTML += `
        <div class="msg">
          <b>${m.nome}</b>: ${m.texto}
        </div>
      `;
    });

    box.scrollTop = box.scrollHeight;
  });
}

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
