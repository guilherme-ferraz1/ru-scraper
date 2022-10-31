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
   const date = data[7][0].split(`\n`)[1]
    
    const dia = date.substring(0, 2)
    const mes = mesesDic[date.substring(3, 6)]
    const ano =  date.substring(7, 9)

    let dataFinal = undefined
    if (dia && mes && ano ) dataFinal = `${dia}/${mes}/${ano}`

    const menu = [
      createItem(data[1]),
      createItem(data[2]),
      createItem(data[3]),
      createItem(data[4]),
      createItem(data[5]),
      createItem(data[6]),
      createItem(data[7]),
    ]

    const MENU_TEMPORARY = [
      {
        carne: [" Iscas de frango acebolada", "Quibe (jantar)"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Abóbora cozida"],
        salada: ["Couve folha", "Pepino"],
        molho: ["Molho de Mostarda"],
        sobremesa: ["Não informado"]
      },
      {
        carne: ["Frango ao Molho de mostarda"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Batata doce"],
        salada: ["Chicória", "Beterraba"],
        molho: ["Molho de Ervas"],
        sobremesa: ["Laranja"]
      },
      {
        carne: ["Bife acebolado"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Macarrão integral primavera"],
        salada: ["Alface", "Cenoura"],
        molho: ["Vinagrete"],
        sobremesa: ["Banana"]
      },
      {
        carne: ["Filé mignon suíno ao molho agridoce"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Jardineira de legumes I"],
        salada: ["Acelga", "Beterraba"],
        molho: ["Molho de Mostarda"],
        sobremesa: ["Laranja"]
      },
      {
        carne: ["Calulu de carne seca", "Almôndega bovina (jantar)"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Cuscuz", "Polenta (jantar)"],
        salada: ["Agrião", "Rabanete"],
        molho: ["Molho de Ervas"],
        sobremesa: ["Banana"]
      },
      {
        carne: ["Linguiça toscana"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Maionese de batatas"],
        salada: ["Repolho", "Pepino"],
        molho: ["Vinagrete"],
        sobremesa: ["Laranja"]
      },
      {
        carne: ["Frango Xadrez"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Macarrão integral ao Alho e Óleo"],
        salada: ["Vagem com cebola"],
        molho: ["Molho de Ervas"],
        molho: ["Maça"],
      }
    ]

    return {
      "dataFinal": date,
      "cardapio": MENU_TEMPORARY
    }
}

const createItem = (menu) => {
  const e = menu[1]
  const item = e.split('\n')
  const teste = item.map((i) => i.split('MOLHO')[0].trim())
  const filtered = item.filter((e) => !e.includes('Carne (jantar)') || !e.includes('Complemento (jantar)') )
  let itemObj = {}
  const saladaItems = filtered[3].substring(9).split('/')
  itemObj.carne = [filtered[0].substring(7)]
  itemObj.fixas = ["Arroz Parbolizado", "Arroz integral", "Feijão"]
  itemObj.complemento = [filtered[2].substring(13)]
  itemObj.salada = [filtered[3].substring(10), filtered[4].substring(9)]
  itemObj.molho = [filtered[5].substring(10, 18)]
  itemObj.sobremesa = [filtered[6] ?? 'Não informado']
  return itemObj
}

const start = async () => {
    const data = await axios.get('https://ru.ufsc.br/ru/')
      .then((res) => {
        const convertedResponse = convert(res?.data)
        const cardapio = formatData(convertedResponse)
        console.log(cardapio)
        return cardapio
    })
    return data
}

app.get('/cardapio-floripa', async (req, res) => {
    const cardapio = await start()
    res.status(200).json(cardapio)
});

app.listen(port)
