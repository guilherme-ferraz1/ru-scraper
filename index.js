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
   const date = data[6][0]?.split(`\n`)[0]
   const cleaned = date?.substring(date.indexOf(' ') + 1)
    
    const dia = cleaned.substring(0, 2)
    const mes = mesesDic[cleaned.substring(3, 6)]
    const ano =  cleaned.substring(7, 9)

    let dataFinal = undefined
    if (dia && mes && ano ) dataFinal = `${dia}/${mes}/${ano}`

    const menu = [
      createItem(data[0]),
      createItem(data[1]),
      createItem(data[2]),
      createItem(data[3]),
      createItem(data[4]),
      createItem(data[5]),
      createItem(data[6]),
    ]

    const fixas = ["Arroz Parbolizado", "Arroz integral", "Feijão"]

    const MENU_TEMPORARY = [
      {
        carne: ["Bisteca suína acebolada"],
        fixas: fixas,
        complemento: ["Polenta simples"],
        salada: ["Couve Folha", "Cenoura ralada"],
        molho: ["Vinagrete"],
        sobremesa: ["Maçã"]
      },
      {
        carne: ["Frango com linguiça"],
        fixas: fixas,
        complemento: ["Chuchu cozido"],
        salada: ["Chicória", "Beterraba Ralada"],
        molho: ["Molho de mostarda"],
        sobremesa: ["Laranja"]
      },
      {
        carne: ["Carne moída com seleta de legumes, Sassami de frango empanado (jantar)"],
        fixas: fixas,
        complemento: ["Farofa com batata palha, Macarrão com ervas (jantar)"],
        salada: ["Repolho roxo", "Pepino Rodelas"],
        molho: ["Molho de ervas"],
        sobremesa: ["Maça"]
      },
      {
        carne: ["Frango à portuguesa"],
        fixas: fixas,
        complemento: ["Abóbora cozida"],
        salada: ["Agrião", "Beterraba Ralada"],
        molho: ["Molho de mostarda"],
        sobremesa: ["Banana"]
      },
      {
        carne: ["Picadinho de carne com batatas"],
        fixas: fixas,
        complemento: ["Brócolis cozido"],
        salada: ["Alface", "Rabanete"],
        molho: ["Molho de ervas"],
        sobremesa: ["Iogurte"]
      },
      {
        carne: ["Moqueca de peixe"],
        fixas: fixas,
        complemento: ["Batata doce ao forno"],
        salada: ["Rúcula", "Cenoura ralada"],
        molho: ["Vinagrete"],
        sobremesa: ["Laranja"]
      },
      {
        carne: ["Carne assada de panela"],
        fixas: fixas,
        complemento: ["Aipim cozido"],
        salada: ["Couve-flor cozida"],
        molho: ["Molho de mostarda"],
        sobremesa: ["Maça"],
      }
    ]

    return {
      "dataFinal": dataFinal,
      "cardapio": menu
    }
}

// const getCarnes = (string) => {
//   let arr = []
//   let newStr = string.toUpperCase()

//   if (string.toUpperCase().includes('CARNE JANTAR')) {
//     arr.push(string.substring(newStr.indexOf('CARNE JANTAR') + 13, newStr.indexOf(('COMPLEMENTO'))))
//     arr.push(string.substring(newStr.indexOf('CARNE ALMOÇO') + 13, newStr.indexOf(('CARNE JANTAR'))))
//     return arr
//   }

//   if (string.toUpperCase().includes('CARNE (JANTAR)')) {
//     arr.push(string.substring(newStr.indexOf('CARNE (JANTAR)') + 15, newStr.indexOf('COMPLEMENTO')))
//     arr.push(string.substring(newStr.indexOf('CARNE (ALMOÇO)') + 15, newStr.indexOf(('CARNE (ALMOÇO)'))))
//     return arr
//   }

//   arr.push(string.substring(newStr.indexOf('CARNE') + 6, newStr.indexOf(('COMPLEMENTO'))))
//   return arr
// }

// const getComplementos = (string) => {
//   let arr = []
//   let newStr = string.toUpperCase()

//   if (string.toUpperCase().includes('COMPLEMENTO JANTAR')) {
//     arr.push(string.substring(newStr.indexOf('COMPLEMENTO JANTAR') + 19, newStr.indexOf(('SALADA'))))
//     arr.push(string.substring(newStr.indexOf('COMPLEMENTO ALMOÇO') + 19, newStr.indexOf(('COMPLEMENTO JANTAR'))))
//     return arr
//   }

//   if (string.toUpperCase().includes('COMPLEMENTO (JANTAR)')) {
//     arr.push(string.substring(newStr.indexOf('COMPLEMENTO (JANTAR)') + 21, newStr.indexOf('SALADA')))
//     arr.push(string.substring(newStr.indexOf('COMPLEMENTO (ALMOÇO)') + 21, newStr.indexOf(('COMPLEMENTO (ALMOÇO)'))))
//     return arr
//   }

//   arr.push(string.substring(newStr.indexOf('COMPLEMENTO') + 12, newStr.indexOf(('SALADA'))))
//   return arr
// }

// const getSalada = (string) => {
//   let arr = []
//   let newStr = string.toUpperCase()

//   if (string.toUpperCase().includes('SALADA 2')) {
//     arr.push(string.substring(newStr.indexOf('SALADA 1') + 9, newStr.indexOf(('SALADA 2'))))
//     if (newStr.includes(('SOBREMESA'))) {
//       arr.push(string.substring(newStr.indexOf('SALADA 2') + 9, newStr.indexOf(('SOBREMESA'))))
//     } else {
//       arr.push(string.substring(newStr.indexOf('SALADA 2') + 9, newStr.indexOf(('MOLHO'))))
//     }
//     return arr
//   }

//   arr.push(string.substring(newStr.indexOf('SALADA 1') + 9, newStr.indexOf(('SOBREMESA'))))
//   return arr
// }

// const getSobremesa = (string) => {
//   let arr = []
//   let newStr = string.toUpperCase()

//   if (string.toUpperCase().includes('SOBREMESA')) {
//     arr.push(string.substring(newStr.indexOf('SOBREMESA') + 10, newStr.indexOf(('MOLHO SALADA'))))
//   }

//   return arr
// }

// const getMolho = (string) => {
//   let arr = []
//   let newStr = string.toUpperCase()

//   if (string.toUpperCase().includes('MOLHO SALADA')) {
//     arr.push(string.substring(newStr.indexOf('MOLHO SALADA') + 13))
//   }

//   return arr
// }

const createItem = (menu) => {
  const e = menu[0]
  const item = e?.split('\n')
  item?.shift()
  let itemObj = {}
  itemObj.carne = []
  itemObj.fixas = ["Arroz Parbolizado", "Arroz integral", "Feijão"]
  itemObj.complemento = []
  itemObj.salada = []
  itemObj.molho = []
  itemObj.sobremesa = []
  let n = 0
  while (n < item?.length) {
    if (n == item.length - 1) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      item[n].includes(':') ? itemObj.sobremesa.push(trimmed) : itemObj.sobremesa.push(item[n])
    }
    if (n == item.length - 2) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      item[n].includes(':') ? itemObj.molho.push(trimmed) : itemObj.molho.push(item[n])
    }
    if (item[n].toUpperCase().includes('CARNE:')) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      itemObj.carne.push(trimmed)
    }
    if (item[n].toUpperCase().includes('CARNE (JANTAR)')) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      itemObj.carne.push(trimmed + ' (jantar)')
    }
    if (item[n].toUpperCase().includes('COMPLEMENTO:')) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      itemObj.complemento.push(trimmed)
    }
    if (item[n].toUpperCase().includes('COMPLEMENTO (JANTAR)')) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      itemObj.complemento.push(trimmed + ' (jantar)')
    }
    if (item[n].toUpperCase().includes('SALADAS')) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      itemObj.salada.push(trimmed)
    }
    if (item[n].toUpperCase().includes('SOBREMESA')) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      itemObj.sobremesa.push(trimmed)
    }
    if (item[n].toUpperCase().includes('MOLHO:')) {
      const trimmed = item[n].substring(item[n].indexOf(':') + 2)
      itemObj.molho.push(trimmed)
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
