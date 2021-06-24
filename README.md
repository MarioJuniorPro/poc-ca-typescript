# POC - Clean Architecture with Express and Typescript 

> ⚠️ This project is for demonstration only, do not use in production. ⚠️

## Setup:

``` shell
npm install
```

Copy the example .env file before running the app. If needed, set any specific credential.

``` shell
cp .env.example .env
```

## Development:

``` shell
npm run dev
```

To use the debug mode:

``` shell
npm run dev:debug
```

If you're using Visual Studio Code, the debugger is configured to automatically attach to the process.

## Running:

To run the optimized version the application must be compiled.

``` shell
npm run build
```

Now it possible to run using:

``` shell
npm start
```

## Docker:

> 🚧 Docker environment is not prepared for development or debug using containers.

> 🚧 Docker image is set to copy the .env file during the build.

``` shell
docker build --tag poc-ca-typescript:prod --target production .
docker run --rm -p 3000:3000 --env-file ./.env poc-ca-typescript:prod
```
