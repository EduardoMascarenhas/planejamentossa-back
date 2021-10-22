const { sendEmailWithNodemailer } = require("../helpers/email");

exports.recuperarSenha = (req, res) => {
  const { userId, email } = req.body;
  const emailData = {
    from: "SGPSE <portalestagiario@gmail.com>",
    to: email,
    subject: "Recuperação de Senha",
    html: `
        <h1>Olá ${email}</h1>
        <hr />
        <h3>Para recuperar a sua senha basta clicar no link abaixo.</h3>
        <a href="https://portaldoestagiariofsa.com.br/recuperar/${userId}" target="_blank" rel="noreferrer noopener">Ativar Conta</a>
        <hr />
      `,
  };

  sendEmailWithNodemailer(req, res, emailData);
};

exports.novoCadastro = (req, res) => {
  const { email, nome, _id } = req.body;

  const emailData = {
    from: "SGPSE <portalestagiario@gmail.com>",
    to: email,
    subject: "Novo Cadastro",
    html: `
        <h1>Olá ${nome}</h1>
        <hr />
        <h3>Para ativar a conta e fazer o login no portal basta clicar no link abaixo.</h3>
        <a href="https://portaldoestagiariofsa.com.br/api/user/ativar/${_id}" target="_blank" rel="noreferrer noopener">Ativar Conta</a>
        <hr />
      `,
  };

  sendEmailWithNodemailer(req, res, emailData);
};

exports.novoCadastro2 = (req, res) => {
  const { email, nome, _id } = req.body;

  const emailData2 = {
    from: "SGPSE Portal <portalestagiario@gmail.com>",
    to: "portalestagiario@gmail.com",
    subject: "Novo Cadastro",
    html: `
        <h1>Um novo usuário se cadastrou no portal</h1>
        <hr />
        <h3>O usuário ${nome} se cadastrou.</h3>
        <h3>Email: ${email}.</h3>
        <hr />
      `,
  };
  sendEmailWithNodemailer(req, res, emailData2);
};

exports.novaInscricao = (req, res) => {
  const {
    email,
    nome,
    checkDeficiencia,
    checkEnsinoBolsa,
    checkEnsinoMedio,
    checkModalidade,
    checkTermos,
    declara50,
    checkCad,
    anoIngresso,
    bairro,
    campus,
    celular,
    cep,
    complemento,
    corRaca,
    cpf,
    cpfResp,
    curso,
    dataNasc,
    estadoCivil,
    logradouro,
    municipio,
    municipioCampus,
    nisAluno,
    nisResp,
    nomeResp,
    numeroCasa,
    orgaoExp,
    rg,
    sexo,
    telefoneFixo,
    tipoEnsino,
    turno,
    universidade,
  } = req.body;

  const emailData3 = {
    from: "SGPSE Portal <portalestagiario@gmail.com>",
    to: "portalestagiario@gmail.com",
    subject: "Nova Inscrição",
    html: `
        <h1>Nova inscrição através do Portal do Estagiário</h1>
        <hr />
        <h3>O usuário ${nome} se cadastrou.</h3>
        <h3>Email: ${email}.</h3>
        
        <h3>Está cadastrado no CadÚnico? ${checkCad === 0 ? "SIM" : "NÃO"}</h3>
        <h3>NIS do aluno: ${checkCad === 0 ? `${nisAluno}` : "NÃO"}</h3>
        <h3>NIS do responsável: ${checkCad === 0 ? `${nisResp}` : "NÃO"}</h3>
        <h3>Nome do responsável: ${checkCad === 0 ? `${nomeResp}` : "NÃO"}</h3>
        <h3>CPF do responsável: ${checkCad === 0 ? `${cpfResp}` : "NÃO"}</h3>
        <hr />
        <h2>Dados do Aluno</h2>
        <h3>Gênero: ${
          sexo === 1 ? "FEMININO" : sexo === 2 ? "MASCULINO" : ""
        }</h3>
        <h3>Estado civil: ${
          estadoCivil === 1
            ? "SOLTEIRO(A)"
            : estadoCivil === 2
            ? "CASADO(A)"
            : estadoCivil === 3
            ? "DIVORCIADO(A)"
            : estadoCivil === 4
            ? "VIÚVO(A)"
            : ""
        }</h3>
        <h3>CPF: ${cpf}</h3>
        <h3>RG: ${rg}</h3>
        <h3>Órgão expedidor: ${orgaoExp}</h3>
        <h3>Data de nascimento: ${dataNasc}</h3>
        <h3>Cor Raça: ${
          corRaca === 1
            ? "BRANCA"
            : corRaca === 2
            ? "PRETA"
            : corRaca === 3
            ? "AMARELA"
            : corRaca === 4
            ? "INDÍGENA"
            : corRaca === 5
            ? "PARDA"
            : corRaca === 6
            ? "NÃO DECLARADA"
            : ""
        }</h3>
        <h3>Município: ${municipio}</h3>
        <h3>CEP: ${cep}</h3>
        <h3>Bairro: ${bairro}</h3>
        <h3>Logradouro: ${logradouro}</h3>
        <h3>Número: ${numeroCasa}</h3>
        <h3>Complemento: ${complemento}</h3>
        <h3>Telefone: ${telefoneFixo}</h3>
        <h3>Celular: ${celular}</h3>
        <hr />
        <h2>Dados de Inscrição</h2>
        <h3>Modalidade: ${
          checkModalidade === 0
            ? "PRESENCIAL"
            : checkModalidade === 1
            ? "EAD"
            : ""
        }</h3>
        <h3>Tipo de ensino superior: ${
          tipoEnsino === 1
            ? "ESTADUAL"
            : tipoEnsino === 2
            ? "FEDERAL"
            : tipoEnsino === 3
            ? "PARTICULAR"
            : ""
        }</h3>
        <h3>Universidade: ${universidade}</h3>
        <h3>Campus/Polo: ${campus}</h3>
        <h3>Município do Campus: ${municipioCampus}</h3>
        <h3>Curso: ${curso}</h3>
        <h3>Ano de Ingresso: ${anoIngresso}</h3>
        <h3>Turno: ${
          turno === 1
            ? "MATUTINO"
            : turno === 2
            ? "VESPERTINO"
            : turno === 3
            ? "NOTURNO"
            : ""
        }</h3>
        <h3>Possui alguma deficiência? ${
          checkDeficiencia === 0 ? "Sim" : "Não"
        }</h3>
        <h3>Declarou que concluiu pelomenos 50% do curso? ${
          declara50 === true ? "SIM" : "NÃO"
        }</h3>
        <h3>Estudou todo o ensino médio em escola pública? ${
          checkEnsinoMedio === 0 ? "SIM" : checkEnsinoMedio === 1 ? "NÃO" : ""
        }</h3>
        <h3>Estudou todo o ensino médio em escola particular como bolsista? ${
          checkEnsinoBolsa === 0 ? "SIM" : checkEnsinoBolsa === 1 ? "NÃO" : ""
        }</h3>
        <hr />
        <h1>Termos de Aceitação</h1>
        <h2>
          ${
            checkTermos === true
              ? `Eu ${nome} declaro que li e estou ciente dos termos de aceitação.`
              : `Eu ${nome} declaro que li e não aceito os termos de aceitação.`
          }
        </h2>
        
        <hr />
      `,
  };
  sendEmailWithNodemailer(req, res, emailData3);
};

exports.novaInscricao2 = (req, res) => {
  const {
    email,
    nome,
    checkDeficiencia,
    checkEnsinoBolsa,
    checkEnsinoMedio,
    checkModalidade,
    checkTermos,
    declara50,
    checkCad,
    anoIngresso,
    bairro,
    campus,
    celular,
    cep,
    complemento,
    corRaca,
    cpf,
    cpfResp,
    curso,
    dataNasc,
    estadoCivil,
    logradouro,
    municipio,
    municipioCampus,
    nisAluno,
    nisResp,
    nomeResp,
    numeroCasa,
    orgaoExp,
    rg,
    sexo,
    telefoneFixo,
    tipoEnsino,
    turno,
    universidade,
  } = req.body;

  const emailData4 = {
    from: "SGPSE <portalestagiario@gmail.com>",
    to: email,
    subject: "Nova Inscrição",
    html: `
        <h1>Olá ${nome}</h1>
        <hr />
        <h3>Inscrição concluída com sucesso!</h3>
        <h3>Agora é só aguardar novas atualizações sobre o processo através do nosso portal.</h3>
        <hr />
      `,
  };
  sendEmailWithNodemailer(req, res, emailData4);
};
