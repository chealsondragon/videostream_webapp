rmdir /Q /S "E:\_Project\Victor\Netflix\backend\public\css\"
rmdir /Q /S "E:\_Project\Victor\Netflix\backend\public\js\"
rmdir /Q /S "E:\_Project\Victor\Netflix\backend\public\static\"
rmdir /Q /S "E:\_Project\Victor\Netflix\backend\public\media\"
del /F "E:\_Project\Victor\Netflix\backend\public\precache-*.js"
del /F "E:\_Project\Victor\Netflix\backend\public\service-worker.js"
del /F "E:\_Project\Victor\Netflix\backend\public\asset-manifest.json"
del /F "E:\_Project\Victor\Netflix\backend\resources\views\webapp.blade.php"

xcopy "E:\_Project\Victor\Netflix\webapp-admin\build\*.*" "E:\_Project\Victor\Netflix\backend\public\" /E /K /D /H /Y
copy "E:\_Project\Victor\Netflix\webapp-admin\build\index.html" "E:\_Project\Victor\Netflix\backend\resources\views\webapp.blade.php"