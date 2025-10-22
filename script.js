// Espera o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function () {
  const botaoSimulacao = document.getElementById("executar-simulacao");
  const oilSimulation = document.querySelector('.oil-simulation');
  const resultsDiv = document.querySelector('.results');


  // Inicialização do gráfico Chart.js para mostrar a redução da poluição ao longo do tempo
  // O gráfico começa com poluição em 100% no dia 0, representando o estado inicial antes da simulação
  const ctx = document.getElementById('pollutionChart').getContext('2d');
  const pollutionChart = new Chart(ctx, {
    type: 'line', // Tipo de gráfico: linha para mostrar progresso ao longo do tempo
    data: {
      labels: [0], // Dias, começando com dia 0
      datasets: [{
        label: 'Poluição (%)', // Legenda do dataset
        data: [100], // Dados iniciais: 100% de poluição no dia 0
        borderColor: '#00ffff', // Cor da linha: ciano para combinar com o tema
        backgroundColor: 'rgba(0, 255, 255, 0.2)', // Fundo semi-transparente mais visível
        fill: true, // Preencher a área abaixo da linha
        tension: 0.3, // Suavizar a linha
        pointBackgroundColor: '#00ffff', // Cor dos pontos
        pointBorderColor: '#ffffff', // Borda branca dos pontos
        pointRadius: 5, // Tamanho dos pontos
        pointHoverRadius: 7 // Tamanho ao passar o mouse
      }]
    },
    options: {
      responsive: true, // Gráfico responsivo
      maintainAspectRatio: false, // Permitir altura personalizada
      plugins: {
        title: {
          display: true,
          text: 'Redução da Poluição ao Longo do Tempo',
          font: {
            size: 18,
            weight: 'bold'
          },
          color: '#00ffff'
        },
        legend: {
          display: true,
          labels: {
            font: {
              size: 14
            },
            color: '#cde6f5'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#00ffff',
          bodyColor: '#cde6f5',
          callbacks: {
            label: function(context) {
              return `Dia ${context.label}: ${context.parsed.y.toFixed(1)}% de poluição`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true, // Eixo Y começa em 0
          max: 100, // Máximo 100% para poluição
          title: {
            display: true,
            text: 'Poluição (%)',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#00ffff'
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#cde6f5'
          },
          grid: {
            color: 'rgba(0, 255, 255, 0.2)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Dias',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#00ffff'
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#cde6f5'
          },
          grid: {
            color: 'rgba(0, 255, 255, 0.2)'
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad'
      }
    }
  });


  // Função para calcular os resultados baseados nos filtros selecionados
  function calcularResultados(ambiente, tipo, metodo) {
    let tempo, reducao, bioprodutos;


    if (metodo === 'biológico') {
      // Método biológico: melhores resultados
      if (ambiente === 'marinho') {
        if (tipo === 'leve') {
          tempo = 10;
          reducao = 95;
          bioprodutos = 'Biossurfactantes, Enzimas, Biopolímeros (PHAs)';
        } else { // pesado
          tempo = 15;
          reducao = 90;
          bioprodutos = 'Biossurfactantes, Enzimas, Ácidos graxos longos';
        }
      } else { // terrestre
        tempo = tipo === 'leve' ? 12 : 18;
        reducao = tipo === 'leve' ? 93 : 88;
        bioprodutos = 'Biossurfactantes, Enzimas, Biofertilizantes';
      }
    } else { // tradicional
      // Método tradicional: piores resultados
      if (ambiente === 'marinho') {
        if (tipo === 'leve') {
          tempo = 25;
          reducao = 75;
        } else { // pesado
          tempo = 35;
          reducao = 65;
        }
      } else { // terrestre
        if (tipo === 'leve') {
          tempo = 30;
          reducao = 70;
        } else { // pesado
          tempo = 40;
          reducao = 60;
        }
      }
      bioprodutos = 'produz ácidos graxos simples, CO₂ e biomassa; não gera bioprodutos de alto valor agregado.';
    }


    return { tempo, reducao, bioprodutos};
  }


  // Função para obter os valores selecionados dos filtros
  function obterSelecoes() {
    const ambiente = document.querySelector('input[name="ambiente"]:checked').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const metodo = document.querySelector('input[name="metodo"]:checked').value;
    return { ambiente, tipo, metodo };
  }


  // Event listener para o botão de simulação
  // Esta função é acionada quando o usuário clica no botão "EXECUTAR SIMULAÇÃO"
  botaoSimulacao.addEventListener("click", function () {
    // Obtém as seleções dos filtros
    // Captura os valores atuais dos radios selecionados para ambiente, tipo de petróleo e método
    const { ambiente, tipo, metodo } = obterSelecoes();


    // Adiciona classe de simulação para animação
    // Aplica a classe CSS 'simulating' para ativar a animação de pulso na imagem de simulação
    oilSimulation.classList.add('simulating');


    // Simula um delay de processamento (1 segundo)
    // Usa setTimeout para simular o tempo de cálculo da simulação
    setTimeout(() => {
      // Calcula os resultados baseados nas seleções
      // Chama a função para obter tempo, redução e biorrodutos conforme as configurações
      const resultados = calcularResultados(ambiente, tipo, metodo);


      // Atualiza o HTML dos resultados
      // Insere os novos valores no DOM da div .results
      resultsDiv.innerHTML = `
        <p><strong>Tempo de Limpeza Previsto:</strong> ${resultados.tempo} dias</p>
        <p><strong>Redução da Poluição:</strong> ${resultados.reducao}%</p>
        <p><strong>Geração de Bioprodutos:</strong> ${resultados.bioprodutos}</p>
      `;


      // Atualização do gráfico com a simulação de degradação progressiva
      // Gera os dados para o gráfico: labels (dias de 0 a tempo) e data (poluição decrescendo linearmente de 100% para (100 - reducao)%)
      const tempo = resultados.tempo;
      const reducao = resultados.reducao;
      const labels = Array.from({length: tempo + 1}, (_, i) => i); // Array de dias: [0, 1, 2, ..., tempo]
      const data = labels.map(day => Math.max(0, 100 - (reducao / tempo) * day)); // Poluição por dia: redução linear, não abaixo de 0


      // Atualiza os dados do gráfico Chart.js
      // Modifica os labels e os dados do dataset, então chama update() para animar a transição
      pollutionChart.data.labels = labels;
      pollutionChart.data.datasets[0].data = data;
      pollutionChart.update('active'); // Atualiza com animação ativa para mostrar o progresso suavemente


      // Remove a classe de simulação após atualizar
      // Finaliza a animação removendo a classe CSS
      oilSimulation.classList.remove('simulating');


      // Rola para o topo da página após a simulação
      window.scrollTo(0, 0);
    }, 1000); // 1 segundo de delay para simular processamento
  });
});
