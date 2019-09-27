var fs = require('fs'),
    xml2js = require('xml2js');
const cheerio = require('cheerio')
var parser = new xml2js.Parser();
const axios = require('axios')
fs.readFile(__dirname + '/map.xml', function (err, data) {
    if (err)
        throw err
    parser.parseString(data, function (err, result) {
        if (err)
            throw err
        interpret(result)
    });
});

async function interpret(data) {
    text= 'location,name,plat,url\n'
    for (el of data.markers.marker) {
        el = el.$
        var result = await axios.get(`https://www.lestablesdenantes.fr/?page_id=${el.id}`)
        const $ = cheerio.load(result.data)
        el.description =  $('.tdn_contenu_central.tdn_fiche h1 ~ p').first().text()
        el.exemplePlat = $('h2:contains("Exemples de") + p').text()
        el.total = $('.tdn_contenu_central.tdn_fiche').text();
        console.log(el)
        text+=`${el.lat} ${el.lng}, ${el.title}, ${el.exemplePlat.replace(/\r?\n|\r/g, ' ').replace(/,/g,';')}, ${el.link}\n`
        console.log(text)
        fs.writeFileSync('result.csv', text)

    }
    fs.writeFileSync('result.csv', text)
}