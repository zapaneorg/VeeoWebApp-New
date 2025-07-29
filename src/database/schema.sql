create table
  public.bookings (
    id uuid not null default gen_random_uuid (),
    user_id uuid null,
    driver_id uuid null,
    pickup_location_text text not null,
    dropoff_location_text text not null,
    pickup_lat numeric null,
    pickup_lng numeric null,
    dropoff_lat numeric null,
    dropoff_lng numeric null,
    booking_time timestamp with time zone not null,
    scheduled_time timestamp with time zone null,
    status text null,
    vehicle_type text null,
    estimated_price numeric null,
    actual_price numeric null,
    estimated_duration_minutes integer null,
    actual_duration_minutes integer null,
    distance_km numeric null,
    passengers integer null,
    luggage integer null,
    child_seat boolean null,
    comments text null,
    payment_method_id text null,
    payment_status text null,
    rating integer null,
    review_comment text null,
    driver_rating integer null,
    cancellation_reason text null,
    cancelled_by text null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    driver_lat numeric null,
    driver_lng numeric null,
    passenger_first_name text null,
    passenger_last_name text null,
    passenger_phone text null,
    constraint bookings_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.driver_documents (
    id uuid not null default gen_random_uuid (),
    driver_id uuid not null,
    document_type text not null,
    status text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    file_path text null,
    constraint driver_documents_pkey primary key (id),
    constraint driver_documents_driver_id_fkey foreign key (driver_id) references profiles (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
  public.driver_settings (
    id uuid not null default gen_random_uuid (),
    driver_id uuid not null,
    theme text null,
    navigation_app text null,
    sound_volume numeric null,
    iban text null,
    swift text null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint driver_settings_pkey primary key (id),
    constraint driver_settings_driver_id_fkey foreign key (driver_id) references profiles (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
  public.favorite_addresses (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    label text not null,
    address text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint favorite_addresses_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.profiles (
    id uuid not null,
    first_name text null,
    last_name text null,
    phone text null,
    email text null,
    profile_pic_url text null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    street_address text null,
    street_number text null,
    postal_code text null,
    department text null,
    role text not null,
    city text null,
    vehicle_model text null,
    license_plate text null,
    vehicle_year integer null,
    status text null,
    lat numeric null,
    lng numeric null,
    constraint profiles_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.ride_messages (
    id uuid not null default gen_random_uuid (),
    booking_id uuid not null,
    sender_id uuid not null,
    sender_type text not null,
    message text not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint ride_messages_pkey primary key (id),
    constraint ride_messages_booking_id_fkey foreign key (booking_id) references bookings (id) on update cascade on delete cascade,
    constraint ride_messages_sender_id_fkey foreign key (sender_id) references profiles (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
  public.chat_messages (
    id uuid not null default gen_random_uuid (),
    booking_id uuid not null,
    sender_id uuid not null,
    message text not null,
    created_at timestamp with time zone not null default now(),
    constraint chat_messages_pkey primary key (id),
    constraint chat_messages_booking_id_fkey foreign key (booking_id) references bookings (id) on update cascade on delete cascade,
    constraint chat_messages_sender_id_fkey foreign key (sender_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;