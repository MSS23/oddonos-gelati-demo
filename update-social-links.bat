@echo off
echo Updating social media links...

powershell -Command "(Get-Content 'index.html') -replace 'instagram.com/oddonos', 'instagram.com/oddonos_gelati/' | Set-Content 'index.html'"
powershell -Command "(Get-Content 'about.html') -replace 'instagram.com/oddonos', 'instagram.com/oddonos_gelati/' | Set-Content 'about.html'"
powershell -Command "(Get-Content 'shops.html') -replace 'instagram.com/oddonos', 'instagram.com/oddonos_gelati/' | Set-Content 'shops.html'"
powershell -Command "(Get-Content 'wholesale.html') -replace 'instagram.com/oddonos', 'instagram.com/oddonos_gelati/' | Set-Content 'wholesale.html'"
powershell -Command "(Get-Content 'reviews.html') -replace 'instagram.com/oddonos', 'instagram.com/oddonos_gelati/' | Set-Content 'reviews.html'"
powershell -Command "(Get-Content 'contact.html') -replace 'instagram.com/oddonos', 'instagram.com/oddonos_gelati/' | Set-Content 'contact.html'"
powershell -Command "(Get-Content 'gelato-card.html') -replace 'instagram.com/oddonos', 'instagram.com/oddonos_gelati/' | Set-Content 'gelato-card.html'"

echo Done! All Instagram links updated to @oddonos_gelati
pause
