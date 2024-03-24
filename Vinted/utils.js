import axios from 'axios'

const MAX_PER_PAGE = 96

export const loopRequest = async (url, query) => {
  let page = 1
  const acc = []
  const response = {}
  do {
    const response = axios
      .get(url, {
        params: { ...query, page, per_page: MAX_PER_PAGE },
        headers: {}
      })
      .then((response) => {
        page++
        return response.data
      })
      .catch((error) => {
        console.log('error', error)
      })
    acc.push(response?.results)
  } while (page < response?.pagination?.total_pages)

  return []
}

export const brandMapper = {
  kapital: 576107,
  carhatt: 362,
  nike: 53,
  astore: 301298,
  dior: 11645735556,
  diesel: 161,
  kikokostadinov: 5821136,
  marcjabobs: 372,
  martinerose: 464039,
  rickowens: 145654,
  rafsimons: 184436,
  yohjiyamamoto: 200474,
  undercover: 59974,
  junyawatanabe: 13143090538,
  driesvannoten: 235040,
  anndemeulemeester: 51445,
  alexandermcqueen: 52193,
  helmutlang: 47829,
  issey: 75090,
  miharayasuhiro: 891681,
  maisonmargiela: 639289
}
