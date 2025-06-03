FROM node:22.16.0-slim

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    ffmpeg \
    git \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Cria ambiente virtual do Python
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV

# Adiciona o venv ao PATH (para pip, python etc.)
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Instala Whisper e dependências Python dentro do venv
RUN pip install --upgrade pip && \
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu && \
    pip install git+https://github.com/openai/whisper.git

# Cria diretório da aplicação
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala dependências Node.js
RUN npm install

# Exponha a porta se necessário
EXPOSE 3000

# Comando padrão
# CMD ["npm", "start"]
