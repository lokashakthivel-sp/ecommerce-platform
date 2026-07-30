# Stage 1 — Build
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml /app/pom.xml
COPY user-service/pom.xml /app/user-service/pom.xml
COPY user-service/src /app/user-service/src
RUN mvn -f /app/user-service/pom.xml clean package -DskipTests

# Stage 2 — Run
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/user-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]