FROM python:3.12.2-slim

WORKDIR /app

COPY Music_Stream_App/playback_service /app/playback_service/
COPY Music_Stream_App/shared /app/shared/
COPY Music_Stream_App/events /app/events/
COPY Music_Stream_App/playback_service/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

ENV PYTHONPATH=/app

CMD ["uvicorn", "playback_service.main:app", "--host", "0.0.0.0", "--port", "8001"]