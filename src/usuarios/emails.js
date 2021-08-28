const nodemailer = require('nodemailer')

const configuracaoEmailProd = {
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USUARIO,
        pass: process.env.EMAIL_SENHA,
    },
    secure: true
}

const configuracaoEmailTest =  (contaTeste) => ({
    host: 'smtp.ethereal.email',
    auth: contaTeste
})

async function criaConfiguracaoEmail() {
    if (process.env.NODE_ENV === 'production') {
        return configuracaoEmailProd;
    } else {
        const contaTeste = await nodemailer.createTestAccount();
        return configuracaoEmailTest(contaTeste);
    }
}

class Email {
    async enviaEmail(usuario) {
        const configuracaoEmail = await criaConfiguracaoEmail();
        const transport = nodemailer.createTransport(configuracaoEmail)
        const info = await transport.sendMail(this)
        if (process.env.NODE_ENV !== 'production') {
            console.log('URL' + nodemailer.getTestMessageUrl(info))
        }
    }
}

class EmailVerificacao extends Email {
    constructor(usuario, endereco) {
        super();
        this.from = '"Formatacao" <noreplay@test.com>'
        this.to = usuario.email;
        this.subject = 'Verificação de e-mail';
        this.text = `Olá! Verifique seu e-mail aqui: ${endereco}`;
        this.html = `<h1>Olá!</h1><p>Verifique seu e-mail aqui: <a href="${endereco}">${endereco}</a></p>`
    }
}



module.exports = { EmailVerificacao }