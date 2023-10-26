import express from 'express'
import VintedService from './Vinted/service.js'

const app = express()
const port = 3000

app.use(express.static('public'))
app.listen(port, () => console.log(`Toolthrift running on port ${port}`))

app.get('/', (_, res) => {
  res.set('Content-Type', 'text/plain')
  const asciiArt = `
  ___________           ._____________.__          .__  _____  __   
  \\__    ___/___   ____ |  \\__    ___/|  |_________|__|/ ____\\/  |_ 
    |    | /  _ \\ /  _ \\|  | |    |   |  |  \\_  __ \\  \\   __\\\\   __\\
    |    |(  <_> |  <_> )  |_|    |   |   Y  \\  | \\/  ||  |   |  |  
    |____| \\____/ \\____/|____/____|   |___|  /__|  |__||__|   |__|  
                                           \\/                    
  `
  res.send(asciiArt)
})

const vintedService = new VintedService()

app.get('/product', (req, res) => {
  const { brand, searchText } = req.query
  vintedService.getProducts({ brand, searchText }).then((products) => {
    res.set('Content-Type', 'application/json')
    res.send(products)
  })
})
