# Projeto Pomodoro Timer

Timer da técnica Pomodoro: 25 minutos de foco, intervalo curto de 5 minutos e intervalo longo de 15 minutos a cada 4 sessões.

Tecnologias: HTML, CSS e JavaScript, sem framework. O tempo vive em `src/js/state.js`. A tela só mostra esse estado. O fim do ciclo é um instante (`Date.now()` + o que falta), então a contagem continua certa com a aba em segundo plano.

- Start, pause e a tecla espaço
- Ao terminar, o próximo intervalo já fica armado (curto, ou longo a cada 4 focos) e espera o start
- Tema verde ou rosa, lembrado neste navegador
- Som de conclusão e ambiente gerados no navegador
- Notificação no fim do ciclo, pedida no primeiro start, só enquanto o navegador ainda não decidiu

Testes: `npm test`

Link do projeto: https://lucas-pomodoro.vercel.app/

Imagem do projeto: ![image](https://raw.githubusercontent.com/lucwx/web-screenshot/main/screenshots/lucas-pomodoro.vercel.app/lucas-pomodoro.vercel.app_desktop.jpeg)
