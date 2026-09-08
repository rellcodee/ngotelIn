--
-- PostgreSQL database dump
--

\restrict UCE6BsJuiGFIv9sqYYzaqYP9Ed0JaVBsVEVtdo25ejt0uTDIInEAUN32bzCnSX3

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO admin_ngotel;

--
-- Name: ai_chat_logs; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.ai_chat_logs (
    id uuid NOT NULL,
    user_id uuid,
    message text,
    response text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ai_chat_logs OWNER TO admin_ngotel;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.bookings (
    id uuid NOT NULL,
    user_id uuid,
    schedule_id uuid,
    status character varying(20) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    total_price integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.bookings OWNER TO admin_ngotel;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    user_id uuid,
    booking_id uuid,
    type character varying(30),
    message text,
    is_read boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO admin_ngotel;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    booking_id uuid NOT NULL,
    amount integer NOT NULL,
    payment_method character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    paid_at timestamp(6) without time zone
);


ALTER TABLE public.payments OWNER TO admin_ngotel;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.resources (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    type character varying(50),
    location character varying(150),
    capacity integer,
    facilities text[] DEFAULT ARRAY[]::text[],
    price_per_night integer DEFAULT 0 NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.resources OWNER TO admin_ngotel;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    booking_id uuid,
    rating integer,
    comment text
);


ALTER TABLE public.reviews OWNER TO admin_ngotel;

--
-- Name: room_images; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.room_images (
    id uuid NOT NULL,
    resource_id uuid NOT NULL,
    image_url text NOT NULL,
    is_primary boolean DEFAULT false NOT NULL
);


ALTER TABLE public.room_images OWNER TO admin_ngotel;

--
-- Name: schedules; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.schedules (
    id uuid NOT NULL,
    resource_id uuid,
    start_time timestamp(6) without time zone NOT NULL,
    end_time timestamp(6) without time zone NOT NULL,
    status character varying(20) DEFAULT 'available'::character varying
);


ALTER TABLE public.schedules OWNER TO admin_ngotel;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin_ngotel
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255),
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO admin_ngotel;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c4122f7b-50a9-4298-8691-800c33b59460	425ac58aeec5c98b9ca26eb4fbe95c67dff37fd02a0223db8c832edcd5aa4a08	2026-08-06 23:46:07.543792+07	20260708151015_init	\N	\N	2026-08-06 23:46:07.471289+07	1
4182b3ba-af38-460d-a0aa-edced4fda08c	0b5b1605a86e1b493dc5807efbdb32232411cd04c37c90b00047b09a7164b33c	2026-08-06 23:46:07.576465+07	20260713060625_add_hotel_features_and_payments	\N	\N	2026-08-06 23:46:07.546661+07	1
6c2f2e66-91c0-4901-a079-bff4dc203e24	e37b83ca243b679815b87faa590515b1bf4d894cd6a7613803dcbc92374fa172	2026-08-06 23:46:07.587706+07	20260729121413_add_uniques_and_fix_relations	\N	\N	2026-08-06 23:46:07.578479+07	1
\.


--
-- Data for Name: ai_chat_logs; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.ai_chat_logs (id, user_id, message, response, created_at) FROM stdin;
3659caee-ddc2-4882-a429-c9487af4e662	746a77a6-b9ad-43ea-9219-0d5ea3fb0b01	Rekomendasi kamar	Halo Kak Jamal! Tentu, saya bantu carikan rekomendasi kamar yang pas ya. \n\nDi SiniBook, kami punya tiga pilihan kamar yang nyaman:\n1. **Standard Cozy 101** (Kapasitas 2 orang, Rp350rb/malam) dengan fasilitas Wi-Fi, AC, TV, dan Single Bed. [Lihat Detail Standard Cozy 101](/rooms/7f1f6d35-2649-4e5c-aeac-e7b1e1ada54c)\n2. **Deluxe Suite 202** (Kapasitas 3 orang, Rp750rb/malam) dengan fasilitas Wi-Fi, AC, TV, Queen Bed, Minibar, dan Bathtub. [Lihat Detail Deluxe Suite 202](/rooms/e729ab30-c2fb-41ac-b1ce-b1d2468d70ca)\n3. **Presidential Penthouse 501** (Kapasitas 5 orang, Rp2,5 juta/malam) dengan fasilitas mewah seperti Private Pool, Private Elevator, Butler Service, dan lainnya. [Lihat Detail Presidential Penthouse 501](/rooms/77ffd1be-9234-44e4-b37c-0ea802a8c720)\n\nKak Jamal lagi cari kamar untuk berapa orang nih?	2026-08-27 07:35:55.124
16b0d156-64d5-4f07-8837-85d274f0e806	18de12d4-8cab-4cb5-8b57-905245b7f22a	Lokasi & akses	Halo Kak Super Admin NgotelIn! SiniBook Hotel berlokasi di Jl. Sudirman No. 123, Jakarta Pusat. \n\nLokasinya sangat strategis di pusat kota dan mudah diakses, Kak. Kalau butuh bantuan lain seputar kamar atau fasilitas, kabari TiniBot ya!	2026-09-02 07:01:12.241
7379545d-b2c8-4f8b-b3bf-7d7df9e3efad	18de12d4-8cab-4cb5-8b57-905245b7f22a	Halo Selamat Siang	Halo Kak Super Admin NgotelIn! Ada yang bisa TiniBot bantu terkait info kamar atau fasilitas SiniBook Hotel siang ini?	2026-09-02 07:30:37.521
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.bookings (id, user_id, schedule_id, status, notes, created_at, total_price) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.notifications (id, user_id, booking_id, type, message, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.payments (id, booking_id, amount, payment_method, status, paid_at) FROM stdin;
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.resources (id, name, type, location, capacity, facilities, price_per_night, description, created_at, updated_at) FROM stdin;
7f1f6d35-2649-4e5c-aeac-e7b1e1ada54c	Standard Cozy 101	standard	Lantai 1	2	{Wi-Fi,AC,TV,"Single Bed"}	350000	Kamar bersih dan Nyaman	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
e729ab30-c2fb-41ac-b1ce-b1d2468d70ca	Deluxe Suite 202	suite	Lantai 2	3	{Wi-Fi,AC,TV,"Queen Bed",Minibar,Bathtub}	750000	Kamar bersih dan Nyaman	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
b2fd52f5-667d-4284-b093-63f5e9d65cfb	Test Kamar	suite	Lantai 5	4	{Wifi,"Smart TV",AC,GYM,"Kolam Renang"}	500000	Kamar bersih dan Nyaman	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
77ffd1be-9234-44e4-b37c-0ea802a8c720	Presidential Penthouse 501	presidential_suite	Lantai 5 (Rooftop)	5	{"Private Pool","Private Elevator","Butler Service",Wi-Fi,"King Bed","Smart Home Control"}	2500000	Kamar bersih dan Nyaman	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
ce9438f6-b3a7-45fe-974c-4f52b85dc117	Pler	presidential_suite	Lantai 3	2	{gym}	5000000	sedlkm	2026-09-08 16:51:22.196	2026-09-08 16:51:22.196
bc4a6daf-653c-4535-b683-83373a407294	Kamar Standard - 101	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 101 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
76898d2d-af83-4b58-8438-e3fc2f0247bf	Kamar Standard - 102	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 102 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
7dfc4685-b595-4476-a3d3-92628a575e9a	Kamar Standard - 103	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 103 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
6ad2a7f6-f261-4e8c-b423-665ccdf1ed3d	Kamar Standard - 104	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 104 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
f50c5d6a-ed82-4e4f-b739-0df9f6065789	Kamar Standard - 105	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 105 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
fad0bb9a-a90f-4b6a-b4ba-6a965e2ef67f	Kamar Standard - 106	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 106 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
637ec105-5879-41e5-8132-a26886fee3f9	Kamar Standard - 107	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 107 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
cb26a315-db6f-496c-a1cc-9cc35a688c53	Kamar Standard - 108	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 108 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
1a52b8d2-30e3-4d1f-aca7-b66be974bcb8	Kamar Standard - 109	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 109 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
328186f5-994e-460f-8a73-8d1ddfb34aaf	Kamar Standard - 110	Standard	Lantai 1	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 110 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
bbe853c2-be72-4fae-9bda-0f91e5bbcd7a	Kamar Standard - 111	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 111 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
33cae0a4-2443-4a3a-b36c-347730f2fa16	Kamar Standard - 112	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 112 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
37c52625-4a8e-4210-9cda-9bc2bd3bbee6	Kamar Standard - 113	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 113 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
6738c27e-9dad-462b-81fb-945cc9f40833	Kamar Standard - 114	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 114 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
7ce5a2c7-69c4-4170-b249-a55c7ab67d26	Kamar Standard - 115	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 115 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
975da61c-9460-42c2-acd9-6c52915341e1	Kamar Standard - 116	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 116 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
e32daa23-fc92-41f1-b520-4df4052764af	Kamar Standard - 117	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 117 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
192406f1-ddae-4e4d-8f30-30a86d8c4b83	Kamar Standard - 118	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 118 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
52aa73df-dceb-44fb-921f-9933efea88ae	Kamar Standard - 119	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 119 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
7f76a1d3-3f14-4f8d-8dd3-f2d0fa8e5643	Kamar Standard - 120	Standard	Lantai 2	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 120 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
b6adff35-7bdc-4ee5-a53f-5ba10de057b1	Kamar Standard - 121	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 121 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
4323eead-f545-4dcb-b300-50fef863d328	Kamar Standard - 122	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 122 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
027b6187-2728-483b-bbe6-e4d7fd3123ed	Kamar Standard - 123	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 123 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
3e0bf188-300b-47a2-82d3-8e91533dfba9	Kamar Standard - 124	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 124 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
3e30642a-8030-499c-b29e-64532643f0c5	Kamar Standard - 125	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 125 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
4875ba3b-e1a3-443b-b81b-2b0aa4cc1df1	Kamar Standard - 126	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 126 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
42a1af30-51d1-467c-85d8-ce00077768e6	Kamar Standard - 127	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 127 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
37d7426c-7e40-46a3-9b76-cfc4492164b2	Kamar Standard - 128	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 128 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
a43081e7-15e2-455a-bfa1-3bd42eeca552	Kamar Standard - 129	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 129 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
bb28aae0-3426-445e-9796-c89cfa621f1d	Kamar Standard - 130	Standard	Lantai 3	2	{WiFi,TV,AC,"Kamar Mandi Dalam"}	400000	Nikmati kenyamanan menginap di Kamar Standard - 130 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
8cde8784-7864-4eb8-b4b9-7e8ce44e23bd	Kamar Suite - 131	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 131 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
410a7e41-c7dc-4119-8686-b66d50af694c	Kamar Suite - 132	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 132 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
25962f40-fda8-4a3d-942d-f8367c3817c8	Kamar Suite - 133	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 133 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
2e8bfb2a-4bdb-4a44-ab96-fe3bb427f6e8	Kamar Suite - 134	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 134 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
32c8833e-3072-4374-b901-80dbbbb48d29	Kamar Suite - 135	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 135 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
04ea6915-4272-4013-9863-dab03dd88942	Kamar Suite - 136	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 136 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
42efc916-9a13-485b-938e-00ab5b15cb19	Kamar Suite - 137	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 137 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
6fc51f9a-1a0b-4c14-92b8-b56497192a62	Kamar Suite - 138	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 138 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
f2ac779b-e5ae-4d65-81d5-d3e34f649225	Kamar Suite - 139	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 139 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
63e964b8-0ffa-4d0c-b6ee-058ffe9e27bc	Kamar Suite - 140	Suite	Lantai 4	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 140 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
bc9de567-a15c-45cc-9e49-67d33033afd0	Kamar Suite - 141	Suite	Lantai 5	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 141 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
dfc3764f-7fb4-4c24-944b-1eb0dfb7d4de	Kamar Suite - 142	Suite	Lantai 5	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 142 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
9c318ade-28e2-4fa1-86d6-af6c376dd784	Kamar Suite - 143	Suite	Lantai 5	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 143 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
5db68833-36ca-453d-9faa-7e936269a857	Kamar Suite - 144	Suite	Lantai 5	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 144 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
cebf00c1-23ff-44cb-b511-6508f5c19448	Kamar Suite - 145	Suite	Lantai 5	4	{WiFi,"Smart TV",AC,Bathtub,Minibar,"Ruang Tamu","Akses Lounge"}	1500000	Nikmati kenyamanan menginap di Kamar Suite - 145 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
73f69b99-5f73-44c1-b824-60acdeb5d049	Kamar Presidential Suite - 146	Presidential Suite	Lantai 5	6	{WiFi,"Smart TV",AC,Jacuzzi,"Dapur Pribadi","Pelayan Pribadi",Balkon}	3500000	Nikmati kenyamanan menginap di Kamar Presidential Suite - 146 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
d964787f-afe9-47f9-aa71-7a4dc5c913ae	Kamar Presidential Suite - 147	Presidential Suite	Lantai 5	6	{WiFi,"Smart TV",AC,Jacuzzi,"Dapur Pribadi","Pelayan Pribadi",Balkon}	3500000	Nikmati kenyamanan menginap di Kamar Presidential Suite - 147 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
8bb2a497-27aa-476b-b9ff-41b04e8bc1e7	Kamar Presidential Suite - 148	Presidential Suite	Lantai 5	6	{WiFi,"Smart TV",AC,Jacuzzi,"Dapur Pribadi","Pelayan Pribadi",Balkon}	3500000	Nikmati kenyamanan menginap di Kamar Presidential Suite - 148 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
9f6545ab-b236-4690-be71-3cf9b6e8d962	Kamar Presidential Suite - 149	Presidential Suite	Lantai 5	6	{WiFi,"Smart TV",AC,Jacuzzi,"Dapur Pribadi","Pelayan Pribadi",Balkon}	3500000	Nikmati kenyamanan menginap di Kamar Presidential Suite - 149 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
f0349363-cccd-47f4-bd1d-9fb7bc1cd2a2	Kamar Presidential Suite - 150	Presidential Suite	Lantai 5	6	{WiFi,"Smart TV",AC,Jacuzzi,"Dapur Pribadi","Pelayan Pribadi",Balkon}	3500000	Nikmati kenyamanan menginap di Kamar Presidential Suite - 150 kami. Dilengkapi dengan fasilitas modern untuk pengalaman terbaik Anda.	2026-09-08 16:40:55.059	2026-09-08 23:40:55.059
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.reviews (id, booking_id, rating, comment) FROM stdin;
\.


--
-- Data for Name: room_images; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.room_images (id, resource_id, image_url, is_primary) FROM stdin;
9fc9c717-1831-4173-9b0c-ba92c7f28e0b	7f1f6d35-2649-4e5c-aeac-e7b1e1ada54c	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80	t
d9d79caf-950c-47a3-a655-ef97fd2ae0e7	e729ab30-c2fb-41ac-b1ce-b1d2468d70ca	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80	t
13bc6629-eecd-4e82-bfcc-7b7441392d01	b2fd52f5-667d-4284-b093-63f5e9d65cfb	https://gic3y7tjtkxmewav.public.blob.vercel-storage.com/room-images/b2fd52f5-667d-4284-b093-63f5e9d65cfb-1788184686842-we.jpeg	f
86f760d2-e44c-4b13-aa42-0f3a40a7a472	b2fd52f5-667d-4284-b093-63f5e9d65cfb	https://gic3y7tjtkxmewav.public.blob.vercel-storage.com/room-images/b2fd52f5-667d-4284-b093-63f5e9d65cfb-1788184686842-wej.jpg	t
c9e28e60-a5e8-4368-90e3-8605c1df7bf6	77ffd1be-9234-44e4-b37c-0ea802a8c720	https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80	t
fa8343ca-6c20-4274-a992-ba7495028fd5	bc4a6daf-653c-4535-b683-83373a407294	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80	t
65dbef6b-a715-4ec6-8478-f332d5df7bb2	76898d2d-af83-4b58-8438-e3fc2f0247bf	https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80	t
7d18bb68-5572-4b17-ae6f-4bb04efe88e9	7dfc4685-b595-4476-a3d3-92628a575e9a	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80	t
f05fbb92-52fd-4d54-9564-8ef17c6f9cc3	6ad2a7f6-f261-4e8c-b423-665ccdf1ed3d	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
d69ca737-1df8-4709-a490-ee8d0f502130	f50c5d6a-ed82-4e4f-b739-0df9f6065789	https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80	t
69aaceaf-123b-4522-bd93-5ff31cf83afb	fad0bb9a-a90f-4b6a-b4ba-6a965e2ef67f	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80	t
53996ef8-2b2a-4932-b918-42004e26cabe	637ec105-5879-41e5-8132-a26886fee3f9	https://images.unsplash.com/photo-1522771731478-44bf10472cb3?auto=format&fit=crop&w=800&q=80	t
d1380090-32c5-4503-abe0-c2db08a302ca	cb26a315-db6f-496c-a1cc-9cc35a688c53	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
7fe178e1-795e-43ba-8609-1acc8665ae4e	1a52b8d2-30e3-4d1f-aca7-b66be974bcb8	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80	t
c1d72750-a541-49e7-a2ed-a0016aa1ea2e	328186f5-994e-460f-8a73-8d1ddfb34aaf	https://images.unsplash.com/photo-1522771731478-44bf10472cb3?auto=format&fit=crop&w=800&q=80	t
50f0bb05-8c79-4a91-80f0-1fc58147d530	bbe853c2-be72-4fae-9bda-0f91e5bbcd7a	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80	t
4e50367d-367e-4a08-8d0f-e212d90b9814	33cae0a4-2443-4a3a-b36c-347730f2fa16	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80	t
34f470cd-82e0-4fa3-92c1-a9784f514287	37c52625-4a8e-4210-9cda-9bc2bd3bbee6	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80	t
0066b449-6892-4073-b6ca-04a18d69e525	6738c27e-9dad-462b-81fb-945cc9f40833	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80	t
e864cf52-ad35-4aad-88d7-9d24eea8e2d8	7ce5a2c7-69c4-4170-b249-a55c7ab67d26	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
b8998b78-cd6d-4cab-93c9-943de0a718ec	975da61c-9460-42c2-acd9-6c52915341e1	https://images.unsplash.com/photo-1522771731478-44bf10472cb3?auto=format&fit=crop&w=800&q=80	t
95f6ff79-f6f5-4f28-ad58-f5dfa863e8d4	e32daa23-fc92-41f1-b520-4df4052764af	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80	t
9d984d4c-5ba4-45a8-a65d-782efafec3ef	192406f1-ddae-4e4d-8f30-30a86d8c4b83	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80	t
583baf96-8675-46e9-bbe7-85f4d2bee171	52aa73df-dceb-44fb-921f-9933efea88ae	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
908851a4-fd80-4b2f-8919-ee1a236b1938	7f76a1d3-3f14-4f8d-8dd3-f2d0fa8e5643	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
d2236a61-4e6a-47bd-ad9a-be460a223bb6	b6adff35-7bdc-4ee5-a53f-5ba10de057b1	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80	t
8445dc2e-8854-4dc6-b6da-a9869cb714e7	4323eead-f545-4dcb-b300-50fef863d328	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
b78f92f6-421a-4232-b3bc-943be2a61592	027b6187-2728-483b-bbe6-e4d7fd3123ed	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80	t
7c370461-94a8-49bd-a076-89b97a8d4572	3e0bf188-300b-47a2-82d3-8e91533dfba9	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80	t
605cae00-3bd2-412f-be2b-ab207017a2a8	3e30642a-8030-499c-b29e-64532643f0c5	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
e2fb70cc-d6cb-47ab-b177-cebb01e64316	4875ba3b-e1a3-443b-b81b-2b0aa4cc1df1	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80	t
14feded1-e64f-43b1-bd83-a21dc18d6e2d	42a1af30-51d1-467c-85d8-ce00077768e6	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
d5b2558a-02de-484e-9cf7-a945f044e5e9	37d7426c-7e40-46a3-9b76-cfc4492164b2	https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80	t
5bd20185-6ae2-49f3-b5ee-a8e512e49a79	a43081e7-15e2-455a-bfa1-3bd42eeca552	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80	t
578ed888-49e9-42ec-9791-6d51f3ae8383	bb28aae0-3426-445e-9796-c89cfa621f1d	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80	t
75819000-4c4a-4aeb-99d4-e2df388ccd8a	8cde8784-7864-4eb8-b4b9-7e8ce44e23bd	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
5a12b4b3-e83c-47b8-b7b4-38202e78b0d9	410a7e41-c7dc-4119-8686-b66d50af694c	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80	t
18bdae7a-aed8-4a9a-b2ba-a648591bee39	25962f40-fda8-4a3d-942d-f8367c3817c8	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
4a0c262e-abf3-4f23-9f0f-903c71bf0519	2e8bfb2a-4bdb-4a44-ab96-fe3bb427f6e8	https://images.unsplash.com/photo-1618773928120-2c40951af173?auto=format&fit=crop&w=800&q=80	t
9d4ed432-45d8-484d-90eb-a4c2aec6d87a	32c8833e-3072-4374-b901-80dbbbb48d29	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80	t
afcdc4dd-f59e-4c76-8591-6068fc109f68	04ea6915-4272-4013-9863-dab03dd88942	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80	t
d38c0f5b-7dbe-4f5f-9ef6-ac1c10f56805	42efc916-9a13-485b-938e-00ab5b15cb19	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80	t
577c3d48-0a65-4f37-8f80-dee9828415c4	6fc51f9a-1a0b-4c14-92b8-b56497192a62	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80	t
23b72105-dbe0-4643-be57-c0d64b3d17f9	f2ac779b-e5ae-4d65-81d5-d3e34f649225	https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80	t
6eaba2ce-4741-44ad-beb3-425bd324b1b7	63e964b8-0ffa-4d0c-b6ee-058ffe9e27bc	https://images.unsplash.com/photo-1522771731478-44bf10472cb3?auto=format&fit=crop&w=800&q=80	t
496ee1cc-b837-4bf8-a812-93386b91c887	bc9de567-a15c-45cc-9e49-67d33033afd0	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80	t
886fdc26-ff09-4723-8734-5cfb24c4c939	dfc3764f-7fb4-4c24-944b-1eb0dfb7d4de	https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80	t
ad222211-c82c-4fb0-9c79-88c09f23dd9a	9c318ade-28e2-4fa1-86d6-af6c376dd784	https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80	t
963b1c76-7e5b-4731-bb22-107f61fe40e6	5db68833-36ca-453d-9faa-7e936269a857	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80	t
88d684fc-7a37-42ca-a20c-a8b81ceff2f9	cebf00c1-23ff-44cb-b511-6508f5c19448	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80	t
01da1a96-32ef-423a-83d3-9f7e35a79de7	73f69b99-5f73-44c1-b824-60acdeb5d049	https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80	t
28acb425-a1ee-4476-891e-e7896fc5bec7	d964787f-afe9-47f9-aa71-7a4dc5c913ae	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80	t
1dfc3467-17ac-404a-bbe8-ceac6b1d694c	8bb2a497-27aa-476b-b9ff-41b04e8bc1e7	https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80	t
fe4e0632-64ef-4ae6-8cec-b54e155f8193	9f6545ab-b236-4690-be71-3cf9b6e8d962	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80	t
649ef91c-a794-49b4-93a6-2a8db7a1b9fc	f0349363-cccd-47f4-bd1d-9fb7bc1cd2a2	https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80	t
8ee2a874-4abb-44f2-8443-0c479a439b74	ce9438f6-b3a7-45fe-974c-4f52b85dc117	/uploads/rooms/room-1788886282204-727950411.png	t
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.schedules (id, resource_id, start_time, end_time, status) FROM stdin;
9e780531-e871-4ba4-8379-1fd6b9bc4b2d	b2fd52f5-667d-4284-b093-63f5e9d65cfb	2026-09-01 14:57:00	2026-09-05 14:57:00	maintenance
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin_ngotel
--

COPY public.users (id, name, email, password_hash, role, created_at) FROM stdin;
18de12d4-8cab-4cb5-8b57-905245b7f22a	Super Admin NgotelIn	admin@ngotelin.com	$2b$10$U8xxqSQXh6MXAKf51SvNDeJWatZ4KJy4AxOjFPlG10eZiq8y/js8m	admin	2026-08-06 17:45:54.819
746a77a6-b9ad-43ea-9219-0d5ea3fb0b01	jamalLer	jamalLer@ngotelin.com	$2b$10$XxqAXVEuntkceUk52IVI3.jl4T1C7vBmRKfm3ia5C3M5iF3m5VTLq	user	2026-08-27 07:35:37.208
f8abeaed-22d5-4955-8895-f44c5e8aad03	Staff Hotel	staff@ngotelin.com	$2b$10$Cp2iFr9.602X.x5k/PWHAu1DnT5mPFK21/J/.kUN.LxJ.EdTo7iWG	staff	2026-08-31 01:02:37.963236
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ai_chat_logs ai_chat_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.ai_chat_logs
    ADD CONSTRAINT ai_chat_logs_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: room_images room_images_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.room_images
    ADD CONSTRAINT room_images_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bookings_schedule_id_key; Type: INDEX; Schema: public; Owner: admin_ngotel
--

CREATE UNIQUE INDEX bookings_schedule_id_key ON public.bookings USING btree (schedule_id);


--
-- Name: payments_booking_id_key; Type: INDEX; Schema: public; Owner: admin_ngotel
--

CREATE UNIQUE INDEX payments_booking_id_key ON public.payments USING btree (booking_id);


--
-- Name: resources_name_key; Type: INDEX; Schema: public; Owner: admin_ngotel
--

CREATE UNIQUE INDEX resources_name_key ON public.resources USING btree (name);


--
-- Name: reviews_booking_id_key; Type: INDEX; Schema: public; Owner: admin_ngotel
--

CREATE UNIQUE INDEX reviews_booking_id_key ON public.reviews USING btree (booking_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: admin_ngotel
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: ai_chat_logs ai_chat_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.ai_chat_logs
    ADD CONSTRAINT ai_chat_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: bookings bookings_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedules(id);


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: room_images room_images_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.room_images
    ADD CONSTRAINT room_images_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedules schedules_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_ngotel
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id);


--
-- PostgreSQL database dump complete
--

\unrestrict UCE6BsJuiGFIv9sqYYzaqYP9Ed0JaVBsVEVtdo25ejt0uTDIInEAUN32bzCnSX3

