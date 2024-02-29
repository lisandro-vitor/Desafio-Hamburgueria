const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())
const port = 3000
const clients = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = clients.findIndex(client => client.id === id)
    const findAOrder = clients.findIndex(client => client.id === id)
    
    if(index || findAOrder < 0) {
        return response.status(404).json({error: "Order not found"})
    }
    
    request.orderIndex = index
    request.orderId = id
    next()
}

const checkUrl = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)

    next()
}

app.post('/order', checkUrl, (request, response) => {
    
    const { order, clientName, price, status} = request.body

    const client = { id: uuid.v4(), order, clientName, price, status}

    clients.push(client)

   return response.status(201).json(client)
   
})

app.get('/order', checkUrl, (request, response) => {
     
    return response.json({clients})
})

app.put('/order/:id', checkOrderId, checkUrl, (request, response) => {
    /* const { id } = request.params

    const index = clients.findIndex(client => client.id === id)
    
    if(index < 0) {
        return response.status(404).json({error: "Order not found"})
    }
    */
    const index = request.orderIndex
    const id = request.orderId
    const { order, clientName, price, status } = request.body
    const updateOrder = { id, order, clientName, price, status}
   
    clients[index] = updateOrder

    return response.json(updateOrder)
    
})

app.delete('/order/:id', checkOrderId, checkUrl, (request, response) => {
    /* const { id } = request.params
    
    const index = clients.findIndex(client => client.id === id)

    if (index < 0) {
        return response.status(404).json({error: "Order not found"})
    }
    */
    const index = request.orderIndex
    
    clients.splice(index, 1)

    return response.json({clients})
})

app.get('/order/:id', checkOrderId, checkUrl, (request, response) => {
    const { id } = request.params
    
    const findAOrder = clients.find(client => client.id === id)
    
    return response.status(201).json(findAOrder)

})

app.patch('/order/:id', checkOrderId, checkUrl, (request, response) => {
    const { id } = request.params
    const { order, clientName, price, status } = request.body
    const index = clients.findIndex(client => client.id === id)
    
    const readyOrder = { id, order:clients[index].order, clientName:clients[index].clientName, price:clients[index].price, status:"Pronto"}
    clients[index] = readyOrder
   

    return response.status(201).json(readyOrder)
})

app.listen(port, () => {
    console.log(`✔ Server started on port ${port}`)
})