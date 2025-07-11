import React, { useState, useEffect } from "react";
import "./App.css";

const PERGUNTAS = [
  {
    pergunta: "Qual jogo eu mais jogo?",
    opcoes: [
      "Call Of Duty Warzone",
      "Valorant",
      "Minecraft",
      "Roblox",
    ],
  },
  {
    pergunta: "Qual meu animal favorito?",
    opcoes: ["Gato", "Cachorro", "Raposa", "Lobo"],
  },
  {
    pergunta: "Qual estado eu moro atualmente?",
    opcoes: ["RJ", "SP", "Toronto(Canada)"]
  },
  {
    pergunta: "O que eu faria se eu visse alguem chorando ou precisando de ajuda:",
    opcoes: [
      "Ria da cara da pessoa e derrubava a pessoa",
      "Matava",
      "Virava psicologo",
      "Mandaria 'e foda isso ai'"
    ],
  },
  {
    pergunta: "Qual meu estilo musica?",
    opcoes: ["ROCK", "INDIE", "FUNK", "ECLETICO"],
  },
];

function App() {
  const [nome, setNome] = useState("");
  const [respostas, setRespostas] = useState(Array(PERGUNTAS.length).fill(""));
  const [enviado, setEnviado] = useState(false);
  const [todasRespostas, setTodasRespostas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    buscarRespostas();
  }, []);

  function buscarRespostas() {
    setCarregando(true);
    fetch("http://localhost:3001/api/respostas")
      .then((res) => res.json())
      .then((data) => {
        setTodasRespostas(data);
        setCarregando(false);
      });
  }

  function handleChangeResposta(idx, valor) {
    setRespostas((prev) => {
      const novo = [...prev];
      novo[idx] = valor;
      return novo;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim() || respostas.some((r) => !r)) {
      alert("Preencha seu nome e todas as perguntas!");
      return;
    }
    fetch("http://localhost:3001/api/responder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, respostas }),
    })
      .then((res) => res.json())
      .then(() => {
        setEnviado(true);
        buscarRespostas();
      });
  }

  return (
    <div className="container">
      <h1 className="titulo">Você realmente me conhece?</h1>
      {!enviado ? (
        <form className="formulario" onSubmit={handleSubmit}>
          <input
            className="input-nome"
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          {PERGUNTAS.map((q, idx) => (
            <div className="pergunta" key={idx}>
              <div className="texto-pergunta">{q.pergunta}</div>
              <div className="opcoes">
                {q.opcoes.map((op, i) => (
                  <label key={i} className="opcao">
                    <input
                      type="radio"
                      name={`pergunta-${idx}`}
                      value={op}
                      checked={respostas[idx] === op}
                      onChange={() => handleChangeResposta(idx, op)}
                      required
                    />
                    {String.fromCharCode(65 + i)}: {op}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="botao-enviar" type="submit">Enviar</button>
        </form>
      ) : (
        <div className="enviado">
          <p>Respostas enviadas! Obrigado por participar.</p>
          <button className="botao-enviar" onClick={() => setEnviado(false)}>
            Responder novamente
          </button>
        </div>
      )}
    </div>
  );
}

export default App; 