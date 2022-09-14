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
    // segunda feira -- feito
    const carneSegunda = fixedMenu[2][2] ?? undefined
    const complementoSegunda = fixedMenu[3][2] ?? undefined
    const salada1Segunda = fixedMenu[4][2] ?? undefined
    const salada2Segunda = fixedMenu[4][3] ?? undefined
    const sobremesaSegunda = fixedMenu[5][2] ?? undefined
    const molhoSegunda = fixedMenu[5][1] ?? undefined

    // terca feira -- feito
    const carneTerca = fixedMenu[7][2] ?? undefined
    const complementoTerca = fixedMenu[8][2] ?? undefined
    const salada1Terca = fixedMenu[9][2] ?? undefined
    const salada2Terca = fixedMenu[9][3] ?? undefined
    const sobremesaTerca = fixedMenu[10][2] ?? undefined
    const molhoTerca = fixedMenu[10][1] ?? undefined

    // quarta feira -- feito
    const carneQuarta = fixedMenu[12][2] ?? undefined
    const complementoQuarta = fixedMenu[14][2] ?? undefined
    const salada1Quarta = fixedMenu[16][2] ?? undefined
    const salada2Quarta = fixedMenu[16][3] ?? undefined
    const sobremesaQuarta = fixedMenu[17][2] ?? undefined
    const molhoQuarta = fixedMenu[17][1] ?? undefined

    // quinta feira -- feito
    const carneQuinta = fixedMenu[19][2] ?? undefined
    const complementoQuinta = fixedMenu[20][2] ?? undefined
    const salada1Quinta = fixedMenu[21][2] ?? undefined
    const salada2Quinta = fixedMenu[21][3] ?? undefined
    const sobremesaQuinta = fixedMenu[22][2] ?? undefined
    const molhoQuinta = fixedMenu[22][1] ?? undefined

    // sexta feira -- feito
    const carneSexta = fixedMenu[24][2] ?? undefined
    const complementoSexta = fixedMenu[25][2] ?? undefined
    const salada1Sexta = fixedMenu[26][2] ?? undefined
    const salada2Sexta = fixedMenu[26][3] ?? undefined
    const sobremesaSexta = fixedMenu[27][2] ?? undefined
    const molhoSexta = fixedMenu[27][1] ?? undefined

    // sabado -- feito
    const carneSabado = fixedMenu[29][2] ?? undefined
    const complementoSabado = fixedMenu[30][2] ?? undefined
    const salada1Sabado = fixedMenu[31][2] ?? undefined
    const salada2Sabado = fixedMenu[31][3] ?? undefined
    const sobremesaSabado = fixedMenu[32][2] ?? undefined
    const molhoSabado = fixedMenu[32][1] ?? undefined

    // domingo -- feito
    const carneDomingo = fixedMenu[34][2] ?? undefined
    const complementoDomingo = fixedMenu[35][2] ?? undefined
    const salada1Domingo = fixedMenu[36][2] ?? undefined
    const sobremesaDomingo = fixedMenu[37][2] ?? undefined
    const molhoDomingo = fixedMenu[37][1] ?? undefined

    const lenght = fixedMenu[0][0]?.length
    const dia = fixedMenu[0][0].substring(5, 7) ?? undefined
    const mes = mesesDic[fixedMenu[0][0].substring(11, lenght - 8)] ?? undefined
    const ano = fixedMenu[0][0].substring(lenght - 4, lenght) ?? undefined

    let dataFinal = undefined
    if (dia && mes && ano ) dataFinal = `${dia}/${mes}/${ano}`

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
            "carne": [carneSabado],
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
        "dataFinal": dataFinal ?? undefined,
        "cardapio": menu
    }
}


const start = async () => {
    const data = await axios.get('https://ru.ufsc.br/ru/')
      .then((res) => {
        const convertedResponse = convert(res?.data)
        const cardapio = formatData(convertedResponse)
        return cardapio
    })
    return data
}

app.get('/cardapio-floripa', async (req, res) => {
    const cardapio = await start()
    res.status(200).json(cardapio)
});

app.listen(port)
