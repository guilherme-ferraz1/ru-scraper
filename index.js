const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const CheerioModule = require('cheerio');
const axios = require('axios')

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pdfExtract = new PDFExtract();

const https = require('https');

const readData = async (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const file = fs.createWriteStream('./dummy.pdf');
            response.pipe(file);
            file.on("finish", async () => {
                pdfExtract.extract('./dummy.pdf', {})
                  .then((data) => {
                    try {
                        resolve(data.pages[0].content.filter(({str}) => str != ' ' && str != ''))
                      } catch (e) {
                        reject(e.message);
                      }
                });
                file.close();
                fs.unlinkSync('./dummy.pdf')
            });
        })
    })
}

const formatData = (allMenu) => {
    // segunda feira -- feito
    const carneSegunda = allMenu.find(({ x, y }) => Math.round(x) == 182 && Math.round(y) == 144)?.str
    const complementoSegunda = allMenu.find(({ x, y }) => Math.round(x) == 220 && Math.round(y) == 168)?.str
    const salada1Segunda = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 180)?.str
    const salada2Segunda = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 193)?.str
    const sobremesaSegunda = allMenu.find(({ x, y }) => Math.round(x) == 205 && Math.round(y) == 205)?.str
    const molhoSegunda = allMenu.find(({ x, y }) => Math.round(x) == 451 && Math.round(y) == 205)?.str

    // terca feira -- feito
    const carneTerca = allMenu.find(({ x, y }) => Math.round(x) == 182 && Math.round(y) == 217)?.str
    const complementoTerca = allMenu.find(({ x, y }) => Math.round(x) == 220 && Math.round(y) == 242)?.str
    const salada1Terca = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 254)?.str
    const salada2Terca = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 266)?.str
    const sobremesaTerca = allMenu.find(({ x, y }) => Math.round(x) == 205 && Math.round(y) == 278)?.str
    const molhoTerca = allMenu.find(({ x, y }) => Math.round(x) == 454 && Math.round(y) == 278)?.str

    // quarta feira -- feito
    const carneQuarta = allMenu.find(({ x, y }) => Math.round(x) == 182 && Math.round(y) == 291)?.str
    const complementoQuarta = allMenu.find(({ x, y }) => Math.round(x) == 220 && Math.round(y) == 315)?.str
    const salada1Quarta = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 327)?.str
    const salada2Quarta = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 340)?.str
    const sobremesaQuarta = allMenu.find(({ x, y }) => Math.round(x) == 205 && Math.round(y) == 352)?.str
    const molhoQuarta = allMenu.find(({ x, y }) => Math.round(x) == 460 && Math.round(y) == 352)?.str

    // quinta feira -- feito
    const carneQuinta = allMenu.find(({ x, y }) => Math.round(x) == 177 && Math.round(y) == 364)?.str
    const complementoQuinta = allMenu.find(({ x, y }) => Math.round(x) == 220 && Math.round(y) == 389)?.str
    const salada1Quinta = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 401)?.str
    const salada2Quinta = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 413)?.str
    const sobremesaQuinta = allMenu.find(({ x, y }) => Math.round(x) == 205 && Math.round(y) == 425)?.str
    const molhoQuinta = allMenu.find(({ x, y }) => Math.round(x) == 456 && Math.round(y) == 425)?.str

    // sexta feira -- feito
    const carneSexta = allMenu.find(({ x, y }) => Math.round(x) == 177 && Math.round(y) == 438)?.str
    const complementoSexta = allMenu.find(({ x, y }) => Math.round(x) == 220 && Math.round(y) == 462)?.str
    const salada1Sexta = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 474)?.str
    const salada2Sexta = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 487)?.str
    const sobremesaSexta = allMenu.find(({ x, y }) => Math.round(x) == 205 && Math.round(y) == 499)?.str
    const molhoSexta = allMenu.find(({ x, y }) => Math.round(x) == 465 && Math.round(y) == 499)?.str

    // sabado -- feito
    const carneSabado = allMenu.find(({ x, y }) => Math.round(x) == 177 && Math.round(y) == 511)?.str
    const complementoSabado = allMenu.find(({ x, y }) => Math.round(x) == 220 && Math.round(y) == 536)?.str
    const salada1Sabado = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 548)?.str
    const salada2Sabado = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 560)?.str
    const sobremesaSabado = allMenu.find(({ x, y }) => Math.round(x) == 205 && Math.round(y) == 572)?.str
    const molhoSabado = allMenu.find(({ x, y }) => Math.round(x) == 471 && Math.round(y) == 572)?.str

    // domingo -- feito
    const carneDomingo = allMenu.find(({ x, y }) => Math.round(x) == 177 && Math.round(y) == 585)?.str
    const complementoDomingo = allMenu.find(({ x, y }) => Math.round(x) == 220 && Math.round(y) == 609)?.str
    const salada1Domingo = allMenu.find(({ x, y }) => Math.round(x) == 194 && Math.round(y) == 621)?.str
    const sobremesaDomingo = allMenu.find(({ x, y }) => Math.round(x) == 205 && Math.round(y) == 634)?.str
    const molhoDomingo = allMenu.find(({ x, y }) => Math.round(x) == 476 && Math.round(y) == 634)?.str

    const dataFinal = allMenu.find(({ x, y }) => Math.round(x) == 61 && Math.round(y) == 597)?.str

    const menu = [
        {
            "carne": [carneSegunda],
            "fixas": ["Arroz Branco", "Arroz integral", "Feijão preto"],
            "complemento": [complementoSegunda],
            "salada": [salada1Segunda, salada2Segunda],
            "sobremesa": [sobremesaSegunda],
            "molho": [molhoSegunda]
        },
        {
            "carne": [carneTerca],
            "fixas": ["Arroz Branco", "Arroz integral", "Feijão preto"],
            "complemento": [complementoTerca],
            "salada": [salada1Terca, salada2Terca],
            "sobremesa": [sobremesaTerca],
            "molho": [molhoTerca]
        },
        {
            "carne": [carneQuarta],
            "fixas": ["Arroz Branco", "Arroz integral", "Feijão preto"],
            "complemento": [complementoQuarta],
            "salada": [salada1Quarta, salada2Quarta],
            "sobremesa": [sobremesaQuarta],
            "molho": [molhoQuarta]
        },
        {
            "carne": [carneQuinta],
            "fixas": ["Arroz Branco", "Arroz integral", "Feijão preto"],
            "complemento": [complementoQuinta],
            "salada": [salada1Quinta, salada2Quinta],
            "sobremesa": [sobremesaQuinta],
            "molho": [molhoQuinta]
        },
        {
            "carne": [carneSexta],
            "fixas": ["Arroz Branco", "Arroz integral", "Feijão preto"],
            "complemento": [complementoSexta],
            "salada": [salada1Sexta, salada2Sexta],
            "sobremesa": [sobremesaSexta],
            "molho": [molhoSexta]
        },
        {
            "carne": [carneSabado],
            "fixas": ["Arroz Branco", "Arroz integral", "Feijão preto"],
            "complemento": [complementoSabado],
            "salada": [salada1Sabado, salada2Sabado],
            "sobremesa": [sobremesaSabado],
            "molho": [molhoSabado]
        },
        {
            "carne": [carneDomingo],
            "fixas": ["Arroz Branco", "Arroz integral", "Feijão preto"],
            "complemento": [complementoDomingo],
            "salada": [salada1Domingo],
            "sobremesa": [sobremesaDomingo],
            "molho": [molhoDomingo]
        }
    ]

    return {
        "dataFinal": dataFinal.replace(/\s/g, ''),
        "cardapio": menu
    }
}

const getMenuUrl = (html) => {
    var $ = CheerioModule.load(html);
    let url = ''
  
    $('a').each( (index, value) => {
      var link = $(value).attr('href');
      if (link?.includes('.pdf') && link?.includes('siteru')) {
        url = link
      }
   });

   return url.replace('http', 'https')
}

const start = async () => {
    const url = await axios.get('https://ru.ufsc.br/ru/')
      .then((res) => {
        return getMenuUrl(res?.data)
    })

    const allItems = await readData(url)
    return formatData(allItems)
}

app.get('/cardapio-floripa', async (req, res) => {
    const cardapio = await start()
    res.status(200).json(cardapio)
});

app.listen(port)
