FROM python:3.12.2-slim

WORKDIR /app

COPY ./user_service /app/user_service
COPY ./shared /app/shared
COPY ./events /app/events
COPY ./user_service/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

ENV PYTHONPATH=/app

CMD ["uvicorn", "user_service.main:app", "--host", "0.0.0.0", "--port", "8001"]