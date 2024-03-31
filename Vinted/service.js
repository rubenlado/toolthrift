// import VintedMoniteur from 'vinted-moniteur'
import VintedMoniteur from './VintedMoniteur/VintedMoniteur.js'
import { brandMapper } from './utils.js'
class VintedService {
  getProducts ({ brand, searchText, io }) {
    const brandId = brandMapper[brand]
    let url = `https://www.vinted.fr/catalog?brand_id[]=${brandId}&order=newest_first`

    if (searchText) {
      url += `&search_text=${searchText}`
    }

    if (brand === 'custom') {
      url = `https://www.vinted.fr/catalog?brand_id[]=51445&brand_id[]=51445&brand_id[]=4977456&brand_id[]=2514944&brand_id[]=891681&brand_id[]=639289&brand_id[]=235040&brand_id[]=505614&brand_id[]=576107&brand_id[]=59974&brand_id[]=11521&brand_id[]=56974&brand_id[]=47829&brand_id[]=1965&brand_id[]=184436&brand_id[]=671&brand_id[]=1455187&brand_id[]=75090&brand_id[]=214088&brand_id[]=276225&brand_id[]=73952&brand_id[]=145654&brand_id[]=609050&color_id[]=1&catalog[]=257&catalog[]=260
      `
    }

    if (brand === 'all') {
      url = `https://www.vinted.fr/catalog?brand_id[]=51445&brand_id[]=51445&brand_id[]=4977456&brand_id[]=2514944&brand_id[]=891681&brand_id[]=639289&brand_id[]=235040&brand_id[]=505614&brand_id[]=576107&brand_id[]=59974&brand_id[]=11521&brand_id[]=56974&brand_id[]=47829&brand_id[]=1965&brand_id[]=184436&brand_id[]=671&brand_id[]=1455187&brand_id[]=75090&brand_id[]=214088&brand_id[]=276225&brand_id[]=73952&brand_id[]=145654&brand_id[]=609050&brand_id[]=2053426&brand_id[]=9044186&brand_id[]=400&brand_id[]=4785&brand_id[]=567&brand_id[]=5821136&brand_id[]=72138&brand_id[]=344976&brand_id[]=180798
      `
    }
    const moniteur = new VintedMoniteur({
      url,
      interval: 5000,
      debug: true
      // AVEC PROXY
      // proxy: ["ip", "ip:port", "username:password"]
      // ou
      // proxy: "./proxy.txt"
    })

    moniteur.on('error', (err) => console.log(err))
    moniteur.on('item', (data) => {
      io.emit('product', data)
      // -> OBJECT
      // {
      //     id: 2838672149,
      //     url: {
      //       info: 'https://www.vinted.fr/hommes/vetements/vetements-de-sport-and-accessoires/accessoires-de-sports/bonnets/2838672149-bonnet-nike',
      //       buy: 'https://www.vinted.fr/transaction/buy/new?source_screen=item&transaction%5Bitem_id%5D=2838672149',
      //       sendmsg: 'https://www.vinted.fr//items/2838672149/want_it/new?button_name=receiver_id=2838672149'
      //     },
      //     title: 'bonnet nike ',
      //     pp: 'https://images1.vinted.net/t/01_01e6f_tyNQCq2Zi6gjebQ6ycgqffSb/f800/1679945160.jpeg?s=93ab40d56d5376fc556ff32be240e2aace80ff1c',
      //     thumbnails: [
      //       'https://images1.vinted.net/t/01_01e6f_tyNQCq2Zi6gjebQ6ycgqffSb/70x100/1679945160.jpeg?s=64b32ac3aac939db1083c36c29e1d41dd5ff45cc',
      //       'https://images1.vinted.net/t/01_01e6f_tyNQCq2Zi6gjebQ6ycgqffSb/150x210/1679945160.jpeg?s=d255bce698a607b4b87666f3144246e4223b54f3',
      //       'https://images1.vinted.net/t/01_01e6f_tyNQCq2Zi6gjebQ6ycgqffSb/310x430/1679945160.jpeg?s=3a1d65b1f9e8846cb10e85fb6141c051651f60ab',
      //       'https://images1.vinted.net/t/01_01e6f_tyNQCq2Zi6gjebQ6ycgqffSb/f800/1679945160.jpeg?s=93ab40d56d5376fc556ff32be240e2aace80ff1c',
      //       'https://images1.vinted.net/t/01_01e6f_tyNQCq2Zi6gjebQ6ycgqffSb/f800/1679945160.jpeg?s=93ab40d56d5376fc556ff32be240e2aace80ff1c',
      //       'https://images1.vinted.net/t/01_01e6f_tyNQCq2Zi6gjebQ6ycgqffSb/f800/1679945160.jpeg?s=93ab40d56d5376fc556ff32be240e2aace80ff1c'
      //     ],
      //     color: '#20232C',
      //     prix: '4.0 EUR (4.9)',
      //     taille: 'vide',
      //     marque: 'Nike',
      //     stats: { favori: 0, vue: 0 },
      //     timestamp: 1679945160,
      //     vendeur: {
      //       name: 'juu1_ee',
      //       pp: 'https://images1.vinted.net/t/01_01590_iBqUekQU9c9vyNoqAVzG6fQn/f800/1652021442.jpeg?s=81e3c8b5c0293455fef869b99b37d544cf9ffe2a',
      //       url: 'https://www.vinted.be/member/13276203-juu1ee'
      //     }
      //   }
    })
    // return []
  }
}

export default VintedService
