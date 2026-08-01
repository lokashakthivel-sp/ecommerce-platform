# Stage 1 — Build
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Copy parent POM first
COPY pom.xml /app/pom.xml
COPY catalog-service/pom.xml /app/catalog-service/pom.xml

# Copy source
COPY catalog-service/src /app/catalog-service/src

# Build the JAR
RUN mvn -f /app/catalog-service/pom.xml clean package -DskipTests

# Stage 2 — Run
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/catalog-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]