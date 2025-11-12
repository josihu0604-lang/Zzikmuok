# ZZIK Full-Stack Backup (local build)
## Restore
mkdir -p /home/user
tar -xzf zzik-fullstack-20251112-050257.tar.gz -C /home/user --strip-components=1

cd /home/user/landing
npm ci || npm i
npm run build
npm start  # http://localhost:3000

## SQL apply (order)
# export DATABASE_URL="postgres://USER:PWD@HOST:PORT/DB"
# for f in 22_functions 27_mission_distance 29_submission_guards 30_receipts 31_franchise; do
#   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase_sql_pack/${f}.sql
# done
