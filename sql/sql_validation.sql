-- sql_validation.sql
-- Validate that the test user record exists for user_id = 101.

SELECT *
FROM Users
WHERE user_id = 101;
