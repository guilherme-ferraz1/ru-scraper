const CheerioModule = require('cheerio');
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
  //  const cleanedData = data.map((obj) => Object.values(obj))
  //  const arr1d = [].concat(...cleanedData)
  //  const nonEmpty = arr1d.filter((e) => e !== '')
   
  //  const segunda = nonEmpty.slice(0, nonEmpty.indexOf('TERÇA-FEIRA'))
  //  const terca = nonEmpty.slice(nonEmpty.indexOf('TERÇA-FEIRA'), nonEmpty.indexOf('QUARTA-FEIRA'))
  //  const quarta = nonEmpty.slice(nonEmpty.indexOf('QUARTA-FEIRA'), nonEmpty.indexOf('QUINTA-FEIRA'))
  //  const quinta = nonEmpty.slice(nonEmpty.indexOf('QUINTA-FEIRA'), nonEmpty.indexOf('SEXTA-FEIRA'))
  //  const sexta = nonEmpty.slice(nonEmpty.indexOf('SEXTA-FEIRA'))
  // //  const sabado = nonEmpty.slice(nonEmpty.indexOf('SABADO'), nonEmpty.indexOf('DOMINGO'))
  // //  const domingo = nonEmpty.slice(nonEmpty.indexOf('DOMINGO'))
  
  //  const date = nonEmpty[nonEmpty.indexOf('SEXTA-FEIRA') + 2]
    
  //   const dia = date.substring(0, 2)
  //   const mes = mesesDic[date.substring(3, 6)]
  //   const ano =  date.substring(7, 9)

  //   let dataFinal = undefined
  //   if (dia && mes && ano ) dataFinal = `${dia}/${mes}/${ano}`

    // const menu = [
    //   createItem(segunda),
    //   createItem(terca),
    //   createItem(quarta),
    //   createItem(quinta),
    //   createItem(sexta),
    //   {
    //     carne: ["Não definido"],
    //     fixas: ["Não definido"],
    //     complemento: ["Não definido"],
    //     salada: ["Não definido"],
    //     molho: ["Não definido"],
    //     sobremesa: ["Não definido"]
    //   },
    //   {
    //     carne: ["Não definido"],
    //     fixas: ["Não definido"],
    //     complemento: ["Não definido"],
    //     salada: ["Não definido"],
    //     molho: ["Não definido"],
    //     sobremesa: ["Não definido"]
    //   },
    // ]
    
    const fixas = ["Arroz Parbolizado", "Arroz integral", "Feijão"]

    const MENU_TEMPORARY = [
      {
        carne: ["Bisteca suína ao molho de mostarda"],
        fixas: fixas,
        complemento: ["Brócolis cozido"],
        salada: ["Pepino Rodelas", "Repolho roxo"],
        sobremesa: ["Maçã"],
        molho: ["Molho de ervas"]
      },
      {
        carne: ["Carne bovina à portuguesa"],
        fixas: fixas,
        complemento: ["Batata palha"],
        salada: ["Beterraba Ralada", "Chicória"],
        sobremesa: ["Laranja"],
        molho: ["Molho de mostarda"]
      },
      {
        carne: ["Frango ao molho vermelho"],
        fixas: fixas,
        complemento: ["Farofa simples"],
        salada: ["Cenoura ralada", "Rúcula"],
        sobremesa: ["Banana"],
        molho: ["Vinagrete"]
      },
      {
        carne: ["Bife acebolado"],
        fixas: fixas,
        complemento: ["Abóbora cozida"],
        salada: ["Alface", "Rabanete Ralado"],
        sobremesa: ["Iogurte"],
        molho: ["Molho de ervas"]
      },
      {
        carne: ["Frango ao curry"],
        fixas: fixas,
        complemento: ["Batata cozida"],
        salada: ["Acelga", "Beterraba Ralada"],
        sobremesa: ["Laranja"],
        molho: ["Vinagrete"]
      },
      {
        carne: ["Omelete com tomate e milho"],
        fixas: [fixas],
        complemento: ["Lentilha refogada"],
        salada: ["Chicória", "Maionese"],
        sobremesa: ["Pêssego em Calda"],
        molho: ["Molho de ervas"]
      },
      {
        carne: ["Carne moída"],
        fixas: [fixas],
        complemento: ["Batata doce ao forno"],
        salada: ["Brócolis"],
        molho: ["Molho de mostarda"],
        sobremesa: ["Maçã"],
      }
    ]

    return {
      "dataFinal": "30/04/2023",
      "cardapio": MENU_TEMPORARY
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
