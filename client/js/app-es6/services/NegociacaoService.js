import {HttpService} from './HttpService';
import {Negociacao} from '../models/Negociacao';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {ConnectionFactory} from '../services/ConnectionFactory';

export class NegociacaoService {

    constructor() {
        this.http = new HttpService();
    }

    
    importa(atual) {
        return this.obterNegociacoes()
            .then(negociacoes => 
                negociacoes.filter(negociacao => 
                    !atual.some(negociacaoExistente => 
                        JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível buscar negociações para importar');
            });
    }

    cadastra(negociacao) {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adicionada com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível adicionar a negociação')
            });
    }

    lista() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações')
            });
    }

    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível apagar as negociações')
            })
    }    

    obterNegociacaoDaSemana() {
        return this.http 
            .get('http://localhost:3000/negociacoes/semana')
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
            .get('http://localhost:3000/negociacoes/anterior')
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
            .get('http://localhost:3000/negociacoes/retrasada')
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