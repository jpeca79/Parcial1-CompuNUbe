# Usar la imagen base de Python
FROM python:3.10-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar las dependencias necesarias para compilar mysqlclient
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential

# Copiar los archivos de requisitos
COPY requirements.txt requirements.txt

# Instalar las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación correrá
EXPOSE 5003

# Comando por defecto para correr la aplicación
CMD ["python", "run.py"]
