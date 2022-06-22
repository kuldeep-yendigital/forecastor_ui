# Switching website to use local APIs 

## Running local APIs

In **forecaster-api** workspace:

Using command line in **taxonomy** directory 

	sls offline --port 3000 --env local

Start any additional APIs you want to use.

Ports must match values in *forecaster-api\taxonomy\lib\environments.json.*
	
Using command line in **metric** directory

	sls offline --port 3001 --env local

Using command line in **timeframe** directory

	sls offline --port 3002 --env local

Using command line in **geograpy** directory

	sls offline --port 3003 --env local
	
Using command line in **data** directory

	sls offline --port 3004 --env local

## Running website

In **forecaster-ui** workspace:

Using command line
```
set environment=local
gulp run
```
