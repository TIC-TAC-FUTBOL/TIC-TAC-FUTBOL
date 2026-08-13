const $=id=>document.getElementById(id);
function tab(id){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));$(id).classList.add("active")}
function add(text,type){const d=document.createElement("div");d.className="msg "+type;d.textContent=text;$("chatbox").appendChild(d);$("chatbox").scrollTop=$("chatbox").scrollHeight}
async function ask(q){add(q,"user");try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q})});const d=await r.json();add(d.answer||d.error,"bot")}catch(e){add("No se pudo conectar con el servidor.","bot")}}
$("form").onsubmit=e=>{e.preventDefault();const q=$("input").value.trim();if(q){$("input").value="";ask(q)}}
document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>ask(b.dataset.q));
add("¡Hola! Soy TIC TAC FUTBOL. ⚽ Pregúntame sobre fútbol.","bot");

$("notes").value=localStorage.getItem("ttf_notes")||"";
function saveNotes(){localStorage.setItem("ttf_notes",$("notes").value);$("saved").textContent="Guardado ✅"}

$("voiceBtn").onclick=()=>{
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){$("heard").textContent="Tu navegador no permite reconocimiento de voz.";return}
 const r=new SR();r.lang="es-CO";r.onresult=e=>{const q=e.results[0][0].transcript;$("heard").textContent="Escuché: "+q;tab("chat");ask(q)};r.start();
};
