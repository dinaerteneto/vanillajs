import {HttpService} from './HttpService';
import {Negociacao} from '../models/Negociacao';

export class NegociacaoService {

    constructor() {
        this.http = new HttpService();
    }

    obterNegociacaoDaSemana() {
        return this.http 
            .get('negociacoes/semana')
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana.');
            });
    }

    obterNegociacaoDaSemanaPassada() {
 
        return this.http 
            .get('negociacoes/anterior')
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana passada.');
            });
    }

    obterNegociacaoDaSemanaRetrasada() {
        return this.http 
            .get('negociacoes/retrasada')
            .then(negociacoes => {
               return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana retrasada.');
            });
    }

    obterNegociacoes() {
        return Promise.all([
            this.obterNegociacaoDaSemana(),
            this.obterNegociacaoDaSemanaPassada(),
            this.obterNegociacaoDaSemanaRetrasada()
        ])
        .then(periodos => {
            return periodos.reduce((dados, periodo) => dados.concat(periodo), []);
         })
        .catch(erro => {
            console.log(erro);
            throw new Error(erro);            
        });        
    }

}