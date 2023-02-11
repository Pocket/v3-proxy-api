# v3-Proxy-Api
wrapper to connect the v3 endpoints to pocket graph v1 
- endpoints to be covered `add`, `send`, and `get`

## Folder structure

- the infrastructure code is present in `.aws`
- the application code is in `src`
- `.circleci` contains circleCI setup

## Develop Locally
```js
nvm use
npm ci
docker-compose up
```

## Run tests
```js
npm run test
npm run test-integrations
```

### Using Docker

```bash
npm ci
docker-compose up
```

### Not Using Docker

Alternatively if you do not need to use the docker services in your app, like snowplow, you can do:

```bash
npm ci
npm run start:dev
```
