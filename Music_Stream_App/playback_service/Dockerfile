FROM python:3.12.2-slim

WORKDIR /app

COPY Music_Stream_App/playback_service /app/playback_service/
COPY Music_Stream_App/shared /app/shared/
COPY Music_Stream_App/events /app/events/
COPY Music_Stream_App/playback_service/requirements.txt /app/requirements.txt
COPY Music_Stream_App/playback_service/wait-for-it.sh /wait-for-it.sh

RUN pip install --no-cache-dir -r /app/requirements.txt
RUN chmod +x /wait-for-it.sh

ENV PYTHONPATH=/app

CMD ["/wait-for-it.sh", "playback_db:5432", "--", "uvicorn", "playback_service.main:app", "--host", "0.0.0.0", "--port", "8001"]