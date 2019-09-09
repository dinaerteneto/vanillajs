import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Mensagem} from '../models/Mensagem';
import {NegociacaoView} from '../views/NegociacaoView';
import {MensagemView} from '../views/MensagemView';
import {NegociacaoService} from '../services/NegociacaoService';
import {DateHelper} from '../helpers/DateHelper';
import {Bind} from '../helpers/Bind';
import {Negociacao} from '../models/Negociacao';
import {ConnectionFactory} from '../services/ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';

class NegociacaoController {

    constructor() {
        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');           

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(), 
            new NegociacaoView($('#negociacoesView')), 
            'adiciona', 'esvazia' , 'ordena', 'inverteOrdem');

        this._mensagem = new Bind(
            new Mensagem(), 
            new MensagemView($('#mensagemView')),
            'texto'
        );

        this._ordemAtual = '';

        this._negociacaoService = new NegociacaoService();
        this._init();
    }

    _init() {
        this._negociacaoService
            .lista()
            .then(negociacoes => 
                negociacoes.forEach(negociacao => 
                    this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => this._mensagem.texto = erro);

        setInterval(() => this.importaNegociacoes(), 2000);
    }
        
    importaNegociacoes() {

        this._negociacaoService
            .importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas'   
            }))
            .catch(erro => this._mensagem.texto = erro);                              
    }

    adiciona(event) {
        
        event.preventDefault();
        
        let negociacao = this._criaNegociacao();

        this._negociacaoService
            .cadastra(negociacao)
            .then(mensagem => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem;
                this._limpaFormulario();
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    apaga() {
        this._negociacaoService
            .apaga()
            .then(() => {
                this._listaNegociacoes.esvazia();
                this._mensagem.texto = 'Negociações apagadas com sucesso.';                
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    ordena(coluna) {
        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }   
        this._ordemAtual = coluna;
    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }

}

let negociacaoController = new NegociacaoController();
export function currentInstance() {
    return negociacaoController;
}