import os
from app.celery_config import celery

if __name__ == '__main__':
    # Start Celery worker
    celery.worker_main(['worker', '--loglevel=info', '-Q', 'cer']) 