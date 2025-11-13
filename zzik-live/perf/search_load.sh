#!/bin/bash
##
# Simple load test for /api/search endpoint
# 
# Usage: ./perf/search_load.sh [base_url] [num_requests] [concurrency]
# Example: ./perf/search_load.sh http://localhost:3007 1000 10
##

BASE_URL="${1:-http://localhost:3007}"
TOTAL_REQUESTS="${2:-1000}"
CONCURRENCY="${3:-10}"

echo "🚀 Load Test Starting"
echo "   Base URL: $BASE_URL"
echo "   Total Requests: $TOTAL_REQUESTS"
echo "   Concurrency: $CONCURRENCY"
echo ""

# Create temp file for results
RESULTS_FILE=$(mktemp)
trap "rm -f $RESULTS_FILE" EXIT

# Function to make a single request
make_request() {
  local idx=$1
  
  # Simple query selection (avoiding array export issues)
  local qrand=$((idx % 13))
  case $qrand in
    0) query="test" ;;
    1) query="cafe" ;;
    2) query="restaurant" ;;
    3) query="gangnam" ;;
    4) query="hongdae" ;;
    5) query="myeongdong" ;;
    6) query="search1" ;;
    7) query="search2" ;;
    8) query="place" ;;
    9) query="location" ;;
    10) query="spot" ;;
    11) query="area" ;;
    *) query="query$qrand" ;;
  esac
  
  # 70% with geo coordinates
  local has_geo=$((idx % 10 < 7))
  
  local url="$BASE_URL/api/search?q=$query&limit=10"
  if [ $has_geo -eq 1 ]; then
    local coord_idx=$((idx % 4))
    case $coord_idx in
      0) url="$url&lat=37.4979&lng=127.0276&radius=3000" ;;
      1) url="$url&lat=37.5564&lng=126.9237&radius=3000" ;;
      2) url="$url&lat=37.5631&lng=126.9830&radius=3000" ;;
      *) url="$url&lat=37.5665&lng=126.9780&radius=3000" ;;
    esac
  fi
  
  local start=$(date +%s%N)
  local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
  local end=$(date +%s%N)
  local duration=$(( (end - start) / 1000000 )) # ms
  
  echo "$status $duration" >> "$RESULTS_FILE"
}

export -f make_request
export BASE_URL RESULTS_FILE

# Run concurrent requests
echo "⏳ Running $TOTAL_REQUESTS requests with concurrency $CONCURRENCY..."
start_time=$(date +%s)

seq 1 $TOTAL_REQUESTS | xargs -P $CONCURRENCY -I {} bash -c 'make_request {}'

end_time=$(date +%s)
total_duration=$((end_time - start_time))

# Calculate statistics
echo ""
echo "📊 Results"
echo "   Duration: ${total_duration}s"
echo "   Throughput: $(awk "BEGIN {printf \"%.2f\", $TOTAL_REQUESTS / $total_duration}") req/s"
echo ""

# Status code distribution
echo "📈 Status Codes:"
awk '{print $1}' "$RESULTS_FILE" | sort | uniq -c | while read count code; do
  printf "   %s: %d (%.1f%%)\n" "$code" "$count" "$(awk "BEGIN {printf \"%.1f\", ($count / $TOTAL_REQUESTS) * 100}")"
done
echo ""

# Latency statistics
echo "⚡ Latency (ms):"
latencies=$(awk '{print $2}' "$RESULTS_FILE" | sort -n)
p50=$(echo "$latencies" | awk -v n=$(wc -l <<< "$latencies") 'NR==int(n*0.5)+1')
p95=$(echo "$latencies" | awk -v n=$(wc -l <<< "$latencies") 'NR==int(n*0.95)+1')
p99=$(echo "$latencies" | awk -v n=$(wc -l <<< "$latencies") 'NR==int(n*0.99)+1')
avg=$(echo "$latencies" | awk '{s+=$1} END {printf "%.1f", s/NR}')
min=$(echo "$latencies" | head -1)
max=$(echo "$latencies" | tail -1)

echo "   min: ${min}ms"
echo "   p50: ${p50}ms"
echo "   avg: ${avg}ms"
echo "   p95: ${p95}ms"
echo "   p99: ${p99}ms"
echo "   max: ${max}ms"
echo ""

# Threshold checks
echo "✅ Threshold Checks:"
[ "$p95" -le 80 ] && echo "   ✅ p95 ≤ 80ms: ${p95}ms" || echo "   ❌ p95 ≤ 80ms: ${p95}ms (FAILED)"
[ "$p99" -le 120 ] && echo "   ✅ p99 ≤ 120ms: ${p99}ms" || echo "   ❌ p99 ≤ 120ms: ${p99}ms (FAILED)"

error_rate=$(awk '{if ($1 != 200) errors++} END {printf "%.2f", (errors/NR)*100}' "$RESULTS_FILE")
echo "   Error rate: ${error_rate}%"
[ "$(echo "$error_rate <= 0.5" | bc)" -eq 1 ] && echo "   ✅ Error rate ≤ 0.5%" || echo "   ❌ Error rate ≤ 0.5% (FAILED)"
