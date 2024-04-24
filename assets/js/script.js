//Responsavel por buscar o busca no HTML e evitar que envie o formulário ao clicar em submit
//async estou avisando ao js que farei uma busca por código não ordenado código assincrono
document.querySelector('.busca').addEventListener('submit', async (event) => {
    event.preventDefault(); //Prefine o comportamento padrão do formulário, ou seja não vai enviar a informação

    let input = document.querySelector('#searchInput').value;//Traz a informação digita pelo usuario. value responsavel pela atualização de valor atravez do #searchInput

    console.log(input);

    if (input !== '') { //Se input diferente de vazio ele fará essa função
        clearInfo(); //Limpar a tela e depois mostrar o carregando.
        showWarning('Carregando...'); //Busca a function criada abaixo atravas do HTML

        /*
        Peguei a API do site de temperatura, mudamos o campo {city name}, para o input do HTML,
        pois ele será responsavel por receber a informação de busca, assim que tiver o retorno do
        que devera buscar ele começara a busca pela informação.
        O encodeURI é responsavel por fazer a busca exata da cidade digitada, exemplo
        Balneário Pinhal (No navegador não tem espaço na URL:https://www.gogle.com.br/Balneário Pinhal)
        Com o encodeURI ele irá padronizar a cidade para examente como ela é para API reconhecer
        (Balne%C3%A1rio%20Pinhal).

        Dentro da url adicionamos ainda mais dois elementos apos o final do appid da API
        01b2e0f43b331df1675dcd4bc4f804e = Essa é a chave KEY que ganhamos ao nos cadastrar no app
        &units=metric = Aqui ele informa que pegaremos também a unidade metrica da API
        &lang=pt_br = E que usaremos a lingua Portuguesa como principal.
        */

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=01b2e0f43b331df1675dcd4bc4f804ef&units=metric&lang=pt_br`; //Se não funcionar ainda pegar a do Bonyeki

        /*
        let results, será responsavel por armazenar a informação buscada no campo input
        quando utilizo o await faremos a requisição e aguardaremos a resposta para dar 
        continuidade no meu código.
        */
        let results = await fetch(url); /*await faz a requisão e aguarda o resultado. 
        ele fez a requisão e armazenou no results(resultado).
        */
        /*
        Após pegar a url vamos pegar o resultados e iremos transformar em um objeto do 
        javascript, para conseguirmos ler o resultado da operação.
        */
        let json = await results.json(); /*Aqui nessa linha eu pedi para o javascript transformar
       o result(resultado) em json, ele transoforma em json e guarda o seu valor em próprio json.
       */

        //console.log(json);//Como ele guardou esse resultado json vamos testar para ver como ficou.
        if (json.cod === 200) {
            /*
            A showInfo é a responsavel por buscar as informações na API, aqui definimos os elemetos nos objetos.
            Dessa forma o json buscara cada nome de elemento que consta aqui.
            */
            showInfo({
                name: json.name, //Responsavel por buscar o elemento
                country: json.sys.country,
                temp: json.main.temp,
                tempIcon: json.weather[0].icon,
                damp: json.main.humidity,
                visible: Math.floor(json.visibility / 1000),
                windSpeed: json.wind.speed,
                windAngle: json.wind.deg
            });

            /* 
            Aqui estamos limpando a tela e depois exibindo o aviso, dessa forma a tela não pisca 
            e traz somente a informação final sem aparecer o carregando.
            */
        } else {
            clearInfo();
            showWarning('Não encontramos esta localização.')
        }
    } else {
        clearInfo(); //Esse else é para quando não digitar nada e for fazer a pesquisa, ele limpara a tela.
    }
    imageBackground()
});

/* 
Aqui é a function que faz funcionar a showInfo, basicamente aqui é o motor da function.
Aqui será definido o que ela fará e as suas propriedades.
*/
function showInfo(json) {
    showWarning('');

    document.querySelector('.titulo').innerHTML = `${json.name}, ${json.country}`;
    document.querySelector('.tempInfo').innerHTML = `${json.temp} <sup>ºC</sup>`;
    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span`;
    document.querySelector('.dampInfo').innerHTML = `${json.damp} <span>%</span>`;
    document.querySelector('.visibleInfo').innerHTML = `${json.visible} <span>km</span`;
    document.querySelector('.temp img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windAngle - 90}deg)`;
    document.querySelector('.resultado').style.display = 'block'; //Como no CSS está definido como none a classe resultado, aqui está informando que será mostrado novamente.

    console.log("Valor de tempIcon:", json.tempIcon);
    imageBackground(json.tempIcon);
}


/*
Função: includes()
Descrição: Verifica se uma string contém outra string como uma substring.
Sintaxe: string.includes(substring)
Parâmetros:
substring: A string que será verificada se está contida na string principal.
Retorno: Retorna true se a string contém a substring e false caso contrário.
Essa função é útil quando você precisa verificar se uma parte específica de 
uma string está presente em outra string. No seu caso, você usou includes() 
para verificar se "13d" está contido no valor de tempIcon, permitindo que 
você alterasse o fundo do site quando necessário.
*/
function imageBackground(tempIcon) {
    if (tempIcon.includes("13d") || tempIcon.includes("13n")) {
        // Obtém a URL da imagem de fundo atual
        // Adiciona um timestamp à URL para forçar o navegador a recarregar a imagem
        let timestamp = new Date().getTime();
        let newBackground = 'url("assets/img/snow.svg?t=' + timestamp + '")';
        document.body.style.background = newBackground;
        document.body.style.backgroundSize = 'auto 80%'; // Define o tamanho da imagem como o tamanho original
        document.body.style.backgroundRepeat = 'no-repeat'; // Impede que a imagem seja repetida
        document.body.style.backgroundPosition = 'center top 30px'; // Centraliza a imagem na horizontal e a move 30px para cima
    } else if (tempIcon.includes("1d") || tempIcon.includes("1n")) {
        let timestamp = new Date().getTime();
        let newBackground = 'url("assets/img/sun.svg?t=' + timestamp + '")';
        document.body.style.background = newBackground;
        document.body.style.backgroundSize = 'auto 90%';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center top 50px';
    } else if (tempIcon.includes("2d") || tempIcon.includes("2n")) {
        let timestamp = new Date().getTime();
        let newBackground = 'url("assets/img/happySunCloud.svg?t=' + timestamp + '")';
        document.body.style.background = newBackground;
        document.body.style.backgroundSize = 'auto';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center top 50px';
    } else if (tempIcon.includes("3d") || tempIcon.includes("3n") || tempIcon.includes("4d") || tempIcon.includes("4n")) { //MUDAR ESSA IMAGEM PARA UMA DE 2 NUVENS JUNTAS
        let timestamp = new Date().getTime();
        let newBackground = 'url("assets/img/cloudy.svg?t=' + timestamp + '")';
        document.body.style.background = newBackground;
        document.body.style.backgroundSize = 'auto';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center top 60px';
    } else if (tempIcon.includes("9d") || tempIcon.includes("9n")) {
        let timestamp = new Date().getTime();
        let newBackground = 'url("assets/img/littleRain.svg?t=' + timestamp + '")';
        document.body.style.background = newBackground;
        document.body.style.backgroundSize = 'auto';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center top 50px';
    } else if (tempIcon.includes("10d") || tempIcon.includes("10n")) {
        let timestamp = new Date().getTime();
        let newBackground = 'url("assets/img/raining.svg?t=' + timestamp + '")';
        document.body.style.background = newBackground;
        document.body.style.backgroundSize = 'auto 70%';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
    } else if (tempIcon.includes("11d") || tempIcon.includes("11n")) {
        let timestamp = new Date().getTime();
        let newBackground = 'url("assets/img/heavyStorn.svg?t=' + timestamp + '")';
        document.body.style.background = newBackground;
        document.body.style.backgroundSize = 'auto';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center top 50px';
    } else if (tempIcon.includes("50d") || tempIcon.includes("50n")) {
        let timestamp = new Date().getTime();
        let newBackground = 'url("assets/img/parcial.svg?t=' + timestamp + '")';
        document.body.style.background = newBackground;
        document.body.style.backgroundSize = 'auto 80%';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
    } else {
        document.body.style.background = '';
    }
}
function clearInfo() {
    showWarning('');
    document.querySelector('.resultado').style.display = 'none';
}

/*
Essa function é responsavel pelo aviso, ela vai buscar a div no html,
incrementar o se(if) estiver diferente de vazio, vai retornar ao html 
atraves do metodo .innerHTML dentro da div aviso, ou seja a funtcion abaixo
serve para que ao escrever no campo e fazer a busca pela informação ele
retorne ao usuario que uma ação está sendo feita.
document.querySelector('.aviso').innerHTML = msg;
document.querySelector = Busca a classe no HTML nesse caso aviso
('.aviso) = classe definida no HTML
.innerHTML = informa que essa ação vai retornar ao HTML escolhido alguma modificação
em javascript.
*/
function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg;
}