-- sql_validation.sql
-- Query to validate that user_id = 101 exists in the MindBridge database.

SELECT *
FROM Users
WHERE user_id = 101;
