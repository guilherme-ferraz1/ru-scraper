const CheerioModule = require('cheerio');
const https = require('https')
const axios = require('axios')


const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mesesDic = {
  "jan": '01',
  "fev": '02',
  "mar": '03',
  "abr": '04',
  "mai": '05',
  "jun": '06',
  "jul": '07',
  "ago": '08',
  "set": '09',
  "out": '10',
  "nov": '11',
  "dez": '12',
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

const formatData = (data) => { 
  return {
    "dataFinal": "03/12/2023",
    "cardapio": [
      {
        "carne": ["Sobrecoxa de frango com ervas"],
        "fixas": ["Arroz branco", "Arroz integral", "Feijão carioca"],
        "complemento": ["Almoço: Legumes refogados", "Jantar: Macarrão com ervas"],
        "salada": ["Acelga", "Pepino"],
        "molho": ["Molho de ervas"],
        "sobremesa": ["Fruta"]
      },
      {
        "carne": ["Almoço: Bife bovino", "Jantar: Carne assada de panela"],
        "fixas": ["Arroz branco", "Arroz integral", "Feijão preto"],
        "complemento": ["Abobrinha ao forno"],
        "salada": ["Rúcula", "Cenoura"],
        "molho": ["Vinagrete"],
        "sobremesa": ["Fruta"]
      },
      {
        "carne": ["Bisteca suína acebolada"],
        "fixas": ["Arroz branco", "Arroz integral", "Feijão preto"],
        "complemento": ["Brócolis"],
        "salada": ["Chicória", "Beterraba"],
        "molho": ["Molho de mostarda"],
        "sobremesa": ["Fruta"]
      },
      {
        "carne": ["Sassami de frango empanado"],
        "fixas": ["Arroz branco", "Arroz integral", "Feijão preto"],
        "complemento": ["Creme de ervilha"],
        "salada": ["Repolho roxo", "Cenoura"],
        "molho": ["Molho de ervas"],
        "sobremesa": ["Fruta"]
      },
      {
        "carne": ["Risoto de frango"],
        "fixas": ["Arroz branco", "Arroz integral", "Feijão preto com vegetais"],
        "complemento": ["Batata palha"],
        "salada": ["Alface", "Beterraba"],
        "molho": ["Molho de mostarda"],
        "sobremesa": ["Fruta"]
      },
      {
        "carne": ["EM BREVE"],
        "fixas": ["Arroz branco", "Arroz integral", "Feijão preto"],
        "complemento": ["EM BREVE"],
        "salada": ["EM BREVE"],
        "molho": ["EM BREVE"],
        "sobremesa": ["EM BREVE"]
      },
      {
        "carne": ["EM BREVE"],
        "fixas": ["Arroz branco", "Arroz integral", "Feijão preto"],
        "complemento": ["EM BREVE"],
        "salada": ["EM BREVE"],
        "molho": ["EM BREVE"],
        "sobremesa": ["EM BREVE"]
      }
    ]
  }
  
}

const createItem = (menu) => {
  let itemObj = {}
  itemObj.carne = []
  itemObj.fixas = ["Arroz Parbolizado", "Arroz integral", "Feijão"]
  itemObj.complemento = []
  itemObj.salada = []
  itemObj.sobremesa = []
  itemObj.molho = []
  let n = 0
  while (n < menu?.length) {
    if (n == menu.length - 1) {
      const trimmed = menu[menu.length - 1]
      if (!trimmed.includes('Molho ')) itemObj.sobremesa.push(trimmed)
      else {
        itemObj.molho.push(trimmed)
        itemObj.sobremesa.push('Não definido')
      }
    }
    if (n == menu.length - 2) {
      const trimmed = menu[menu.length - 2]
      if (trimmed.includes('Molho ')) itemObj.molho.push(trimmed)
    }
    if (menu[n].toUpperCase() == 'CARNE:') {
      const trimmed = menu[n + 1]
      itemObj.carne.push(trimmed)
    }
    if (menu[n].toUpperCase() == 'CARNE (JANTAR):') {
      const trimmed = menu[n + 1]
      if (!menu[n + 1].includes(':')) itemObj.carne.push(trimmed + ' (jantar)')
    }
    if (menu[n].toUpperCase() == 'COMPLEMENTO:') {
      const trimmed = menu[n + 1]
      itemObj.complemento.push(trimmed)
    }
    if (menu[n].toUpperCase() == 'COMPLEMENTO (JANTAR):') {
      const trimmed = menu[n + 1]
      if (!menu[n + 1].includes(':')) itemObj.complemento.push(trimmed + ' (jantar)')
    }
    if (menu[n].toUpperCase() == 'SALADAS:') {
      let i = 1
      while (i < 3) {
        if (!menu[n + i]?.includes('Molho ')) {
          const trimmed = menu[n + i]
          itemObj.salada.push(trimmed)
        }
        i++
      }
    }
    n++
  }
  return itemObj
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
