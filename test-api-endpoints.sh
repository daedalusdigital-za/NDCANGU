#!/bin/bash

# API Testing Script for NDCANGU API
echo "Testing NDCANGU API Endpoints"
echo "================================="

# Base URL
BASE_URL="https://ngcanduapi.azurewebsites.net/api"

# Login and get token
echo "1. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/Auth/Login" \
  -H "Content-Type: application/json" \
  -d '{"email":"welcomeking@outlook.com","password":"Kingsland"}')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token (assuming jq is available, otherwise we'll parse manually)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to extract token from login response"
  exit 1
fi

echo "Token extracted: ${TOKEN:0:50}..."
echo ""

# Test endpoints with authentication
echo "2. Testing authenticated endpoints..."

ENDPOINTS=(
  "Provinces"
  "Districts" 
  "HealthFacilities"
  "Trainers"
  "TrainingSessions"
  "InventoryItems"
  "Sales"
  "DeliveryRecords"
  "Users"
)

for endpoint in "${ENDPOINTS[@]}"; do
  echo "Testing $endpoint..."
  RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/response.txt \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    "$BASE_URL/$endpoint")
  
  HTTP_CODE=$RESPONSE
  RESPONSE_BODY=$(cat /tmp/response.txt)
  
  echo "  Status: $HTTP_CODE"
  if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Success - Data length: ${#RESPONSE_BODY} characters"
    # Show first 100 characters of response
    echo "  Preview: ${RESPONSE_BODY:0:100}..."
  else
    echo "  ❌ Failed - Response: $RESPONSE_BODY"
  fi
  echo ""
done

# Clean up
rm -f /tmp/response.txt

echo "API testing completed!"