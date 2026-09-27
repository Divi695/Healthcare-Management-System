# Healthcare Management System

Patient records, appointment scheduling, prescription tracking, and secure
medical report uploads.

**Stack:** Django + Django REST Framework + PostgreSQL · React + Redux ·
Redis · AWS S3

## Project layout

```
healthcare-management-system/
├── backend/                 Django + DRF API
│   ├── config/               settings, urls, wsgi/asgi
│   └── apps/
│       ├── accounts/          custom User model (roles: admin/doctor/nurse/patient), JWT auth
│       ├── patients/           patient profiles + medical history
│       ├── appointments/       scheduling, with double-booking prevention
│       ├── prescriptions/      prescriptions + medications
│       ├── medical_reports/    S3-backed file uploads, signed URLs
│       └── common/             base model, audit-log middleware, permissions
├── frontend/                 React + Redux Toolkit SPA
│   └── src/
│       ├── api/axiosClient.js  JWT-aware axios instance (auto refresh)
│       ├── app/store.js        Redux store
│       ├── features/           one slice per domain (auth/patients/appointments/prescriptions/reports)
│       └── pages/               route-level screens
└── docker-compose.yml        Postgres + Redis + backend + frontend
```

## Roles & permissions

- **admin** — full access.
- **doctor** — sees their own patients/appointments; can write prescriptions.
- **nurse** — read/write access to clinical records, cannot prescribe.
- **patient** — can only see their own records, appointments, prescriptions and reports.

All access to patients, prescriptions, and reports is logged to `audit.log`
(`apps.common.middleware.AuditLogMiddleware`) — a starting point for
HIPAA-style audit trails, not a compliance guarantee on its own.

## Getting started (Docker)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker-compose up --build
```

- API: http://localhost:8000/api/
- Swagger docs: http://localhost:8000/api/docs/
- Frontend: http://localhost:3000

Then, in a second terminal, run migrations and create an admin user:

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

## Getting started (without Docker)

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then edit DB/Redis/S3 values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm start
```

## Secure medical report storage (S3)

Set `USE_S3=True` in `backend/.env` and fill in the AWS variables. Files are
stored under `reports/<patient_id>/<uuid>.<ext>` (non-guessable keys), the
bucket should be **private**, and the API only ever returns short-lived
signed URLs (5-minute expiry, configurable via `AWS_QUERYSTRING_EXPIRE`) —
never public links.

## Key API endpoints

| Endpoint | Description |
|---|---|
| `POST /api/auth/register/` | Create a user account |
| `POST /api/auth/login/` | Obtain JWT access + refresh tokens |
| `POST /api/auth/refresh/` | Refresh an access token |
| `GET/POST /api/patients/` | List / create patient profiles |
| `GET/POST /api/patients/history/` | Medical history entries |
| `GET/POST /api/appointments/` | Scheduling (conflict-checked per doctor) |
| `GET/POST /api/prescriptions/` | Prescriptions with nested medications |
| `GET/POST /api/reports/` | Multipart upload of medical report files |

Full interactive schema at `/api/docs/` (drf-spectacular / Swagger UI).

## Notes & next steps

This scaffold favors a clean, working baseline over exhaustive coverage.
Reasonable next additions: Celery + Redis for appointment reminder emails/SMS,
rate-limited OTP-based 2FA for staff accounts, field-level encryption for
particularly sensitive columns (e.g. allergies, diagnoses), and a proper
CI pipeline running `pytest` + `npm test`.
