# E-Commerce Platform — Full DevOps Capstone Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Week 1 — Building the Microservices](#week-1--building-the-microservices)
5. [Week 2 — Dockerization](#week-2--dockerization)
6. [Week 3 — Jenkins CI Pipeline](#week-3--jenkins-ci-pipeline)
7. [Week 4 — Ansible Provisioning](#week-4--ansible-provisioning)
8. [Week 5 — Kubernetes on AKS](#week-5--kubernetes-on-aks)
9. [Week 6 — Monitoring and Final Touches](#week-6--monitoring-and-final-touches)
10. [Errors Encountered and Solutions](#errors-encountered-and-solutions)
11. [API Reference](#api-reference)
12. [Startup Guide](#startup-guide)

---

## Project Overview

A three-service Java e-commerce microservices platform built and deployed using a complete DevOps toolchain. The project covers the full software delivery lifecycle — from writing code locally to running it on a managed Kubernetes cluster on Azure, with automated CI/CD pipelines, infrastructure provisioning, and monitoring.

**Services:**
- **catalog-service** — manages the product catalog
- **cart-service** — manages per-user shopping carts
- **order-service** — handles order placement and tracking

---

## Architecture

```
Developer Machine (Windows)
│
├── VS Code (code editing)
├── Docker Desktop (local containers)
├── Jenkins (CI/CD server at localhost:8080)
└── WSL Kali Linux (kubectl, ansible, az cli)
         │
         ▼
    GitHub Repository
         │
         ▼ (webhook trigger)
    Jenkins Pipeline
    ├── Maven build & test
    ├── Docker build
    ├── Docker push → Azure Container Registry
    └── kubectl rollout restart
              │
              ▼
    Azure Kubernetes Service (AKS)
    ├── Nginx Ingress Controller (single public IP: 4.247.195.40)
    ├── catalog-service pod (port 8081)
    ├── cart-service pod (port 8082)
    ├── order-service pod (port 8083)
    └── postgres pod (port 5432)
              │
              ▼
    Azure Monitor + Container Insights
    (CPU, memory, pod health dashboards)
```

**Inter-service communication:**
- order-service calls catalog-service via HTTP to validate product IDs before confirming orders
- All services connect to PostgreSQL via ClusterIP service inside the cluster
- External traffic enters via the Nginx Ingress Controller and is routed by path

---

## Tech Stack

| Category | Tool | Version |
|---|---|---|
| Language | Java | 24 |
| Framework | Spring Boot | 4.1.0 |
| Build tool | Maven | 3.9.x (multi-module) |
| ORM | Spring Data JPA / Hibernate | via Spring Boot |
| Local DB | H2 (in-memory) | via Spring Boot |
| Production DB | PostgreSQL | 16-alpine |
| Containerization | Docker | Desktop latest |
| Container Registry | Azure Container Registry | Basic tier |
| CI/CD | Jenkins | 2.x LTS |
| Infrastructure | Ansible | latest (on Azure VM) |
| Orchestration | Kubernetes | AKS latest |
| Ingress | Nginx Ingress Controller | v1.10.1 |
| Monitoring | Azure Monitor + Container Insights | - |
| Cloud | Microsoft Azure | Azure for Students |
| Version control | Git + GitHub | - |
| OS | Windows 11 + WSL Kali Linux | - |

---

## Week 1 — Building the Microservices

### Goal
Build three Spring Boot services as a Maven multi-module project, with inter-service HTTP communication and unit tests.

### Project Structure

```
ecommerce-platform/
├── pom.xml                    ← parent POM
├── catalog-service/
│   ├── pom.xml
│   └── src/
├── cart-service/
│   ├── pom.xml
│   └── src/
└── order-service/
    ├── pom.xml
    └── src/
```

### Step 1 — Install Maven on Windows

1. Download binary zip from https://maven.apache.org/download.cgi
2. Extract to `C:\Program Files\Maven\apache-maven-3.x.x\`
3. Set environment variables:
   - New system variable: `MAVEN_HOME = C:\Program Files\Maven\apache-maven-3.x.x`
   - Add to Path: `%MAVEN_HOME%\bin`
4. Verify: `mvn -version`

### Step 2 — Create folder structure

```
cd C:\Users\%USERNAME%\Desktop
mkdir ecommerce-platform
cd ecommerce-platform
mkdir catalog-service cart-service order-service
code .
```

### Step 3 — Parent POM (`pom.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.ecommerce</groupId>
    <artifactId>ecommerce-platform</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>catalog-service</module>
        <module>cart-service</module>
        <module>order-service</module>
    </modules>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.1.0</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>24</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### Step 4 — Generate services from Spring Initializr

Go to https://start.spring.io for each service:
- Project: Maven, Language: Java, Spring Boot: 4.1.0
- Group: `com.ecommerce`, Artifact: `catalog-service` / `cart-service` / `order-service`
- Java: 24, Packaging: Jar
- Dependencies: Spring Web, Spring Data JPA, H2 Database, Lombok

### Step 5 — Child POM parent block

In each child `pom.xml`, replace the generated `<parent>` block with:

```xml
<parent>
    <groupId>com.ecommerce</groupId>
    <artifactId>ecommerce-platform</artifactId>
    <version>1.0-SNAPSHOT</version>
    <relativePath>../pom.xml</relativePath>
</parent>
```

Child POM dependencies:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-test-autoconfigure</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

Child POM build block:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludes>
                    <exclude>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                    </exclude>
                </excludes>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>1.18.42</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### catalog-service

**Port:** 8081

**`application.properties`:**
```properties
server.port=8081
spring.application.name=catalog-service
spring.datasource.url=jdbc:h2:mem:catalogdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.defer-datasource-initialization=true
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

**`data.sql`** (seed data):
```sql
INSERT INTO products (name, description, price, stock_quantity) VALUES
('Laptop', '15 inch gaming laptop', 1299.99, 50),
('Headphones', 'Noise cancelling wireless headphones', 299.99, 120),
('Keyboard', 'Mechanical RGB keyboard', 89.99, 200),
('Mouse', 'Wireless ergonomic mouse', 49.99, 300),
('Monitor', '27 inch 4K display', 499.99, 75);
```

**Endpoints:**
- `GET /products` — list all
- `GET /products/{id}` — get one
- `GET /products/search?name=x` — search
- `POST /products` — create
- `PUT /products/{id}` — update
- `DELETE /products/{id}` — delete
- `GET /version` — version check

### cart-service

**Port:** 8082

**`application.properties`:**
```properties
server.port=8082
spring.application.name=cart-service
spring.datasource.url=jdbc:h2:mem:cartdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.defer-datasource-initialization=true
```

**Endpoints:**
- `GET /cart/{userId}` — get cart
- `POST /cart/{userId}/items` — add item
- `DELETE /cart/{userId}/items/{productId}` — remove item
- `DELETE /cart/{userId}` — clear cart
- `GET /cart/{userId}/total` — get total
- `GET /cart/health` — health check

### order-service

**Port:** 8083

**`application.properties`:**
```properties
server.port=8083
spring.application.name=order-service
spring.datasource.url=jdbc:h2:mem:orderdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.defer-datasource-initialization=true
catalog.service.url=http://localhost:8081
```

**Endpoints:**
- `POST /orders` — place order (validates products via catalog-service)
- `GET /orders/{orderId}` — get order
- `GET /orders/user/{userId}` — get user orders
- `PATCH /orders/{orderId}/status` — update status
- `GET /orders/health` — health check

### Run all services locally

```
# Three separate CMD windows
cd catalog-service && mvn spring-boot:run
cd cart-service && mvn spring-boot:run
cd order-service && mvn spring-boot:run
```

### Run all tests

```
mvn test
```

### Test inter-service communication

```
# Place order — order-service validates productId=1 with catalog-service
curl -X POST http://localhost:8083/orders -H "Content-Type: application/json" ^
  -d "{\"userId\":\"user1\",\"items\":[{\"productId\":1,\"productName\":\"Laptop\",\"price\":1299.99,\"quantity\":1}]}"
```

---

## Week 2 — Dockerization

### Goal
Containerize all three services with multi-stage Dockerfiles, replace H2 with PostgreSQL, and orchestrate everything with docker-compose.

### Dockerfile structure (same pattern for all three services)

**`catalog-service/Dockerfile`:**
```dockerfile
# Stage 1 — Build
FROM maven:3.9-eclipse-temurin-24 AS build
WORKDIR /app
COPY pom.xml /app/pom.xml
COPY catalog-service/pom.xml /app/catalog-service/pom.xml
COPY catalog-service/src /app/catalog-service/src
RUN mvn -f /app/catalog-service/pom.xml clean package -DskipTests

# Stage 2 — Run
FROM eclipse-temurin:24-jre-alpine
WORKDIR /app
COPY --from=build /app/catalog-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Repeat for `cart-service/Dockerfile` (port 8082) and `order-service/Dockerfile` (port 8083).

### Spring profiles for Docker

Create `application-docker.properties` in each service's `src/main/resources/`:

**catalog-service:**
```properties
server.port=8081
spring.application.name=catalog-service
spring.datasource.url=jdbc:postgresql://postgres:5432/catalogdb
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=ecommerce
spring.datasource.password=ecommerce123
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:data-docker.sql
```

**cart-service:**
```properties
server.port=8082
spring.application.name=cart-service
spring.datasource.url=jdbc:postgresql://postgres:5432/cartdb
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=ecommerce
spring.datasource.password=ecommerce123
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**order-service:**
```properties
server.port=8083
spring.application.name=order-service
spring.datasource.url=jdbc:postgresql://postgres:5432/orderdb
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=ecommerce
spring.datasource.password=ecommerce123
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
catalog.service.url=http://catalog-service:8081
```

Note: `catalog.service.url` changes from `localhost` to `catalog-service` (Docker container name) for inter-container communication.

### Seed data for Docker (`catalog-service/src/main/resources/data-docker.sql`)

```sql
INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Laptop', '15 inch gaming laptop', 1299.99, 50
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop');

INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Headphones', 'Noise cancelling wireless headphones', 299.99, 120
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Headphones');

INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Keyboard', 'Mechanical RGB keyboard', 89.99, 200
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Keyboard');

INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Mouse', 'Wireless ergonomic mouse', 49.99, 300
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mouse');

INSERT INTO products (name, description, price, stock_quantity)
SELECT 'Monitor', '27 inch 4K display', 499.99, 75
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Monitor');
```

`WHERE NOT EXISTS` prevents duplicate inserts on container restart.

### Database init script (`init-db.sql` in project root)

```sql
CREATE DATABASE catalogdb;
CREATE DATABASE cartdb;
CREATE DATABASE orderdb;
```

### `docker-compose.yml` (project root)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: postgres
    environment:
      POSTGRES_USER: ecommerce
      POSTGRES_PASSWORD: ecommerce123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - ecommerce-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ecommerce"]
      interval: 10s
      timeout: 5s
      retries: 5

  catalog-service:
    build:
      context: .
      dockerfile: catalog-service/Dockerfile
    container_name: catalog-service
    ports:
      - "8081:8081"
    environment:
      SPRING_PROFILES_ACTIVE: docker
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - ecommerce-network

  cart-service:
    build:
      context: .
      dockerfile: cart-service/Dockerfile
    container_name: cart-service
    ports:
      - "8082:8082"
    environment:
      SPRING_PROFILES_ACTIVE: docker
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - ecommerce-network

  order-service:
    build:
      context: .
      dockerfile: order-service/Dockerfile
    container_name: order-service
    ports:
      - "8083:8083"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      CATALOG_SERVICE_URL: http://catalog-service:8081
    depends_on:
      postgres:
        condition: service_healthy
      catalog-service:
        condition: service_started
    networks:
      - ecommerce-network

networks:
  ecommerce-network:
    driver: bridge

volumes:
  postgres_data:
```

### Commands

```
# First run (builds images)
docker-compose up --build

# Subsequent runs
docker-compose up

# Full teardown including volumes (fresh start)
docker-compose down -v
```

---

## Week 3 — Jenkins CI Pipeline

### Goal
Automate build, test, Docker image creation and push to Azure Container Registry on every git push.

### Prerequisites
- Jenkins installed on Windows (runs as LocalSystem)
- Java 21 installed separately for Jenkins (project uses Java 24, Jenkins needs 17 or 21)
- Docker Desktop running

### Jenkins Installation on Windows

1. Download `.msi` from https://www.jenkins.io/download/
2. Install — select LocalSystem account, port 8080, point to JDK 21
3. Unlock: `type "C:\Program Files\Jenkins\secrets\initialAdminPassword"`
4. Install suggested plugins
5. Create admin user

### Plugins to install

Jenkins → Manage Jenkins → Plugins → Available:
- Docker Pipeline
- Docker plugin
- Git plugin
- Pipeline
- GitHub Integration Plugin
- SSH Agent

### Azure Container Registry setup

1. Azure portal → Container Registry → Create
2. Resource group: `ecommerce-rg`
3. Registry name: globally unique (e.g. `ecommerceregYOURNAME`)
4. Pricing: Basic
5. After creation → Access keys → Enable Admin user
6. Note: Login server, Username, Password

### Jenkins credentials

**ACR credentials:**
- Kind: Username with password
- Username: ACR username
- Password: ACR password
- ID: `acr-credentials`

**GitHub credentials:**
- Kind: Username with password
- Username: GitHub username
- Password: GitHub Personal Access Token (repo + admin:repo_hook scopes)
- ID: `github-credentials`

### `Jenkinsfile` (project root)

```groovy
pipeline {
    agent any

    environment {
        ACR_REGISTRY = 'yourregistryname.azurecr.io'
        ACR_CREDENTIALS = 'acr-credentials'
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Building and testing all services...'
                bat 'mvn clean test'
            }
        }

        stage('Package') {
            steps {
                echo 'Packaging all services...'
                bat 'mvn clean package -DskipTests'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker images...'
                script {
                    docker.build("${ACR_REGISTRY}/catalog-service:${BUILD_TAG}",
                        "-f catalog-service/Dockerfile .")
                    docker.build("${ACR_REGISTRY}/cart-service:${BUILD_TAG}",
                        "-f cart-service/Dockerfile .")
                    docker.build("${ACR_REGISTRY}/order-service:${BUILD_TAG}",
                        "-f order-service/Dockerfile .")
                }
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing images to Azure Container Registry...'
                script {
                    docker.withRegistry("https://${ACR_REGISTRY}", ACR_CREDENTIALS) {
                        docker.image("${ACR_REGISTRY}/catalog-service:${BUILD_TAG}").push()
                        docker.image("${ACR_REGISTRY}/catalog-service:${BUILD_TAG}").push('latest')
                        docker.image("${ACR_REGISTRY}/cart-service:${BUILD_TAG}").push()
                        docker.image("${ACR_REGISTRY}/cart-service:${BUILD_TAG}").push('latest')
                        docker.image("${ACR_REGISTRY}/order-service:${BUILD_TAG}").push()
                        docker.image("${ACR_REGISTRY}/order-service:${BUILD_TAG}").push('latest')
                    }
                }
            }
        }

    }

    post {
        success {
            echo "Pipeline succeeded! Build ${BUILD_TAG} deployed."
        }
        failure {
            echo 'Pipeline failed — check the logs above.'
        }
    }
}
```

### Create pipeline job

- Jenkins → New Item → name: `ecommerce-pipeline` → Pipeline
- Pipeline → Definition: Pipeline script from SCM
- SCM: Git, Repository URL: your GitHub repo
- Credentials: `github-credentials`
- Branch: `*/main`
- Script Path: `Jenkinsfile`

### Restart Jenkins

```
# Browser (easiest)
http://localhost:8080/restart

# CMD
net stop Jenkins
net start Jenkins
```

---

## Week 4 — Ansible Provisioning

### Goal
Provision an Azure VM with Docker and deploy all containers using Ansible playbooks, triggered automatically from Jenkins.

### Azure VM setup

- Ubuntu Server 22.04 LTS
- Size: Standard_B2s (2 vCPU, 4GB RAM) — B1ms was too small, caused VM freeze
- Authentication: SSH public key
- Inbound ports: 22, 80, 8081, 8082, 8083
- Download `.pem` key file to `C:\Users\ADMIN\.ssh\`

### Install Ansible in WSL

```bash
sudo apt update
sudo apt install ansible -y
ansible --version
```

### SSH setup

```bash
cp /mnt/c/Users/ADMIN/.ssh/ecommerce-vm-key.pem ~/.ssh/
chmod 600 ~/.ssh/ecommerce-vm-key.pem
ssh -i ~/.ssh/ecommerce-vm-key.pem azureuser@VM_PUBLIC_IP
```

### Ansible project structure

```
~/ansible/
├── inventory.ini
├── site.yml
├── vars.yml
└── roles/
    ├── docker/
    │   └── tasks/
    │       └── main.yml
    └── deploy/
        └── tasks/
            └── main.yml
```

### `inventory.ini`

```ini
[ecommerce_servers]
localhost ansible_connection=local ansible_python_interpreter=/usr/bin/python3
```

Note: inventory targets localhost because Ansible runs ON the VM itself (not from WSL remotely), to avoid Windows/WSL LocalSystem compatibility issues.

### `vars.yml`

```yaml
acr_registry: yourregistryname.azurecr.io
acr_username: yourregistryname
acr_password: YOUR_ACR_PASSWORD
```

### `roles/docker/tasks/main.yml`

```yaml
---
- name: Update apt cache
  apt:
    update_cache: yes
  become: yes

- name: Install required packages
  apt:
    name:
      - apt-transport-https
      - ca-certificates
      - curl
      - gnupg
      - lsb-release
    state: present
  become: yes

- name: Add Docker GPG key
  apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present
  become: yes

- name: Add Docker repository
  apt_repository:
    repo: "deb [arch=amd64] https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable"
    state: present
  become: yes

- name: Install Docker
  apt:
    name:
      - docker-ce
      - docker-ce-cli
      - containerd.io
      - docker-compose-plugin
    state: present
    update_cache: yes
  become: yes

- name: Start and enable Docker
  systemd:
    name: docker
    state: started
    enabled: yes
  become: yes

- name: Add azureuser to docker group
  user:
    name: azureuser
    groups: docker
    append: yes
  become: yes
```

### `roles/deploy/tasks/main.yml`

```yaml
---
- name: Stop and remove existing containers
  command: docker rm -f catalog-service cart-service order-service postgres
  become: yes
  ignore_errors: yes

- name: Log in to Azure Container Registry
  command: docker login {{ acr_registry }} --username {{ acr_username }} --password {{ acr_password }}
  become: yes

- name: Pull images
  command: docker pull {{ acr_registry }}/{{ item }}:latest
  become: yes
  loop:
    - catalog-service
    - cart-service
    - order-service

- name: Create Docker network
  command: docker network create ecommerce-network
  become: yes
  ignore_errors: yes

- name: Start PostgreSQL
  command: >
    docker run -d --name postgres --network ecommerce-network
    -e POSTGRES_USER=ecommerce -e POSTGRES_PASSWORD=ecommerce123
    -v postgres_data:/var/lib/postgresql/data
    --restart unless-stopped postgres:16-alpine
  become: yes
  ignore_errors: yes

- name: Wait for PostgreSQL
  pause:
    seconds: 15

- name: Create databases
  command: >
    docker exec postgres psql -U ecommerce
    -c "CREATE DATABASE catalogdb;"
    -c "CREATE DATABASE cartdb;"
    -c "CREATE DATABASE orderdb;"
  become: yes
  ignore_errors: yes

- name: Start catalog-service
  command: >
    docker run -d --name catalog-service --network ecommerce-network
    -p 8081:8081 -e SPRING_PROFILES_ACTIVE=docker
    --restart unless-stopped {{ acr_registry }}/catalog-service:latest
  become: yes
  ignore_errors: yes

- name: Start cart-service
  command: >
    docker run -d --name cart-service --network ecommerce-network
    -p 8082:8082 -e SPRING_PROFILES_ACTIVE=docker
    --restart unless-stopped {{ acr_registry }}/cart-service:latest
  become: yes
  ignore_errors: yes

- name: Start order-service
  command: >
    docker run -d --name order-service --network ecommerce-network
    -p 8083:8083 -e SPRING_PROFILES_ACTIVE=docker
    -e CATALOG_SERVICE_URL=http://catalog-service:8081
    --restart unless-stopped {{ acr_registry }}/order-service:latest
  become: yes
  ignore_errors: yes
```

### `site.yml`

```yaml
---
- name: Provision and deploy ecommerce platform
  hosts: ecommerce_servers
  vars_files:
    - vars.yml
  roles:
    - docker
    - deploy
```

### Run playbook

```bash
# Copy Ansible files and SSH key to VM
scp -i ~/.ssh/ecommerce-vm-key.pem -r ~/ansible azureuser@VM_IP:~/ansible
scp -i ~/.ssh/ecommerce-vm-key.pem ~/.ssh/ecommerce-vm-key.pem azureuser@VM_IP:~/.ssh/

# SSH into VM
ssh -i ~/.ssh/ecommerce-vm-key.pem azureuser@VM_IP

# On the VM — install Ansible
sudo apt update && sudo apt install ansible -y

# Allow sudo without password (required for Ansible)
sudo visudo
# Add at bottom: azureuser ALL=(ALL) NOPASSWD:ALL

# Fix hostname resolution (speeds up sudo)
echo "127.0.0.1 ecommerce-vm" | sudo tee -a /etc/hosts

# Run playbook
ansible-playbook -i ~/ansible/inventory.ini ~/ansible/site.yml
```

### Jenkins triggering Ansible via SSH

```groovy
stage('Deploy with Ansible') {
    steps {
        bat """
            ssh -i C:/ProgramData/Jenkins/.jenkins/.ssh/ecommerce-vm-key.pem
            -o StrictHostKeyChecking=no azureuser@VM_IP
            "ansible-playbook -i ~/ansible/inventory.ini ~/ansible/site.yml"
        """
    }
}
```

PEM file permissions fix for Jenkins (CMD as Administrator):
```
icacls "C:\ProgramData\Jenkins\.jenkins\.ssh\ecommerce-vm-key.pem" /inheritance:r
icacls "C:\ProgramData\Jenkins\.jenkins\.ssh\ecommerce-vm-key.pem" /grant:r "SYSTEM:(R)"
icacls "C:\ProgramData\Jenkins\.jenkins\.ssh\ecommerce-vm-key.pem" /grant:r "BUILTIN\Administrators:(R)"
```

---

## Week 5 — Kubernetes on AKS

### Goal
Move from a single VM to a managed Kubernetes cluster with rolling deployments, health checks, and a single Nginx ingress entry point.

### AKS cluster creation

- Azure portal → Kubernetes Service → Create
- Resource group: `ecommerce-rg`
- Cluster name: `ecommerce-aks`
- Node pool: Standard_D2s_v3, 1 node, Availability zones: None
- Integrations: link to ACR
- Network: Azure CNI Overlay

### Install tools in WSL

```bash
# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# Azure CLI (Kali/Debian bookworm)
sudo apt-get install ca-certificates curl apt-transport-https lsb-release gnupg -y
sudo mkdir -p /etc/apt/keyrings
curl -sLS https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /etc/apt/keyrings/microsoft.gpg
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/azure-cli/ bookworm main" | sudo tee /etc/apt/sources.list.d/azure-cli.list
sudo apt-get update && sudo apt-get install azure-cli -y

# Connect to AKS
az login
az aks get-credentials --resource-group ecommerce-rg --name ecommerce-aks
kubectl get nodes
```

### Kubernetes manifests (`k8s/` folder)

**`configmap.yml`:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ecommerce-config
data:
  SPRING_PROFILES_ACTIVE: "docker"
  CATALOG_SERVICE_URL: "http://catalog-service:8081"
```

**`postgres.yml`:**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          env:
            - name: POSTGRES_USER
              value: ecommerce
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: ecommerce-secrets
                  key: POSTGRES_PASSWORD
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata
          ports:
            - containerPort: 5432
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: postgres-storage
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
```

**`catalog-service.yml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: catalog-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: catalog-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: catalog-service
    spec:
      containers:
        - name: catalog-service
          image: yourregistryname.azurecr.io/catalog-service:latest
          ports:
            - containerPort: 8081
          envFrom:
            - configMapRef:
                name: ecommerce-config
          env:
            - name: SPRING_DATASOURCE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: ecommerce-secrets
                  key: SPRING_DATASOURCE_PASSWORD
          readinessProbe:
            httpGet:
              path: /products
              port: 8081
            initialDelaySeconds: 30
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /products
              port: 8081
            initialDelaySeconds: 60
            periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: catalog-service
spec:
  selector:
    app: catalog-service
  ports:
    - port: 8081
      targetPort: 8081
```

**`cart-service.yml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cart-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cart-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: cart-service
    spec:
      containers:
        - name: cart-service
          image: yourregistryname.azurecr.io/cart-service:latest
          ports:
            - containerPort: 8082
          envFrom:
            - configMapRef:
                name: ecommerce-config
          env:
            - name: SPRING_DATASOURCE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: ecommerce-secrets
                  key: SPRING_DATASOURCE_PASSWORD
          readinessProbe:
            tcpSocket:
              port: 8082
            initialDelaySeconds: 30
            periodSeconds: 10
          livenessProbe:
            tcpSocket:
              port: 8082
            initialDelaySeconds: 60
            periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: cart-service
spec:
  selector:
    app: cart-service
  ports:
    - port: 8082
      targetPort: 8082
```

**`order-service.yml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: order-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
        - name: order-service
          image: yourregistryname.azurecr.io/order-service:latest
          ports:
            - containerPort: 8083
          envFrom:
            - configMapRef:
                name: ecommerce-config
          env:
            - name: SPRING_DATASOURCE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: ecommerce-secrets
                  key: SPRING_DATASOURCE_PASSWORD
          readinessProbe:
            tcpSocket:
              port: 8083
            initialDelaySeconds: 30
            periodSeconds: 10
          livenessProbe:
            tcpSocket:
              port: 8083
            initialDelaySeconds: 60
            periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  selector:
    app: order-service
  ports:
    - port: 8083
      targetPort: 8083
```

**`ingress.yml`:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: catalog-service-external
spec:
  type: ClusterIP
  selector:
    app: catalog-service
  ports:
    - port: 8081
      targetPort: 8081
---
apiVersion: v1
kind: Service
metadata:
  name: cart-service-external
spec:
  type: ClusterIP
  selector:
    app: cart-service
  ports:
    - port: 8082
      targetPort: 8082
---
apiVersion: v1
kind: Service
metadata:
  name: order-service-external
spec:
  type: ClusterIP
  selector:
    app: order-service
  ports:
    - port: 8083
      targetPort: 8083
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
    - http:
        paths:
          - path: /products
            pathType: Prefix
            backend:
              service:
                name: catalog-service-external
                port:
                  number: 8081
          - path: /cart
            pathType: Prefix
            backend:
              service:
                name: cart-service-external
                port:
                  number: 8082
          - path: /orders
            pathType: Prefix
            backend:
              service:
                name: order-service-external
                port:
                  number: 8083
```

### Nginx Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
kubectl get pods -n ingress-nginx -w
kubectl get service ingress-nginx-controller -n ingress-nginx
```

### Deploy to AKS

```bash
kubectl create secret generic ecommerce-secrets \
  --from-literal=SPRING_DATASOURCE_PASSWORD=ecommerce123 \
  --from-literal=POSTGRES_PASSWORD=ecommerce123

kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/postgres.yml
kubectl apply -f k8s/catalog-service.yml
kubectl apply -f k8s/cart-service.yml
kubectl apply -f k8s/order-service.yml
kubectl apply -f k8s/ingress.yml
```

### Create databases (one-time after postgres pod starts)

```bash
kubectl exec -it POD_NAME -- psql -U ecommerce -c "CREATE DATABASE catalogdb;"
kubectl exec -it POD_NAME -- psql -U ecommerce -c "CREATE DATABASE cartdb;"
kubectl exec -it POD_NAME -- psql -U ecommerce -c "CREATE DATABASE orderdb;"
```

### Manual deployment after Jenkins build

```bash
kubectl rollout restart deployment catalog-service cart-service order-service
kubectl rollout status deployment catalog-service
kubectl rollout status deployment cart-service
kubectl rollout status deployment order-service
kubectl get pods
```

### Useful kubectl commands

```bash
kubectl get pods                          # list all pods
kubectl get services                      # list all services
kubectl get nodes -o wide                 # node info with IP
kubectl logs POD_NAME                     # pod logs
kubectl describe pod POD_NAME            # detailed pod info
kubectl describe ingress ecommerce-ingress # ingress routing info
kubectl get endpoints                     # service → pod IP mappings
kubectl exec -it POD_NAME -- /bin/sh     # shell into pod
```

---

## Week 6 — Monitoring and Final Touches

### Kubernetes Secrets

```bash
kubectl create secret generic ecommerce-secrets \
  --from-literal=SPRING_DATASOURCE_PASSWORD=ecommerce123 \
  --from-literal=POSTGRES_PASSWORD=ecommerce123

kubectl get secrets
kubectl describe secret ecommerce-secrets
```

### Azure Monitor

- AKS cluster → Monitoring → Insights → Enable
- Overview tab shows: node CPU/memory, pod count, cluster health
- Containers tab: per-container CPU, memory, live log streaming
- Alerts → Create alert rule:
  - CPU > 80% → email notification
  - Restarting container count > 3 → email notification

### Dashboard

- Azure portal → Dashboard → Create new
- Add metric charts: CPU usage, memory usage
- Pin to custom dashboard named `Ecommerce Platform`

---

## API Reference

Base URL (AKS): `http://4.247.195.40`
Base URL (local): `http://localhost:808x`

### Catalog Service

| Method | Path | Description |
|---|---|---|
| GET | /products | List all products |
| GET | /products/{id} | Get product by ID |
| GET | /products/search?name=x | Search products |
| POST | /products | Create product |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |
| GET | /version | Version info |

### Cart Service

| Method | Path | Description |
|---|---|---|
| GET | /cart/{userId} | Get user cart |
| POST | /cart/{userId}/items | Add item to cart |
| DELETE | /cart/{userId}/items/{productId} | Remove item |
| DELETE | /cart/{userId} | Clear cart |
| GET | /cart/{userId}/total | Get cart total |
| GET | /cart/health | Health check |

### Order Service

| Method | Path | Description |
|---|---|---|
| POST | /orders | Place order |
| GET | /orders/{orderId} | Get order |
| GET | /orders/user/{userId} | Get user orders |
| PATCH | /orders/{orderId}/status | Update order status |
| GET | /orders/health | Health check |

### Sample requests

```bash
# Create a product
curl -X POST http://localhost:8081/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam","description":"HD webcam","price":79.99,"stockQuantity":150}'

# Add to cart
curl -X POST http://localhost:8082/cart/user1/items \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"productName":"Laptop","price":1299.99,"quantity":1}'

# Place order
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","items":[{"productId":1,"productName":"Laptop","price":1299.99,"quantity":1}]}'
```

---

## Startup Guide

### Local development startup

```
1. Open Docker Desktop — wait for "Engine running"
2. cd ecommerce-platform && docker-compose up
3. Open http://localhost:8080 (Jenkins)
4. Test: curl http://localhost:8081/products
```

### AKS deployment (after code change)

```bash
# 1. Push code
git add . && git commit -m "change" && git push origin main

# 2. Jenkins builds automatically — wait for success at localhost:8080

# 3. Deploy to AKS (WSL)
kubectl rollout restart deployment catalog-service cart-service order-service
kubectl rollout status deployment catalog-service
kubectl get pods

# 4. Verify
curl http://4.247.195.40/products
```

### Full system restart after reboot

```
1. Start Docker Desktop
2. net start Jenkins  (or open localhost:8080 — Jenkins auto-starts)
3. docker-compose up  (for local dev)
4. WSL: kubectl get pods  (AKS runs independently, no restart needed)
```

### AKS is always running
AKS runs independently on Azure — you don't need to start it. Just run `kubectl get pods` to verify.

---

*Documentation generated at end of 6-week DevOps capstone project.*
*Tools: Maven, Spring Boot, Docker, Jenkins, Ansible, Kubernetes (AKS), Azure Monitor*
