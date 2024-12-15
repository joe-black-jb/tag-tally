.PHONY: docker venv run uvicorn

build:
	docker build --platform linux/amd64 -t tag-tally:test .

run:
	docker run --rm --name local-tag-tally -it -p 8000:8000 -e ENV=local -v $(pwd):/app tag-tally:test

deploy:
	sh ./scripts/deploy.sh

venv:
	sh ./scripts/venv.sh

util:
	ENV=local python utils.py

start:
	uvicorn main:app --reload
