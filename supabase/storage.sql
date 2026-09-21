insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public can read product images" on storage.objects;
drop policy if exists "admins can upload product images" on storage.objects;
drop policy if exists "admins can update product images" on storage.objects;
drop policy if exists "admins can delete product images" on storage.objects;

create policy "public can read product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images' and name like 'products/%');

create policy "admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and name like 'products/%' and public.is_admin());

create policy "admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and name like 'products/%' and public.is_admin())
with check (bucket_id = 'product-images' and name like 'products/%' and public.is_admin());

create policy "admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and name like 'products/%' and public.is_admin());
