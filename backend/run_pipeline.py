#!/usr/bin/env python3
"""
Script to run the ML pipeline for mines 0-10 and populate the database.
This script calls the backend's /admin/run endpoint for each mine.
"""

import requests
import time
import sys

# Backend API URL
API_URL = "http://localhost:8000"

# Date range from the image
START_DATE = "2025-01-01"
END_DATE = "2025-08-01"

# Mine IDs to process
MINE_IDS = list(range(0, 11))  # Mines 0 to 10

def run_pipeline_for_mine(mine_id):
    """Run the pipeline for a single mine"""
    try:
        url = f"{API_URL}/admin/run"
        params = {
            "mine_id": mine_id,
            "start_date": START_DATE,
            "end_date": END_DATE
        }
        
        print(f"\n⏳ Processing Mine {mine_id}...")
        print(f"   URL: {url}")
        print(f"   Params: {params}")
        
        response = requests.post(url, params=params, timeout=300)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Mine {mine_id}: Success!")
            print(f"   Response: {data}")
            return True
        else:
            print(f"❌ Mine {mine_id}: HTTP {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Mine {mine_id}: Cannot connect to backend at {API_URL}")
        print("   Make sure the backend is running with:")
        print("   cd backend && uvicorn app:app --reload --port 8000")
        return False
    except requests.exceptions.Timeout:
        print(f"⏱️ Mine {mine_id}: Request timeout (model is taking a while)")
        return False
    except Exception as e:
        print(f"❌ Mine {mine_id}: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("🚀 Mining Data Pipeline Runner")
    print("=" * 60)
    print(f"Date Range: {START_DATE} to {END_DATE}")
    print(f"Mines to Process: {len(MINE_IDS)} (IDs: {MINE_IDS})")
    print("=" * 60)
    
    # Check if backend is reachable
    try:
        print("\n📡 Checking backend connection...")
        response = requests.get(f"{API_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is reachable!")
        else:
            print(f"⚠️  Backend responded with status {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot reach backend at {API_URL}")
        print("   Please start the backend first:")
        print("   cd backend")
        print("   uvicorn app:app --reload --port 8000")
        sys.exit(1)
    
    # Run pipeline for each mine
    successful = 0
    failed = 0
    
    for mine_id in MINE_IDS:
        if run_pipeline_for_mine(mine_id):
            successful += 1
        else:
            failed += 1
        
        # Small delay between requests
        time.sleep(2)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Pipeline Execution Summary")
    print("=" * 60)
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"📈 Total: {successful + failed}")
    print("=" * 60)
    
    if failed == 0:
        print("\n🎉 All mines processed successfully!")
        print("Data should now be available in the database.")
        print("\nNext steps:")
        print("1. Start the frontend: cd frontend && npm run dev")
        print("2. Open http://localhost:5174")
        print("3. Select a mine and click 'Analysis' to see the data")
    else:
        print(f"\n⚠️  {failed} mines failed. Check the errors above.")

if __name__ == "__main__":
    main()
