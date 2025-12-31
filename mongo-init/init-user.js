// Initializes the `appuser` in the `amazon_clone` database.
// This runs automatically when the mongo container's data directory is empty.

db = db.getSiblingDB('amazon_clone');
db.createUser({
  user: 'appuser',
  pwd: 'AppUserPass123!',
  roles: [{ role: 'readWrite', db: 'amazon_clone' }]
});
