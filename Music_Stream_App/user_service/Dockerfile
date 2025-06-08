FROM python:3.12.2-slim

WORKDIR /app

COPY Music_Stream_App/user_service /app/user_service/
COPY Music_Stream_App/shared /app/shared/
COPY Music_Stream_App/events /app/events/
COPY Music_Stream_App/user_service/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

ENV PYTHONPATH=/app

CMD ["uvicorn", "user_service.main:app", "--host", "0.0.0.0", "--port", "8001"]