FROM openjdk:21-jdk-slim

USER root 
# apt-get을 실행해 curl을 설치
RUN apt-get update && apt-get install -y curl

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]