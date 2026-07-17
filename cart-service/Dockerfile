# Stage 1 — Build
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

COPY pom.xml /app/pom.xml
COPY cart-service/pom.xml /app/cart-service/pom.xml
COPY cart-service/src /app/cart-service/src

RUN mvn -f /app/cart-service/pom.xml clean package -DskipTests

# Stage 2 — Run
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/cart-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]