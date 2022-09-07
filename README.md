# dbt-ts-client

A module for running [dbt](https://getdbt.com) via TypeScript/JavaScript

## Usage
### Installation
`npm install dbt_ts_client`

### API
The module aims to replicate all [methods and options of the dbt CLI](https://docs.getdbt.com/reference/dbt-commands). Please raise an issue if something is missing.

See `docs/` for full documentation.
```ts
import DbtClient from 'dbt_ts_client'

const dbt = new DbtClient({ dbtProjectPath: '/path/to/dbt/project' })
await dbt.deps()
dbt.run()
```
