-- 윈도우용
배치 파일 start

@echo off
echo Starting the server...
start /b javaw -jar -Dspring.profiles.active=prod onePieceBountyRush.jar
echo Server started.

배치 파일 stop

@echo off
echo Stopping the server...
for /f "tokens=1" %%i in ('jps -l ^| findstr onePieceBountyRush.jar') do taskkill /F /PID %%i
echo Server stopped.


-- 리눅스
nohup java -jar -Dspring.profiles.active=prod ./onePieceBountyRush.jar > /dev/null & echo $! > ./pid_web.file &