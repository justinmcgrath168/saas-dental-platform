https://1.gpt600.com/chat/bf676a44-7cc3-49a3-aec5-a286a9cc2d9a
dental-management-saas/
│
├── .github/ # GitHub Actions and CI/CD configuration
│ └── workflows/
│ ├── ci.yml
│ └── deploy.yml
│
├── app/ # Next.js 14 app router
│ ├── api/ # API routes
│ │ ├── auth/
│ │ │ └── [...nextauth]/
│ │ │ └── route.ts
│ │ ├── check-subdomain/
│ │ │ └── route.ts
│ │ ├── organizations/
│ │ │ ├── route.ts
│ │ │ ├── [id]/
│ │ │ │ ├── route.ts
│ │ │ │ └── locations/
│ │ │ │ └── route.ts
│ │ │ └── [organizationId]/
│ │ │ └── users/
│ │ │ └── route.ts
│ │ ├── permissions/
│ │ │ └── route.ts
│ │ ├── tenants/
│ │ │ ├── route.ts
│ │ │ └── [id]/
│ │ │ ├── route.ts
│ │ │ └── subscriptions/
│ │ │ ├── route.ts
│ │ │ └── [id]/
│ │ │ └── route.ts
│ │ └── users/
│ │ ├── route.ts
│ │ └── [id]/
│ │ └── route.ts
│ │
│ ├── auth/ # Authentication pages
│ │ ├── signin/
│ │ │ └── page.tsx
│ │ ├── register/
│ │ │ ├── page.tsx
│ │ │ └── success/
│ │ │ └── page.tsx
│ │ ├── forgot-password/
│ │ │ └── page.tsx
│ │ ├── reset-password/
│ │ │ └── page.tsx
│ │ └── error/
│ │ └── page.tsx
│ │
│ ├── (marketing)/ # Public marketing pages
│ │ ├── page.tsx # Landing page
│ │ ├── pricing/
│ │ │ └── page.tsx
│ │ ├── about/
│ │ │ └── page.tsx
│ │ ├── features/
│ │ │ └── page.tsx
│ │ ├── contact/
│ │ │ └── page.tsx
│ │ ├── terms/
│ │ │ └── page.tsx
│ │ └── privacy/
│ │ └── page.tsx
│ │
│ ├── (dashboard)/ # Protected dashboard pages
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ ├── users/
│ │ │ ├── page.tsx
│ │ │ ├── create/
│ │ │ │ └── page.tsx
│ │ │ └── [id]/
│ │ │ ├── page.tsx
│ │ │ └── edit/
│ │ │ └── page.tsx
│ │ ├── organizations/
│ │ │ ├── page.tsx
│ │ │ ├── create/
│ │ │ │ └── page.tsx
│ │ │ └── [id]/
│ │ │ ├── page.tsx
│ │ │ └── edit/
│ │ │ └── page.tsx
│ │ ├── settings/
│ │ │ ├── page.tsx
│ │ │ ├── profile/
│ │ │ │ └── page.tsx
│ │ │ ├── organization/
│ │ │ │ └── page.tsx
│ │ │ ├── subscription/
│ │ │ │ └── page.tsx
│ │ │ └── team/
│ │ │ └── page.tsx
│ │ │
│ │ ├── patients/ # Dental Clinic Module
│ │ │ ├── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ ├── appointments/
│ │ │ ├── page.tsx
│ │ │ └── calendar/
│ │ │ └── page.tsx
│ │ ├── treatments/
│ │ │ ├── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ ├── invoices/
│ │ │ ├── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ │
│ │ ├── lab-cases/ # Dental Lab Module
│ │ │ ├── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ ├── designs/
│ │ │ └── page.tsx
│ │ ├── production/
│ │ │ └── page.tsx
│ │ │
│ │ ├── imaging/ # Imaging Center Module
│ │ │ ├── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ ├── referrals/
│ │ │ └── page.tsx
│ │ │
│ │ ├── inventory/ # Supplies Management Module
│ │ │ └── page.tsx
│ │ ├── orders/
│ │ │ ├── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ └── suppliers/
│ │ └── page.tsx
│ │
│ ├── layout.tsx # Root layout
│ ├── error.tsx # Global error boundary
│ ├── loading.tsx # Global loading state
│ └── not-found.tsx # 404 page
│
├── components/ # Shared React components
│ ├── ui/ # shadcn UI components
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ ├── form.tsx
│ │ ├── input.tsx
│ │ └── ... (other shadcn components)
│ │
│ ├── layout/ # Layout components
│ │ ├── main-nav.tsx
│ │ ├── user-nav.tsx
│ │ ├── sidebar.tsx
│ │ ├── mobile-nav.tsx
│ │ ├── footer.tsx
│ │ └── tenant-switcher.tsx
│ │
│ ├── dashboard/ # Dashboard components
│ │ ├── dashboard-stats.tsx
│ │ ├── recent-activity.tsx
│ │ └── upcoming-appointments.tsx
│ │
│ ├── user/ # User-related components
│ │ ├── user-card.tsx
│ │ ├── user-role-badge.tsx
│ │ └── permission-list.tsx
│ │
│ ├── patient/ # Patient-related components
│ │ ├── patient-card.tsx
│ │ ├── treatment-history.tsx
│ │ └── odontogram.tsx
│ │
│ ├── appointment/ # Appointment components
│ │ ├── appointment-form.tsx
│ │ ├── calendar-view.tsx
│ │ └── time-slots.tsx
│ │
│ ├── lab/ # Lab-related components
│ │ ├── case-status.tsx
│ │ ├── production-timeline.tsx
│ │ └── case-details.tsx
│ │
│ ├── imaging/ # Imaging components
│ │ ├── image-viewer.tsx
│ │ └── referral-form.tsx
│ │
│ └── forms/ # Reusable form components
│ ├── address-form.tsx
│ ├── search-filter.tsx
│ └── date-range-picker.tsx
│
├── lib/ # Utility libraries
│ ├── prisma.ts # Prisma client
│ ├── auth.ts # Authentication utilities
│ ├── api-utils.ts # API helper functions
│ ├── validators.ts # Zod validators
│ ├── date-utils.ts # Date formatting utilities
│ ├── tenant-utils.ts # Multi-tenancy utilities
│ └── permissions.ts # Permission checking utilities
│
├── hooks/ # Custom React hooks
│ ├── use-toast.ts
│ ├── use-permissions.ts
│ ├── use-tenant.ts
│ └── use-organization.ts
│
├── types/ # TypeScript type definitions
│ ├── next-auth.d.ts
│ ├── database.ts
│ └── api.ts
│
├── prisma/ # Prisma ORM
│ ├── schema.prisma # Database schema
│ ├── seed.ts # Seed data
│ └── migrations/ # Database migrations
│
├── public/ # Static assets
│ ├── favicon.ico
│ ├── logo.svg
│ └── images/
│ ├── landing/
│ └── dashboard/
│
├── styles/ # Global styles
│ └── globals.css # Tailwind imports
│
├── middleware.ts # Next.js middleware for tenant routing
├── next.config.js # Next.js configuration
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
├── tsconfig.json # TypeScript configuration
├── package.json # Project dependencies
├── .env.example # Example environment variables
├── .gitignore
├── .eslintrc.json # ESLint configuration
└── README.md # Project documentation
