# Start the JobPortal backend
# Run this script from d:\JobPortal\backend
$env:TEMP = "D:\tmp"
$env:TMP  = "D:\tmp"
$env:PYTHONPATH = "D:\PyLibs"
python -m uvicorn main:app --reload --port 8000
