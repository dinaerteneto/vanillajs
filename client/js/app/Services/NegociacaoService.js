class NegociacaoService {

    obterNegociacaoDaSemana(cb) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'negociacoes/semana');
        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    cb(null,JSON.parse(xhr.responseText)
                        .map(obj => new Negociacao(new Date(obj.data), obj.quantidade, obj.valor)));                                           
                } else {
                    cb('Não foi possível obter as negociações da semana', null);
                }
            }
        }
        xhr.send();
    }

}