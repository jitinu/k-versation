insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  is_sso_user,
  is_anonymous
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'kr-member@example.com',
    '',
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Korean Member","username":"kr_member"}',
    false,
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'us-member@example.com',
    '',
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"US Member","username":"us_member"}',
    false,
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'jp-member@example.com',
    '',
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Japan Member","username":"jp_member"}',
    false,
    false,
    false
  )
on conflict (id) do nothing;

insert into public.profiles (id, username, display_name, country_code, country_name)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'kr_member',
    'Korean Member',
    'KR',
    'South Korea'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'us_member',
    'US Member',
    'US',
    'United States'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'jp_member',
    'Japan Member',
    'JP',
    'Japan'
  )
on conflict (id) do update
set
  username = excluded.username,
  display_name = excluded.display_name,
  country_code = excluded.country_code,
  country_name = excluded.country_name;
