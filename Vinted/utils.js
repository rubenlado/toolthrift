import axios from 'axios'

const MAX_PER_PAGE = 96

export const loopRequest = async (url, query) => {
  let page = 1
  const acc = []
  const response = {}
  do {
    const response = axios.get(url, { params: { ...query, page, per_page: MAX_PER_PAGE }, headers: {} }).then((response) => {
      page++
      return response.data
    }).catch((error) => {
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
  kikokostadinov: 5821136
}
