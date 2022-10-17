const CheerioModule = require('cheerio');
const axios = require('axios')

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mesesDic = {
    "janeiro": '01',
    "fevereiro": '02',
    "março": '03',
    "abril": '04',
    "maio": '05',
    "junho": '06',
    "julho": '07',
    "agosto": '08',
    "setembro": '09',
    "outubro": '10',
    "novembro": '11',
    "dezembro": '12',
}

const convert = (html) => {
    var jsonResponse = [];
    var $ = CheerioModule.load(html);

    $('table').each(function(i, table) {
      var tableAsJson = [];
      var columnHeadings = [];
      $(table).find('tr').each(function(i, row) {
        $(row).find('th').each(function(j, cell) {
          columnHeadings[j] = $(cell).text().trim();
        });
      });

      $(table).find('tr').each(function(i, row) {
        var rowAsJson = {};
        $(row).find('td').each(function(j, cell) {
          if (columnHeadings[j]) {
            rowAsJson[ columnHeadings[j] ] = $(cell).text().trim();
          } else {
            rowAsJson[j] = $(cell).text().trim();
          }
        });

        if (JSON.stringify(rowAsJson) != '{}')
          tableAsJson.push(rowAsJson);
      });

      if (tableAsJson.length != 0)
        jsonResponse.push(tableAsJson);
    });
    return jsonResponse[0];
  }

const formatData = (allMenu) => {   
    const fixedMenu = Object.values(allMenu)
    const carneSegunda = 'Frango ao molho de mostarda'
    const complementoSegunda = 'Brócolis cozido'
    const salada1Segunda = 'Alface'
    const salada2Segunda = 'Cenoura ralada'
    const sobremesaSegunda = 'Laranja'
    const molhoSegunda = 'Molho de ervas'

    // terca feira -- feito
    const carneTerca = 'Lombinho suíno à portuguesa'
    const complementoTerca = 'Mandioquinha'
    const salada1Terca = 'Agrião'
    const salada2Terca = 'Beterraba Ralada'
    const sobremesaTerca = 'Laranja'
    const molhoTerca = 'Molho de mostarda'

    // quarta feira -- feito
    const carneQuarta = 'Carne moída com azeitonas'
    const complementoQuarta = 'Farofa colorida'
    const salada1Quarta = 'Chicória'
    const salada2Quarta = 'Rabanete Ralado'
    const molhoQuarta = 'Vinagrete'
    const sobremesaQuarta = 'Banana'


    // quinta feira -- feito
    const carneQuinta = 'Frango ao molho vermelho'
    const complementoQuinta = 'Jardineira de legumes I'
    const salada1Quinta = 'Rúcula'
    const salada2Quinta = 'Pepino Rodelas'
    const sobremesaQuinta = 'Iogurte'
    const molhoQuinta = 'Molho de ervas'

    // sexta feira -- feito
    const carneSexta = 'Filé de peixe empanado'
    const complementoSexta = 'Abóbora cozida'
    const salada1Sexta = 'Espinafre'
    const salada2Sexta = 'Cenoura ralada'
    const sobremesaSexta = 'Laranja'
    const molhoSexta = 'Molho de mostarda'

    // sabado -- feito
    const carneSabado = 'Não informado'
    const complementoSabado = 'Vagem cozida'
    const salada1Sabado = 'Repolho'
    const salada2Sabado = 'Pepino Rodelas'
    const sobremesaSabado = 'Maça'
    const molhoSabado = 'Vinagrete'

    // domingo -- feito
    const carneDomingo = 'Não informado'
    const complementoDomingo = 'CNão informado'
    const salada1Domingo = 'Chuchu cozido'
    const sobremesaDomingo = 'Laranja'
    const molhoDomingo = 'Molho de ervas'

    // const lenght = fixedMenu[0][0]?.length
    // const dia = fixedMenu[0][0].substring(5, 7) ?? undefined
    // const mes = mesesDic[fixedMenu[0][0].substring(11, lenght - 8)] ?? undefined
    // const ano = fixedMenu[0][0].substring(lenght - 4, lenght) ?? undefined

    // let dataFinal = undefined
    // if (dia && mes && ano ) dataFinal = `${dia}/${mes}/${ano}`

    const menu = [
        {
            "carne": [carneSegunda],
            "fixas": ["Arroz Parbolizado", "Arroz integral", "Feijão"],
            "complemento": [complementoSegunda],
            "salada": [salada1Segunda, salada2Segunda],
            "sobremesa": [sobremesaSegunda],
            "molho": [molhoSegunda]
        },
        {
            "carne": [carneTerca],
            "fixas": ["Arroz Parbolizado", "Arroz integral", "Feijão"],
            "complemento": [complementoTerca],
            "salada": [salada1Terca, salada2Terca],
            "sobremesa": [sobremesaTerca],
            "molho": [molhoTerca]
        },
        {
            "carne": [carneQuarta],
            "fixas": ["Arroz Parbolizado", "Arroz integral", "Feijão"],
            "complemento": [complementoQuarta],
            "salada": [salada1Quarta, salada2Quarta],
            "sobremesa": [sobremesaQuarta],
            "molho": [molhoQuarta]
        },
        {
            "carne": [carneQuinta],
            "fixas": ["Arroz Parbolizado", "Arroz integral", "Feijão"],
            "complemento": [complementoQuinta],
            "salada": [salada1Quinta, salada2Quinta],
            "sobremesa": [sobremesaQuinta],
            "molho": [molhoQuinta]
        },
        {
            "carne": [carneSexta],
            "fixas": ["Arroz Parbolizado", "Arroz integral", "Feijão"],
            "complemento": [complementoSexta],
            "salada": [salada1Sexta, salada2Sexta],
            "sobremesa": [sobremesaSexta],
            "molho": [molhoSexta]
        },
        {
            "carne": [carneSabado, 'Feijoada com carne'],
            "fixas": ["Arroz Parbolizado", "Arroz integral", "Feijão"],
            "complemento": [complementoSabado],
            "salada": [salada1Sabado, salada2Sabado],
            "sobremesa": [sobremesaSabado],
            "molho": [molhoSabado]
        },
        {
            "carne": [carneDomingo],
            "fixas": ["Arroz Parbolizado", "Arroz integral", "Feijão"],
            "complemento": [complementoDomingo],
            "salada": [salada1Domingo],
            "sobremesa": [sobremesaDomingo],
            "molho": [molhoDomingo]
        }
    ]

    return {
        "dataFinal": '25/09/2022',
        "cardapio": menu
    }
}


const start = async () => {
    const data = await axios.get('https://ru.ufsc.br/ru/')
      .then((res) => {
        // const convertedResponse = convert(res?.data)
        const cardapio = formatData(res)
        return cardapio
    })
    return data
}

app.get('/cardapio-floripa', async (req, res) => {
    const cardapio = await start()
    res.status(200).json(cardapio)
});

app.listen(port)
