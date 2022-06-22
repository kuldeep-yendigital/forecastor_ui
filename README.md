# Omdia Forecaster UI

## Local development

If your local setup matches the app specs as defined in the [package.json](./package.json) you can run the npm commands from the script section directly, otherwise just use the docker image which will start up with `npm run dev` as the default command.

### Docker image

To execute the docker image you need to set a couple of environment variables which are defined in an env file in the root directory of the project. All required variable identifiers are shipped in the [.env.dist](./.end.dist) file which you can use as an example.

```sh
# Start the container
$ docker-compose up

# Run the unit test suite
$ docker exec -it forecaster-ui npm run test

# Execute bash inside the running container
$ docker exec -it forecaster-ui bash
```

## Installation
Node: tested on version 6.9.2

NPM: tested n version 4.0.5

The tests will pop up a Chrome browser, you need Chrome installed as well.

Check out this repo, then do:
```
npm install
```

For Windows users, it's handy to set up `git` to check out `LF`s instead of `CRLF`s, like this:
```
git config --global core.autocrlf input
```

## Building

Build with:
```
npm run build
```


## Running


```
npm start
```

will start the `webpack` dev server and hot-reload your changes.

```
npm run start:prod
```
Will just start an http-server pointing to the *dist* folder. (You will need to run npm build before to )

### Defaults

If environment variable `environment` is not set, settings from *forecaster-uiconfig\default.settings.js* will be used, otherwise if set, the settings for that environment from the same folder will be used.

[Changing Forecaster to use local APIs](localAPIs.md)

## Testing
Run unit tests with:
```
npm test
```

and end to end tests with *(Remember to run the server first)*:

```
npm run e2e
```

To run just the tests in a feature file you can just use protractor directly.
For example if you want to run all the tests from `metric-selection.feature`:
```
node_modules\.bin\protractor test\protractor.conf.js --specs test\e2e\features\metric-selection.feature
```

## Deployment ##


You will need to set the environment variable `environment` to the environment you want to deploy to.

	set environment=[dev|qa] e.g. set environment=dev
	or
	Teamcity Configuration Parameter env.environment

  Deploy the contents of the *dist* folder to the s3 bucket with:

```
npm deploy
```
During deployment files in folder `config` are used:

* [environment].json files to determine the environment to deploy to.
* [environment].settings.js files contain settings for the running application. The appropriate file is copied to settings.js on the root of application.

## Environment Variables
* `environment` - e.g. 'local', 'dev', 'qa'

### Required environment vars:
* `AWS_ACCESS_KEY_ID` - standard AWS env var
* `AWS_SECRET_ACCESS_KEY` - standard AWS env var

:rocket:
