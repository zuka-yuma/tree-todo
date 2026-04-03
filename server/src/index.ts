import fastify from 'fastify'

const server = fastify()

server.get('/api/health', async (request, reply) => {
    reply.status(200).send({ status:"ok", timeStamp: Date.now()})
})

server.listen({ port: 3001 }, (err, address) => {
    if (err) throw err
    server.log.info(`server listening on ${address}`)
})