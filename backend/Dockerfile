# ==============================
# 🏗️ Etapa 1: Build de la app
# ==============================
FROM eclipse-temurin:21-jdk-alpine

RUN apk add libc6-compat

WORKDIR /app
# Copiamos solo lo necesario para acelerar la caché
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Ahora copiamos el resto del código fuente
COPY src src

EXPOSE 5000

# Construimos el JAR sin ejecutar tests
#RUN ./mvnw clean package -DskipTests

CMD ["./mvnw", "spring-boot:run"]
# ==============================
# 🚀 Etapa 2: Imagen final
# ==============================
# FROM eclipse-temurin:21-jre-alpine

# WORKDIR /app

# # Copiamos solo el artefacto final
# COPY --from=builder /app/target/*.jar app.jar

# # Puerto donde correrá tu app (ajusta si es 8080 o 5000)
# EXPOSE 5000

# # Ejecuta la aplicación
# ENTRYPOINT ["java", "-jar", "app.jar"]
