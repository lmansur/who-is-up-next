const Koa = require('koa')
const { ApolloServer } = require('apollo-server-koa')
const { makeExecutableSchema } = require('graphql-tools')
const { Sequelize, Model } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', '', {
  host: 'localhost',
  dialect: 'postgres'
})

// Testing database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to database established!')
  }).catch(err => {
    console.log(`Unable to connect to database: ${err}`)
  })

class Match extends Model {}
Match.init({
  teamSize: Sequelize.INTEGER
}, { sequelize, modelName: 'match' })

Match.sync().then(() => {
  Match.create({teamSize: 5 })
  Match.create({teamSize: 3 })
  Match.findAll().then(matches => {
    console.log('************')
    console.log(matches)
  })
})

const typeDefs = `
  type Query { matches: [Match] }
  type Match { id: Int!, teamSize: Int! }
`

const matches = [
  { id: 1, teamSize: 3 },
  { id: 2, teamSize: 5 },
  { id: 3, teamSize: 5 },
]

const resolvers = {
  Query: { matches: () => matches }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const app = new Koa()
const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({ app })

app.listen(3000)
