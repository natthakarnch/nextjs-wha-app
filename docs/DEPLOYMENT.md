# Deployment Guide for Production

This project is configured to run in production with specific environment settings. Follow these steps to ensure a successful deployment.

## 1. Environment Configuration (.env.production)
Ensure the `.env.production` file is correctly set up before building or deploying.

Required variables:
- `DATABASE_URL`: Must use `mariadb://` format (e.g., `mariadb://user:password@host:3306/db_name`)
- `RESEND_API_KEY`: API key for email services
- `CONTACT_RECEIVER_EMAIL`: Email address to receive contact form submissions

## 2. Production Build
Run the following command to generate the production build:
```bash
npm run build
```
- The build process will use the variables defined in `.env.production`.
- Ensure all necessary dependencies (including devDependencies if required by your CI/CD pipeline) are installed via `npm install`.

## 3. Deployment Checklist
- **Database Connection**: Ensure the database host (e.g., `host.docker.internal` or production DB host) is accessible from the production environment.
- **Node.js Version**: Use Node.js 18+ (as required by Next.js 16).
- **Environment Injection**: If using Docker or a cloud provider (Vercel, etc.), make sure the environment variables are injected at runtime.
- **Cache Components**: This project uses Next.js 16 Cache Components, ensure your hosting platform supports Next.js 16.

## 4. Troubleshooting
- **Build Errors (EPERM)**: If you encounter file permission errors on Windows during local builds, use `cmd /c "rmdir /S /Q .next"` to clear the build cache.
- **Connection String Errors**: If Prisma throws "error parsing connection string", verify that your `DATABASE_URL` starts with `mariadb://` and not `mysql://`.
- **Missing Modules**: Ensure `npm install` has been run to include all production dependencies (e.g., `recharts`).
