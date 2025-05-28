FROM python:3.12.2-slim

WORKDIR /app

COPY ./catalog_service /app/catalog_service
COPY ./shared /app/shared
COPY ./events /app/events
COPY ./catalog_service/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

ENV PYTHONPATH=/app

CMD ["uvicorn", "catalog_service.main:app", "--host", "0.0.0.0", "--port", "8001"]