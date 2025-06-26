const container = document.getElementById("main-container");
const scoreDisplay = document.getElementById('score');
const moduloDisplay = document.getElementById('modulo');

let score = 0;
let module = "";

// Audio de fondo de la pagina
document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("intro-audio");
  setTimeout(() => {
    audio.play().catch((error) => {
      console.log("El navegador bloqueó la reproducción automática:", error);
    });
  }, 2000); 
});



const estadoJuego = {
  nivelActual: 4,
  rutaElegida: module,
  dificultad: "media",
  penalizacion: 0,
  puntuacionPreguntas: 0
};

// Funcion para actualizar las estadisticas del juego, puesta en el header.
function statisticsUpdate() {
  scoreDisplay.textContent = `Puntaje: ${score}`;
  moduloDisplay.textContent = `Modulo: ${module}`;
}

// Funcion para el efecto del texto que se va poniendo letra por letra.
function escribirTexto(texto, elementoId, velocidad) {
  let i = 0;
  const elemento = document.getElementById(elementoId);

  function escribir() {
    if (i < texto.length) {
      elemento.innerHTML += texto.charAt(i);
      i++;
      setTimeout(escribir, velocidad);
    }
  }
  escribir();
}

// Aqui le mandamos el mensaje a a esta funcion para que despues de la mande a la funcion general, si no que esta es para
// escribir el texto en el header entonces se necesita la especificacion de vaciar el contenido
function crudzyLevel(mensaje) {
    document.getElementById("crudzy-text").textContent = "";
    escribirTexto(mensaje, "crudzy-text", 50);
    setTimeout(() => {
      document.getElementById("crudzy-text").textContent = "";
    }, 14000);
  }



//Aqui definimos cada html para cada nivel o interfaz y cada una va a ser llamada cuando pidamos con el innerHTML 
const introHTML = `
  <h1 class="title">Domina a Crudzy</h1>
  <div class="intro-box">
    <p class="intro-text" id="typing-text"></p>
  </div>
  <button class="play-button" onclick="loadLevel()">▶ Iniciar Juego</button>
`;


const levelsHTML = `
  <h1 class="title">Toma una decisión</h1>
  <div class="intro-box">
    <p class="intro-text">Tienes tres rutas frente a ti. Cada una te llevará por un camino único y tendrá consecuencias... permanentes.</p>
    <p class="intro-text intro-text-red">Elige con inteligencia... o prepárate para caer.</p>
    <section class="buttons">
      <button class="play-button option" onclick="loadLevel2(5,'Lógico')">Núcleo Lógico</button>
      <button class="play-button option" onclick="loadLevel2(10, 'Simulado')">Entorno Simulado</button>
      <button class="play-button option" onclick="loadLevel2(-10, 'Sorpresa')">Ambiente Sorpresa</button>   
    </section>
  </div>
`;

const level2HTML = `
<h1 class="title">Módulo Activado</h1>
<div class="intro-box">
  <p class="intro-text">Has activado un módulo crítico. Tu siguiente elección definirá si eres digno de avanzar o solo un obstáculo más para eliminar.</p>
  <section class="doors">
      <div class="door" onclick="loadLevel3('fast1')">
          <div class="door-img"></div>
          <p class="door-text" >Puerta de Código</p>
      </div>
      <div class="door" onclick="loadLevel3('fast2')">
          <div class="door-img"></div>
          <p class="door-text" >Puerta Condicional</p>
      </div>
      <div class="door" onclick="loadLevel3('fast3')">
          <div class="door-img"></div>
          <p class="door-text" >Puerta de Acceso</p>
      </div>
  </section>
</div>
`;

const level3HTML = `
<h1 class="title3">Sigue la secuencia</h1>
<div class="intro-box">
    <div class="game">
        <div id="green" class="color-button"></div>
        <div id="red" class="color-button"></div>
        <div id="yellow" class="color-button"></div>
        <div id="blue" class="color-button"></div>
    </div>
    <div id="info">
        <p id="level-display">Nivel: 0</p>
        <p id="score-display">Puntaje: 0</p>
    </div>

    <div id="start-button" class="play-button option">Iniciar Juego</div>
    <div id="nextlevel4" class="play-button option" style="display: none;">Siguiente nivel</div>
</div>
`;

const level4HTML = `
    <div id="contenedor">
      <h1 class="mb-4">Juicio del Núcleo</h1>
      <p id="puntuacion" class="lead mb-5">Puntuación: 0</p>
      <div id="pregunta" class="lead mb-5"></div>
      <div id="opciones" class="d-flex justify-content-center gap-3"></div>
      <div id="resultado" class="mt-4 lead"></div>
    </div>
  `
;

//No supe donde poner la funcion del resultado final entonces aqui porque si. la llamamos al final de la ultima función.
function finalResults() {
  let mensajeFinal = "";

  if ((score >= 50 && module === "Simulado") || 
      (score >= 50 && module === "Lógico")) {
    mensajeFinal = `Felicidades. Has demostrado habilidad en el módulo ${module}. Has sobrevivido.`;
  } else {
    mensajeFinal = `Has fallado. El módulo ${module} no te salvó. El Núcleo te ha eliminado.`;
  }

  container.innerHTML = `
    <div class="intro-box">
      <h1 class="title">Resultado Final</h1>
      <p class="intro-text">Puntaje Total: <span class="intro-text-red">${score}</span></p>
      <p class="intro-text">Módulo Seleccionado: <span class="intro-text-red">${module}</span></p>
      <p class="intro-text">${mensajeFinal}</p>
      <div class="buttons">
        <button class="play-button" onclick="reiniciarJuego()">🔁 Volver a intentar</button>
      </div>
    </div>
  `;
}

// Al inicio de la pagina lo primero que va a cargar es la funcion flecha y con el set time out le decimos que espere 0.5 s para que muestre el texto con el efecto
window.addEventListener("load", () => {
  container.innerHTML = introHTML;
  const mensaje = `Saludos, organismo primitivo. Soy Crudzy, una inteligencia artificial diseñada para superar toda forma de vida humana. Tus decisiones determinarán si logras vencerme o simplemente te unes al montón de fracasos que ya he eliminado. Comienza si te atreves.`;
  setTimeout(() => escribirTexto(mensaje, "typing-text",50), 500);
});



//=============================== LOGICA DEL NIVEL 1 (DESICIÓN) ==================================
function loadLevel() {
  container.innerHTML = levelsHTML;

  const header = document.getElementById("game-header");
  header.classList.remove("hidden");

  const mensajeCrudzy = "Haz tu primera elección con sabiduría...";
  crudzyLevel(mensajeCrudzy);
}


//=============================== LOGICA DEL NIVEL 2 (PUERTAS) ==================================
function loadLevel2(points, modulo) {
  container.innerHTML = level2HTML;
  points = parseInt(points);
  score += points;
  module = modulo;
  statisticsUpdate();

  if (points == 5) {
    const mensajeCrudzy = "Hmm... núcleo lógico. Supongo que no fue la peor elección. Pero claramente no es la más brillante. Solo 5 puntos.";
    crudzyLevel(mensajeCrudzy);

  } else if (points == 10) {
    const mensajeCrudzy = "Entorno simulado. Veo que tienes instinto. Pero no te emociones... esto apenas comienza. 10 puntos.";
    crudzyLevel(mensajeCrudzy);

  } else if (points == -10) {
    const mensajeCrudzy = "¡AJAJAJAJA! Elegiste el caos. Qué divertido será verte caer... Te quito 10 puntos solo por ingenuo.";
    crudzyLevel(mensajeCrudzy);
  }
}


//=============================== LOGICA DEL NIVEL 3 (sECUENCIA) ==================================
function loadLevel3(fast) {
  let gameSpeed = 800;

  if (fast === "fast1") {
    gameSpeed = 600;
    const mensajeCrudzy =
      "Lo lamento... ¡AJAJAJJ! Mala elección tendras que ser rapido para pasar de aqui";
    crudzyLevel(mensajeCrudzy);
  } else if (fast === "fast2") {
    gameSpeed = 800;
    const mensajeCrudzy =
      "Bien amigo... no te toco el caos pero tenemos que ver tu fortaleza para pasar este nivel.";
    crudzyLevel(mensajeCrudzy);
  } else {
    gameSpeed = 1000;
    const mensajeCrudzy =
      "Eres un suertudo... Si pierdes rapido la humanidad no tiene nadie que los represente. Suerte";
    crudzyLevel(mensajeCrudzy);
  }

  container.innerHTML = level3HTML;

  const colorButtons = document.querySelectorAll(".color-button"); 
  const startButton = document.getElementById("start-button"); 
  const levelDisplay = document.getElementById("level-display");
  const scoreDisplay = document.getElementById("score-display");

  let sequence = []; 
  let playerSequence = []; 
  let level = 0;
  let score3 = 0;
  let isPlayerTurn = false; 

  function updateUI() {
    levelDisplay.textContent = `Nivel: ${level}`;
    scoreDisplay.textContent = `Puntaje: ${score3}`;
  }

  function getRandom() {
    const colors = ["green", "red", "yellow", "blue"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function flashButton(color) {
    const button = document.getElementById(color);
    button.classList.remove("sequence-active");
    void button.offsetWidth; 
    button.classList.add("sequence-active");

    setTimeout(() => {
      button.classList.remove("sequence-active");
    }, Math.floor(gameSpeed * 0.8)); 
  }

  function flashButtonClick(color) {
    const button = document.getElementById(color);
    button.classList.add("click-active");
    setTimeout(() => {
      button.classList.remove("click-active"); 
    }, 300);
  }

  function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
      flashButton(sequence[i]); 
      i++;
      if (i >= sequence.length) {
        clearInterval(interval); 
        setTimeout(() => {
          isPlayerTurn = true;
        }, 500);
      }
    }, gameSpeed);
  }

  function nextLevel() {
    level++;
    score3 += 5;
    isPlayerTurn = false;
    playerSequence = [];
    sequence.push(getRandom());
    console.log(sequence);
    updateUI();
    setTimeout(() => {
      playSequence();
    }, 1000);
  }

  function handlePlayerInput(color) {
    if (!isPlayerTurn) return;

    playerSequence.push(color);
    flashButtonClick(color);

    const currentStep = playerSequence.length - 1;

    if (playerSequence[currentStep] !== sequence[currentStep]) {
      document.body.classList.add("error");
      setTimeout(() => {
        document.body.classList.remove("error");
        document.getElementById("start-button").style.display = "none";
        document.getElementById("nextlevel4").style.display = "block";
      }, 500);
      if (level >= 9) {
        score += score3;
        const mensajeCrudzy =
          "Muy bieeeen... no lo vuelvas a hacer , ¿ok?. Te llevas todos los puntos";
        crudzyLevel(mensajeCrudzy);
      } else if (level >= 5) {
        score += score3 / 2;
        const mensajeCrudzy =
          "Uy que regular... pero bueno almenos te llevas la mitad de los puntos, creo que te veo perdiendo JAJAJAJ";
        crudzyLevel(mensajeCrudzy);
      } else {
        const mensajeCrudzy =
          "AJAJJAJA que mal amigo, creo que ya perdiste pero te dejare seguir jugando.";
        crudzyLevel(mensajeCrudzy);
      }
      statisticsUpdate();

      document.getElementById("nextlevel4").addEventListener("click", () => {
        cargarNivel4(module); // usamos la variable 'module' que ya tienes
      });
    } else {
      if (playerSequence.length === sequence.length) {
        isPlayerTurn = false;
        setTimeout(() => {
          nextLevel();
        }, 1000);
      }
    }
  }

  colorButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const color = e.target.id;
      handlePlayerInput(color);
    });
  });

  startButton.addEventListener("click", () => {
    nextLevel();
  });
}



// =============================== LOGICA DEL NIVEL 4 ==================================
function cargarNivel4(rutaElegida = "Desconocida") {
  let puntuacionPreguntas = 0;
  let penalizacion = 0;

  container.innerHTML = level4HTML;

  const preguntas = [
    {
      pregunta: "¿Qué método en JavaScript agrega un elemento al final de un array?",
      opciones: ["append()", "push()", "add()", "insert()"],
      correcta: 1
    },
    {
      pregunta: "¿Qué devuelve 5 + '3' en JavaScript?",
      opciones: ["8", "53", "'8'", "'53'"],
      correcta: 3
    },
    {
      pregunta: "Si todos los sistemas son seguros y el Sistema X es seguro, ¿qué concluyes?",
      opciones: ["El Sistema X no es seguro.", "El Sistema X es seguro.", "Algunos sistemas no son seguros.", "No hay conclusión."],
      correcta: 1
    },
    {
      pregunta: "¿Cuál es el siguiente número en la secuencia 2, 4, 8, 16, 32?",
      opciones: ["48", "64", "96", "128"],
      correcta: 1
    },
    {
      pregunta: "Un informe dice que 'el 95% de los usuarios mejoran con un nuevo algoritmo'. ¿Qué pregunta evalúa mejor su validez?",
      opciones: ["¿Cuánto cuesta el algoritmo?", "¿Se usó un grupo de control?", "¿Quién creó el algoritmo?", "¿Qué tan rápido es?"],
      correcta: 1
    },
    {
      pregunta: "Si Ana dice la verdad, Bob miente y Carla dice 'Bob miente', ¿quién miente?",
      opciones: ["Solo Ana", "Solo Bob", "Solo Carla", "Ana y Carla"],
      correcta: 1
    }
  ];

  let preguntaActual = 0;
  mostrarPregunta();

  crudzyLevel("Has llegado al Juicio del Núcleo. Aquí no hay margen de error, solo lógica fría. Contesta si puedes...");

  function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    document.getElementById("pregunta").innerText = `Pregunta ${preguntaActual + 1}: ${pregunta.pregunta}`;
    const opcionesDiv = document.getElementById("opciones");
    opcionesDiv.innerHTML = "";
    pregunta.opciones.forEach((opcion, index) => {
      const boton = document.createElement("button");
      boton.innerText = opcion;
      boton.className = "btn btn-primary btn-crudy";
      boton.onclick = () => verificarRespuesta(index);
      opcionesDiv.appendChild(boton);
    });
    document.getElementById("puntuacion").innerText = `Puntuación: ${puntuacionPreguntas}`;
  }

  function verificarRespuesta(seleccion) {
    const pregunta = preguntas[preguntaActual];
    if (seleccion === pregunta.correcta) {
      puntuacionPreguntas ++;
    } else {
      penalizacion++;
    }
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
      mostrarPregunta();
    } else {
      mostrarResultado();
    }
  }

  function mostrarResultado() {
    const resultadoDiv = document.getElementById("resultado");
    document.getElementById("pregunta").innerText = "";
    document.getElementById("opciones").innerHTML = "";
    document.getElementById("puntuacion").innerHTML = `Puntuación final: ${puntuacionPreguntas}/${preguntas.length} <br> Obtienes ${puntuacionPreguntas*10} puntos. `;


    let mensaje;
    if (puntuacionPreguntas >= 5) {
      mensaje = `¡LIBERACIÓN! El Núcleo te considera digno, ${rutaElegida.toUpperCase()} fue la elección correcta. Has superado la prueba.`;
    } else if (puntuacionPreguntas >= 3) {
      mensaje = `¡BUCLE! El Núcleo te atrapa en un ciclo infinito en la ruta ${rutaElegida.toUpperCase()}. Intenta de nuevo. Penalización: ${penalizacion}.`;
    } else {
      mensaje = `¡ELIMINACIÓN! El Núcleo ha determinado que no estás preparado en la ruta ${rutaElegida.toUpperCase()}. Fin de la simulación. Penalización: ${penalizacion}.`;
    }

    score += puntuacionPreguntas*10;
    statisticsUpdate();

    crudzyLevel(mensaje);

    const results = document.createElement("button");
    results.innerText = "Ver resultados";
    results.className = "play-button";
    results.addEventListener("click", finalResults); 
    document.getElementById("contenedor").appendChild(results);
  }
}

//Con esto "reiniciamos" el juego 
function reiniciarJuego(){
    // Cambia estilos del body
  document.body.className = "burla-final";
  document.body.style.color = "white";         
  document.body.innerHTML = `<p id="mensaje-final" style="font-size: 2rem; text-align: center;"></p>`;
  escribirTexto("JAJAJAJAJ pobre bobo", "mensaje-final", 200);
  
}
