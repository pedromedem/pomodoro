# Projeto Pomodoro Timer

Timer da técnica Pomodoro: 25 minutos de foco, intervalo curto de 5 minutos e intervalo longo de 15 minutos a cada 4 sessões.

Tecnologias: HTML, CSS e JavaScript, sem framework. O tempo vive em `src/js/state.js`. A tela só mostra esse estado. O fim do ciclo é um instante (`Date.now()` + o que falta), então a contagem continua certa com a aba em segundo plano.

- Um botão: Começar, Pausar, Continuar, Começar intervalo ou Voltar ao foco
- A barra de espaço faz o mesmo quando o foco não está num botão
- Ao terminar, a tela diz o que acabou e o próximo intervalo fica armado (curto, ou longo a cada 4 focos)
- Tema claro ou escuro, no mesmo tom do portfólio, lembrado neste navegador
- Música “A New Town” (CC0) e um sino ao começar e ao terminar
- Notificação no fim do ciclo, pedida no primeiro start, só enquanto o navegador ainda não decidiu

Testes: `npm test`

Link do projeto: https://lucas-pomodoro.vercel.app/

Imagem do projeto: ![image](https://raw.githubusercontent.com/lucwx/web-screenshot/main/screenshots/lucas-pomodoro.vercel.app/lucas-pomodoro.vercel.app_desktop.jpeg)
