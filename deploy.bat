rmdir /Q /S "E:\_Project\Victor\Influencer\backend-influencer\public\css\"
rmdir /Q /S "E:\_Project\Victor\Influencer\backend-influencer\public\js\"
rmdir /Q /S "E:\_Project\Victor\Influencer\backend-influencer\public\static\"
rmdir /Q /S "E:\_Project\Victor\Influencer\backend-influencer\public\media\"
del /F "E:\_Project\Victor\Influencer\backend-influencer\public\precache-*.js"
del /F "E:\_Project\Victor\Influencer\backend-influencer\public\service-worker.js"
del /F "E:\_Project\Victor\Influencer\backend-influencer\public\asset-manifest.json"
del /F "E:\_Project\Victor\Influencer\backend-influencer\resources\views\webapp.blade.php"

xcopy "E:\_Project\Victor\Influencer\webapp-influencer\build\*.*" "E:\_Project\Victor\Influencer\backend-influencer\public\" /E /K /D /H /Y
copy "E:\_Project\Victor\Influencer\webapp-influencer\build\index.html" "E:\_Project\Victor\Influencer\backend-influencer\resources\views\webapp.blade.php"