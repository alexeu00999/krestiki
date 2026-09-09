SHELL := /bin/sh

PORT ?= 8000
REQUIRED_FILES := index.html style.css app.js Makefile README.md

.PHONY: run check

run:
	@command -v python3 >/dev/null 2>&1 || { echo "Ошибка: нужен Python 3"; exit 1; }
	@echo "Игра доступна по адресу: http://localhost:$(PORT)"
	@python3 -m http.server "$(PORT)"

check:
	@missing=0; \
	for file in $(REQUIRED_FILES); do \
		if [ ! -f "$$file" ]; then \
			echo "Не найден файл: $$file"; \
			missing=1; \
		fi; \
	done; \
	if [ "$$missing" -ne 0 ]; then \
		exit 1; \
	fi; \
	echo "OK: все обязательные файлы на месте";
