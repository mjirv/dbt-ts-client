# dbt-ts-client

A module for running [dbt](https://getdbt.com) via TypeScript/JavaScript

## Usage
### Installation
`npm install dbt-ts-client`

### API
The module aims to replicate all [methods and options of the dbt CLI](https://docs.getdbt.com/reference/dbt-commands). Please raise an issue if something is missing.

See `docs/` for full documentation.
```ts
import DbtClient from 'dbt-ts-client'

const client = new DbtClient('/path/to/dbt/project')
client.run()