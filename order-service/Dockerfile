# Stage 1 — Build
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

COPY pom.xml /app/pom.xml
COPY order-service/pom.xml /app/order-service/pom.xml
COPY order-service/src /app/order-service/src

RUN mvn -f /app/order-service/pom.xml clean package -DskipTests

# Stage 2 — Run
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/order-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]