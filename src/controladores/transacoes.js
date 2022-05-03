let bancoDeDados = require('../bancodedados');
const { format } = require('date-fns');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    const valorAux = Number(valor);

    if (valorAux < 1) {
        return res.status(400).json("Não é permitido depósitos com valores negativos ou zerados!");
    }

    const contaEncontrada = bancoDeDados.contas.find(conta => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
    }

    contaEncontrada.saldo += valorAux;

    const registro = {
        data: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
        numero_conta,
        valor: valorAux
    }

    bancoDeDados.depositos.push(registro);

    return res.status(201).send();
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const valorAux = Number(valor);

    if (!senha || senha.trim() === "") {
        return res.status(400).json({ mensagem: "A senha deve ser informada!" });
    }

    const contaEncontrada = bancoDeDados.contas.find(conta => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha inválida!" });
    }

    if (contaEncontrada.saldo - valorAux < 0) {
        return res.status(400).json({ mensagem: "Você não possui saldo suficiente para realizar essa operação!" });
    }

    contaEncontrada.saldo -= valorAux;

    const registro = {
        data: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
        numero_conta,
        valor: valorAux
    }

    bancoDeDados.saques.push(registro);

    return res.status(201).send();
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !Number(numero_conta_origem)) {
        return res.status(400).json({ mensagem: "Número da conta de origem não informado ou inválido!" });
    }
    if (!numero_conta_destino || !Number(numero_conta_destino)) {
        return res.status(400).json({ mensagem: "Número da conta de destino não informado ou inválido!" });
    }
    if (!valor || Number(valor) < 1) {
        return res.status(400).json({ mensagem: "Valor não informado ou inválido!" });
    }
    if (!senha || senha.trim() === "") {
        return res.status(400).json({ mensagem: "Senha não informada!" });
    }

    const contaBancariaOrigem = bancoDeDados.contas.find(conta => {
        return conta.numero === Number(numero_conta_origem);
    });

    if (!contaBancariaOrigem) {
        return res.status(404).json({ mensagem: "Conta bancária de origem não encontrada!" });
    }

    const contaBancariaDestino = bancoDeDados.contas.find(conta => {
        return conta.numero === Number(numero_conta_destino);
    });

    if (!contaBancariaDestino) {
        return res.status(404).json({ mensagem: "Conta bancária de destino não encontrada!" });
    }

    if (contaBancariaOrigem.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }

    const valorAux = Number(valor);

    if (contaBancariaOrigem.saldo - valorAux < 0) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }

    contaBancariaOrigem.saldo -= valorAux;
    contaBancariaDestino.saldo += valorAux;

    const registro = {
        data: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor: valorAux
    }

    bancoDeDados.transferencias.push(registro);

    return res.status(201).send();
};

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !Number(numero_conta)) {
        return res.status(400).json({ mensagem: "Número da conta não informado ou inválido!" });
    }

    if (!senha || senha.trim() === "") {
        return res.status(400).json({ mensagem: "Senha não informada!" });
    }

    const contaBancaria = bancoDeDados.contas.find(conta => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaBancaria) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (contaBancaria.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }

    return res.status(200).json({ saldo: contaBancaria.saldo });

}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !Number(numero_conta)) {
        return res.status(400).json({ mensagem: "Número da conta não informado ou inválido!" });
    }

    if (!senha || senha.trim() === "") {
        return res.status(400).json({ mensagem: "Senha não informada!" });
    }

    const contaBancaria = bancoDeDados.contas.find(conta => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaBancaria) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (contaBancaria.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }

    const depositos = bancoDeDados.depositos.filter(deposito => {
        return deposito.numero_conta === numero_conta;
    });

    const saques = bancoDeDados.saques.filter(saque => {
        return saque.numero_conta === numero_conta;
    });

    const transferenciasEnviadas = bancoDeDados.transferencias.filter(transferencia => {
        return transferencia.numero_conta_origem === numero_conta;
    });

    const transferenciasRecebidas = bancoDeDados.transferencias.filter(transferencia => {
        return transferencia.numero_conta_destino === numero_conta;
    });

    const objetoExtrato = {
        depositos,
        saques,
        transferenciasEnviadas,
        transferenciasRecebidas
    }

    return res.status(200).json(objetoExtrato);
};

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
};