-- profileController.updateProfile always targets WHERE id=1 and getProfile
-- does SELECT * LIMIT 1, so a single seed row must exist for the profile
-- endpoints to work at all.
INSERT INTO profile (id, full_name)
VALUES (1, 'Your Name')
ON CONFLICT (id) DO NOTHING;

SELECT setval('profile_id_seq', GREATEST((SELECT MAX(id) FROM profile), 1));
