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

    // const menu = [
    //   createItem(data[1]),
    //   createItem(data[2]),
    //   createItem(data[3]),
    //   createItem(data[4]),
    //   createItem(data[5]),
    //   createItem(data[6]),
    //   createItem(data[7]),
    // ]

    const MENU_TEMPORARY = [
      {
        carne: ["Carne moída com ervilha", "Almôndega bovina (jantar)"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Farofa com azeitonas, Polenta simples (jantar)"],
        salada: ["Repolho roxo", "Pepino Rodelas"],
        molho: ["Molho de Mostarda"],
        sobremesa: ["Laranja"]
      },
      {
        carne: ["Frango ao molho curry"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Brócolis cozido"],
        salada: ["Alface", "Beterraba Ralada"],
        molho: ["Vinagrete"],
        sobremesa: ["Maçã"]
      },
      {
        carne: ["Filé mignon suíno ao molho de mostarda"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Abobrinha ao forno"],
        salada: ["Repolho", "Cenoura ralada"],
        molho: ["Molho de mostarda"],
        sobremesa: ["Laranja"]
      },
      {
        carne: ["Sobrecoxa de frango"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Grão de bico com legumes"],
        salada: ["Rúcula", "Beterraba Ralada"],
        molho: ["Molho de ervas"],
        sobremesa: ["Maça"]
      },
      {
        carne: ["Mungunzá", "Quibe (jantar)"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Farofa simples", "Macarrão integral ao alho e óleo (jantar)"],
        salada: ["Espinafre", "Cenoura ralada"],
        molho: ["Vinagrete"],
        sobremesa: ["Banana"]
      },
      {
        carne: ["Feijoada", "Feijoada vegetariana"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Farofa simples"],
        salada: ["Pepino Rodelas", "Couve Folha"],
        molho: ["Molho de ervas"],
        sobremesa: ["Laranja"]
      },
      {
        carne: ["Risoto de Frango"],
        fixas: ["Arroz Parbolizado", "Arroz integral", "Feijão"],
        complemento: ["Abóbora cozida"],
        salada: ["Chuchu cozido"],
        molho: ["Vinagrete"],
        molho: ["Abacaxi"],
      }
    ]

    return {
      "dataFinal": '13/11/2022',
      "cardapio": MENU_TEMPORARY
    }
}

const getCarnes = (string) => {
  let arr = []
  let newStr = string.toUpperCase()

  if (string.toUpperCase().includes('CARNE JANTAR')) {
    arr.push(string.substring(newStr.indexOf('CARNE JANTAR') + 13, newStr.indexOf(('COMPLEMENTO'))))
    arr.push(string.substring(newStr.indexOf('CARNE ALMOÇO') + 13, newStr.indexOf(('CARNE JANTAR'))))
    return arr
  }

  if (string.toUpperCase().includes('CARNE (JANTAR)')) {
    arr.push(string.substring(newStr.indexOf('CARNE (JANTAR)') + 15, newStr.indexOf('COMPLEMENTO')))
    arr.push(string.substring(newStr.indexOf('CARNE (ALMOÇO)') + 15, newStr.indexOf(('CARNE (ALMOÇO)'))))
    return arr
  }

  arr.push(string.substring(newStr.indexOf('CARNE') + 6, newStr.indexOf(('COMPLEMENTO'))))
  return arr
}

const getComplementos = (string) => {
  let arr = []
  let newStr = string.toUpperCase()

  if (string.toUpperCase().includes('COMPLEMENTO JANTAR')) {
    arr.push(string.substring(newStr.indexOf('COMPLEMENTO JANTAR') + 19, newStr.indexOf(('SALADA'))))
    arr.push(string.substring(newStr.indexOf('COMPLEMENTO ALMOÇO') + 19, newStr.indexOf(('COMPLEMENTO JANTAR'))))
    return arr
  }

  if (string.toUpperCase().includes('COMPLEMENTO (JANTAR)')) {
    arr.push(string.substring(newStr.indexOf('COMPLEMENTO (JANTAR)') + 21, newStr.indexOf('SALADA')))
    arr.push(string.substring(newStr.indexOf('COMPLEMENTO (ALMOÇO)') + 21, newStr.indexOf(('COMPLEMENTO (ALMOÇO)'))))
    return arr
  }

  arr.push(string.substring(newStr.indexOf('COMPLEMENTO') + 12, newStr.indexOf(('SALADA'))))
  return arr
}

const getSalada = (string) => {
  let arr = []
  let newStr = string.toUpperCase()

  if (string.toUpperCase().includes('SALADA 2')) {
    arr.push(string.substring(newStr.indexOf('SALADA 1') + 9, newStr.indexOf(('SALADA 2'))))
    if (newStr.includes(('SOBREMESA'))) {
      arr.push(string.substring(newStr.indexOf('SALADA 2') + 9, newStr.indexOf(('SOBREMESA'))))
    } else {
      arr.push(string.substring(newStr.indexOf('SALADA 2') + 9, newStr.indexOf(('MOLHO'))))
    }
    return arr
  }

  arr.push(string.substring(newStr.indexOf('SALADA 1') + 9, newStr.indexOf(('SOBREMESA'))))
  return arr
}

const getSobremesa = (string) => {
  let arr = []
  let newStr = string.toUpperCase()

  if (string.toUpperCase().includes('SOBREMESA')) {
    arr.push(string.substring(newStr.indexOf('SOBREMESA') + 10, newStr.indexOf(('MOLHO SALADA'))))
  }

  return arr
}

const getMolho = (string) => {
  let arr = []
  let newStr = string.toUpperCase()

  if (string.toUpperCase().includes('MOLHO SALADA')) {
    arr.push(string.substring(newStr.indexOf('MOLHO SALADA') + 13))
  }

  return arr
}

const createItem = (menu) => {
  const e = menu[1]
  const item = e.split('\n')
  const arr = item
    .map((i) => i.split(/\s+/))
  delete arr[1]
  const bigArr = [].concat(...arr)
  const cleaned = bigArr.filter((item) => item !== undefined)
  const replaced = cleaned.map((i) => i.replace(/[!@#$%:^&*]/g, ""))
  const bigString = replaced.join(' ')
  
  let itemObj = {}
  itemObj.carne = getCarnes(bigString)
  itemObj.fixas = ["Arroz Parbolizado", "Arroz integral", "Feijão"]
  itemObj.complemento = getComplementos(bigString)
  itemObj.salada = getSalada(bigString)
  itemObj.molho = getMolho(bigString)
  itemObj.sobremesa = getSobremesa(bigString)
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
