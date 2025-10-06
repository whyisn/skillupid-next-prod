-- SkillUpID schema for Supabase (Postgres)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text default 'student',
  created_at timestamp with time zone default now()
);

create table if not exists public.courses (
  id text primary key,
  title text not null,
  category text,
  level text,
  rating numeric,
  price integer default 0,
  premium boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.modules (
  id text primary key,
  course_id text references public.courses(id) on delete cascade,
  title text not null,
  order_no integer not null default 1,
  video_provider text,
  video_id text,
  duration_seconds integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  course_id text references public.courses(id) on delete cascade,
  status text default 'active',
  created_at timestamp with time zone default now(),
  unique(user_id, course_id)
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete cascade,
  module_id text references public.modules(id) on delete cascade,
  percent integer default 0,
  updated_at timestamp with time zone default now(),
  unique(enrollment_id, module_id)
);

create table if not exists public.quizzes (
  id text primary key,
  course_id text references public.courses(id) on delete cascade,
  title text not null
);

create table if not exists public.questions (
  id text primary key,
  quiz_id text references public.quizzes(id) on delete cascade,
  body text not null,
  type text not null default 'mcq',
  options jsonb,
  answer_key jsonb
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_id text references public.quizzes(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  score numeric default 0,
  passed boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  course_id text references public.courses(id) on delete cascade,
  code text unique not null,
  pdf_url text,
  issued_at timestamp with time zone default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  course_id text references public.courses(id),
  amount integer not null,
  status text not null,
  provider text not null default 'midtrans',
  external_ref text,
  created_at timestamp with time zone default now()
);

-- RLS enable
alter table public.users enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;
alter table public.submissions enable row level security;
alter table public.certificates enable row level security;
alter table public.payments enable row level security;

-- Basic policies (adjust as needed)
create policy "users_self" on public.users for select using (auth.email() = email);
create policy "enrollments_self" on public.enrollments for all using (user_id = auth.uid());
create policy "progress_self" on public.progress for all using (
  exists(select 1 from enrollments e where e.id = enrollment_id and e.user_id = auth.uid())
);
create policy "submissions_self" on public.submissions for all using (user_id = auth.uid());
create policy "certificates_self" on public.certificates for select using (user_id = auth.uid());
create policy "payments_self" on public.payments for select using (user_id = auth.uid());
