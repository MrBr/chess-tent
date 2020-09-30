# Chess Tent

### Setup instructions

Run these commands:
```shell script
yarn build:dev
docker-compose -f docker-compose.yml
```

Then open up 2 terminal windows and run following in each

```shell script
cd ./packages/server
yarn start
```

```shell script
cd ./packages/web
yarn start
```

Access the app at http://localhost:3000
