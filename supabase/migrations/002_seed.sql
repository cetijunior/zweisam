-- Seed categories for celebration photography niche
insert into public.categories (slug, name_de, name_en, sort_order) values
  ('couples', 'Paare', 'Couples', 1),
  ('gender-reveal', 'Gender Reveal', 'Gender Reveal', 2),
  ('birthdays', 'Geburtstage', 'Birthdays', 3),
  ('kids', 'Kinderfeste', 'Kids Parties', 4),
  ('gatherings', 'Zusammenkünfte', 'Gatherings', 5),
  ('indoor', 'Indoor', 'Indoor', 6),
  ('outdoor', 'Outdoor', 'Outdoor', 7)
on conflict (slug) do nothing;

update public.site_settings set
  studio_name = 'Zweisam',
  tagline_de = 'Die kleinen Feiern. Die großen Gefühle.',
  tagline_en = 'Small gatherings. Big feelings.',
  about_headline_de = 'Zwei Blicke. Eine Geschichte.',
  about_headline_en = 'Two lenses. One story.',
  about_body_de = 'Wir sind ein Paar hinter der Kamera — und fotografieren die Feiern dazwischen.',
  about_body_en = 'We are a couple behind the camera — photographing the celebrations in between.',
  email = 'hello@zweisam.studio',
  instagram = 'https://instagram.com/zweisam',
  tiktok = 'https://tiktok.com/@zweisam',
  handle = '@zweisam',
  location = 'Berlin',
  photographers_de = 'Ein Paar. Ein Studio.',
  photographers_en = 'A couple. A studio.',
  updated_at = now()
where id = 1;
