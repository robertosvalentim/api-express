const express = require('express');
const { listarContasBancarias, criarContaBancaria, atualizarUsuarioDaContaBancaria, deletarConta } = require('./controladores/contas');
const { depositar, sacar, transferir, saldo, extrato } = require('./controladores/transacoes');
const { validarSenha, validarCamposDaContaBancaria, validarCamposNasTransacoes } = require('./intermediarios');
const rotas = express();


rotas.get('/contas', validarSenha, listarContasBancarias);
rotas.post('/contas', validarCamposDaContaBancaria, criarContaBancaria);
rotas.put('/contas/:numero', validarCamposDaContaBancaria, atualizarUsuarioDaContaBancaria);
rotas.delete('/contas/:numeroConta', deletarConta);

rotas.post('/transacoes/depositar', validarCamposNasTransacoes, depositar);
rotas.post('/transacoes/sacar', validarCamposNasTransacoes, sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);

module.exports = rotas;