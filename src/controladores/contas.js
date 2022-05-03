let bancoDeDados = require('../bancodedados');
let { indiceContaBancaria } = require('../indices_banco_de_dados');

const listarContasBancarias = (req, res) => {
    return res.status(200).json(bancoDeDados.contas);
}
const criarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const cpfEncontrado = bancoDeDados.contas.find(conta => {
        return conta.usuario.cpf === cpf;
    });
    if (cpfEncontrado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" });
    }

    const emailEncontrado = bancoDeDados.contas.find(conta => {
        return conta.usuario.email === email;
    });
    if (emailEncontrado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado!" });
    }

    let contaBancaria = {
        numero: indiceContaBancaria++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    bancoDeDados.contas.push(contaBancaria);

    return res.status(201).send();
}

const atualizarUsuarioDaContaBancaria = (req, res) => {
    const { numero } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if (!Number(numero)) {
        return res.status(400).json({ mensagem: "O numero da conta deve ser um número válido!" })
    }
    const contaEncontrada = bancoDeDados.contas.find(conta => {
        return conta.numero === Number(numero);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
    }

    const cpfEncontrado = bancoDeDados.contas.find(conta => {
        return conta.usuario.cpf === cpf;
    });
    if (cpfEncontrado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf informado!" });
    }

    const emailEncontrado = bancoDeDados.contas.find(conta => {
        return conta.usuario.email === email;
    });

    if (emailEncontrado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado!" });
    }

    contaEncontrada.usuario.nome = nome;
    contaEncontrada.usuario.cpf = cpf;
    contaEncontrada.usuario.data_nascimento = data_nascimento;
    contaEncontrada.usuario.telefone = telefone;
    contaEncontrada.usuario.email = email;
    contaEncontrada.usuario.senha = senha;

    return res.status(200).send();
}
const deletarConta = (req, res) => {
    const { numeroConta } = req.params;
    if (!Number(numeroConta)) {
        return res.status(400).json({ mensagem: "O numero da conta deve ser um número válido!" })
    }
    const contaEncontrada = bancoDeDados.contas.find(conta => {
        return conta.numero === Number(numeroConta);
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
    }

    if (contaEncontrada.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }

    const contas = bancoDeDados.contas.filter(conta => {
        return conta.numero !== Number(numeroConta);
    });

    bancoDeDados.contas = contas;

    return res.status(200).send();
}



module.exports = {
    listarContasBancarias,
    criarContaBancaria,
    atualizarUsuarioDaContaBancaria,
    deletarConta
};