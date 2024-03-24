import fs from 'fs'
import EventEmitter from 'events'
import { parseVintedURL, vintedSearch } from './api.js'

class VintedMoniteur extends EventEmitter {
  constructor (obj) {
    super()

    this.url = obj?.url

    this.dbPath = obj?.dbPath
    this.interval = obj?.interval ?? 5000
    this.debug = obj?.debug ?? false
    this.proxy = this.#proxy(obj?.proxy) ?? false
    this.db = new Map()
    this.#init()
  }

  #init () {
    const
      self = this
    const url = self.url
    const { validURL, domain, querystring } = parseVintedURL(url)

    if (!validURL) this.emit('error', 'Invalid URL')
    else {
      if (this.debug) console.log(`Moniteur lancer sur: ${url}`)
      this.#search()
    };
  }

  #proxy (listOrFile) {
    if (!listOrFile) return
    if (typeof listOrFile === 'object' && Array.isArray(listOrFile)) return listOrFile
    else if (fs.existsSync(listOrFile)) return fs.readFileSync(listOrFile)?.split('\n')
  }

  #search () {
    return new Promise(async resolve => {
      try {
        const
          db = this.db
        const url = this.url

        setTimeout(() => this.#search(), this.interval)
        const
          res = await vintedSearch(url, this.proxy)
        if (!res.items) return resolve()
        const
          isFirstSync = db.get('first')
        const lastItemTimestamp = db.get('last')
        const items = res.items
          .sort((a, b) => b?.photo?.high_resolution?.timestamp - a?.photo?.high_resolution?.timestamp)
          .filter((item) => !lastItemTimestamp || item?.photo?.high_resolution?.timestamp > lastItemTimestamp)
        if (!items.length) return resolve()

        const newLastItemTimestamp = items[0]?.photo?.high_resolution?.timestamp
        if (!lastItemTimestamp || newLastItemTimestamp > lastItemTimestamp) db.set('last', newLastItemTimestamp)

        const itemsToSend = ((lastItemTimestamp && !isFirstSync) ? items.reverse() : [items[0]])
        if (itemsToSend.length > 0) {
          db.set('first', true)
          if (this.debug) console.log(`${itemsToSend.length} ${itemsToSend.length > 1 ? 'nouveaux articles trouvés' : 'nouvel article trouvé'} pour la recherche: ${url}!\n`)
        }

        for (const item of itemsToSend) {
          const obj = {
            id: item.id,
            url: {
              info: item.url.replace('vinted.be', 'vinted.fr'),
              buy: `https://www.vinted.fr/transaction/buy/new?source_screen=item&transaction%5Bitem_id%5D=${item.id}`,
              sendmsg: `https://www.vinted.fr//items/${item.id}/want_it/new?button_name=receiver_id=${item.id}`
            },
            title: item.title || 'vide',
            pp: item.photo?.url,
            thumbnails: item.photo.thumbnails?.map(image => image.url),
            color: item?.photo?.dominant_color,
            price: `${item.price || 'vide'} ${item.currency || 'EUR'} (${item.total_item_price || 'vide'})`,
            size: item.size_title || 'vide',
            marque: item.brand_title || 'vide',
            brand: {
              likes: item.favourite_count || 0,
              views: item.view_count || 0
            },
            timestamp: item?.photo?.high_resolution?.timestamp || false,
            seller: {
              name: item.user?.login || 'vide',
              pp: item.user?.photo?.url,
              url: item.user?.profile_url
            }
          }
          this.emit('item', obj)
        };
        resolve()
      } catch (error) {
        if (this.debug) console.log(error)
        return resolve()
      }
    })
  }
}
export default VintedMoniteur
