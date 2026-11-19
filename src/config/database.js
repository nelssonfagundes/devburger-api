import { createRequire } from 'node:module'

// reaproveita o mesmo arquivo de configuração das migrations
const require = createRequire(import.meta.url)
const databaseConfig = require('./database.cjs')

export default databaseConfig
