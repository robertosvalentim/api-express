
const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: "A senha não foi informada!" });
    }

    if (senha_banco !== "Cubos123Bank") {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    next();
};

const validarCamposDaContaBancaria = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ mensagem: "O parâmetro nome não foi informado!" });
    }

    if (!cpf || cpf.trim() === "") {
        return res.status(400).json({ mensagem: "O parâmetro CPF não foi informado!" });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "O parâmetro data de nascimento não foi informado!" });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "O parâmetro telefone não foi informado!" });
    }

    if (!email) {
        return res.status(400).json({ mensagem: "O parâmetro telefone não foi informado!" });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "O parâmetro senha não foi informado!" });
    }

    next();
}

const validarCamposNasTransacoes = (req, res, next) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta) {
        return res.status(400).json("O número da conta e o valor são obrigatórios!");
    }
    const valorAux = Number(valor);
    if (!valor || !valorAux) {
        return res.status(400).json("O número da conta e o valor são obrigatórios!");
    }

    next();
};

module.exports = {
    validarSenha,
    validarCamposDaContaBancaria,
    validarCamposNasTransacoes
};