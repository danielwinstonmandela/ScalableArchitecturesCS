FROM python:3.12.2-slim

WORKDIR /app

COPY Music_Stream_App/catalog_service /app/catalog_service/
COPY Music_Stream_App/shared /app/shared/
COPY Music_Stream_App/events /app/events/
COPY Music_Stream_App/catalog_service/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

ENV PYTHONPATH=/app

CMD ["uvicorn", "catalog_service.main:app", "--host", "0.0.0.0", "--port", "8001"]